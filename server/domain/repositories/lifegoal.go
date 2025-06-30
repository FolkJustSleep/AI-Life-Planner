package repositories

import (
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type lifeGoalRepository struct {
	SupabaseClient *datasources.SupabaseREST
}

type ILifeGoalRepository interface{
	InsertLifeGoal(data entities.LifeGoalResponse) error
	FindAll() (*[]entities.LifeGoalModel, error)
	FindByUserID(id string) (*entities.LifeGoalModel, error)
	UpdateLifeGoal(id string, data entities.LifeGoalUpdateBody) error
	FindByID(id string) (*entities.LifeGoalModel, error)
	DeleteLifeGoal(id string) error
}

func NewLifeGoalRepository(client *datasources.SupabaseREST) ILifeGoalRepository {
	return &lifeGoalRepository{
		SupabaseClient: client,
	}
}

func (repo *lifeGoalRepository) InsertLifeGoal(data entities.LifeGoalResponse) error {
	if data.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	_, err := repo.SupabaseClient.Query("life_goals", http.MethodPost, "", data)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> InsertLifeGoal: %s \n", err)
		fmt.Println("Error inserting life goal:", err)
		return err
	}
	return nil
}

func (repo *lifeGoalRepository) FindAll() (*[]entities.LifeGoalModel, error) {
	respond, err := repo.SupabaseClient.Query("life_goals", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> FindAll: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	var goals []entities.LifeGoalModel
	if err := json.Unmarshal(respond, &goals); err != nil {
		fiberlog.Errorf("Users -> FindAll: %s \n", err)
		return nil, err
	}
	return &goals, nil
}

 func (repo *lifeGoalRepository) FindByUserID(id string) (*entities.LifeGoalModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("life_goals", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> FindByID: %s \n", err)
		fmt.Println("Error fetching life goal by ID:", err)
		return nil, err
	}
	var goal []entities.LifeGoalModel
	if err := json.Unmarshal(respond, &goal); err != nil {
		fiberlog.Errorf("LifeGoal -> FindByID: %s \n", err)
		return nil, err
	}
	if len(goal) == 0 {
		return nil, fmt.Errorf("LifeGoal with ID %s not found", id)
	}
	if len(goal) > 1 {
		fiberlog.Errorf("Users -> FindByID: multiple users found with ID %s", id)
		return nil, fmt.Errorf("multiple users found with ID %s", id)
	}
	return &goal[0], nil
}

func (repo *lifeGoalRepository) UpdateLifeGoal(id string,data entities.LifeGoalUpdateBody) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("life_goals", http.MethodPatch, queryParams, data)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> UpdateLifeGoal: %s \n", err)
		fmt.Println("Error updating life goal:", err)
		return err
	}
	return nil
}

 func (repo *lifeGoalRepository) FindByID(id string) (*entities.LifeGoalModel, error) {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("life_goals", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> FindByID: %s \n", err)
		fmt.Println("Error fetching life goal by ID:", err)
		return nil, err
	}
	var goal []entities.LifeGoalModel
	if err := json.Unmarshal(respond, &goal); err != nil {
		fiberlog.Errorf("LifeGoal -> FindByID: %s \n", err)
		return nil, err
	}
	if len(goal) == 0 {
		return nil, fmt.Errorf("LifeGoal with ID %s not found", id)
	}
	if len(goal) > 1 {
		fiberlog.Errorf("Users -> FindByID: multiple users found with ID %s", id)
		return nil, fmt.Errorf("multiple users found with ID %s", id)
	}
	return &goal[0], nil
}

func (repo *lifeGoalRepository) DeleteLifeGoal(id string) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("life_goals", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> DeleteLifeGoal: %s \n", err)
		fmt.Println("Error deleting life goal record:", err)
		return err
	}
	return nil
}