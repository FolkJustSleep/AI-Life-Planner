package entities

import (
	"time"
)

type GeneratedPlan struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Generated_Plan      string    `json:"generated_plan"`
	PromptID  string    `json:"prompt_id"`
	LifeGoalID  string    `json:"lifegoal_id"`
	FinanceID  string    `json:"finance_id"`
	HealthID  string    `json:"health_id"`
	ScheduleID  string    `json:"schedule_id"`
	CreatedAt time.Time `json:"created_at"`
}

type GeneratedPlanResponse struct {
	UserID    string    `json:"user_id"`
	Generated_Plan      string    `json:"generated_plan"`
	PromptID  string    `json:"prompt_id"`
	LifeGoalID  string    `json:"lifegoal_id"`
	FinanceID  string    `json:"finance_id"`
	HealthID  string    `json:"health_id"`
	ScheduleID  string    `json:"schedule_id"`
	CreatedAt time.Time `json:"created_at"`
}