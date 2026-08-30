import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MonthlyLimits, Category, Activity, ResourceSummary, AIPriorityResponse } from '../types';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';

interface LedgerContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  limits: MonthlyLimits;
  categories: Category[];
  activities: Activity[];
  summary: ResourceSummary;
  isLoading: boolean;
  isSavingLimits: boolean;
  saveLimits: (newLimits: Partial<MonthlyLimits>) => Promise<void>;
  addCategory: (name: string, color: string) => Promise<Category>;
  updateCategory: (id: string, name: string, color: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => Promise<Activity>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<void>;
  aiPriorities: AIPriorityResponse | null;
  isAiLoading: boolean;
  fetchAiPriorities: () => Promise<void>;
  clearAiPriorities: () => void;
  refreshData: () => Promise<void>;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

// Helper for default current month string "YYYY-MM"
function getCurrentMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthString());
  
  const [limits, setLimits] = useState<MonthlyLimits>({
    userId: user?.id || 'demo-user-1',
    month: selectedMonth,
    timeHours: 120,
    budgetAmount: 1500,
    willPoints: 100,
    currencySymbol: '$',
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', userId: user?.id || 'demo-user-1', name: 'Health & Wellness', color: '#10b981', isDefault: true },
    { id: 'cat-2', userId: user?.id || 'demo-user-1', name: 'Work & Focus', color: '#3b82f6', isDefault: true },
    { id: 'cat-3', userId: user?.id || 'demo-user-1', name: 'Home & Environment', color: '#f59e0b', isDefault: true },
    { id: 'cat-4', userId: user?.id || 'demo-user-1', name: 'Relationships & Social', color: '#ec4899', isDefault: true },
  ]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSavingLimits, setIsSavingLimits] = useState<boolean>(false);
  
  const [aiPriorities, setAiPriorities] = useState<AIPriorityResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Fetch data when user or selectedMonth changes
  const loadData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await ApiService.fetchLedgerState(user.id, selectedMonth);
      if (data.limits) setLimits(data.limits);
      if (data.categories) setCategories(data.categories);
      if (data.activities) setActivities(data.activities);
    } catch (err) {
      console.error('Failed to load ledger data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Resource Calculations
  const summary: ResourceSummary = useMemo(() => {
    let usedTime = 0;
    let usedBudget = 0;
    let usedWill = 0;
    let replenishedWill = 0;

    activities.forEach((act) => {
      const t = Number(act.timeImpact) || 0;
      const b = Number(act.budgetImpact) || 0;
      const w = Number(act.willImpact) || 0;

      if (act.type === 'capability') {
        replenishedWill += w;
        // If capability also costs time or money (e.g. spa or course)
        usedTime += t;
        usedBudget += b;
      } else {
        // Need or Action
        usedTime += t;
        usedBudget += b;
        usedWill += w;
      }
    });

    const startingTime = Number(limits.timeHours) || 0;
    const startingBudget = Number(limits.budgetAmount) || 0;
    const startingWill = Number(limits.willPoints) || 0;

    const remainingTime = startingTime - usedTime;
    const remainingBudget = startingBudget - usedBudget;
    const remainingWill = startingWill - usedWill + replenishedWill;

    return {
      startingTime,
      startingBudget,
      startingWill,
      usedTime,
      usedBudget,
      usedWill,
      replenishedWill,
      remainingTime,
      remainingBudget,
      remainingWill,
    };
  }, [limits, activities]);

  // Save Limits
  const saveLimits = async (newLimits: Partial<MonthlyLimits>) => {
    if (!user) return;
    setIsSavingLimits(true);
    try {
      const saved = await ApiService.saveLimits(user.id, {
        ...newLimits,
        month: selectedMonth,
      });
      setLimits(saved);
    } catch (err) {
      console.error('Error saving limits:', err);
      // Optimistic update fallback
      setLimits((prev) => ({ ...prev, ...newLimits }));
    } finally {
      setIsSavingLimits(false);
    }
  };

  // Add Category
  const addCategory = async (name: string, color: string): Promise<Category> => {
    if (!user) throw new Error('Not authenticated');
    const created = await ApiService.addCategory(user.id, name, color);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  // Update Category
  const updateCategory = async (id: string, name: string, color: string): Promise<Category> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await ApiService.updateCategory(user.id, id, name, color);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  // Delete Category (with auto-reassignment to Uncategorized)
  const deleteCategory = async (id: string) => {
    if (!user) return;
    try {
      const res = await ApiService.deleteCategory(user.id, id);
      setCategories((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (res.fallbackCategory && !next.some((c) => c.id === res.fallbackCategory?.id)) {
          next.push(res.fallbackCategory);
        }
        return next;
      });

      // Update local activities category references if reassigned
      if (res.fallbackCategory) {
        setActivities((prev) =>
          prev.map((act) => (act.categoryId === id ? { ...act, categoryId: res.fallbackCategory!.id } : act))
        );
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Add Activity
  const addActivity = async (activityData: Omit<Activity, 'id' | 'userId' | 'createdAt'>): Promise<Activity> => {
    if (!user) throw new Error('Not authenticated');
    const created = await ApiService.addActivity(user.id, {
      ...activityData,
      month: activityData.month || selectedMonth,
    });
    setActivities((prev) => [created, ...prev]);
    return created;
  };

  // Update Activity
  const updateActivity = async (id: string, updates: Partial<Activity>): Promise<Activity> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await ApiService.updateActivity(user.id, id, updates);
    setActivities((prev) => prev.map((act) => (act.id === id ? updated : act)));
    return updated;
  };

  // Delete Activity
  const deleteActivity = async (id: string) => {
    if (!user) return;
    await ApiService.deleteActivity(user.id, id);
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  // Trigger AI Prioritization
  const fetchAiPriorities = async () => {
    const actionActivities = activities.filter((a) => a.type === 'action');
    if (actionActivities.length === 0) {
      setAiPriorities({
        summary: 'No pending actions found in your monthly ledger.',
        encouragement: 'Add a few action tasks in the Daily Activity Log to receive AI energy & resource recommendations.',
        items: [],
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await ApiService.getAIPriorities(actionActivities, summary, categories);
      setAiPriorities(res);
    } catch (err) {
      console.error('Failed to get AI priorities:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearAiPriorities = () => {
    setAiPriorities(null);
  };

  return (
    <LedgerContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        limits,
        categories,
        activities,
        summary,
        isLoading,
        isSavingLimits,
        saveLimits,
        addCategory,
        updateCategory,
        deleteCategory,
        addActivity,
        updateActivity,
        deleteActivity,
        aiPriorities,
        isAiLoading,
        fetchAiPriorities,
        clearAiPriorities,
        refreshData: loadData,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = (): LedgerContextType => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};
