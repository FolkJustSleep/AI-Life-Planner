// src/models/aigen_model.ts

// Interface for the response from the AI plan generation API
export interface AiPlanResponse {
  data: string; 
  message: string;
  status: number;
}