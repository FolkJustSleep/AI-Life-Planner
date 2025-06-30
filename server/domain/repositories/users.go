package repositories

import (
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type usersRepository struct {
	SupabaseClient *datasources.SupabaseREST
}

type IUsersRepository interface {
	FindAll() (*[]entities.UserProfileModel, error)
	InsertUser(data entities.UserProfileResponse) error
	FindByID(id string) (*entities.UserProfileModel, error)
	UpdateUser(data entities.UserProfileModel) error
}

func NewUsersRepository(client *datasources.SupabaseREST) IUsersRepository {
	return &usersRepository{
		SupabaseClient: client,
	}
}

func (repo *usersRepository) InsertUser(data entities.UserProfileResponse) error {
	_, err := repo.SupabaseClient.Query("user_profiles", http.MethodPost, "", data)
	if err != nil {
		fiberlog.Errorf("Users -> InsertUser: %s \n", err)
		fmt.Println("Error inserting user:", err)
		return err
	}
	return nil
}

func (repo *usersRepository) FindAll() (*[]entities.UserProfileModel, error) {
	respond , err := repo.SupabaseClient.Query("user_profiles", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Errorf("Users -> FindAll: %s \n", err)
		fmt.Println("Error fetching users:", err)
		return nil, err
	}
	var users []entities.UserProfileModel
	if err := json.Unmarshal(respond, &users); err != nil {
		fiberlog.Errorf("Users -> FindAll: %s \n", err)
		return nil, err
	}
	return &users, nil
}

func (repo *usersRepository) FindByID(id string) (*entities.UserProfileModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond , err := repo.SupabaseClient.Query("user_profiles", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("Users -> FindByID: %s \n", err)
		fmt.Println("Error fetching user by ID:", err)
		return nil, err
	}
	var data []entities.UserProfileModel
	if err := json.Unmarshal(respond, &data); err != nil {
		fiberlog.Errorf("Users -> FindByID: %s \n", err)
		return nil, err
	}
	if len(data) == 0 {
		return nil, fmt.Errorf("user with ID %s not found", id)
	}
	if len(data) > 1 {
		fiberlog.Errorf("Users -> FindByID: multiple users found with ID %s", id)
		return nil, fmt.Errorf("multiple users found with ID %s", id)
	}
	return &data[0], nil
}


func (repo *usersRepository) UpdateUser(data entities.UserProfileModel) error {
	queryParams := fmt.Sprintf("?user_id=eq.%s", data.UserID)
	_, err := repo.SupabaseClient.Query("user_profiles", http.MethodPatch, queryParams, data)
	if err != nil {
		fiberlog.Errorf("Users -> UpdateUser: %s \n", err)
		fmt.Println("Error updating user:", err)
		return err
	}
	return nil
}


func (repo *usersRepository) DeleteUser(id string) error {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("user_profiles", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("Users -> DeleteUser: %s \n", err)
		fmt.Println("Error deleting user:", err)
		return err
	}
	return nil
}

func (repo *usersRepository) DeleteAllUsers() error {
	_, err := repo.SupabaseClient.Query("user_profiles", http.MethodPost, "", nil)
	if err != nil {
		fiberlog.Errorf("Users -> DeleteAllUsers: %s \n", err)
		fmt.Println("Error deleting all users:", err)
		return err
	}
	return nil
}