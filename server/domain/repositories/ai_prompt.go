package repositories

import (
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

)


type aiPromptRepository struct {
	SupabaseClient *datasources.SupabaseREST
}

type IAipromptRepository interface {
	InsertAIPrompt(data entities.AiPromptResponse) error
	GetPromptByUserID(id string)(*entities.AiPromptModel,error)
	DeletePromptByID(id string) error
}

func NewAiPromptRepository(client *datasources.SupabaseREST) IAipromptRepository {
	return &aiPromptRepository{
		SupabaseClient: client,
	}
}

func (repo *aiPromptRepository) InsertAIPrompt(data entities.AiPromptResponse) error {
	if data.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	_, err := repo.SupabaseClient.Query("ai_prompt", http.MethodPost, "", data)
	if err != nil {
		fmt.Println("Error inserting AI prompt:", err)
		return err
	}
	return nil
}

func (repo *aiPromptRepository) GetPromptByUserID(id string)(*entities.AiPromptModel,error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("ai_prompt", http.MethodGet, queryParams, nil)
	if err != nil {
		fmt.Println("Error fetching AI prompt:", err)
		return nil, err
	}
	var data []entities.AiPromptModel
	if err := json.Unmarshal(respond, &data); err != nil {
		fmt.Println("Error unmarshalling AI prompt:", err)
		return nil, err
	}
	return &data[0], nil
}
func (repo *aiPromptRepository) DeletePromptByID(id string) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("ai_prompt", http.MethodDelete, queryParams, nil)
	if err != nil {
		fmt.Println("Error deleting AI prompt:", err)
		return err
	}
	return nil
}