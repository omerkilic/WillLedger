import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLedger } from '../context/LedgerContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calendar, 
  ChevronDown, 
  LogOut, 
  User, 
  Sparkles, 
  Menu, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Globe
} from 'lucide-react';
import { ResourceStatusBar } from './ResourceStatusBar';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { selectedMonth, setSelectedMonth } = useLedger();
  const { language, setLanguage, t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Month navigation helper
  const handlePrevMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) - 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const formatMonthTitle = (mString: string) => {
    const [yearStr, monthStr] = mString.split('-');
    const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#EDEAE5] px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-[#718096] hover:text-[#1A202C] hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#4F6D7A] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4F6D7A] rounded-lg flex items-center justify-center text-white font-bold shadow-xs">
              W
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-[#1A202C] block leading-tight">
                {t('app.title', 'Will Ledger')}
              </span>
              <span className="text-[11px] text-[#718096] hidden sm:block leading-none">
                {t('app.subtitle', 'Mental Energy, Time & Budget Tracker')}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="flex items-center bg-[#F7F9F9] border border-[#EDEAE5] rounded-full px-2 py-1 shadow-xs">
          <button
            id="btn-prev-month"
            onClick={handlePrevMonth}
            className="p-1 rounded-full text-[#718096] hover:text-[#1A202C] hover:bg-white transition-colors"
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold text-[#2D3748] select-none">
            <Calendar className="w-3.5 h-3.5 text-[#4F6D7A]" />
            <span>{formatMonthTitle(selectedMonth)}</span>
          </div>

          <button
            id="btn-next-month"
            onClick={handleNextMonth}
            className="p-1 rounded-full text-[#718096] hover:text-[#1A202C] hover:bg-white transition-colors"
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Language Switcher, Quick Pills & Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TR / EN Language Toggle */}
          <div className="flex items-center bg-[#F7F9F9] border border-[#EDEAE5] rounded-full p-0.5 shadow-xs" role="group" aria-label={t('lang.switch')}>
            <button
              id="btn-lang-tr"
              onClick={() => setLanguage('tr')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                language === 'tr'
                  ? 'bg-[#4F6D7A] text-white shadow-xs'
                  : 'text-[#718096] hover:text-[#1A202C]'
              }`}
              title="Türkçe"
            >
              TR
            </button>
            <button
              id="btn-lang-en"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#4F6D7A] text-white shadow-xs'
                  : 'text-[#718096] hover:text-[#1A202C]'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <div className="hidden xl:block">
            <ResourceStatusBar compact />
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="btn-user-profile-menu"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#EDEAE5] hover:border-gray-300 hover:bg-[#F7F9F9] transition-all text-xs font-medium text-[#2D3748] shadow-xs focus-visible:ring-2 focus-visible:ring-[#4F6D7A]"
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-gray-700 flex items-center justify-center font-bold text-xs uppercase">
                {user?.name ? user.name.charAt(0) : user?.email?.charAt(0) || 'U'}
              </div>
              <span className="max-w-[110px] truncate hidden sm:inline font-semibold text-xs">{user?.name || user?.email}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#A0AEC0]" />
            </button>

            {profileOpen && (
              <div 
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EDEAE5] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-xs font-semibold text-[#1A202C] truncate">{user?.name || 'Account'}</p>
                  <p className="text-[11px] text-[#718096] truncate">{user?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#4F6D7A] font-medium bg-[#F0F4F2] px-2 py-0.5 rounded-md inline-flex">
                    <ShieldCheck className="w-3 h-3" /> {language === 'tr' ? 'Güvenli Alan' : 'Secure Workspace'}
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-[11px] text-[#A0AEC0]">
                    {language === 'tr' ? 'Aktif Ay:' : 'Active Month:'} <span className="font-semibold text-[#2D3748]">{selectedMonth}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    id="btn-sign-out"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('btn.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
