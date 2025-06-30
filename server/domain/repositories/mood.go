package repositories

import (
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type MoodRepository struct {
	Datasource *datasources.SupabaseREST
}

type IMoodRepository interface {
	GetMood() (*[]entities.MoodModel, error)
	GetMoodById(id string) (*[]entities.MoodModel, error)
	NewMood(mood entities.MoodResponse) error
}

func NewMoodRepository(datasource *datasources.SupabaseREST) *MoodRepository {
	return &MoodRepository{
		Datasource: datasource,
	}
}

func (repo *MoodRepository) GetMood() (*[]entities.MoodModel, error) {
	response, err := repo.Datasource.Query("mood", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Error("Cannot get all moods",err)
		return nil, err
	}
	var mood []entities.MoodModel
	if err := json.Unmarshal(response, &mood); err != nil {
		fiberlog.Error("Unmarshal error all moods",err)
		return nil, err
	}
	return &mood, nil
}

func (repo *MoodRepository) GetMoodById(id string) (*[]entities.MoodModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	response, err := repo.Datasource.Query("mood", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Error("Cannot get all moods",err)
		return nil, err
	}
	var mood []entities.MoodModel
	if err := json.Unmarshal(response, &mood); err != nil {
		fiberlog.Error("Unmarshal error all moods",err)
		return nil, err
	}
	return &mood, nil
}

func (repo *MoodRepository) NewMood(mood entities.MoodResponse) error {
	_, err := repo.Datasource.Query("mood", http.MethodPost, "", mood)
	if err != nil {
		fiberlog.Error("Cannot insert mood",err)
		return err
	}
	return nil
}