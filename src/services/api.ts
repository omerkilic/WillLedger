import { User, MonthlyLimits, Category, Activity, AIPriorityResponse } from '../types';

const STORAGE_KEYS = {
  USER: 'mwl_user',
  SELECTED_MONTH: 'mwl_selected_month',
};

export class ApiService {
  private static getHeaders(userId?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    return headers;
  }

  // Auth
  static async register(email: string, password: string, name?: string): Promise<{ user: User }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create account');
      }
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      return data;
    } catch (e: any) {
      // Fallback offline simulation if needed
      const dummyUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(dummyUser));
      return { user: dummyUser };
    }
  }

  static async login(email: string, password: string): Promise<{ user: User }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to sign in');
      }
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      return data;
    } catch (e: any) {
      const dummyUser: User = {
        id: 'demo-user-1',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(dummyUser));
      return { user: dummyUser };
    }
  }

  static getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Ledger State Fetch
  static async fetchLedgerState(
    userId: string,
    month: string
  ): Promise<{ limits: MonthlyLimits; categories: Category[]; activities: Activity[] }> {
    try {
      const res = await fetch(`/api/ledger/state?month=${encodeURIComponent(month)}`, {
        headers: this.getHeaders(userId),
      });
      if (!res.ok) throw new Error('Failed to fetch ledger state');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching state, returning default state:', err);
      return {
        limits: {
          userId,
          month,
          timeHours: 120,
          budgetAmount: 1500,
          willPoints: 100,
          currencySymbol: '$',
        },
        categories: [
          { id: 'cat-1', userId, name: 'Health & Wellness', color: '#10b981', isDefault: true },
          { id: 'cat-2', userId, name: 'Work & Focus', color: '#3b82f6', isDefault: true },
          { id: 'cat-3', userId, name: 'Home & Environment', color: '#f59e0b', isDefault: true },
          { id: 'cat-4', userId, name: 'Relationships & Social', color: '#ec4899', isDefault: true },
        ],
        activities: [],
      };
    }
  }

  // Limits
  static async saveLimits(userId: string, limits: Partial<MonthlyLimits>): Promise<MonthlyLimits> {
    const res = await fetch('/api/ledger/limits', {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId, ...limits }),
    });
    if (!res.ok) throw new Error('Failed to save limits');
    const data = await res.json();
    return data.limits;
  }

  // Categories
  static async addCategory(userId: string, name: string, color: string): Promise<Category> {
    const res = await fetch('/api/ledger/categories', {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ name, color }),
    });
    if (!res.ok) throw new Error('Failed to create category');
    const data = await res.json();
    return data.category;
  }

  static async updateCategory(userId: string, id: string, name: string, color: string): Promise<Category> {
    const res = await fetch(`/api/ledger/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ name, color }),
    });
    if (!res.ok) throw new Error('Failed to update category');
    const data = await res.json();
    return data.category;
  }

  static async deleteCategory(userId: string, id: string): Promise<{ success: boolean; fallbackCategory?: Category }> {
    const res = await fetch(`/api/ledger/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return await res.json();
  }

  // Activities
  static async addActivity(userId: string, activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>): Promise<Activity> {
    const res = await fetch('/api/ledger/activities', {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ ...activity, userId }),
    });
    if (!res.ok) throw new Error('Failed to create activity');
    const data = await res.json();
    return data.activity;
  }

  static async updateActivity(userId: string, id: string, updates: Partial<Activity>): Promise<Activity> {
    const res = await fetch(`/api/ledger/activities/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(userId),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update activity');
    const data = await res.json();
    return data.activity;
  }

  static async deleteActivity(userId: string, id: string): Promise<boolean> {
    const res = await fetch(`/api/ledger/activities/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to delete activity');
    return true;
  }

  // AI Prioritization
  static async getAIPriorities(
    actions: Activity[],
    remainingResources: any,
    categories: Category[]
  ): Promise<AIPriorityResponse> {
    const res = await fetch('/api/ledger/ai-prioritize', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ actions, remainingResources, categories }),
    });
    if (!res.ok) throw new Error('Failed to get AI recommendations');
    return await res.json();
  }
}
