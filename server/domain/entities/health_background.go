package entities

import(
	"time"
)

type HealthBackgroundModel struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Medical_Conditions []string `json:"medical_conditions"`
	Allergies   []string `json:"allergies"`
	Medications []string `json:"medications"`
	Fitness_Level string `json:"fitness_level"`
	Sleep_Pattern string `json:"sleep_pattern"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
type HealthBackgroundResponse struct {
	UserID          string    `json:"user_id"`
	Medical_Conditions []string `json:"medical_conditions"`
	Allergies       []string `json:"allergies"`
	Medications     []string `json:"medications"`
	Fitness_Level    string `json:"fitness_level"`
	Sleep_Pattern    string `json:"sleep_pattern"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}