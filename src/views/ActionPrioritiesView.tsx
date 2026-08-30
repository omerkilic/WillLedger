import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { ResourceStatusBar } from '../components/ResourceStatusBar';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  BookOpen, 
  HeartHandshake,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { Activity } from '../types';

export const ActionPrioritiesView: React.FC = () => {
  const { 
    activities, 
    categories, 
    limits, 
    summary, 
    aiPriorities, 
    isAiLoading, 
    fetchAiPriorities, 
    updateActivity 
  } = useLedger();

  const [activeGroupingFilter, setActiveGroupingFilter] = useState<string>('all');

  const actionActivities = activities.filter((a) => a.type === 'action');
  const pendingActions = actionActivities.filter((a) => !a.completed);

  const handleToggleComplete = async (activityId: string) => {
    const act = activities.find((a) => a.id === activityId);
    if (!act) return;
    try {
      await updateActivity(act.id, { completed: !act.completed });
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityBadgeStyle = (score: number) => {
    if (score >= 85) return 'bg-[#F0F4F2] text-[#4F6D7A] border-[#4F6D7A]/30';
    if (score >= 70) return 'bg-blue-50 text-blue-800 border-blue-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  const getGroupBadge = (group: string) => {
    const normalized = (group || '').toLowerCase().replace(/[^a-z]/g, '');
    if (normalized.includes('quickwin')) {
      return { label: 'Quick Win', color: 'bg-[#F0F4F2] text-[#4F6D7A] border-[#EDEAE5]' };
    }
    if (normalized.includes('highimpact')) {
      return { label: 'High Impact', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    if (normalized.includes('lowresource')) {
      return { label: 'Low Resource', color: 'bg-teal-50 text-teal-700 border-teal-200' };
    }
    if (normalized.includes('steadyprogress')) {
      return { label: 'Steady Progress', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    return { label: group || 'Action Task', color: 'bg-gray-100 text-[#718096] border-gray-200' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Resource Context */}
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-light text-[#1A202C] mb-2">Action Priorities</h2>
            <p className="text-[#718096] max-w-2xl leading-relaxed">
              Smart recommendations calibrated to your remaining {summary.remainingWill} will points, {summary.remainingTime} available hours, and {limits.currencySymbol}{summary.remainingBudget} budget.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              id="btn-trigger-ai-priorities"
              onClick={fetchAiPriorities}
              disabled={isAiLoading || actionActivities.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-lg shadow-[#4F6D7A]/15 disabled:opacity-50 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Analyzing Resources...' : 'Generate AI Advice'}</span>
            </button>
          </div>
        </header>

        {/* Live Resource Bar */}
        <ResourceStatusBar />
      </div>

      {/* 2. Main Content */}
      {actionActivities.length === 0 ? (
        /* Empty State: No action items exist */
        <div
          id="priorities-no-actions-state"
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EDEAE5] shadow-xs text-center space-y-4 max-w-xl mx-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A202C]">
            No Action Items Found
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed max-w-md mx-auto">
            The AI priority engine analyzes tasks classified specifically as <strong>"Action"</strong>. Head over to the Daily Activity Log to add pending goals or milestones first.
          </p>
        </div>
      ) : !aiPriorities ? (
        /* Prompt to Generate State */
        <div
          id="priorities-prompt-state"
          className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDEAE5] shadow-xs text-center space-y-6 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#F0F4F2] text-[#4F6D7A] flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#1A202C]">
              Ready to Optimize Your Next Steps?
            </h3>
            <p className="text-xs text-[#718096] max-w-lg mx-auto leading-relaxed">
              You have <span className="font-semibold text-[#1A202C]">{pendingActions.length} pending action tasks</span>. 
              Click below to let our supportive AI coach review your current willpower level ({summary.remainingWill} pts) and suggest the most sustainable tasks to tackle.
            </p>
          </div>

          <button
            id="btn-generate-ai-priorities-center"
            onClick={fetchAiPriorities}
            disabled={isAiLoading}
            className="px-6 py-3.5 rounded-2xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-lg shadow-[#4F6D7A]/15 inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Analyzing Energy & Time...' : 'Analyze & Prioritize Actions'}</span>
          </button>
        </div>
      ) : (
        /* Recommendations List */
        <div className="space-y-6">
          {/* AI Coach Summary Card */}
          <div
            id="ai-coach-summary-card"
            className="bg-[#2D3748] rounded-3xl p-6 sm:p-7 text-white shadow-md space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-700/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F0F4F2]">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Coach Guidance</span>
              </div>
              <span className="text-[11px] text-gray-300">
                Calibrated for {summary.remainingWill} Will Points
              </span>
            </div>

            <p className="text-sm text-gray-100 leading-relaxed font-light">
              "{aiPriorities.summary}"
            </p>

            {aiPriorities.encouragement && (
              <p className="text-xs text-emerald-300 italic border-l-2 border-emerald-400 pl-3 py-1">
                {aiPriorities.encouragement}
              </p>
            )}
          </div>

          {/* Recommended Tasks List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-semibold text-[#1A202C]">
                  Recommended Action Sequence
                </h3>
                <p className="text-xs text-[#718096]">
                  Tasks ranked by mental energy compatibility, impact, and momentum value.
                </p>
              </div>

              {/* Grouping filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['all', 'quick_win', 'high_impact', 'steady_progress', 'low_resource'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setActiveGroupingFilter(grp)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors capitalize ${
                      activeGroupingFilter === grp
                        ? 'bg-[#4F6D7A] text-white'
                        : 'bg-[#F7F9F9] text-[#718096] border border-[#EDEAE5] hover:bg-gray-100'
                    }`}
                  >
                    {grp.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* List items */}
            <div className="space-y-3">
              {aiPriorities.items
                .filter((item) => {
                  if (activeGroupingFilter === 'all') return true;
                  const normalizedFilter = activeGroupingFilter.replace('_', '').toLowerCase();
                  const normalizedCategory = (item.fitCategory || '').replace(/\s+/g, '').toLowerCase();
                  return normalizedCategory.includes(normalizedFilter);
                })
                .map((item, index) => {
                  const act = activities.find((a) => a.id === item.activityId);
                  const isDone = act?.completed || false;
                  const groupInfo = getGroupBadge(item.fitCategory);

                  return (
                    <div
                      key={item.activityId || index}
                      id={`priority-item-${item.activityId}`}
                      className={`p-4.5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-[#F7F9F9]/50 border-gray-200/60 opacity-60'
                          : 'bg-white hover:bg-[#F7F9F9] border-[#EDEAE5] shadow-xs'
                      }`}
                    >
                      {/* Left: Rank, Checkbox, Title & Recommendation Reason */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-[#2D3748] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </div>

                        {act && (
                          <button
                            id={`btn-complete-priority-${act.id}`}
                            onClick={() => handleToggleComplete(act.id)}
                            className="mt-0.5 text-gray-400 hover:text-[#4F6D7A] transition-colors shrink-0"
                            title={isDone ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-[#4F6D7A]" />
                            ) : (
                              <Circle className="w-5 h-5 hover:text-[#2D3748]" />
                            )}
                          </button>
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-semibold tracking-tight ${
                                isDone ? 'line-through text-gray-400' : 'text-[#1A202C]'
                              }`}
                            >
                              {item.title}
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${groupInfo.color}`}
                            >
                              {groupInfo.label}
                            </span>
                          </div>

                          <p className="text-xs text-[#718096] leading-relaxed">
                            {item.reason}
                          </p>
                        </div>
                      </div>

                      {/* Right: Resource Cost & Priority Score */}
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        {act && (
                          <div className="flex items-center gap-2 text-xs">
                            {act.timeImpact > 0 && (
                              <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3" /> {act.timeImpact}h
                              </span>
                            )}
                            {act.budgetImpact > 0 && (
                              <span className="flex items-center gap-1 font-semibold text-[#4F6D7A] bg-[#F0F4F2] px-2 py-0.5 rounded-md">
                                <DollarSign className="w-3 h-3" /> {limits.currencySymbol}{act.budgetImpact}
                              </span>
                            )}
                            <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Zap className="w-3 h-3" /> -{act.willImpact} will
                            </span>
                          </div>
                        )}

                        <div
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${getPriorityBadgeStyle(
                            item.priorityScore
                          )}`}
                          title="AI Priority Match Index (out of 100)"
                        >
                          Match: {item.priorityScore}%
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
