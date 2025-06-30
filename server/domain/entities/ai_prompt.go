package entities

import (
	"time"
)

type AiPromptModel struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Prompt    string    `json:"prompt"`
	LifeGoalID  string    `json:"lifegoal_id"`
	FinanceID  string    `json:"finance_id"`
	HealthID  string    `json:"health_id"`
	ScheduleID  string    `json:"schedule_id"`
	CreatedAt time.Time `json:"created_at"`
}

type AiPromptResponse struct {
	UserID    string    `json:"user_id"`
	Prompt    string    `json:"prompt"`
	LifeGoalID  string    `json:"lifegoal_id"`
	FinanceID  string    `json:"finance_id"`
	HealthID  string    `json:"health_id"`
	ScheduleID  string    `json:"schedule_id"`
	CreatedAt time.Time `json:"created_at"`
}