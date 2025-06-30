package repositories

import (
	"encoding/json"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"
	"fmt"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

type HabitRepository struct {
	SupabaseREST *datasources.SupabaseREST
}

type IHabitRepository interface {
	CreateHabit(habit *entities.HabitResponse) error
	GetHabitsByUserID(userId string) (*[]entities.HabitModel, error)
}

func NewHabitRepository(supabaseREST *datasources.SupabaseREST) *HabitRepository {
	return &HabitRepository{
		SupabaseREST: supabaseREST,
	}
}

func (repo *HabitRepository) CreateHabit(habit *entities.HabitResponse)  error {
	_, err := repo.SupabaseREST.Query("habits", http.MethodPost, "", habit)
	if err != nil {
		fiberlog.Errorf("HabitRepository -> CreateHabit: %s \n", err)
		fmt.Println("Error inserting habit:", err)
		return  err
	}
	return nil
}

func (repo *HabitRepository) GetHabitsByUserID(userId string) (*[]entities.HabitModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", userId)
	respond, err := repo.SupabaseREST.Query("habits", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("HabitRepository -> GetHabitsByUserID: %s \n", err)
		fmt.Println("Error fetching habits by UserID:", err)
		return nil, err
	}
	var habits []entities.HabitModel
	if err := json.Unmarshal(respond, &habits); err != nil {
		fiberlog.Errorf("HabitRepository -> GetHabitsByUserID: %s \n", err)
		fmt.Println("Error unmarshalling habits:", err)
		return nil, err
	}
	if len(habits) == 0 {
		return nil, fmt.Errorf("no habits found for user ID: %s", userId)
	}
	return &habits, nil
}