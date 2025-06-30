package entities

import (
	"time"
)
	


type LifeGoalModel struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	ShortTerm  []string    `json:"short_term"`
	LongTerm   []string    `json:"long_term"`
	Priorities []string    `json:"priorities"`
	TimeFrame  string    `json:"timeframe"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type LifeGoalResponse struct {
	UserID    string    `json:"user_id"`
	ShortTerm  []string    `json:"short_term"`
	LongTerm   []string    `json:"long_term"`
	Priorities []string    `json:"priorities"`
	TimeFrame  string    `json:"timeframe"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type LifeGoalBody struct {
	ShortTerm  []string `json:"short_term"`
	LongTerm   []string `json:"long_term"`
	Priorities []string `json:"priorities"`
	TimeFrame  string `json:"timeframe"`
}
type LifeGoalUpdateBody struct {
	ShortTerm  []string  `json:"short_term"`
	LongTerm   []string  `json:"long_term"`
	Priorities []string  `json:"priorities"`
	TimeFrame  string    `json:"timeframe"`
	UpdatedAt  time.Time `json:"updated_at"`
}