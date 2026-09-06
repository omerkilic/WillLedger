import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Zap, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  BatteryCharging, 
  TrendingUp, 
  Layers, 
  Lightbulb, 
  ShieldCheck,
  ChevronRight,
  Flame,
  Coffee,
  ShoppingBag,
  Briefcase,
  GitBranch,
  Compass,
  HelpCircle,
  AlertTriangle,
  Activity,
  Target,
  Workflow,
  RefreshCw,
  Cpu,
  Award,
  ArrowDown,
  ArrowUp,
  BarChart2,
  Info
} from 'lucide-react';

interface ManualGuideViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

type GuideSection = 'all' | 'architecture' | 'decision-tree' | 'energy-cycle' | 'ai-matrix' | 'simulator';

export const ManualGuideView: React.FC<ManualGuideViewProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const isTr = language === 'tr';

  const [activeSection, setActiveSection] = useState<GuideSection>('all');
  const [selectedTreeNode, setSelectedTreeNode] = useState<'root' | 'capability' | 'need' | 'action'>('root');
  const [matrixHoveredZone, setMatrixHoveredZone] = useState<number | null>(null);
  const [simulatorScenario, setSimulatorScenario] = useState<'balanced' | 'overworked' | 'recharge'>('balanced');

  const filterTabs = [
    { id: 'all', label: isTr ? 'Tüm Kılavuz & Çizimler' : 'All Diagrams & Handbook' },
    { id: 'architecture', label: isTr ? '1. Sistem Mimarisi & Akış' : '1. Architecture & Flow' },
    { id: 'decision-tree', label: isTr ? '2. Karar Ağacı Şeması' : '2. Decision Tree Diagram' },
    { id: 'energy-cycle', label: isTr ? '3. İrade Döngüsü Eğrisi' : '3. Will Curve & Cycle' },
    { id: 'ai-matrix', label: isTr ? '4. AI Önceliklendirme Matrisi' : '4. AI Prioritization Matrix' },
    { id: 'simulator', label: isTr ? '5. İnteraktif Simülatör' : '5. Interactive Simulator' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* 1. Hero Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4F6D7A] bg-[#4F6D7A]/10 px-3 py-1 rounded-full">
              <Workflow className="w-3.5 h-3.5" />
              <span>{isTr ? 'Görsel Kılavuz & Şemalar' : 'Visual Guide & Schemas'}</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-[#1A202C]">
              {isTr ? 'Will Ledger Nasıl Çalışır?' : 'How Does Will Ledger Work?'}
            </h1>
            <p className="text-sm text-[#718096] max-w-2xl leading-relaxed">
              {isTr
                ? 'Zihinsel enerjinizi, zamanınızı ve bütçenizi tüketmeden hedeflerinizi yönetmeniz için tasarlanmış şemalar, mimari akışlar ve karar ağaçları.'
                : 'Interactive blueprints, architectural diagrams, decision trees and energy curves to protect your mental energy and master your goals.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-manual-goto-dashboard"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 bg-[#4F6D7A] hover:bg-[#3D5A66] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <span>{isTr ? 'Canlı Panoya Git' : 'Go to Live Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Quick Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-[#EDEAE5] overflow-x-auto pb-1 text-xs">
          <span className="text-[#718096] font-medium shrink-0 flex items-center gap-1 mr-1">
            <Info className="w-3.5 h-3.5" /> {isTr ? 'Şema Seç:' : 'Select Schema:'}
          </span>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as GuideSection)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-[#1A202C] text-white shadow-xs'
                  : 'bg-[#FAF9F6] text-[#4A5568] hover:bg-[#EDEAE5]/70 border border-[#EDEAE5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Sistem Mimarisi & Kaynak Akış Şeması (System Flow Architecture) */}
      {(activeSection === 'all' || activeSection === 'architecture') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F6D7A] mb-1">
                <Workflow className="w-4 h-4" />
                <span>{isTr ? 'Şema 1' : 'Diagram 1'}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#1A202C]">
                {isTr ? 'Sistem Mimarisi ve Kaynak Akış Şeması' : 'System Architecture & Resource Flow Diagram'}
              </h2>
              <p className="text-xs text-[#718096]">
                {isTr 
                  ? 'Aktivitelerin üç ana havuza nasıl dağıldığını ve AI motorunun çalışma modelini gösterir.'
                  : 'Illustrates how daily activities flow into the three core pools and feed the AI recommendation engine.'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
              {isTr ? 'Canlı Enerji Döngüsü' : 'Live Energy Cycle'}
            </span>
          </div>

          {/* Flow Architecture Diagram (Visual Infographic) */}
          <div className="bg-[#FAF9F6] rounded-2xl p-4 sm:p-6 border border-[#EDEAE5]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Sol Sütun: Girdi Aktiviteleri */}
              <div className="lg:col-span-3 space-y-3">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-[#718096] mb-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {isTr ? 'Girdi: Günlük Aktiviteler' : 'Input: Daily Activities'}
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <BatteryCharging className="w-4 h-4 text-emerald-600" /> {isTr ? 'Kapasite' : 'Capability'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      {isTr ? '+⚡ Şarj' : '+⚡ Charge'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718096]">
                    {isTr ? 'Uyku, yürüyüş, dinlenme, meditasyon.' : 'Sleep, nature walks, rest, meditation.'}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-amber-600" /> {isTr ? 'İhtiyaç' : 'Need'}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                      {isTr ? '-⏳ -💰 Sabit' : '-⏳ -💰 Essential'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718096]">
                    {isTr ? 'Market, faturalar, ev düzeni, sağlık.' : 'Groceries, bills, home chores, healthcare.'}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-800 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-600" /> {isTr ? 'Eylem (Action)' : 'Action (Goal)'}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                      {isTr ? '🤖 AI Süzgeci' : '🤖 AI Filter'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718096]">
                    {isTr ? 'Hedefler, projeler, odak çalışmaları.' : 'Projects, deep work, learning, milestones.'}
                  </p>
                </div>
              </div>

              {/* Orta Sütun 1: Akış Oku */}
              <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center space-y-2 text-[#4F6D7A]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-center">{isTr ? 'İşleme' : 'Process'}</div>
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Orta Sütun 2: 3 Temel Havuz (Core Resource Pools) */}
              <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#4F6D7A]/20 shadow-xs space-y-4">
                <div className="text-center pb-2 border-b border-[#EDEAE5]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4F6D7A]">
                    {isTr ? 'Merkezi Kaynak Havuzları' : 'Core Resource Pools'}
                  </span>
                  <div className="text-xs text-[#718096]">
                    {isTr ? 'Anlık Bakiye ve Tüketim Dengesi' : 'Live Balance & Consumption Dynamics'}
                  </div>
                </div>

                {/* Will Meter */}
                <div className="space-y-1.5 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" /> {isTr ? 'İrade (Willpower)' : 'Willpower'}
                    </span>
                    <span className="text-amber-800 font-bold text-xs">{isTr ? '100 WP Tavan' : '100 WP Cap'}</span>
                  </div>
                  <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-[78%]" />
                  </div>
                  <div className="text-[10px] text-amber-700/80 flex justify-between">
                    <span>{isTr ? 'Kapasiteyle artar (+)' : 'Refills via Capability (+)'}</span>
                    <span>{isTr ? 'Kararlarla azalır (-)' : 'Depletes via Decisions (-)'}</span>
                  </div>
                </div>

                {/* Time Meter */}
                <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> {isTr ? 'Serbest Zaman' : 'Discretionary Time'}
                    </span>
                    <span className="text-blue-800 font-bold text-xs">{isTr ? '120 Saat / Ay' : '120 Hours / Month'}</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-[60%]" />
                  </div>
                  <div className="text-[10px] text-blue-700/80 flex justify-between">
                    <span>{isTr ? 'Her eylemde düşer (-)' : 'Decreases per activity (-)'}</span>
                    <span>{isTr ? 'Kota kontrolü' : 'Quota control'}</span>
                  </div>
                </div>

                {/* Budget Meter */}
                <div className="space-y-1.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {isTr ? 'Mali Bütçe' : 'Financial Budget'}
                    </span>
                    <span className="text-emerald-800 font-bold text-xs">{isTr ? '$1,500 / Ay' : '$1,500 / Month'}</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[68%]" />
                  </div>
                  <div className="text-[10px] text-emerald-700/80 flex justify-between">
                    <span>{isTr ? 'İhtiyaç & Harcamalar (-)' : 'Needs & expenses (-)'}</span>
                    <span>{isTr ? 'Tasarruf payı' : 'Savings buffer'}</span>
                  </div>
                </div>
              </div>

              {/* Orta Sütun 3: Akış Oku */}
              <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center space-y-2 text-[#4F6D7A]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-center">{isTr ? 'Çıktı' : 'Output'}</div>
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Sağ Sütun: AI Sıralama ve Koruma Çıktısı */}
              <div className="lg:col-span-3 space-y-3">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-[#718096] mb-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  {isTr ? 'Çıktı: Akıllı Karar Desteği' : 'Output: Intelligent Guidance'}
                </div>

                <div className="bg-purple-50/80 p-3.5 rounded-xl border border-purple-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>{isTr ? 'AI Öncelik Sıralaması' : 'AI Priority Ordering'}</span>
                  </div>
                  <p className="text-[11px] text-purple-950/80 leading-relaxed">
                    {isTr 
                      ? 'Kalan irade ve vaktinize göre "Bugün ilk neyi yapmalıyım?" sorusunu yanıtlar.'
                      : 'Answers "What should I tackle next?" according to remaining will bandwidth and available hours.'}
                  </p>
                  <div className="text-[10px] font-semibold text-purple-800 bg-white/70 px-2 py-1 rounded">
                    ⚡ Quick Wins vs 🏆 High Impact
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isTr ? 'Tükenmişlik Kalkanı' : 'Burnout Shield'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-950/80 leading-relaxed">
                    {isTr
                      ? 'İrade seviyesi kritik sınıra (%30 altına) yaklaştığında otomatik mola uyarısı verir.'
                      : 'Triggers proactive recovery alerts when mental bandwidth drops below critical thresholds (<30%).'}
                  </p>
                  <div className="text-[10px] font-semibold text-emerald-800 bg-white/70 px-2 py-1 rounded">
                    {isTr ? '🛡️ Enerji Tükenmesi Engellenir' : '🛡️ Burnout Prevented'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Karar Ağacı Şeması (Decision Tree Diagram) */}
      {(activeSection === 'all' || activeSection === 'decision-tree') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F6D7A] mb-1">
                <GitBranch className="w-4 h-4" />
                <span>{isTr ? 'Şema 2' : 'Diagram 2'}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#1A202C]">
                {isTr ? 'Aktivite Sınıflandırma Karar Ağacı' : 'Activity Classification Decision Tree'}
              </h2>
              <p className="text-xs text-[#718096]">
                {isTr 
                  ? 'Yeni bir görev, buluşma veya harcama belirdiğinde nereye kaydedeceğinizi adım adım gösteren görsel diyagram.'
                  : 'A step-by-step visual flowchart showing where to log any upcoming task, errand, or habit.'}
              </p>
            </div>
            <span className="text-xs text-[#718096]">
              {isTr ? 'Düğümlere tıklayarak detayları açın' : 'Click nodes to inspect details'}
            </span>
          </div>

          {/* Interactive Decision Tree Diagram (Visual Nodes) */}
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#EDEAE5] space-y-6">
            
            {/* Seviye 1: Kök Düğüm (Root Question) */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => setSelectedTreeNode('root')}
                className={`max-w-md w-full p-4 rounded-2xl border-2 text-center transition-all cursor-pointer shadow-xs ${
                  selectedTreeNode === 'root'
                    ? 'bg-[#1A202C] text-white border-[#1A202C] scale-102'
                    : 'bg-white text-[#1A202C] border-[#EDEAE5] hover:border-[#4F6D7A]'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
                  {isTr ? 'SORU 1 (Başlangıç)' : 'QUESTION 1 (Starting Point)'}
                </div>
                <div className="text-sm font-semibold">
                  {isTr 
                    ? 'Bu aktivite seni zihnen dolduruyor mu, yoksa tüketiyor mu?'
                    : 'Does this activity recharge your mental energy, or does it consume cognitive effort?'}
                </div>
              </div>

              {/* Dikey Bağlantı Çizgisi */}
              <div className="w-0.5 h-6 bg-[#CBD5E1]" />
            </div>

            {/* Seviye 2: 2 Ana Dal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              
              {/* Sol Dal: Şarj Edenler -> KAPASİTE */}
              <div className="flex flex-col items-center space-y-3">
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                  {isTr ? '🌿 Evet, Şarj Ediyor & Rahatlatıyor' : '🌿 Yes, Recharges & Restores'}
                </div>
                <div className="w-0.5 h-4 bg-emerald-300" />
                
                <div 
                  onClick={() => setSelectedTreeNode('capability')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                    selectedTreeNode === 'capability'
                      ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <BatteryCharging className="w-4 h-4" /> {isTr ? '1. KAPASİTE (Capability)' : '1. CAPABILITY'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedTreeNode === 'capability' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {isTr ? '+⚡ WP Artışı' : '+⚡ WP Boost'}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed mb-2">
                    {isTr 
                      ? 'Doğa yürüyüşü, kaliteli uyku, meditasyon, hobiler, temiz hava molası.'
                      : 'Nature walks, restorative sleep, meditation, relaxing hobbies, fresh air breaks.'}
                  </p>
                  <div className={`text-[11px] font-medium p-2 rounded-lg ${
                    selectedTreeNode === 'capability' ? 'bg-white/10' : 'bg-white/70 text-emerald-900 border border-emerald-200'
                  }`}>
                    💡 <strong>{isTr ? 'Etki:' : 'Impact:'}</strong> {isTr ? 'İrade havuzunu doldurur. Zor günlerden sonra tükenmeyi engeller.' : 'Refills mental battery. Prevents chronic decision fatigue and burnout.'}
                  </div>
                </div>
              </div>

              {/* Sağ Dal: Tüketenler -> İkinci Soru */}
              <div className="flex flex-col items-center space-y-3">
                <div className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                  {isTr ? '⚡ Hayır, Efor / Zaman Gerektiriyor' : '⚡ No, Consumes Effort / Time'}
                </div>
                <div className="w-0.5 h-4 bg-amber-300" />

                {/* Ara Soru Kutusu */}
                <div className="w-full bg-white p-3.5 rounded-2xl border-2 border-dashed border-[#CBD5E1] text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#718096] mb-0.5">
                    {isTr ? 'SORU 2 (Zorunluluk Testi)' : 'QUESTION 2 (Essentiality Test)'}
                  </div>
                  <div className="text-xs font-semibold text-[#1A202C]">
                    {isTr ? 'Ertelenemez, temel bir yaşam gereksinimi mi?' : 'Is it an essential, unskippable life obligation?'}
                  </div>
                </div>

                {/* 2 Alt Dal: İhtiyaç vs Eylem */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
                  
                  {/* Evet -> İhtiyaç */}
                  <div 
                    onClick={() => setSelectedTreeNode('need')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                      selectedTreeNode === 'need'
                        ? 'bg-amber-600 text-white border-amber-700 ring-4 ring-amber-500/20'
                        : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" /> {isTr ? '2. İHTİYAÇ' : '2. NEED'}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedTreeNode === 'need' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-800'
                      }`}>
                        -⏳ -💰
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed mb-2">
                      {isTr ? 'Market, fatura ödeme, ev tamiratı, doktor randevusu.' : 'Groceries, paying bills, doctor appointments, essential errands.'}
                    </p>
                    <div className={`text-[10px] font-medium p-1.5 rounded ${
                      selectedTreeNode === 'need' ? 'bg-white/10' : 'bg-white/70 text-amber-900 border border-amber-200'
                    }`}>
                      📌 <strong>{isTr ? 'Öneri:' : 'Tip:'}</strong> {isTr ? 'Sabah ilk iş veya toplu şekilde bitirip zihinden çıkarın.' : 'Batch together or complete early to clear cognitive overhead.'}
                    </div>
                  </div>

                  {/* Hayır -> Eylem */}
                  <div 
                    onClick={() => setSelectedTreeNode('action')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                      selectedTreeNode === 'action'
                        ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-500/20'
                        : 'bg-blue-50 text-blue-950 border-blue-200 hover:bg-blue-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> {isTr ? '3. EYLEM (Action)' : '3. ACTION'}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedTreeNode === 'action' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {isTr ? '🎯 AI Sıralar' : '🎯 AI Ranks'}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed mb-2">
                      {isTr ? 'Proje tamamlama, kod yazma, eğitim izleme, sosyal etkinlik.' : 'Project milestones, deep work, coursework, impactful creative tasks.'}
                    </p>
                    <div className={`text-[10px] font-medium p-1.5 rounded ${
                      selectedTreeNode === 'action' ? 'bg-white/10' : 'bg-white/70 text-blue-900 border border-blue-200'
                    }`}>
                      🤖 <strong>{isTr ? 'Öneri:' : 'Tip:'}</strong> {isTr ? 'AI Öncelikler sekmesinde enerjinize göre sıralatın.' : 'Let AI schedule tasks according to your active energy curve.'}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. İrade Eğrisi & Enerji Döngüsü Çizimi (Willpower Daily Waveform & Depletion Chart) */}
      {(activeSection === 'all' || activeSection === 'energy-cycle') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F6D7A] mb-1">
                <Activity className="w-4 h-4" />
                <span>{isTr ? 'Şema 3' : 'Diagram 3'}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#1A202C]">
                {isTr ? 'Günlük İrade Eğrisi & Şarj Döngüsü Çizimi' : 'Daily Will Curve & Replenishment Cycle'}
              </h2>
              <p className="text-xs text-[#718096]">
                {isTr 
                  ? 'İradenizin gün içinde nasıl tükendiğini ve ara "Kapasite" molalarıyla nasıl dengede tutulacağını gösteren grafik eğrisi.'
                  : 'Visual waveform showing natural cognitive depletion throughout the day and how targeted capability pauses sustain peak clarity.'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shrink-0">
              {isTr ? 'Optimal Zihin Eğrisi' : 'Optimal Cognitive Curve'}
            </span>
          </div>

          {/* SVG Drawn Graph of Daily Energy */}
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#EDEAE5] space-y-4">
            <div className="relative w-full h-64 bg-white rounded-xl border border-[#EDEAE5] p-4 overflow-hidden">
              
              {/* Background Reference Zones */}
              <div className="absolute inset-x-4 top-4 h-16 bg-emerald-50/40 rounded-t border-b border-emerald-100 flex items-center justify-between px-3 text-[10px] font-semibold text-emerald-700">
                <span>{isTr ? 'Yeşil Bölge (80-100 WP): Zirve Odaklanma & Yüksek İrade' : 'Green Zone (80-100 WP): Peak Focus & High Willpower'}</span>
                <span>{isTr ? 'Yüksek Etkili Görevler' : 'High Impact Tasks'}</span>
              </div>
              <div className="absolute inset-x-4 top-20 h-24 bg-amber-50/40 border-b border-amber-100 flex items-center justify-between px-3 text-[10px] font-semibold text-amber-700">
                <span>{isTr ? 'Sarı Bölge (40-80 WP): Normal Çalışma & İhtiyaçlar' : 'Yellow Zone (40-80 WP): Routine Work & Needs'}</span>
                <span>{isTr ? 'Rutin & Hızlı Görevler' : 'Routine & Quick Wins'}</span>
              </div>
              <div className="absolute inset-x-4 bottom-8 h-16 bg-rose-50/40 rounded-b flex items-center justify-between px-3 text-[10px] font-semibold text-rose-700">
                <span>{isTr ? 'Kırmızı Bölge (<40 WP): Tükenmişlik Tehlikesi!' : 'Red Zone (<40 WP): Burnout Danger!'}</span>
                <span>{isTr ? 'Karar Verme Gücü Biter' : 'Decision Fatigue'}</span>
              </div>

              {/* SVG Curve Path */}
              <svg className="absolute inset-x-4 inset-y-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="35%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="80%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* Dotted threshold line */}
                <line x1="0" y1="140" x2="800" y2="140" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

                {/* Energy Curve Line */}
                <path
                  d="M 0,25 C 100,25 150,110 250,115 C 280,117 320,60 380,65 C 440,70 480,125 560,130 C 620,135 670,45 800,30"
                  fill="none"
                  stroke="url(#curveGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Key Milestone Dots on the Curve */}
                <circle cx="20" cy="25" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="250" cy="115" r="5" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
                <circle cx="380" cy="65" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="560" cy="130" r="5" fill="#EF4444" stroke="#fff" strokeWidth="2" />
                <circle cx="780" cy="30" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
              </svg>

              {/* Time Markers on Bottom */}
              <div className="absolute inset-x-4 bottom-1 flex justify-between text-[11px] text-[#718096] font-medium pt-1 border-t border-[#EDEAE5]">
                <span>{isTr ? '08:00 (Uyanış: 100 WP)' : '08:00 (Wake-up: 100 WP)'}</span>
                <span>{isTr ? '12:00 (İş Sonrası)' : '12:00 (Post Deep Work)'}</span>
                <span className="text-emerald-700 font-bold">{isTr ? '13:30 (Kapasite Molası +25 WP)' : '13:30 (Capability Pause +25 WP)'}</span>
                <span>{isTr ? '17:00 (Mesai Sonu)' : '17:00 (End of Shift)'}</span>
                <span>{isTr ? '22:00 (Dinlenme)' : '22:00 (Rest)'}</span>
              </div>
            </div>

            {/* Comparison Cards: Burnout vs Ledger Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{isTr ? 'Geleneksel Hata: "Tükenmişlik Çukuru"' : 'Traditional Pitfall: The Burnout Abyss'}</span>
                </div>
                <p className="text-xs text-rose-950/80 leading-relaxed">
                  {isTr 
                    ? 'Hiç kapasite (mola, spor, uyku) eklemeden sadece "Eylem" yapıldığında irade öğleden sonra sıfırlanır, erteleme ve stres başlar.'
                    : 'Working non-stop on goals without replenishing habits causes will reserves to zero out by 3 PM, triggering procrastination and distress.'}
                </p>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isTr ? 'Will Ledger Modeli: "Sürdürülebilir Denge"' : 'Will Ledger Model: Sustainable Equilibrium'}</span>
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  {isTr
                    ? 'Zor bir eylemin ardından yeşil bir "Kapasite" aktivitesi ekleyerek depoyu yeniden doldurur, günü yorulmadan tamamlarsınız.'
                    : 'Pairing intensive actions with restorative capability breaks consistently recharges your pool, preserving mental clarity throughout the week.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. AI Önceliklendirme Matrisi (2x2 Matrix Diagram) */}
      {(activeSection === 'all' || activeSection === 'ai-matrix') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F6D7A] mb-1">
                <Layers className="w-4 h-4" />
                <span>{isTr ? 'Şema 4' : 'Diagram 4'}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#1A202C]">
                {isTr ? 'AI Önceliklendirme Matrisi (4 Bölge)' : 'AI Prioritization Matrix (4 Quadrants)'}
              </h2>
              <p className="text-xs text-[#718096]">
                {isTr
                  ? 'Eylemlerinizin harcadığı irade maliyetine ve ürettiği etkiye göre 4 farklı bölgede konumlandırılması.'
                  : 'How your tasks are categorized across 4 zones based on willpower cognitive cost versus productive impact.'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full shrink-0">
              {isTr ? 'Gemini Destekli Matris' : 'Gemini-Powered Matrix'}
            </span>
          </div>

          {/* 2x2 Matrix Graphic Grid */}
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#EDEAE5] space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Bölge 1: Hızlı Kazanımlar (Quick Wins) */}
              <div 
                onMouseEnter={() => setMatrixHoveredZone(1)}
                onMouseLeave={() => setMatrixHoveredZone(null)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                  matrixHoveredZone === 1
                    ? 'bg-purple-50 border-purple-400 scale-102 shadow-md'
                    : 'bg-white border-purple-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <span className="text-xs font-bold text-purple-900">
                        {isTr ? 'Bölge 1: Hızlı Kazanım (Quick Wins)' : 'Zone 1: Quick Wins'}
                      </span>
                      <div className="text-[10px] text-[#718096]">
                        {isTr ? 'Düşük İrade, Yüksek Etki' : 'Low Will Cost, High Impact'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                    {isTr ? 'İlk Bunu Yap!' : 'Do First!'}
                  </span>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed mb-3">
                  {isTr 
                    ? 'Az zihinsel efor gerektiren ama tamamlandığında büyük rahatlama ve motivasyon sağlayan işler.'
                    : 'Tasks requiring little cognitive friction that unlock immediate momentum and relief.'}
                </p>
                <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#EDEAE5] text-xs font-medium text-purple-950 flex items-center justify-between">
                  <span>{isTr ? 'Örnek: Kritik e-posta göndermek, hızlı onay.' : 'E.g., Sending key emails, approving invoices.'}</span>
                  <span className="text-purple-700 font-bold">{isTr ? 'Skor: 90-99' : 'Score: 90-99'}</span>
                </div>
              </div>

              {/* Bölge 2: Büyük Etki (High Impact) */}
              <div 
                onMouseEnter={() => setMatrixHoveredZone(2)}
                onMouseLeave={() => setMatrixHoveredZone(null)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                  matrixHoveredZone === 2
                    ? 'bg-blue-50 border-blue-400 scale-102 shadow-md'
                    : 'bg-white border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-900">
                        {isTr ? 'Bölge 2: Büyük Etki (High Impact)' : 'Zone 2: High Impact'}
                      </span>
                      <div className="text-[10px] text-[#718096]">
                        {isTr ? 'Yüksek İrade, Yüksek Etki' : 'High Will Cost, High Impact'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                    {isTr ? 'Sabah Odaklan' : 'Morning Focus'}
                  </span>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed mb-3">
                  {isTr
                    ? 'Kariyerinizi veya hedefinizi ileri taşıyan, derin odaklanma ve yüksek irade isteyen temel taşlar.'
                    : 'Core milestones moving your career or life forward that demand peak morning focus.'}
                </p>
                <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#EDEAE5] text-xs font-medium text-blue-950 flex items-center justify-between">
                  <span>{isTr ? 'Örnek: Strateji raporu, zorlu kodlama.' : 'E.g., Strategy document, deep coding.'}</span>
                  <span className="text-blue-700 font-bold">{isTr ? 'Skor: 75-89' : 'Score: 75-89'}</span>
                </div>
              </div>

              {/* Bölge 3: Dolgu Görevler (Low Effort Fill-ins) */}
              <div 
                onMouseEnter={() => setMatrixHoveredZone(3)}
                onMouseLeave={() => setMatrixHoveredZone(null)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                  matrixHoveredZone === 3
                    ? 'bg-stone-50 border-stone-400 scale-102 shadow-md'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-stone-500 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900">
                        {isTr ? 'Bölge 3: Dolgu Görevler (Fill-ins)' : 'Zone 3: Fill-in Tasks'}
                      </span>
                      <div className="text-[10px] text-[#718096]">
                        {isTr ? 'Düşük İrade, Düşük Etki' : 'Low Will Cost, Low Impact'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded-full font-bold">
                    {isTr ? 'Boşlukta Yap' : 'Slot in Gaps'}
                  </span>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed mb-3">
                  {isTr
                    ? 'Fazla kafa yormayan ama yapılması gereken hafif aktiviteler. Enerjiniz azaldığında iyi gider.'
                    : 'Light maintenance tasks that do not demand creative energy. Ideal when bandwidth is moderate.'}
                </p>
                <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#EDEAE5] text-xs font-medium text-stone-950 flex items-center justify-between">
                  <span>{isTr ? 'Örnek: Dosya temizliği, takvim düzenleme.' : 'E.g., Folder cleanup, calendar scheduling.'}</span>
                  <span className="text-stone-700 font-bold">{isTr ? 'Skor: 50-70' : 'Score: 50-70'}</span>
                </div>
              </div>

              {/* Bölge 4: Enerji Emiciler (Drain & Reconsider) */}
              <div 
                onMouseEnter={() => setMatrixHoveredZone(4)}
                onMouseLeave={() => setMatrixHoveredZone(null)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                  matrixHoveredZone === 4
                    ? 'bg-amber-50 border-amber-400 scale-102 shadow-md'
                    : 'bg-white border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-900">
                        {isTr ? 'Bölge 4: Enerji Emici (Reconsider)' : 'Zone 4: Energy Drains'}
                      </span>
                      <div className="text-[10px] text-[#718096]">
                        {isTr ? 'Yüksek İrade, Düşük Etki' : 'High Will Cost, Low Impact'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                    {isTr ? 'Ertele / Delege Et' : 'Defer or Delegate'}
                  </span>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed mb-3">
                  {isTr
                    ? 'Sizi çok yoran ama kayda değer bir katma değer sağlamayan yıpratıcı işler.'
                    : 'Demanding obligations that provide minimal upside. Candidates for simplification or delegation.'}
                </p>
                <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#EDEAE5] text-xs font-medium text-amber-950 flex items-center justify-between">
                  <span>{isTr ? 'Örnek: Gereksiz tartışmalı toplantılar.' : 'E.g., Endless unfocused meetings.'}</span>
                  <span className="text-rose-700 font-bold">{isTr ? 'AI Uyarısı Alır' : 'AI Caution Flag'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. İnteraktif Senaryo ve Kaynak Simülasyonu (Live Dynamic Simulator) */}
      {(activeSection === 'all' || activeSection === 'simulator') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDEAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F6D7A] mb-1">
                <BarChart2 className="w-4 h-4" />
                <span>{isTr ? 'Şema 5' : 'Diagram 5'}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#1A202C]">
                {isTr ? 'İnteraktif Senaryo Simülatörü' : 'Interactive Scenario Simulator'}
              </h2>
              <p className="text-xs text-[#718096]">
                {isTr
                  ? 'Farklı hayat senaryolarının kaynak havuzlarınızı nasıl etkilediğini canlı olarak test edin.'
                  : 'Test how various lifestyle scenarios dynamically impact your cognitive and material resources.'}
              </p>
            </div>
            <span className="text-xs text-[#718096]">
              {isTr ? 'Senaryoyu değiştirerek canlı sayaçları inceleyin' : 'Switch scenarios to inspect live reactions'}
            </span>
          </div>

          {/* Scenario Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSimulatorScenario('balanced')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                simulatorScenario === 'balanced'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-[#FAF9F6] border-[#EDEAE5] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⚖️</span>
                <span className="text-sm font-bold text-emerald-950">
                  {isTr ? '1. Dengeli Hafta' : '1. Balanced Week'}
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                {isTr ? 'Kapasite ve eylemler eşit dağıtılmış, sağlıklı döngü.' : 'Equal balance between restorative habits and goal sprints.'}
              </p>
            </button>

            <button
              onClick={() => setSimulatorScenario('overworked')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                simulatorScenario === 'overworked'
                  ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 shadow-xs'
                  : 'bg-[#FAF9F6] border-[#EDEAE5] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-bold text-rose-950">
                  {isTr ? '2. Aşırı Yüklenme' : '2. Overworked Surge'}
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                {isTr ? 'Sıfır mola, arka arkaya ağır eylemler ve toplantılar.' : 'Zero recovery pauses, back-to-back heavy decisions.'}
              </p>
            </button>

            <button
              onClick={() => setSimulatorScenario('recharge')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                simulatorScenario === 'recharge'
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-[#FAF9F6] border-[#EDEAE5] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🧘</span>
                <span className="text-sm font-bold text-blue-950">
                  {isTr ? '3. Şarj & İyileşme' : '3. Recharge & Recovery'}
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                {isTr ? 'Hafta sonu doğa yürüyüşü, uyku ve zihinsel dinlenme.' : 'Dedicated nature walks, deep sleep, and creative relaxation.'}
              </p>
            </button>
          </div>

          {/* Live Outcome Visualization */}
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#EDEAE5] space-y-6">
            
            {/* Status Summary Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              simulatorScenario === 'balanced'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : simulatorScenario === 'overworked'
                ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                : 'bg-blue-50/80 border-blue-200 text-blue-950'
            }`}>
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase tracking-wider">
                  {isTr ? (
                    simulatorScenario === 'balanced' ? 'Durum: Mükemmel Zihinsel Denge' : simulatorScenario === 'overworked' ? 'Tehlike: Tükenmişlik Sınırı Aşılıyor' : 'Durum: İrade Havuzu Tamamen Yenilendi'
                  ) : (
                    simulatorScenario === 'balanced' ? 'Status: Optimal Cognitive Balance' : simulatorScenario === 'overworked' ? 'Warning: Critical Depletion Threshold' : 'Status: Will Battery Fully Replenished'
                  )}
                </div>
                <div className="text-xs opacity-90">
                  {isTr ? (
                    simulatorScenario === 'balanced' 
                      ? 'İrade kaybı kontrollü, hedefler ilerliyor ve mola zamanında alındı.' 
                      : simulatorScenario === 'overworked' 
                      ? 'İrade 20 WP altına geriledi. AI acil Kapasite molası öneriyor.' 
                      : 'Yeni haftaya 95+ WP ile başlama hazırlığı tamamlandı.'
                  ) : (
                    simulatorScenario === 'balanced'
                      ? 'Will attrition is healthy, milestones advance steadily with timely pauses.'
                      : simulatorScenario === 'overworked'
                      ? 'Willpower dipped below 20 WP. AI advises emergency capability downtime.'
                      : 'Prepared to enter the new work cycle with a 95+ WP peak reservoir.'
                  )}
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 ${
                simulatorScenario === 'balanced'
                  ? 'bg-emerald-200 text-emerald-900'
                  : simulatorScenario === 'overworked'
                  ? 'bg-rose-200 text-rose-900 animate-pulse'
                  : 'bg-blue-200 text-blue-900'
              }`}>
                {isTr ? (
                  simulatorScenario === 'balanced' ? 'Sağlık Skoru: %88' : simulatorScenario === 'overworked' ? 'Sağlık Skoru: %24' : 'Sağlık Skoru: %98'
                ) : (
                  simulatorScenario === 'balanced' ? 'Health Score: 88%' : simulatorScenario === 'overworked' ? 'Health Score: 24%' : 'Health Score: 98%'
                )}
              </span>
            </div>

            {/* Meters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Will Meter */}
              <div className="bg-white p-4 rounded-xl border border-[#EDEAE5] shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-current" /> {isTr ? 'İrade (Will)' : 'Willpower'}
                  </span>
                  <span className="font-bold text-sm">
                    {simulatorScenario === 'balanced' && (isTr ? '78 WP (İyi)' : '78 WP (Good)')}
                    {simulatorScenario === 'overworked' && (isTr ? '18 WP (Kritik!)' : '18 WP (Critical!)')}
                    {simulatorScenario === 'recharge' && (isTr ? '95 WP (Zirve)' : '95 WP (Peak)')}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      simulatorScenario === 'balanced' ? 'bg-amber-500 w-[78%]' : simulatorScenario === 'overworked' ? 'bg-rose-500 w-[18%]' : 'bg-emerald-500 w-[95%]'
                    }`}
                  />
                </div>
                <div className="text-[11px] text-[#718096]">
                  {isTr ? (
                    simulatorScenario === 'balanced' ? 'Kapasite aktiviteleriyle dengede tutuldu.' : simulatorScenario === 'overworked' ? 'Karar yorgunluğu zirvede, mola şart!' : 'Dinlenme ve uyku ile tamamen doldu.'
                  ) : (
                    simulatorScenario === 'balanced' ? 'Sustained through capability habits.' : simulatorScenario === 'overworked' ? 'High decision fatigue; downtime needed!' : 'Fully topped up by intentional recovery.'
                  )}
                </div>
              </div>

              {/* Time Meter */}
              <div className="bg-white p-4 rounded-xl border border-[#EDEAE5] shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" /> {isTr ? 'Kalan Zaman' : 'Remaining Time'}
                  </span>
                  <span className="font-bold text-sm">
                    {simulatorScenario === 'balanced' && (isTr ? '68 Saat' : '68 Hours')}
                    {simulatorScenario === 'overworked' && (isTr ? '12 Saat' : '12 Hours')}
                    {simulatorScenario === 'recharge' && (isTr ? '92 Saat' : '92 Hours')}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-blue-500 transition-all duration-500 ${
                      simulatorScenario === 'balanced' ? 'w-[58%]' : simulatorScenario === 'overworked' ? 'w-[12%]' : 'w-[78%]'
                    }`}
                  />
                </div>
                <div className="text-[11px] text-[#718096]">
                  {isTr ? (
                    simulatorScenario === 'balanced' ? 'Haftalık hedeflere uygun harcama.' : simulatorScenario === 'overworked' ? 'Zaman kotası tükenmek üzere.' : 'Önemli projeler için bol süre var.'
                  ) : (
                    simulatorScenario === 'balanced' ? 'Disciplined expenditure against quota.' : simulatorScenario === 'overworked' ? 'Hours exhausted on reactive tasks.' : 'Generous runway for upcoming milestones.'
                  )}
                </div>
              </div>

              {/* Budget Meter */}
              <div className="bg-white p-4 rounded-xl border border-[#EDEAE5] shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> {isTr ? 'Kalan Bütçe' : 'Remaining Budget'}
                  </span>
                  <span className="font-bold text-sm">
                    {simulatorScenario === 'balanced' && '$1,120'}
                    {simulatorScenario === 'overworked' && '$430'}
                    {simulatorScenario === 'recharge' && '$1,380'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-emerald-500 transition-all duration-500 ${
                      simulatorScenario === 'balanced' ? 'w-[75%]' : simulatorScenario === 'overworked' ? 'w-[30%]' : 'w-[90%]'
                    }`}
                  />
                </div>
                <div className="text-[11px] text-[#718096]">
                  {isTr ? (
                    simulatorScenario === 'balanced' ? 'Tasarruf ve harcama sınırları içinde.' : simulatorScenario === 'overworked' ? 'Plansız acil harcamalar oluştu.' : 'Sıfır masraflı doğa dinlenmesi.'
                  ) : (
                    simulatorScenario === 'balanced' ? 'Well within discretionary targets.' : simulatorScenario === 'overworked' ? 'Unplanned reactive outflows.' : 'Low-cost restorative nature activities.'
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 7. Hızlı Başlangıç Eylem Butonları */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDEAE5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-semibold text-[#1A202C]">
            {isTr ? 'Şimdi Uygulamaya Başlayın' : 'Start Applying Right Now'}
          </h3>
          <p className="text-xs text-[#718096]">
            {isTr 
              ? 'Aylık limitlerinizi belirleyin veya ilk aktivitenizi kaydederek başlayın.'
              : 'Set your monthly baseline limits or record your first activity to calibrate your ledger.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('setup')}
            className="px-4 py-2.5 rounded-xl border border-[#EDEAE5] bg-[#FAF9F6] hover:bg-white text-xs font-semibold text-[#4A5568] transition-colors cursor-pointer"
          >
            {isTr ? 'Aylık Limitleri Düzenle' : 'Adjust Monthly Limits'}
          </button>
          <button
            onClick={() => onNavigate('log')}
            className="px-4 py-2.5 rounded-xl border border-[#EDEAE5] bg-[#FAF9F6] hover:bg-white text-xs font-semibold text-[#4A5568] transition-colors cursor-pointer"
          >
            {isTr ? 'Aktivite Ekle' : 'Log Activity'}
          </button>
          <button
            onClick={() => onNavigate('priorities')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTr ? 'AI Önceliklerine Bak' : 'Inspect AI Priorities'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
