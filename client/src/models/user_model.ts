// src/models/user_model.ts

// Define the structure of the data your new backend API expects for all user data
export interface ApiAllUserData {
  age: number;
  allergies: string[];
  available_time: string;
  busy_days: string[];
  currency: string;
  expenses: number;
  fitness_level: string;
  full_name: string;
  gender: string;
  height: number;
  income: number;
  long_term: string[];
  medical_conditions: string[];
  medications: string[];
  preferred_times: string[];
  priorities: string[];
  risk_tolerance: string;
  savings_goal: number;
  short_term: string[];
  sleep_pattern: string;
  timeframe: string;
  user_id?: string;
  weight: number;
  work_hours: string;
}

// Interface for the data structure collected from your React component's form
export interface ClientProfileData {
  personal: {
    full_name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  health: {
    medicalConditions: string;
    currentMedications: string;
    allergies: string;
    fitnessLevel: string;
    sleepPattern: string;
  };
  schedule: {
    workHours: string;
    availableTime: string;
    busiestDays: string;
    preferredTimes: string;
  };
  financial: {
    currency: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    monthlySavingGoal: string;
    riskTolerance: string;
  };
  lifeGoals: {
    shortTermGoals: string;
    longTermGoals: string;
    lifePriorities: string;
    preferredTimeframe: string;
  };
}

// Interface for generic API responses
export interface ApiResponse {
  data: string;
  message: string;
  status: number;
}

export interface UserModel {
  full_name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
