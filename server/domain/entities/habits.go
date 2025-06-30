package entities

import (
	"time"
)


type HabitModel struct {
	ID        int   `json:"id"`
	UserID    string    `json:"user_id"`
	Name string    `json:"name"`
	Frequency string    `json:"frequency"`
	Description string    `json:"description"`
	TargetCount int    `json:"target_count"`
	CurrentStreak int    `json:"current_streak"`
	CompletedDate []string    `json:"completed_dates"`
	Category string    `json:"category"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}


type HabitResponse struct{
	UserID    string    `json:"user_id"`
	Name string    `json:"name"`
	Frequency string    `json:"frequency"`
	Description string    `json:"description"`
	TargetCount int    `json:"target_count"`
	CurrentStreak int    `json:"current_streak"`
	CompletedDate []string    `json:"completed_dates"`
	Category string    `json:"category"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}