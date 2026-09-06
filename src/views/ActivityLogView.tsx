import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { useLanguage } from '../context/LanguageContext';
import { Activity, ActivityType } from '../types';
import { ResourceStatusBar } from '../components/ResourceStatusBar';
import { EditActivityModal } from '../components/EditActivityModal';
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Zap, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Search, 
  Filter, 
  Heart,
  Calendar,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';

export const ActivityLogView: React.FC = () => {
  const { activities, categories, limits, addActivity, deleteActivity, updateActivity, selectedMonth } = useLedger();
  const { language, t } = useLanguage();
  const isTr = language === 'tr';

  // Quick Add Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('action');
  const [date, setDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today.startsWith(selectedMonth) ? today : `${selectedMonth}-01`;
  });
  const [categoryId, setCategoryId] = useState(() => categories[0]?.id || 'cat-1');
  const [timeImpact, setTimeImpact] = useState<number | string>(1.5);
  const [budgetImpact, setBudgetImpact] = useState<number | string>(0);
  const [willImpact, setWillImpact] = useState<number | string>(15);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ActivityType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Edit Modal State
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError(isTr ? 'Lütfen bir aktivite adı girin.' : 'Please enter an activity title.');
      return;
    }

    const tImpact = Math.max(0, Number(timeImpact) || 0);
    const b = Math.max(0, Number(budgetImpact) || 0);
    const w = Math.max(0, Number(willImpact) || 0);

    setIsSubmitting(true);
    try {
      await addActivity({
        title: title.trim(),
        type,
        date: date || `${selectedMonth}-01`,
        month: selectedMonth,
        categoryId: categoryId || categories[0]?.id || 'cat-1',
        timeImpact: tImpact,
        budgetImpact: b,
        willImpact: w,
        notes: notes.trim(),
        completed: false,
      });

      // Reset form
      setTitle('');
      setNotes('');
      if (type === 'capability') {
        setTimeImpact(1);
        setBudgetImpact(0);
        setWillImpact(20);
      } else {
        setTimeImpact(1.5);
        setBudgetImpact(0);
        setWillImpact(15);
      }
    } catch (err: any) {
      setValidationError(err?.message || (isTr ? 'Aktivite kaydedilemedi' : 'Failed to save activity'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (act: Activity) => {
    try {
      await updateActivity(act.id, { completed: !act.completed });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      setDeletingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered & Sorted Activities (Chronological desc)
  const filteredActivities = activities
    .filter((a) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && a.categoryId !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Live Calculation Status Area */}
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-light text-[#1A202C] mb-2">
              {isTr ? 'Günlük Aktivite Defteri' : 'Daily Activity Log'}
            </h2>
            <p className="text-[#718096] max-w-2xl leading-relaxed">
              {isTr ? (
                <>
                  Günlük kayıtlarınızı 3 temel boyutta tutun: <strong>kapasite</strong> (şarj eden alışkanlıklar), <strong>ihtiyaç</strong> (bakım/rutin) ve <strong>eylem</strong> (odaklanılmış projeler).
                </>
              ) : (
                <>
                  Log daily items across three essential dimensions: <strong>capabilities</strong> (restorative habits), <strong>needs</strong> (maintenance), and <strong>actions</strong> (intentional projects).
                </>
              )}
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F4F2] text-[#4F6D7A] text-xs font-semibold border border-[#EDEAE5]">
              {isTr ? `${activities.length} Aktivite Kayıtlı` : `${activities.length} Entries Logged`}
            </span>
          </div>
        </header>

        {/* Prominent Live Calculations Status Area */}
        <ResourceStatusBar />
      </div>

      {/* 2. Quick-Add Activity Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-medium text-[#1A202C]">
              {isTr ? 'Hızlı Aktivite Ekle' : 'Quick-Log Activity'}
            </h3>
            <p className="text-xs text-[#718096]">
              {isTr ? 'Sınıflandırın ve kaynak etkilerini tahmin edin.' : 'Classify and estimate resource impact.'}
            </p>
          </div>
          <span className="text-xs text-[#A0AEC0]">
            {isTr ? 'Canlı bakiye düşümü' : 'Real-time balance deduction'}
          </span>
        </div>

        {validationError && (
          <div
            id="activity-validation-error"
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleCreateActivity} className="space-y-6">
          {/* Classification Tabs: Capability / Need / Action */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">
              {isTr ? '1. Aktivite Sınıflandırmasını Seçin' : '1. Choose Activity Classification'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Capability */}
              <button
                type="button"
                id="type-tab-capability"
                onClick={() => {
                  setType('capability');
                  setWillImpact(20);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  type === 'capability'
                    ? 'bg-[#F0F4F2] border-[#4F6D7A]/40 ring-1 ring-[#4F6D7A] text-[#1A202C] shadow-xs'
                    : 'bg-[#F7F9F9] border-[#EDEAE5] text-[#718096] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-[#4F6D7A]">
                    <Sparkles className="w-3.5 h-3.5" /> {isTr ? 'Kapasite' : 'Capability'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4F6D7A]/15 text-[#4F6D7A]">
                    {isTr ? '+İrade Şarjı' : '+Will Replenish'}
                  </span>
                </div>
                <p className="text-[11px] text-[#718096] leading-tight">
                  {isTr 
                    ? 'Dinlenme, spor, yürüyüş, meditasyon veya zihinsel enerjiyi geri kazandıran hobiler.'
                    : 'Restorative habits, walks, meditation, or learning that restores mental stamina.'}
                </p>
              </button>

              {/* Need */}
              <button
                type="button"
                id="type-tab-need"
                onClick={() => {
                  setType('need');
                  setWillImpact(10);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  type === 'need'
                    ? 'bg-[#F0F4F2] border-[#4F6D7A]/40 ring-1 ring-[#4F6D7A] text-[#1A202C] shadow-xs'
                    : 'bg-[#F7F9F9] border-[#EDEAE5] text-[#718096] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-blue-700">
                    <Heart className="w-3.5 h-3.5" /> {isTr ? 'İhtiyaç' : 'Need'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {isTr ? 'Rutin / Bakım' : 'Maintenance'}
                  </span>
                </div>
                <p className="text-[11px] text-[#718096] leading-tight">
                  {isTr
                    ? 'Zorunlu ev işleri, market alışverişi, sağlık faturaları ve idari işler.'
                    : 'Essential chores, groceries, healthcare bills, and administrative upkeep.'}
                </p>
              </button>

              {/* Action */}
              <button
                type="button"
                id="type-tab-action"
                onClick={() => {
                  setType('action');
                  setWillImpact(15);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  type === 'action'
                    ? 'bg-[#F0F4F2] border-[#4F6D7A]/40 ring-1 ring-[#4F6D7A] text-[#1A202C] shadow-xs'
                    : 'bg-[#F7F9F9] border-[#EDEAE5] text-[#718096] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-amber-700">
                    <Zap className="w-3.5 h-3.5" /> {isTr ? 'Eylem (Hedef)' : 'Action (Goal)'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {isTr ? 'AI Öncelikler' : 'Goal & Task'}
                  </span>
                </div>
                <p className="text-[11px] text-[#718096] leading-tight">
                  {isTr
                    ? 'Kariyer projeleri, derin odaklanma gerektiren işler, öğrenme ve hedefler.'
                    : 'Intentional creative projects, milestones, deep work, and social engagements.'}
                </p>
              </button>
            </div>
          </div>

          {/* Activity Title & Category & Date */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label htmlFor="input-activity-title" className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">
                {isTr ? 'Aktivite Başlığı' : 'Activity Title'}
              </label>
              <input
                id="input-activity-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  isTr
                    ? (type === 'capability'
                        ? 'Örn: 20 dk Sabah Nefes Egzersizi & Çay'
                        : type === 'need'
                        ? 'Örn: Haftalık Market Alışverişi'
                        : 'Örn: Proje Raporunun 3. Bölümünü Yaz')
                    : (type === 'capability'
                        ? 'e.g. 20-min Morning Breathwork & Tea'
                        : type === 'need'
                        ? 'e.g. Grocery Shopping & Meal Prep'
                        : 'e.g. Write Chapter 3 of Project Proposal')
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-sm text-[#1A202C] transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label htmlFor="select-activity-category" className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">
                {isTr ? 'Kategori' : 'Category'}
              </label>
              <select
                id="select-activity-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-xs font-medium text-[#2D3748] bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label htmlFor="input-activity-date" className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">
                {isTr ? 'Tarih' : 'Date'}
              </label>
              <input
                id="input-activity-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-xs font-medium text-[#2D3748] bg-white"
              />
            </div>
          </div>

          {/* Resource Impact Sliders / Inputs */}
          <div className="p-5 rounded-2xl bg-[#F7F9F9] border border-[#EDEAE5] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F6D7A] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#4F6D7A]" />
                {isTr ? '2. Kaynak Etkisi Tahmini' : '2. Resource Impact Estimation'}
              </span>
              <span className="text-[11px] text-[#718096]">
                {type === 'capability' 
                  ? (isTr ? 'İradeyi ve Zihinsel Canlılığı Artırır' : 'Replenishes Will / Mental Stamina') 
                  : (isTr ? 'Aylık havuzdan düşer' : 'Draws from monthly pool')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Time */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-[#EDEAE5] shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#2D3748] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" /> {isTr ? 'Zaman (Saat)' : 'Time (Hours)'}
                  </span>
                  <span className="font-bold text-blue-700">{timeImpact}h</span>
                </div>
                <input
                  id="slider-time-impact"
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={timeImpact}
                  onChange={(e) => setTimeImpact(Number(e.target.value))}
                  className="w-full accent-[#4F6D7A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A0AEC0]">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-[#EDEAE5] shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#2D3748] flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#4F6D7A]" /> {isTr ? 'Mali Maliyet' : 'Budget Cost'}
                  </span>
                  <span className="font-bold text-[#4F6D7A]">
                    {limits.currencySymbol}{budgetImpact}
                  </span>
                </div>
                <input
                  id="slider-budget-impact"
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={budgetImpact}
                  onChange={(e) => setBudgetImpact(Number(e.target.value))}
                  className="w-full accent-[#4F6D7A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A0AEC0]">
                  <span>{limits.currencySymbol}0</span>
                  <span>{limits.currencySymbol}150</span>
                  <span>{limits.currencySymbol}300+</span>
                </div>
              </div>

              {/* Will */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-[#EDEAE5] shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#2D3748] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {type === 'capability' 
                      ? (isTr ? 'İrade Doldurma' : 'Will Replenish') 
                      : (isTr ? 'İrade Harcama' : 'Will Drain')}
                  </span>
                  <span
                    className={`font-bold ${
                      type === 'capability' ? 'text-[#4F6D7A]' : 'text-amber-700'
                    }`}
                  >
                    {type === 'capability' ? `+${willImpact}` : `-${willImpact}`} {isTr ? 'puan' : 'pts'}
                  </span>
                </div>
                <input
                  id="slider-will-impact"
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={willImpact}
                  onChange={(e) => setWillImpact(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#4F6D7A]"
                />
                <div className="flex justify-between text-[10px] text-[#A0AEC0]">
                  <span>0</span>
                  <span>25</span>
                  <span>50 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              id="input-activity-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isTr ? 'İsteğe bağlı notlar, hedefler veya detay...' : 'Optional notes, context or milestone outcome...'}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-xs text-[#1A202C] placeholder:text-gray-400"
            />

            <button
              id="btn-submit-activity"
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-3 rounded-2xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-lg shadow-[#4F6D7A]/15 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isSubmitting 
                  ? (isTr ? 'Kaydediliyor...' : 'Logging...') 
                  : (isTr ? 'Deftere Kaydet' : 'Save to Ledger')}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Chronological Daily Activity List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-5">
        {/* List Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-semibold text-[#1A202C]">
              {isTr ? 'Kayıtlı Aktiviteler' : 'Logged Activities'}
            </h3>
            <p className="text-xs text-[#718096]">
              {isTr 
                ? 'Kaydettiğiniz kapasite, ihtiyaç ve eylemlerin kronolojik akışı.'
                : 'Chronological log of your recorded capabilities, needs, and actions.'}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A0AEC0] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTr ? 'Aktivite ara...' : 'Search activities...'}
                className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-[#F7F9F9] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#4F6D7A] w-36 sm:w-44"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-[#F7F9F9] text-[#2D3748]"
            >
              <option value="all">{isTr ? 'Tüm Türler' : 'All Types'}</option>
              <option value="capability">{isTr ? 'Kapasite' : 'Capabilities'}</option>
              <option value="need">{isTr ? 'İhtiyaç' : 'Needs'}</option>
              <option value="action">{isTr ? 'Eylemler' : 'Actions'}</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-[#F7F9F9] text-[#2D3748]"
            >
              <option value="all">{isTr ? 'Tüm Kategoriler' : 'All Categories'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 ? (
          <div
            id="activity-log-empty-state"
            className="py-12 px-4 text-center rounded-2xl bg-[#F7F9F9] border border-dashed border-[#CBD5E0] space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F0F4F2] text-[#4F6D7A] flex items-center justify-center mx-auto shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-medium text-[#1A202C]">
              {isTr ? 'Henüz Aktivite Eklenmedi' : 'No Activities Logged Yet'}
            </h4>
            <p className="text-xs text-[#718096] max-w-md mx-auto leading-relaxed">
              {isTr
                ? 'Günlük kapasite, ihtiyaç ve eylemlerinizi takip ederek kaynak havuzunuzu dengede tutun. Yukarıdaki formu kullanarak ilk kaydınızı oluşturun!'
                : 'Tracking your daily capabilities, needs, and actions keeps your monthly resource pool visible and balanced. Use the quick-log form above to record your first activity!'}
            </p>
          </div>
        ) : (
          /* Chronological Activity Items */
          <div className="space-y-2.5">
            {filteredActivities.map((act) => {
              const cat = categories.find((c) => c.id === act.categoryId);

              return (
                <div
                  key={act.id}
                  id={`activity-item-${act.id}`}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                    act.completed
                      ? 'bg-gray-50 border-[#EDEAE5] opacity-75'
                      : 'bg-white hover:bg-[#F7F9F9] border-[#EDEAE5] shadow-xs'
                  }`}
                >
                  {/* Left: Checkbox + Title + Category + Date */}
                  <div className="flex items-start sm:items-center gap-3">
                    <button
                      id={`btn-toggle-complete-${act.id}`}
                      onClick={() => handleToggleComplete(act)}
                      className="mt-0.5 sm:mt-0 text-gray-400 hover:text-[#4F6D7A] transition-colors shrink-0 cursor-pointer"
                      title={act.completed ? (isTr ? 'Beklemede olarak işaretle' : 'Mark pending') : (isTr ? 'Tamamlandı olarak işaretle' : 'Mark completed')}
                    >
                      {act.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#4F6D7A]" />
                      ) : (
                        <Circle className="w-5 h-5 hover:text-gray-600" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-medium tracking-tight ${
                            act.completed ? 'line-through text-gray-400' : 'text-[#1A202C]'
                          }`}
                        >
                          {act.title}
                        </span>

                        {/* Type badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            act.type === 'capability'
                              ? 'bg-teal-50 text-teal-800'
                              : act.type === 'need'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {act.type === 'capability' 
                            ? (isTr ? 'Kapasite' : 'Capability') 
                            : act.type === 'need' 
                            ? (isTr ? 'İhtiyaç' : 'Need') 
                            : (isTr ? 'Eylem' : 'Action')}
                        </span>

                        {/* Category tag */}
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 bg-[#F7F9F9] text-[#718096] border border-gray-200"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cat?.color || '#4F6D7A' }}
                          />
                          {cat?.name || (isTr ? 'Genel' : 'Uncategorized')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#718096]">
                        <span className="flex items-center gap-1 text-[#A0AEC0]">
                          <Calendar className="w-3 h-3" /> {act.date}
                        </span>
                        {act.notes && (
                          <span className="text-[#718096] italic max-w-xs truncate">
                            "{act.notes}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Resource Impacts + Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Resource Impact Pills */}
                    <div className="flex items-center gap-2 text-xs">
                      {act.timeImpact > 0 && (
                        <span className="flex items-center gap-1 font-medium px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700">
                          <Clock className="w-3 h-3" /> {act.timeImpact}h
                        </span>
                      )}
                      {act.budgetImpact > 0 && (
                        <span className="flex items-center gap-1 font-medium px-2 py-0.5 rounded-lg bg-[#F0F4F2] text-[#4F6D7A]">
                          <DollarSign className="w-3 h-3" /> {limits.currencySymbol}{act.budgetImpact}
                        </span>
                      )}
                      <span
                        className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded-lg ${
                          act.type === 'capability'
                            ? 'bg-[#F0F4F2] text-[#4F6D7A]'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        {act.type === 'capability' ? `+${act.willImpact}` : `-${act.willImpact}`} {isTr ? 'irade' : 'will'}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      <button
                        id={`btn-edit-activity-${act.id}`}
                        onClick={() => setEditingActivity(act)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                        title={isTr ? 'Aktiviteyi Düzenle' : 'Edit Activity'}
                        aria-label={`Edit ${act.title}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-delete-activity-${act.id}`}
                        onClick={() => handleDelete(act.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={isTr ? 'Aktiviteyi Sil' : 'Delete Activity'}
                        aria-label={`Delete ${act.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Activity Modal */}
      {editingActivity && (
        <EditActivityModal
          activity={editingActivity}
          onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
};

