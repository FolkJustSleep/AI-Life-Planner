package entities

import (
	"time"
)
type FinanceModel struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	Currency string  `json:"currency"`
	Income      float64 `json:"income"`
	Expenses    float64 `json:"expenses"`
	SavingsGoal float64 `json:"savings_goal"`
	Risk_Tolerance   string  `json:"risk_tolerance"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

type FinanceRespond struct {
	UserID      string  `json:"user_id"`
	Currency string  `json:"currency"`
	Income      float64 `json:"income"`
	Expenses    float64 `json:"expenses"`
	Savings_Goal float64 `json:"savings_goal"`
	Risk_Tolerance       string  `json:"risk_tolerance"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}