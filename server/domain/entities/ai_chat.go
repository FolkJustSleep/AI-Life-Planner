package entities

import (
	"time"
)

type AIChat struct {
	Id            string    `json:"id"`
	UserID        string    `json:"user_id"`
	Message  string    `json:"message"`
	Sender    string    `json:"sender"`
	CreatedAt time.Time `json:"created_at"`
}
type AIChatResponse struct {
	UserID        string    `json:"user_id"`
	Sender    string    `json:"sender"`
	Message  string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

