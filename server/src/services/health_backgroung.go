package services

import (
	"go-fiber-template/domain/repositories"
	"go-fiber-template/domain/entities"
	"time"
	fiberlog "github.com/gofiber/fiber/v2/log"
	"fmt"
)


type HealthBackgroundService struct {
	HealthRepo repositories.IHealthBackgroundRepository
}

type IHealthBackgroundService interface {
	GetAllHealth() (*[]entities.HealthBackgroundModel, error)
	GetHealthByUserID(userID string) (*entities.HealthBackgroundModel, error)
	InsertHealth(data entities.HealthBackgroundResponse, userID string) error
}

func NewHealthBackgroundService(repo repositories.IHealthBackgroundRepository) IHealthBackgroundService {
	return &HealthBackgroundService{
		HealthRepo: repo,
	}
}

func (sv *HealthBackgroundService) GetAllHealth() (*[]entities.HealthBackgroundModel, error) {
	data, err := sv.HealthRepo.FindAll()
	if err != nil {
		fiberlog.Errorf("HealthBackgroundService -> GetAllHealth: %s \n", err)
		fmt.Println("Error fetching all health backgrounds:", err)
		return nil, err
	}
	return data, nil
}
func (sv *HealthBackgroundService) GetHealthByUserID(userID string) (*entities.HealthBackgroundModel, error) {
	if userID == "" {
		return nil, fmt.Errorf("userID cannot be empty")
	}
	data, err := sv.HealthRepo.FindByUserID(userID)
	if err != nil {
		fiberlog.Errorf("HealthBackgroundService -> GetHealthByUserID: %s \n", err)
		fmt.Println("Error fetching health background by user ID:", err)
		return nil, err
	}
	return data, nil
}
func (sv *HealthBackgroundService) InsertHealth(data entities.HealthBackgroundResponse, userID string) error {
	if userID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	fmt.Println("Inserting health background for userID:", userID, " with data:", data)
	data.UserID = userID
	data.CreatedAt = time.Now().Add(7 * time.Hour)
	data.UpdatedAt = time.Now().Add(7 * time.Hour)

	err := sv.HealthRepo.InsertHealthBackground(data)
	if err != nil {
		fiberlog.Errorf("HealthBackgroundService -> InsertHealth: %s \n", err)
		fmt.Println("Error inserting health background:", err)
		return err
	}
	return nil
}