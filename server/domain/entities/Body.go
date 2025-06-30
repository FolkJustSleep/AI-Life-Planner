package entities

import (
	// "time"
)

type BodyData struct{
	UserID    string    `json:"user_id"`
	// Fullname  string    `json:"full_name"`
	// Age      int    `json:"age"`
	// Weight   float32    `json:"weight"`
	// Height   float32    `json:"height"`
	// Gender   string    `json:"gender"`
	Medical_Conditions []string `json:"medical_conditions"`
	Allergies   []string `json:"allergies"`
	Medications []string `json:"medications"`
	Fitness_Level string `json:"fitness_level"`
	Sleep_Pattern string `json:"sleep_pattern"`
	Work_Hours     string    `json:"work_hours"`
	Available_Time string    `json:"available_time"`
	Busy_Days      []string  `json:"busy_days"`
	Preferred_Times []string  `json:"preferred_times"`
	Currency string  `json:"currency"`
	Income      float64 `json:"income"`
	Expenses    float64 `json:"expenses"`
	Savings_Goal float64 `json:"savings_goal"`
	Risk_Tolerance       string  `json:"risk_tolerance"`
	ShortTerm  []string    `json:"short_term"`
	LongTerm   []string    `json:"long_term"`
	Priorities []string    `json:"priorities"`
	TimeFrame  string    `json:"timeframe"`
	// CreatedAt time.Time `json:"created_at"`
	// UpdatedAt time.Time `json:"updated_at"`
}