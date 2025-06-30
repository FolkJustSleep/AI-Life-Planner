package entities

import (
	"time"
)

type ScheduleModel struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	WorkHours     string    `json:"work_hours"`
	AvailableTime string    `json:"available_time"`
	BusyDays      []string  `json:"busy_days"`
	PreferredTime []string  `json:"preferred_times"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type ScheduleResponse struct {
	UserID         string    `json:"user_id"`
	Work_Hours     string    `json:"work_hours"`
	Available_Time string    `json:"available_time"`
	Busy_Days      []string  `json:"busy_days"`
	Preferred_Times []string  `json:"preferred_times"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

//  query schedule
// create prompt
