import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { Clock, DollarSign, Zap, Sparkles } from 'lucide-react';

interface ResourceStatusBarProps {
  compact?: boolean;
}

export const ResourceStatusBar: React.FC<ResourceStatusBarProps> = ({ compact = false }) => {
  const { summary, limits } = useLedger();

  // Helper for safe percentages
  const getPercent = (used: number, starting: number) => {
    if (starting <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((used / starting) * 100)));
  };

  const timePct = getPercent(summary.usedTime, summary.startingTime);
  const budgetPct = getPercent(summary.usedBudget, summary.startingBudget);
  const willPct = summary.startingWill > 0
    ? Math.min(100, Math.max(0, Math.round((summary.remainingWill / summary.startingWill) * 100)))
    : 0;

  if (compact) {
    return (
      <div id="resource-status-bar-compact" className="flex items-center gap-2.5 text-xs font-medium">
        {/* Time */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F4F2] text-[#4F6D7A] border border-[#EDEAE5]">
          <Clock className="w-3.5 h-3.5 text-[#4F6D7A]" />
          <span>
            {summary.remainingTime}h <span className="text-[#718096] font-normal">time</span>
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F4F2] text-[#4F6D7A] border border-[#EDEAE5]">
          <DollarSign className="w-3.5 h-3.5 text-[#4F6D7A]" />
          <span>
            {limits.currencySymbol}{summary.remainingBudget} <span className="text-[#718096] font-normal">budget</span>
          </span>
        </div>

        {/* Will */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F4F2] text-[#4F6D7A] border border-[#EDEAE5]">
          <Zap className="w-3.5 h-3.5 text-[#4F6D7A]" />
          <span>
            {summary.remainingWill} pts <span className="text-[#718096] font-normal">will</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="resource-status-bar" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Time Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDEAE5] shadow-xs">
        <p className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-4">
          Time Capacity
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-light text-[#2D3748]">{summary.remainingTime}</span>
          <span className="text-[#718096] text-sm">hours left (of {summary.startingTime}h)</span>
        </div>

        {/* Sleek slim progress bar */}
        <div className="mt-6 h-1 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              summary.remainingTime < 0 ? 'bg-rose-500' : 'bg-[#4F6D7A]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, timePct))}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2.5 text-[11px] text-[#718096]">
          <span>{summary.usedTime}h allocated</span>
          <span>{timePct}% capacity</span>
        </div>
      </div>

      {/* 2. Budget Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDEAE5] shadow-xs">
        <p className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-4">
          Financial Budget
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-light text-[#2D3748]">
            {limits.currencySymbol}{summary.remainingBudget}
          </span>
          <span className="text-[#718096] text-sm">available (of {limits.currencySymbol}{summary.startingBudget})</span>
        </div>

        {/* Sleek slim progress bar */}
        <div className="mt-6 h-1 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              summary.remainingBudget < 0 ? 'bg-rose-500' : 'bg-[#4F6D7A]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, budgetPct))}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2.5 text-[11px] text-[#718096]">
          <span>{limits.currencySymbol}{summary.usedBudget} spent</span>
          <span>{budgetPct}% used</span>
        </div>
      </div>

      {/* 3. Will / Mental Energy Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDEAE5] shadow-xs">
        <p className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-4">
          Mental Energy (Will)
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-light text-[#2D3748]">
            {summary.remainingWill}
          </span>
          <span className="text-[#718096] text-sm">
            points (base {summary.startingWill})
          </span>
        </div>

        {/* Sleek slim progress bar */}
        <div className="mt-6 h-1 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              summary.remainingWill < 15 ? 'bg-rose-500' : 'bg-[#4F6D7A]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, willPct))}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2.5 text-[11px] text-[#718096]">
          <span>-{summary.usedWill} drained</span>
          {summary.replenishedWill > 0 ? (
            <span className="text-[#4F6D7A] font-medium">+{summary.replenishedWill} restored</span>
          ) : (
            <span>{willPct}% vitality</span>
          )}
        </div>
      </div>
    </div>
  );
};
