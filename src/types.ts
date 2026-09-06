export type ActivityType = 'capability' | 'need' | 'action';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface MonthlyLimits {
  id?: string;
  userId: string;
  month: string; // Format: "YYYY-MM"
  timeHours: number;
  budgetAmount: number;
  willPoints: number;
  currencySymbol: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  isDefault?: boolean;
  createdAt?: string;
}

export interface Activity {
  id: string;
  userId: string;
  month: string; // "YYYY-MM"
  date: string;  // "YYYY-MM-DD"
  title: string;
  type: ActivityType;
  categoryId: string;
  timeImpact: number;   // Hours spent (0 or positive)
  budgetImpact: number; // Money spent (0 or positive)
  willImpact: number;   // Points (for Need/Action: drain; for Capability: replenishment or drain)
  notes?: string;
  completed?: boolean;
  createdAt: string;
}

export interface ResourceSummary {
  startingTime: number;
  startingBudget: number;
  startingWill: number;
  usedTime: number;
  usedBudget: number;
  usedWill: number;
  replenishedWill: number;
  remainingTime: number;
  remainingBudget: number;
  remainingWill: number;
}

export interface AIPriorityItem {
  activityId: string;
  title: string;
  categoryName: string;
  fitCategory: 'Quick Win' | 'High Impact' | 'Steady Progress' | 'Low Resource';
  reason: string;
  timeRequired: number;
  budgetRequired: number;
  willRequired: number;
  priorityScore: number; // 1-100
}

export interface AIPriorityResponse {
  summary: string;
  encouragement: string;
  items: AIPriorityItem[];
  unfeasibleCount?: number;
}

export type NavigationTab = 
  | 'dashboard'
  | 'setup'
  | 'log'
  | 'categories'
  | 'priorities'
  | 'manual';
