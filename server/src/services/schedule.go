package services

import (
	"fmt"
	"go-fiber-template/domain/entities"
	"go-fiber-template/domain/repositories"

	"time"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type ScheduleService struct {
	ScheduleRepo repositories.IScheduleRepository
}

type IScheduleService interface {
	GetAllSchedules() (*[]entities.ScheduleModel, error)
	CreateSchedule(id string, schedule entities.ScheduleResponse) error
	GetScheduleByID(id string) (*entities.ScheduleModel, error)
	GetScheduleByUserID(id string) (*entities.ScheduleModel, error)
	UpdateSchedule(id string, schedule entities.ScheduleResponse) error
}
func NewScheduleService(scheduleRepo repositories.IScheduleRepository) IScheduleService {
	return &ScheduleService{
		ScheduleRepo: scheduleRepo,
	}
}
func (sv *ScheduleService) GetAllSchedules() (*[]entities.ScheduleModel, error) {
	data, err := sv.ScheduleRepo.GetAllSchedules()
	if err != nil {
		fiberlog.Errorf("ScheduleService -> GetAllSchedules: %s \n", err)
		fmt.Println("Error fetching all schedules:", err)
		return nil, err
	}
	return data, nil
}
func (sv *ScheduleService) CreateSchedule(id string,schedule entities.ScheduleResponse) error {
	schedule.UserID = id
	if schedule.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	schedule.CreatedAt = time.Now().Add(7 * time.Hour)
	schedule.UpdatedAt = time.Now().Add(7 * time.Hour)

	err := sv.ScheduleRepo.CreateSchedule(schedule)
	if err != nil {
		fiberlog.Errorf("ScheduleService -> CreateSchedule: %s \n", err)
		fmt.Println("Error inserting schedule:", err)
		return err
	}
	return nil
}

func (sv *ScheduleService) GetScheduleByUserID(id string) (*entities.ScheduleModel, error) {
	data, err := sv.ScheduleRepo.GetScheduleByUserID(id)
	if err != nil {
		fiberlog.Errorf("ScheduleService -> GetScheduleByUserID: %s \n", err)
		fmt.Println("Error fetching schedule by ID:", err)
		return nil, err
	}
	return data, nil
}

func (sv *ScheduleService) GetScheduleByID(id string) (*entities.ScheduleModel, error) {
	data, err := sv.ScheduleRepo.GetScheduleByID(id)
	if err != nil {
		fiberlog.Errorf("ScheduleService -> GetScheduleByID: %s \n", err)
		fmt.Println("Error fetching schedule by ID:", err)
		return nil, err
	}
	return data, nil
}

func (sv *ScheduleService) UpdateSchedule(id string, schedule entities.ScheduleResponse) error {
	if id == "" {
		return fmt.Errorf("schedule ID cannot be empty")
	}
	if schedule.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	schedule.UpdatedAt = time.Now().Add(7 * time.Hour)

	err := sv.ScheduleRepo.UpdateSchedule(id, schedule)
	if err != nil {
		fiberlog.Errorf("ScheduleService -> UpdateSchedule: %s \n", err)
		fmt.Println("Error updating schedule:", err)
		return err
	}
	return nil
}


