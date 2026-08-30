import React, { useState, useEffect } from 'react';
import { Activity, ActivityType } from '../types';
import { useLedger } from '../context/LedgerContext';
import { X, Sparkles, AlertCircle, Clock, DollarSign, Zap } from 'lucide-react';

interface EditActivityModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({ activity, onClose }) => {
  const { categories, limits, updateActivity } = useLedger();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<ActivityType>('action');
  const [categoryId, setCategoryId] = useState('');
  const [timeImpact, setTimeImpact] = useState<number | string>(1);
  const [budgetImpact, setBudgetImpact] = useState<number | string>(0);
  const [willImpact, setWillImpact] = useState<number | string>(10);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDate(activity.date);
      setType(activity.type);
      setCategoryId(activity.categoryId);
      setTimeImpact(activity.timeImpact);
      setBudgetImpact(activity.budgetImpact);
      setWillImpact(activity.willImpact);
      setNotes(activity.notes || '');
      setError(null);
    }
  }, [activity]);

  if (!activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an activity title.');
      return;
    }

    const t = Math.max(0, Number(timeImpact) || 0);
    const b = Math.max(0, Number(budgetImpact) || 0);
    const w = Math.max(0, Number(willImpact) || 0);

    setIsSaving(true);
    try {
      await updateActivity(activity.id, {
        title: title.trim(),
        date,
        type,
        categoryId: categoryId || categories[0]?.id || 'cat-1',
        timeImpact: t,
        budgetImpact: b,
        willImpact: w,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update activity');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EDEAE5] space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F0F4F2] text-[#4F6D7A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-[#1A202C]">Edit Activity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#718096] hover:text-[#1A202C] hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Classification Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1.5">
              Activity Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['capability', 'need', 'action'] as ActivityType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2.5 text-xs font-medium rounded-xl border capitalize transition-all ${
                    type === t
                      ? 'bg-[#F0F4F2] border-[#4F6D7A]/40 text-[#4F6D7A] ring-1 ring-[#4F6D7A]'
                      : 'bg-[#F7F9F9] border-[#EDEAE5] text-[#718096] hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1">
              Activity Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-sm text-[#1A202C]"
            />
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-xs text-[#2D3748] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-xs text-[#2D3748] bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resource Estimates */}
          <div className="p-4 rounded-2xl bg-[#F7F9F9] border border-[#EDEAE5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#4F6D7A]">
              Estimated Resource Impact
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {/* Time */}
              <div>
                <label className="text-[11px] font-semibold text-[#718096] flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-blue-500" /> Time (hrs)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={timeImpact}
                  onChange={(e) => setTimeImpact(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1A202C] focus:ring-1 focus:ring-[#4F6D7A] outline-none"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="text-[11px] font-semibold text-[#718096] flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-[#4F6D7A]" /> Budget ({limits.currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={budgetImpact}
                  onChange={(e) => setBudgetImpact(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1A202C] focus:ring-1 focus:ring-[#4F6D7A] outline-none"
                />
              </div>

              {/* Will */}
              <div>
                <label className="text-[11px] font-semibold text-[#718096] flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  {type === 'capability' ? 'Will +Pts' : 'Will -Pts'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={willImpact}
                  onChange={(e) => setWillImpact(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1A202C] focus:ring-1 focus:ring-[#4F6D7A] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reflections, context, or milestones..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-xs text-[#1A202C]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#718096] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-white bg-[#4F6D7A] hover:bg-[#3D545E] shadow-lg shadow-[#4F6D7A]/15 transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving Changes...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
