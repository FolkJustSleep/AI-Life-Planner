package services

import (
	"fmt"
	"go-fiber-template/domain/entities"
	"go-fiber-template/domain/repositories"
	"time"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type AiGenService struct {
	AiGenRepo repositories.IAiGenRepository
	AiPromptRepo repositories.IAipromptRepository
	LifeGoalRepo repositories.ILifeGoalRepository
	UserRepo     repositories.IUsersRepository
	HealthRepo   repositories.IHealthBackgroundRepository
	FinanceRepo  repositories.IFinanceRepository
	ScheduleRepo repositories.IScheduleRepository
}

type IAiGenService interface {
	GenerateLifeGoal(id string) (string, error)
	GetAllGenGoal() (*[]entities.GeneratedPlan,error)
	GetGenGoalByUserID(id string) (*[]entities.GeneratedPlan,error)
	GenereateAiAssist(id string, bodyData entities.AIChatResponse) (string, error)
	GetGenChatByUserID(id string) (*[]entities.AIChat, error)
	DeleteGenChatByUserID(id string)  error 
	DeleteGenGoalByID(id string)  error 
}

func NewAiGenService(aiGenRepo repositories.IAiGenRepository, aiPromptRepo repositories.IAipromptRepository, lifeGoalRepo repositories.ILifeGoalRepository, userRepo repositories.IUsersRepository, healthRepo repositories.IHealthBackgroundRepository, financeRepo repositories.IFinanceRepository , scheduleRepo repositories.IScheduleRepository) IAiGenService {
	return &AiGenService{
		AiGenRepo: aiGenRepo,
		AiPromptRepo: aiPromptRepo,
		LifeGoalRepo: lifeGoalRepo,
		UserRepo:     userRepo,
		HealthRepo:   healthRepo,
		FinanceRepo:  financeRepo,
		ScheduleRepo: scheduleRepo,
	}
}

func (sv *AiGenService) GenerateLifeGoal(id string) (string, error) {
	data,  err:= sv.AiPromptRepo.GetPromptByUserID(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GenerateLifeGoal: %s \n", err)
		fmt.Println("Error getting prompt:", err)
		return "", nil // or return an error if you prefer
	}
	prompt := data.Prompt
	response, err := sv.AiGenRepo.GenerateLifeGoal(prompt)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GenerateLifeGoal: %s \n", err)
		fmt.Println("Error generating life goal:", err)
		return "", err
	}
	Goaldata := entities.GeneratedPlanResponse{
		UserID: id,
		Generated_Plan: response,
		PromptID: data.ID,
		LifeGoalID: data.LifeGoalID,
		FinanceID: data.FinanceID,
		HealthID: data.HealthID,
		ScheduleID: data.ScheduleID,
		CreatedAt: time.Now().Add(7 * time.Hour),
	}
	err = sv.AiGenRepo.InsertGoal(Goaldata)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GenerateLifeGoal: %s \n", err)
		fmt.Println("Error inserting life goal:", err)
		
	}
	return response, nil
}

func (sv *AiGenService) GetAllGenGoal() (*[]entities.GeneratedPlan, error) {
	data, err := sv.AiGenRepo.GetAllGenGoal()
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetAllAiGens: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	return data, nil
}

func (sv *AiGenService) GetGenGoalByUserID(id string) (*[]entities.GeneratedPlan, error) {
	data, err := sv.AiGenRepo.GetGenGoalByUserID(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetAiGenGoalByUserID: %s \n", err)
		fmt.Println("Error fetching life goal by User ID:", err)
		return nil, err
	}
	return data, nil
}

func (sv *AiGenService) GenereateAiAssist(id string, bodyData entities.AIChatResponse) (string, error) {
	bodyData.UserID= id
	bodyData.CreatedAt= time.Now().Add(7 * time.Hour)
	bodyData.Sender= "user"
	err := sv.AiGenRepo.InsertChat(bodyData)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetGenGoalByID: %s \n", err)
		fmt.Println("Error inserting chats:\n", err)
		return "", err
	}
	history,err := sv.GetGenChatByUserID(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetGenGoalByID: %s \n", err)
		fmt.Println("Error fetching life goal by User ID:", err)
		return "", err
	}
	data, err := sv.AiGenRepo.GenerateAiChat(*history, bodyData.Message)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetGenGoalByID: %s \n", err)
		fmt.Println("Error Genchat :", err)
		return "", err
	}
	datasent := entities.AIChatResponse{
		UserID: id,
		Sender: "ai",
		Message: data,
		CreatedAt: time.Now().Add(7 * time.Hour),
		
	}
	
	err = sv.AiGenRepo.InsertChat(datasent)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetGenGoalByID: %s \n", err)
		fmt.Println("Error inserting Message:\n", err)
		return "", err
	}
	return data, nil
}

func (sv *AiGenService) GetGenChatByUserID(id string) (*[]entities.AIChat, error) {
	data, err := sv.AiGenRepo.GetGenAiChatByUserID(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> GetAiGenGoalByUserID: %s \n", err)
		fmt.Println("Error fetching GenChat by User ID:\n", err)
		return nil, err
	}
	return data, nil
}


func (sv *AiGenService)DeleteGenChatByUserID(id string)  error {
	err := sv.AiGenRepo.DeleteChat(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> DeleteGenChatByUserID: %s \n", err)
		fmt.Println("Error Deleting GenChat by User ID:\n", err)
		return err
	}
	return nil
}

func (sv *AiGenService) DeleteGenGoalByID(id string)  error {
	data, err := sv.AiGenRepo.GetGenGoalByID(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> DeleteGenChatByUserID: %s \n", err)
		fmt.Println("Error Deleting GenGoal by ID:\n", err)
		return err
	}
	err = sv.AiGenRepo.DeleteGoal(id)
	if err != nil {
		fiberlog.Errorf("AiGenService -> DeleteGenGoalByID: %s \n", err)
		fmt.Println("Error Deleting GenChat by ID:\n", err)
		return err
	}
	err = sv.AiPromptRepo.DeletePromptByID((*data).PromptID)
	if err != nil {
		fiberlog.Errorf("AiPromptService -> DeletePromptByID: %s \n", err)
		fmt.Println("Error deleting prompt by ID:", err)
		return err
	}
	err = sv.LifeGoalRepo.DeleteLifeGoal((*data).LifeGoalID)
	if err != nil {
		fiberlog.Errorf("LifeGoalService -> DeleteLifeGoalByID: %s \n", err)
		fmt.Println("Error deleting life goal by ID:", err)
		return err
	}
	err = sv.FinanceRepo.DeleteFinance((*data).FinanceID)
	if err != nil {
		fiberlog.Errorf("FinanceService -> DeleteFinanceByID: %s \n", err)
		fmt.Println("Error deleting finance by ID:", err)
		return err
	}
	err = sv.HealthRepo.DeleteHealthBackground((*data).HealthID)
	if err != nil {
		fiberlog.Errorf("HealthBackgroundService -> DeleteHealthBackgroundByID: %s \n", err)
		fmt.Println("Error deleting health background by ID:", err)
		return err
	}
	err = sv.ScheduleRepo.DeleteSchedule((*data).ScheduleID)
	if err != nil {
		fiberlog.Errorf("ScheduleService -> DeleteScheduleByID: %s \n", err)
		fmt.Println("Error deleting schedule by ID:", err)
		return err
	}
	return nil
}