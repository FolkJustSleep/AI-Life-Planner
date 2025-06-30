export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'productivity' | 'health' | 'career' | 'personal' | 'finance';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  plan?: ProductivityPlan;
}

export interface ProductivityPlan {
  timeBlocks: TimeBlock[];
  subtasks: SubTask[];
  habits: Habit[];
}

export interface TimeBlock {
  id: string;
  title: string;
  type: 'deep-work' | 'pomodoro' | 'break' | 'planning';
  duration: number;
  description: string;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  name: string;
  details?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount?: number;
  completedDates: string[];
  category: 'health' | 'productivity' | 'mindfulness' | 'learning';
  currentStreak: number;
  bestStreak: number;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
  tags: string[];
}

export interface FinancialData {
  id: string;
  month: string;
  income: number;
  expenses: { category: string; amount: number; type: 'fixed' | 'flexible' }[];
  savings: number;
  goals: {
    name: string;
    target: number;
    current: number;
    deadline: Date;
  }[];
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  tasks: SubTask[];
  progress: number;
}