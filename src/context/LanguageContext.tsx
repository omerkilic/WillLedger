import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Brand & App
    'app.title': 'Will Ledger',
    'app.subtitle': 'Zihinsel Enerji, Zaman ve Bütçe Takibi',
    
    // Navigation
    'nav.dashboard': 'Pano',
    'nav.dashboard_desc': 'Kaynak dengesi ve özet',
    'nav.setup': 'Aylık Limitler',
    'nav.setup_desc': 'İrade, zaman ve bütçe tavanı',
    'nav.log': 'Aktivite Günlüğü',
    'nav.log_desc': 'Kapasite, ihtiyaç ve eylemler',
    'nav.categories': 'Kategoriler',
    'nav.categories_desc': 'Etiketler ve renkler',
    'nav.priorities': 'AI Öncelikler',
    'nav.priorities_desc': 'Yapay zeka eylem sıralaması',
    'nav.manual': 'Kılavuz & Şemalar',
    'nav.manual_desc': 'Çizimler, akışlar ve rehber',

    // Quick Actions & Controls
    'btn.log_activity': 'Aktivite Ekle',
    'btn.how_to_use': 'Nasıl Kullanılır?',
    'btn.adjust_limits': 'Limitleri Düzenle',
    'btn.save': 'Kaydet',
    'btn.cancel': 'İptal',
    'btn.delete': 'Sil',
    'btn.edit': 'Düzenle',
    'btn.logout': 'Çıkış Yap',
    'btn.goto_dashboard': 'Panoya Git',
    'btn.filter_all': 'Tümü',

    // Resources
    'res.will': 'İrade',
    'res.will_desc': 'Zihinsel Enerji',
    'res.time': 'Zaman',
    'res.time_desc': 'Serbest Saat Kotası',
    'res.budget': 'Bütçe',
    'res.budget_desc': 'Aylık Harcama Limiti',
    'res.remaining': 'Kalan',
    'res.spent': 'Harcanan',
    'res.allocated': 'Tahsis Edilen',
    'res.recharged': 'Doldurulan',

    // Activity Types
    'type.capability': 'Kapasite',
    'type.capability_tag': 'Kapasite (+⚡)',
    'type.capability_desc': 'Zihinsel enerjiyi şarj eden aktiviteler (Uyku, yürüyüş, dinlenme)',
    'type.need': 'İhtiyaç',
    'type.need_tag': 'İhtiyaç (-⏳ -💰)',
    'type.need_desc': 'Ertelenemez zorunlu gereksinimler (Market, fatura, sağlık)',
    'type.action': 'Eylem',
    'type.action_tag': 'Eylem (Hedef)',
    'type.action_desc': 'Gelişim ve iş hedefleri (AI tarafından önceliklendirilir)',

    // Statuses
    'status.optimal': 'Optimal Denge',
    'status.warning': 'Dikkat: İrade Düşüyor',
    'status.burnout_alert': 'Tükenmişlik Alarmı: Mola Verin!',
    'status.health_score': 'Denge Sağlık Skoru',

    // Guide Headers
    'guide.badge': 'Görsel Kılavuz & Şemalar',
    'guide.title': 'Will Ledger Nasıl Çalışır?',
    'guide.subtitle': 'Zihinsel enerjinizi, zamanınızı ve bütçenizi tüketmeden hedeflerinizi yönetmeniz için tasarlanmış şemalar, mimari akışlar ve karar ağaçları.',
    'guide.select_schema': 'Şema Seç:',
    'guide.tab_all': 'Tüm Kılavuz & Çizimler',
    'guide.tab_architecture': '1. Sistem Mimarisi & Akış',
    'guide.tab_decision': '2. Karar Ağacı Şeması',
    'guide.tab_cycle': '3. İrade Döngüsü Eğrisi',
    'guide.tab_matrix': '4. AI Önceliklendirme Matrisi',
    'guide.tab_simulator': '5. İnteraktif Simülatör',

    // Lang toggle
    'lang.turkish': 'Türkçe',
    'lang.english': 'İngilizce',
    'lang.switch': 'Dil Değiştir',
  },
  en: {
    // Brand & App
    'app.title': 'Will Ledger',
    'app.subtitle': 'Mental Energy, Time & Budget Tracker',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.dashboard_desc': 'Resource balance & overview',
    'nav.setup': 'Monthly Setup',
    'nav.setup_desc': 'Will, time and budget targets',
    'nav.log': 'Activity Log',
    'nav.log_desc': 'Capability, needs and actions',
    'nav.categories': 'Categories',
    'nav.categories_desc': 'Labels and colors',
    'nav.priorities': 'Action Priorities',
    'nav.priorities_desc': 'AI intelligent task ordering',
    'nav.manual': 'Guide & Schemas',
    'nav.manual_desc': 'Diagrams, flows and handbook',

    // Quick Actions & Controls
    'btn.log_activity': 'Log Activity',
    'btn.how_to_use': 'How to Use?',
    'btn.adjust_limits': 'Adjust Limits',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.logout': 'Sign Out',
    'btn.goto_dashboard': 'Go to Dashboard',
    'btn.filter_all': 'All',

    // Resources
    'res.will': 'Willpower',
    'res.will_desc': 'Mental Energy',
    'res.time': 'Time',
    'res.time_desc': 'Discretionary Hours Quota',
    'res.budget': 'Budget',
    'res.budget_desc': 'Monthly Spending Ceiling',
    'res.remaining': 'Remaining',
    'res.spent': 'Spent',
    'res.allocated': 'Allocated',
    'res.recharged': 'Recharged',

    // Activity Types
    'type.capability': 'Capability',
    'type.capability_tag': 'Capability (+⚡)',
    'type.capability_desc': 'Activities that recharge mental energy (Sleep, nature walks, rest)',
    'type.need': 'Need',
    'type.need_tag': 'Need (-⏳ -💰)',
    'type.need_desc': 'Essential unskippable obligations (Groceries, bills, health)',
    'type.action': 'Action',
    'type.action_tag': 'Action (Goal)',
    'type.action_desc': 'Growth, work and life projects (Prioritized by AI)',

    // Statuses
    'status.optimal': 'Optimal Balance',
    'status.warning': 'Attention: Will Depleting',
    'status.burnout_alert': 'Burnout Warning: Take a Break!',
    'status.health_score': 'Balance Health Score',

    // Guide Headers
    'guide.badge': 'Visual Guide & Schemas',
    'guide.title': 'How Does Will Ledger Work?',
    'guide.subtitle': 'Interactive blueprints, architectural diagrams, decision trees and energy curves to protect your mental energy and master your goals.',
    'guide.select_schema': 'Select Diagram:',
    'guide.tab_all': 'All Diagrams & Handbook',
    'guide.tab_architecture': '1. System Architecture & Flow',
    'guide.tab_decision': '2. Decision Tree Diagram',
    'guide.tab_cycle': '3. Will Curve & Cycle',
    'guide.tab_matrix': '4. AI Prioritization Matrix',
    'guide.tab_simulator': '5. Interactive Simulator',

    // Lang toggle
    'lang.turkish': 'Turkish',
    'lang.english': 'English',
    'lang.switch': 'Switch Language',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('will_ledger_lang');
    if (saved === 'tr' || saved === 'en') {
      return saved;
    }
    // Auto-detect browser language or default to TR
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('en')) {
      return 'en';
    }
    return 'tr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('will_ledger_lang', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const translation = translations[language]?.[key];
    if (translation) return translation;
    const fallback = translations['en']?.[key];
    if (fallback) return fallback;
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
