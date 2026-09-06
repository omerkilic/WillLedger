import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { useLanguage } from '../context/LanguageContext';
import { NavigationTab } from '../types';
import { ResourceStatusBar } from '../components/ResourceStatusBar';
import { 
  LayoutDashboard, 
  Clock, 
  DollarSign, 
  Zap, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Sliders, 
  BookOpen, 
  CheckCircle2, 
  HeartHandshake,
  TrendingUp,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { summary, limits, activities, categories, selectedMonth } = useLedger();
  const { language, t } = useLanguage();

  // Format month name according to language
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthName = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1).toLocaleDateString(
    language === 'tr' ? 'tr-TR' : 'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  const recentActivities = [...activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const pendingActions = activities.filter((a) => a.type === 'action' && !a.completed);
  const completedCount = activities.filter((a) => a.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4F6D7A]">
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'tr' ? 'Aylık Genel Bakış' : 'Monthly Overview'}</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-[#1A202C]">
              {language === 'tr' ? `${monthName} Genel Durum` : `${monthName} Ledger at a Glance`}
            </h1>
            <p className="text-sm text-[#718096] max-w-2xl leading-relaxed">
              {language === 'tr' 
                ? 'Zihinsel enerjiniz, serbest zamanınız ve bütçe dengeniz. Düzenli takip, tükenmişliği önler ve sürdürülebilir bir tempo kazanmanızı sağlar.' 
                : 'Your personal energy, time, and budget balance. Regular tracking helps you stay mindful of limited mental bandwidth while building sustainable momentum.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-dash-quick-log"
              onClick={() => onNavigate('log')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('btn.log_activity')}</span>
            </button>

            <button
              id="btn-dash-guide"
              onClick={() => onNavigate('manual')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium text-xs transition-colors border border-amber-200/80 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-700" />
              <span>{t('btn.how_to_use')}</span>
            </button>

            <button
              id="btn-dash-adjust-setup"
              onClick={() => onNavigate('setup')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F7F9F9] hover:bg-gray-100 text-[#4A5568] font-medium text-xs transition-colors border border-[#EDEAE5] cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#718096]" />
              <span>{t('btn.adjust_limits')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Live Resource Status Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">
            {language === 'tr' ? 'Canlı Kaynak Havuzları' : 'Current Resource Pools'}
          </h2>
          <span className="text-xs text-[#A0AEC0]">{language === 'tr' ? 'Anlık otomatik hesaplama' : 'Live dynamic calculations'}</span>
        </div>
        <ResourceStatusBar />
      </div>

      {/* 3. Empty State OR Analytics Grid */}
      {activities.length === 0 ? (
        /* Supportive Warm Empty State */
        <div
          id="dashboard-empty-state"
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EDEAE5] shadow-xs text-center space-y-6 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#F0F4F2] text-[#4F6D7A] flex items-center justify-center mx-auto shadow-xs">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-medium text-[#1A202C]">
              {language === 'tr' ? 'Will Ledger Takibinize Hoş Geldiniz' : 'Welcome to Your Monthly Will Ledger'}
            </h3>
            <p className="text-sm text-[#718096] leading-relaxed">
              {language === 'tr' ? (
                <>
                  <span className="font-semibold text-[#1A202C]">{monthName}</span> için henüz bir aktivite kaydedilmedi. 
                  Günlük <strong>kapasite</strong> (şarj eden alışkanlıklar), <strong>ihtiyaç</strong> (zorunlu işler) ve <strong>eylem</strong> (hedefler) girişleri yaparak zihinsel enerjinizi koruyun.
                </>
              ) : (
                <>
                  No activities have been recorded yet for <span className="font-semibold text-[#1A202C]">{monthName}</span>. 
                  Tracking your daily <strong>capabilities</strong> (restorative habits), <strong>needs</strong> (maintenance), and <strong>actions</strong> (goals) lets you clearly see how much mental energy and time you have remaining.
                </>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-empty-start-logging"
              onClick={() => onNavigate('log')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-lg shadow-[#4F6D7A]/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'tr' ? 'İlk Aktiviteyi Kaydet' : 'Record Your First Activity'}</span>
            </button>
            <button
              id="btn-empty-setup-limits"
              onClick={() => onNavigate('setup')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#F7F9F9] hover:bg-gray-100 text-[#4A5568] font-medium text-xs transition-colors border border-[#EDEAE5] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>{language === 'tr' ? 'Aylık Limitleri İncele' : 'Review Monthly Limits'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Rich Dashboard Analytics & Recent Logs */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Recent Activity Feed */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#EDEAE5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-[#1A202C]">
                  {language === 'tr' ? 'Son Aktiviteler' : 'Recent Activity Logs'}
                </h3>
                <p className="text-xs text-[#718096]">
                  {language === 'tr' ? 'Bu ay eklenen en son kayıtlar' : 'Your latest entries this month'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('log')}
                className="text-xs font-semibold text-[#4F6D7A] hover:text-[#3D545E] flex items-center gap-1"
              >
                <span>{language === 'tr' ? 'Tümünü Gör' : 'View Full Log'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentActivities.map((act) => {
                const cat = categories.find((c) => c.id === act.categoryId);

                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-[#F7F9F9] border border-[#EDEAE5] flex items-center justify-between gap-3 text-xs hover:border-gray-300 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1A202C] truncate">{act.title}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            act.type === 'capability'
                              ? 'bg-teal-50 text-teal-800'
                              : act.type === 'need'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {act.type === 'capability' ? (language === 'tr' ? 'Kapasite' : 'Capability') : act.type === 'need' ? (language === 'tr' ? 'İhtiyaç' : 'Need') : (language === 'tr' ? 'Eylem' : 'Action')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#718096]">
                        <span>{act.date}</span>
                        <span>•</span>
                        <span style={{ color: cat?.color || '#4F6D7A' }}>{cat?.name || 'General'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-xs shrink-0">
                      {act.timeImpact > 0 && <span className="text-blue-700">{act.timeImpact}h</span>}
                      {act.budgetImpact > 0 && <span className="text-[#4F6D7A]">{limits.currencySymbol}{act.budgetImpact}</span>}
                      <span
                        className={
                          act.type === 'capability' ? 'text-teal-700 font-bold' : 'text-amber-700 font-bold'
                        }
                      >
                        {act.type === 'capability' ? `+${act.willImpact}` : `-${act.willImpact}`} {language === 'tr' ? 'irade' : 'will'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: AI Insights Shortcut & Progress Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Action Priority Prompt Card */}
            <div className="bg-[#1A202C] rounded-3xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F0F4F2] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4F6D7A]" /> {language === 'tr' ? 'AI Öncelik Motoru' : 'AI Priority Engine'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 font-medium">
                  {pendingActions.length} {language === 'tr' ? 'Bekleyen' : 'Pending'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">
                  {language === 'tr' ? 'Akıllı Eylem Tavsiyeleri' : 'Smart Action Recommendations'}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {language === 'tr' 
                    ? `Sırada ne yapacağınızı belirlemek için kalan ${summary.remainingWill} irade puanı, ${summary.remainingTime} saat ve bütçenize göre AI sıralamasını alın.`
                    : `Need clarity on what to tackle next? Let our AI assistant organize your logged actions according to your remaining ${summary.remainingWill} will points, ${summary.remainingTime}h time, and budget.`}
                </p>
              </div>

              <button
                id="btn-dash-open-priorities"
                onClick={() => onNavigate('priorities')}
                className="w-full py-3 px-4 rounded-2xl bg-[#4F6D7A] hover:bg-[#3D545E] text-white font-medium text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'tr' ? 'AI Eylem Tavsiyelerini Al' : 'Get AI Action Recommendations'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Summary Metrics */}
            <div className="bg-white rounded-3xl p-6 border border-[#EDEAE5] shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">
                {language === 'tr' ? 'Aylık Aktivite Özeti' : 'Monthly Activity Summary'}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#F7F9F9] border border-[#EDEAE5]">
                  <span className="text-[11px] text-[#718096] uppercase tracking-wider font-semibold">
                    {language === 'tr' ? 'Tamamlanan' : 'Completed'}
                  </span>
                  <p className="text-xl font-light text-[#1A202C] mt-1">
                    {completedCount} <span className="text-xs text-[#A0AEC0]">/ {activities.length}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F9F9] border border-[#EDEAE5]">
                  <span className="text-[11px] text-[#718096] uppercase tracking-wider font-semibold">
                    {language === 'tr' ? 'Şarj Edilen İrade' : 'Will Restored'}
                  </span>
                  <p className="text-xl font-light text-[#4F6D7A] mt-1">
                    +{summary.replenishedWill} <span className="text-xs text-[#A0AEC0]">{language === 'tr' ? 'puan' : 'pts'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
