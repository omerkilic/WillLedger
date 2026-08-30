import React, { useState, useEffect } from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  Sliders, 
  Clock, 
  DollarSign, 
  Zap, 
  Save, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const MonthlySetupView: React.FC = () => {
  const { limits, saveLimits, selectedMonth, isSavingLimits } = useLedger();

  const [timeHours, setTimeHours] = useState<number | string>(limits.timeHours);
  const [budgetAmount, setBudgetAmount] = useState<number | string>(limits.budgetAmount);
  const [willPoints, setWillPoints] = useState<number | string>(limits.willPoints);
  const [currencySymbol, setCurrencySymbol] = useState<string>(limits.currencySymbol || '$');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state if external limits change
  useEffect(() => {
    setTimeHours(limits.timeHours);
    setBudgetAmount(limits.budgetAmount);
    setWillPoints(limits.willPoints);
    setCurrencySymbol(limits.currencySymbol || '$');
  }, [limits]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsedTime = Number(timeHours);
    const parsedBudget = Number(budgetAmount);
    const parsedWill = Number(willPoints);

    if (isNaN(parsedTime) || parsedTime < 0) {
      setValidationError('Please enter a valid non-negative number for Available Time.');
      return;
    }
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      setValidationError('Please enter a valid non-negative number for Monthly Budget.');
      return;
    }
    if (isNaN(parsedWill) || parsedWill < 0) {
      setValidationError('Please enter a valid non-negative number for Will / Mental Energy.');
      return;
    }

    if (parsedTime > 744) {
      setValidationError('A single month has 744 total hours maximum. Please set a realistic available time limit.');
      return;
    }

    await saveLimits({
      timeHours: parsedTime,
      budgetAmount: parsedBudget,
      willPoints: parsedWill,
      currencySymbol: currencySymbol.trim() || '$',
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const parsedTime = Math.max(0, Number(timeHours) || 0);
  const parsedBudget = Math.max(0, Number(budgetAmount) || 0);
  const parsedWill = Math.max(0, Number(willPoints) || 0);

  // Format month name
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthName = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header matching Sleek Interface */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light text-[#1A202C] mb-2">Monthly Resource Setup</h2>
          <p className="text-[#718096] max-w-lg leading-relaxed">
            Defining your foundations for {monthName}. Be intentional with your limits to protect your well-being.
          </p>
        </div>

        <div className="self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F4F2] text-[#4F6D7A] text-xs font-semibold border border-[#EDEAE5]">
            Active: {monthName}
          </span>
        </div>
      </header>

      {/* Top 3 Capacity Display Cards matching Sleek Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EDEAE5] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-4">
            Time Capacity
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-[#2D3748]">{parsedTime}</span>
            <span className="text-[#718096]">hours</span>
          </div>
          <div className="mt-6 h-1 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
            <div className="h-full bg-[#4F6D7A] w-full" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EDEAE5] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-4">
            Financial Budget
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-[#2D3748]">
              {currencySymbol}{parsedBudget.toLocaleString()}
            </span>
            <span className="text-[#718096]">available</span>
          </div>
          <div className="mt-6 h-1 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
            <div className="h-full bg-[#4F6D7A] w-full" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EDEAE5] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-4">
            Mental Energy (Will)
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-[#2D3748]">{parsedWill}</span>
            <span className="text-[#718096]">points</span>
          </div>
          <div className="mt-6 h-1 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
            <div className="h-full bg-[#4F6D7A] w-full" />
          </div>
        </div>
      </div>

      {/* Main Section: Form & Supportive Insight Card */}
      <section className="bg-white rounded-3xl border border-[#EDEAE5] p-8 sm:p-10 flex flex-col lg:flex-row gap-10 lg:gap-12 shadow-xs">
        {/* Form Container */}
        <div className="flex-1 max-w-xl space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-medium text-[#1A202C]">Adjust Monthly Limits</h3>
            <p className="text-xs text-[#718096] mt-1">Calibrate limits to preserve mental stamina.</p>
          </div>

          {validationError && (
            <div
              id="setup-validation-error"
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {savedSuccess && (
            <div
              id="setup-save-success"
              className="p-3.5 rounded-2xl bg-[#F0F4F2] border border-[#4F6D7A]/30 text-xs text-[#4F6D7A] font-medium flex items-center gap-2 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-[#4F6D7A] shrink-0" />
              <span>Monthly starting limits saved successfully! Your calculations have updated across the app.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Time Input */}
            <div>
              <label
                htmlFor="input-time-hours"
                className="block text-sm font-medium text-[#4A5568] mb-2"
              >
                Total Available Time (h)
              </label>
              <input
                id="input-time-hours"
                type="number"
                min="0"
                max="744"
                step="1"
                value={timeHours}
                onChange={(e) => setTimeHours(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-base text-[#1A202C] transition-all"
                placeholder="160"
              />
              <p className="text-xs text-[#A0AEC0] mt-2">Consider weekends and mandatory rest.</p>
            </div>

            {/* 2. Budget Input & Currency */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="input-budget-amount"
                  className="block text-sm font-medium text-[#4A5568]"
                >
                  Budget Allocation ({currencySymbol})
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#A0AEC0]">Currency:</span>
                  <select
                    id="select-currency-symbol"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="text-xs font-medium bg-[#F7F9F9] border border-gray-200 rounded-lg px-2 py-1 text-[#4A5568] focus:ring-1 focus:ring-[#4F6D7A]"
                  >
                    <option value="$">$ (USD/CAD/AUD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="¥">¥ (JPY/CNY)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="₺">₺ (TRY)</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
              </div>
              <input
                id="input-budget-amount"
                type="number"
                min="0"
                step="10"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-base text-[#1A202C] transition-all"
                placeholder="2450"
              />
            </div>

            {/* 3. Will / Mental Energy Points */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="input-will-points"
                  className="block text-sm font-medium text-[#4A5568]"
                >
                  Starting Will Points ({willPoints} pts)
                </label>
                <span className="text-xs text-[#A0AEC0]">10–500 pts</span>
              </div>
              <input
                id="input-will-points"
                type="range"
                min="10"
                max="500"
                step="5"
                value={willPoints}
                onChange={(e) => setWillPoints(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F6D7A]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>Low Energy</span>
                <span>High Resilience</span>
              </div>

              {/* Quick Points Presets */}
              <div className="flex items-center gap-2 pt-3">
                <span className="text-[11px] text-[#A0AEC0]">Presets:</span>
                {[50, 80, 100, 150, 200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWillPoints(preset)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      Number(willPoints) === preset
                        ? 'bg-[#F0F4F2] text-[#4F6D7A] border-[#4F6D7A]/40 font-semibold'
                        : 'bg-white text-[#718096] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {preset} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                id="btn-save-monthly-limits"
                type="submit"
                disabled={isSavingLimits}
                className="w-full bg-[#4F6D7A] text-white py-4 rounded-2xl font-medium hover:bg-[#3D545E] transition-colors shadow-lg shadow-[#4F6D7A]/15 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingLimits ? 'Saving Foundation...' : 'Save Monthly Foundation'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Supportive Insight Card matching Sleek Interface */}
        <div className="w-full lg:w-[320px] bg-[#F7F9F9] rounded-3xl p-8 flex flex-col justify-center border border-dashed border-[#CBD5E0]">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xs flex items-center justify-center mx-auto mb-6 text-2xl border border-gray-100">
              🌿
            </div>
            <h4 className="text-sm font-semibold text-[#2D3748] mb-2">Supportive Insight</h4>
            <p className="text-xs text-[#718096] leading-relaxed">
              "Rest is not a reward for productivity. It is a prerequisite for functioning."
              <br /><br />
              Your settings today help you say 'no' to things that don't serve your core priorities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
