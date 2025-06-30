package repositories

import (
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"
	"fmt"
	"encoding/json"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

type HealthBackgroundRepository struct {
	SupabaseClient *datasources.SupabaseREST
}

type IHealthBackgroundRepository interface {
	InsertHealthBackground(data entities.HealthBackgroundResponse) error
	FindAll() (*[]entities.HealthBackgroundModel, error)
	FindByUserID(id string) (*entities.HealthBackgroundModel, error)
	DeleteHealthBackground(id string) error
}

func NewHealthBackgroundRepository(client *datasources.SupabaseREST) IHealthBackgroundRepository {
	return &HealthBackgroundRepository{
		SupabaseClient: client,
	}
}

func (repo *HealthBackgroundRepository) InsertHealthBackground(data entities.HealthBackgroundResponse) error {
	if data.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	_, err := repo.SupabaseClient.Query("health_backgrounds", http.MethodPost, "", data)
	if err != nil {
		fiberlog.Errorf("HealthBackground -> InsertHealthBackground: %s \n", err)
		fmt.Println("Error inserting health background:", err)
		return err
	}
	return nil
}
func (repo *HealthBackgroundRepository) FindAll() (*[]entities.HealthBackgroundModel, error) {
	respond, err := repo.SupabaseClient.Query("health_backgrounds", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Errorf("HealthBackground -> FindAll: %s \n", err)
		fmt.Println("Error fetching all health backgrounds:", err)
		return nil, err
	}
	var backgrounds []entities.HealthBackgroundModel
	if err := json.Unmarshal(respond, &backgrounds); err != nil {
		fiberlog.Errorf("HealthBackground -> FindAll: %s \n", err)
		return nil, err
	}
	return &backgrounds, nil
}

func (repo *HealthBackgroundRepository) FindByUserID(id string) (*entities.HealthBackgroundModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("health_backgrounds", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("HealthBackground -> FindByUserID: %s \n", err)
		fmt.Println("Error fetching health background by user ID:", err)
		return nil, err
	}
	var background []entities.HealthBackgroundModel
	if err := json.Unmarshal(respond, &background); err != nil {
		fiberlog.Errorf("HealthBackground -> FindByUserID: %s \n", err)
		return nil, err
	}
	if len(background) == 0 {
		return nil, fmt.Errorf("no health background records found for user ID: %s", id)
	}
	return &background[0], nil
}

func (repo *HealthBackgroundRepository) DeleteHealthBackground(id string) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("health_backgrounds", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("HealthBackground -> DeleteHealthBackground: %s \n", err)
		fmt.Println("Error deleting health background record:", err)
		return err
	}
	return nil
}