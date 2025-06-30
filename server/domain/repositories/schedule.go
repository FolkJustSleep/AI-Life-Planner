package repositories

import (
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type IScheduleRepository interface {
	GetAllSchedules() (*[]entities.ScheduleModel, error)
	CreateSchedule(schedule entities.ScheduleResponse) error
	GetScheduleByID(id string) (*entities.ScheduleModel, error)
	GetScheduleByUserID(id string) (*entities.ScheduleModel, error)
	UpdateSchedule(id string, schedule entities.ScheduleResponse) error
	DeleteSchedule(id string) error
}

type ScheduleRepository struct {
	SupabaseRest *datasources.SupabaseREST
}

func NewScheduleRepository(supabaseRest *datasources.SupabaseREST) IScheduleRepository {
	return &ScheduleRepository{
		SupabaseRest: supabaseRest,
	}
}

func (repo *ScheduleRepository) GetAllSchedules() (*[]entities.ScheduleModel, error) {
	respond , err := repo.SupabaseRest.Query("schedules", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Errorf("ScheduleRepository -> GetAllSchedules: %s \n", err)
		fmt.Println("Error fetching all schedules:", err)
		return nil, err
	}
	var schedules []entities.ScheduleModel
	if err := json.Unmarshal(respond, &schedules); err != nil {
		fiberlog.Errorf("ScheduleRepository -> GetAllSchedules: %s \n", err)
		fmt.Println("Error unmarshalling schedules:", err)
		return nil, err
	}
	return &schedules, nil
}

func (repo *ScheduleRepository) CreateSchedule(schedule entities.ScheduleResponse) error {
	if schedule.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	_, err := repo.SupabaseRest.Query("schedules", http.MethodPost, "", schedule)
	if err != nil {
		fiberlog.Errorf("ScheduleRepository -> CreateSchedule: %s \n", err)
		fmt.Println("Error inserting schedule:", err)
		return err
	}
	return nil
}

func (repo *ScheduleRepository) GetScheduleByID(id string) (*entities.ScheduleModel, error) {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	respond, err := repo.SupabaseRest.Query("schedules", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("ScheduleRepository -> GetScheduleByID: %s \n", err)
		fmt.Println("Error fetching schedule by ID:", err)
		return nil, err
	}
	var schedule []entities.ScheduleModel
	if err := json.Unmarshal(respond, &schedule); err != nil {
		fiberlog.Errorf("ScheduleRepository -> GetScheduleByID: %s \n", err)
		fmt.Println("Error unmarshalling schedule:", err)
		return nil, err
	}
	if len(schedule) == 0 {
		return nil, fmt.Errorf("schedule with ID %s not found", id)
	}
	return &schedule[0], nil
}

func (repo *ScheduleRepository) GetScheduleByUserID(id string) (*entities.ScheduleModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond, err := repo.SupabaseRest.Query("schedules", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("ScheduleRepository -> GetScheduleByUserID: %s \n", err)
		fmt.Println("Error fetching schedule by UserID:", err)
		return nil, err
	}
	var schedule []entities.ScheduleModel
	if err := json.Unmarshal(respond, &schedule); err != nil {
		fiberlog.Errorf("ScheduleRepository -> GetScheduleByUserID: %s \n", err)
		fmt.Println("Error unmarshalling schedule:", err)
		return nil, err
	}
	if len(schedule) == 0 {
		return nil, fmt.Errorf("schedule with UserID %s not found", id)
	}
	return &schedule[0], nil
}
func (repo *ScheduleRepository) UpdateSchedule(id string, schedule entities.ScheduleResponse) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseRest.Query("schedules", http.MethodPatch, queryParams, schedule)
	if err != nil {
		fiberlog.Errorf("ScheduleRepository -> UpdateSchedule: %s \n", err)
		fmt.Println("Error updating schedule:", err)
		return err
	}
	return nil
}

func (repo *ScheduleRepository) DeleteSchedule(id string) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseRest.Query("schedules", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("ScheduleRepository -> DeleteSchedule: %s \n", err)
		fmt.Println("Error deleting schedule:", err)
		return err
	}
	return nil
}