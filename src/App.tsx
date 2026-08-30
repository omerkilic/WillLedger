import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { MonthlySetupView } from './views/MonthlySetupView';
import { ActivityLogView } from './views/ActivityLogView';
import { CategoryManagerView } from './views/CategoryManagerView';
import { ActionPrioritiesView } from './views/ActionPrioritiesView';
import { Sparkles, Loader2 } from 'lucide-react';

const MainShell: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-[#718096]">
          <Loader2 className="w-6 h-6 animate-spin text-[#4F6D7A]" />
          <span className="text-sm font-medium">Opening your Monthly Will Ledger...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <LedgerProvider>
      <div className="min-h-screen bg-[#FDFCFB] text-[#2D3748] flex flex-col selection:bg-[#F0F4F2] selection:text-[#4F6D7A]">
        {/* Top Navigation Bar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Body Layout: Sidebar + Main Content View */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 bg-[#FDFCFB]">
            <div className="max-w-5xl mx-auto">
              {activeTab === 'dashboard' && <DashboardView onNavigate={(tab) => setActiveTab(tab)} />}
              {activeTab === 'setup' && <MonthlySetupView />}
              {activeTab === 'log' && <ActivityLogView />}
              {activeTab === 'categories' && <CategoryManagerView />}
              {activeTab === 'priorities' && <ActionPrioritiesView />}
            </div>
          </main>
        </div>
      </div>
    </LedgerProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainShell />
    </AuthProvider>
  );
}

