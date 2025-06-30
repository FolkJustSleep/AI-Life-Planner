package entities

import (
	"time"
)

type UserProfileModel struct {
	ID		string    `json:"id"`
	UserID    string    `json:"user_id"`
	Fullname  string    `json:"full_name"`
	Age      int    `json:"age"`
	Weight   float32    `json:"weight"`
	Height   float32    `json:"height"`
	Gender   string    `json:"gender"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserProfileResponse struct {
	UserID    string    `json:"user_id"`
	Fullname  string    `json:"full_name"`
	Age       int       `json:"age"`
	Weight    float32   `json:"weight"`
	Height    float32   `json:"height"`
	Gender    string    `json:"gender"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
