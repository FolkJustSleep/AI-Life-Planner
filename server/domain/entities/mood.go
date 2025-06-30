package entities

import (
	"time"
)

type MoodModel struct {
	ID        int   `json:"id"`
	UserID    string    `json:"user_id"`
	Mood      string    `json:"mood"`
	Note      string    `json:"note"`
	CreatedAt time.Time `json:"created_at"`
}

type MoodResponse struct {
	UserID    string    `json:"user_id"`
	Mood      string    `json:"mood"`
	Note      string    `json:"note"`
	CreatedAt time.Time `json:"created_at"`
}