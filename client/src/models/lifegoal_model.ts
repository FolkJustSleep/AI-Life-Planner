// Types and Interfaces

export interface ApiResponse {
  message: string;
  data: LifeGoalsData;
}

export interface AiPlanData {
  id: string;
  user_id: string;
  generated_plan: string;
  created_at: string;
}

export interface ApiPlanResponse {
  message: string;
  data: AiPlanData[];
}

export interface LifeGoalsData {
  id: string;
  user_id: string;
  short_term: string[];
  long_term: string[];
  priorities: string[];
  timeframe: string;
  created_at: string;
  updated_at: string;
}

export interface GoalCardData {
  id: string;
  title: string;
  description: string;
  date: string;
  timeBlocks: number;
  tasks: number;
  habits: number;
  category: string;
  ai_plan: string;
  type: 'short_term' | 'long_term';
}