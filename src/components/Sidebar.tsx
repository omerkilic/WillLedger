import React from 'react';
import { NavigationTab } from '../types';
import { 
  LayoutDashboard, 
  Sliders, 
  BookOpen, 
  FolderKanban, 
  Sparkles, 
  Zap,
  Clock,
  DollarSign
} from 'lucide-react';
import { useLedger } from '../context/LedgerContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
}) => {
  const { activities, summary } = useLedger();

  const actionCount = activities.filter((a) => a.type === 'action' && !a.completed).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Monthly Dashboard',
      shortDesc: 'Remaining resources at a glance',
      icon: LayoutDashboard,
    },
    {
      id: 'setup',
      label: 'Monthly Setup',
      shortDesc: 'Starting time, budget & will limits',
      icon: Sliders,
    },
    {
      id: 'log',
      label: 'Daily Activity Log',
      shortDesc: 'Record capabilities, needs & actions',
      icon: BookOpen,
      badge: activities.length > 0 ? activities.length : undefined,
    },
    {
      id: 'categories',
      label: 'Category Manager',
      shortDesc: 'Customize life areas & tags',
      icon: FolderKanban,
    },
    {
      id: 'priorities',
      label: 'Action Priorities',
      shortDesc: 'AI recommendations on what next',
      icon: Sparkles,
      badge: actionCount > 0 ? actionCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 md:top-[61px] left-0 z-40 h-screen md:h-[calc(100vh-61px)] w-72 bg-white border-r border-[#EDEAE5] flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-2 py-1 mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#A0AEC0]">
              Navigation
            </h2>
          </div>

          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#4F6D7A] ${
                    isActive
                      ? 'bg-[#F0F4F2] text-[#4F6D7A] font-medium'
                      : 'text-[#718096] hover:bg-gray-50 hover:text-[#1A202C]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#4F6D7A]'
                        : 'text-[#718096] group-hover:text-[#1A202C]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium tracking-tight truncate">
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#4F6D7A]/15 text-[#4F6D7A]'
                              : 'bg-gray-100 text-[#718096]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Energy Meter Card */}
        <div className="bg-[#F7F9F9] rounded-2xl p-4 border border-[#EDEAE5] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#2D3748] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#4F6D7A]" />
              Will Vitality
            </span>
            <span className="font-bold text-[#1A202C] text-xs">
              {summary.remainingWill} <span className="font-normal text-[#A0AEC0] text-[10px]">pts</span>
            </span>
          </div>

          <div className="w-full bg-[#EDF2F7] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.remainingWill <= 15
                  ? 'bg-rose-500'
                  : summary.remainingWill <= 40
                  ? 'bg-amber-500'
                  : 'bg-[#4F6D7A]'
              }`}
              style={{
                width: `${
                  summary.startingWill > 0
                    ? Math.min(100, Math.max(0, (summary.remainingWill / summary.startingWill) * 100))
                    : 0
                }%`,
              }}
            />
          </div>

          <p className="text-[11px] text-[#718096] leading-snug">
            {summary.remainingWill > 50
              ? 'Generous mental bandwidth available for milestones.'
              : summary.remainingWill > 20
              ? 'Moderate energy remaining. Consider a replenishing habit.'
              : 'Energy low. Prioritize rest and self-care today.'}
          </p>
        </div>
      </aside>
    </>
  );
};
