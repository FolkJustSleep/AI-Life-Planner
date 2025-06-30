package repositories

import (
	// "encoding/json"
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/aimodel"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

	// "go-fiber-template/domain/entities"
	// "net/http"

	fiberlog "github.com/gofiber/fiber/v2/log"
)
type aiGenRepository struct {
	SupabaseClient *datasources.SupabaseREST
	GeminiClient   *aimodel.GeminiRest
}

type IAiGenRepository interface {
	GenerateLifeGoal(prompt string) (string, error)
	InsertGoal(data entities.GeneratedPlanResponse) error
	GetAllGenGoal() (*[]entities.GeneratedPlan,error)
	GetGenGoalByUserID(id string) (*[]entities.GeneratedPlan,error)
	GenerateAiAssitant(prompt string) (string, error)
	InsertChat(data entities.AIChatResponse) error
	// InsertGenMessage(data entities.AIChatResponse) error 
	GetGenAiChatByUserID(id string) (*[]entities.AIChat, error)
	GenerateAiChat(history []entities.AIChat,prompt string) (string, error)
	DeleteChat(id string) error
	DeleteGoal(id string) error
	GetGenGoalByID(id string) (*entities.GeneratedPlan,error)
}

func NewAiGenRepository(client *datasources.SupabaseREST, geminiClient *aimodel.GeminiRest) IAiGenRepository {
	return &aiGenRepository{
		SupabaseClient: client,
		GeminiClient:   geminiClient,
	}
}

func (repo *aiGenRepository) GenerateLifeGoal(prompt string) (string, error) {
	if prompt == "" {
		return "", fmt.Errorf("prompt cannot be empty")
	}

	response, err := repo.GeminiClient.GenerateText(prompt)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GenerateLifeGoal: %s \n", err)
		fmt.Println("Error generating life goal:", err)
		return "", err
	}
	return response, nil
}

func (repo *aiGenRepository) InsertGoal(data entities.GeneratedPlanResponse) error {
	_, err := repo.SupabaseClient.Query("goals", http.MethodPost, "", data)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> InsertGoal: %s \n", err)
		fmt.Println("Error inserting life goal:", err)
		return err
	}
	return nil
}


func (repo *aiGenRepository) GetAllGenGoal() (*[]entities.GeneratedPlan,error){
	respond, err := repo.SupabaseClient.Query("goals", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GetAllGenGoal: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	var data []entities.GeneratedPlan
	if err = json.Unmarshal(respond, &data); err != nil {
		fiberlog.Errorf("AiGenRepository -> GetAllGenGoal: %s \n", err)
		return nil, err
	}
	return &data , nil 
}

func (repo *aiGenRepository) GetGenGoalByUserID(id string) (*[]entities.GeneratedPlan,error){
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("goals", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GetGenGoalByUserID: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	var data []entities.GeneratedPlan
	if err = json.Unmarshal(respond, &data); err != nil {
		fiberlog.Errorf("AiGenRepository -> GetGenGoalByUserID: %s \n", err)
		return nil, err
	}
	if len(data) == 0 {
		return nil, fmt.Errorf("LifeGoal with ID %s not found", id)
	}
	return &data , nil 
}
func (repo *aiGenRepository) GenerateAiAssitant(prompt string) (string, error) {
	if prompt == "" {
		return "", fmt.Errorf("prompt cannot be empty")
	}

	response, err := repo.GeminiClient.GenerateText(prompt)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GenerateLifeGoal: %s \n", err)
		fmt.Println("Error generating life goal:", err)
		return "", err
	}
	return response, nil
}

func (repo *aiGenRepository) InsertChat(data entities.AIChatResponse) error {
	_, err := repo.SupabaseClient.Query("ai_chats", http.MethodPost, "", data)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> InsertGoal: %s \n", err)
		fmt.Println("Error inserting life goal:", err)
		return err
	}
	return nil
}

// func (repo *aiGenRepository) InsertGenMessage(data entities.AIChatResponse) error {
// 	quertParams := fmt.Sprintf("?user_id=eq.%s", data.UserID)
// 	_, err := repo.SupabaseClient.Query("ai_chats", http.MethodPatch, quertParams, data.Message)
// 	if err != nil {
// 		fiberlog.Errorf("AiGenRepository -> InsertGoal: %s \n", err)
// 		fmt.Println("Error inserting life goal:", err)
// 		return err
// 	}
// 	return nil
// }

func (repo *aiGenRepository) GetGenAiChatByUserID(id string) (*[]entities.AIChat,error){
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("ai_chats", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GetGenGoalByUserID: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	var data []entities.AIChat
	if err = json.Unmarshal(respond, &data); err != nil {
		fiberlog.Errorf("AiGenRepository -> GetGenGoalByUserID: %s \n", err)
		return nil, err
	}
	if len(data) == 0 {
		return nil, fmt.Errorf("LifeGoal with ID %s not found", id)
	}
	return &data , nil 
}

func (repo *aiGenRepository) GenerateAiChat(history []entities.AIChat,prompt string) (string, error) {
	if prompt == "" {
		return "", fmt.Errorf("prompt cannot be empty")
	}

	response, err := repo.GeminiClient.AIChat(history,prompt)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GenerateLifeGoal: %s \n", err)
		fmt.Println("Error generating life goal:", err)
		return "", err
	}
	return response, nil
}


func (repo *aiGenRepository) DeleteChat(id string) error {
	queryParams := fmt.Sprintf("?user_id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("ai_chats", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> InsertGoal: %s \n", err)
		fmt.Println("Error Deleteting life goal:", err)
		return err
	}
	return nil
}

func (repo *aiGenRepository) DeleteGoal(id string) error{
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("goals", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> InsertGoal: %s \n", err)
		fmt.Println("Error Deleteting life goal:", err)
		return err
	}
	return nil
}
func (repo *aiGenRepository) GetGenGoalByID(id string) (*entities.GeneratedPlan,error){
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	respond, err := repo.SupabaseClient.Query("goals", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("AiGenRepository -> GetGenGoalByUserID: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	var data []entities.GeneratedPlan
	if err = json.Unmarshal(respond, &data); err != nil {
		fiberlog.Errorf("AiGenRepository -> GetGenGoalByUserID: %s \n", err)
		return nil, err
	}
	if len(data) == 0 {
		return nil, fmt.Errorf("goal with ID %s not found", id)
	}
	return &data[0] , nil 
}