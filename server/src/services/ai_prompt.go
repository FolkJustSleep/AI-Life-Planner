package services

import (
	"fmt"
	"go-fiber-template/domain/entities"
	"go-fiber-template/domain/repositories"
	"strings"
	"time"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type AiPromptService struct {
	LifeGoalRepo repositories.ILifeGoalRepository
	UserRepo     repositories.IUsersRepository
	AiPromptRepo repositories.IAipromptRepository
	HealthRepo   repositories.IHealthBackgroundRepository
	FinanceRepo  repositories.IFinanceRepository
	ScheduleRepo repositories.IScheduleRepository
}
type IAiPromptService interface {
	CreateAIPrompt(id string) error
	DeleteAIPrompt(id string) error
}

func NewAiPromptService(lifegoalrepo repositories.ILifeGoalRepository, userRepo repositories.IUsersRepository, aiPromptRepo repositories.IAipromptRepository, healthRepo repositories.IHealthBackgroundRepository, financeRepo repositories.IFinanceRepository , scheduleRepo repositories.IScheduleRepository) IAiPromptService {
	return &AiPromptService{
		LifeGoalRepo: lifegoalrepo,
		UserRepo:     userRepo,
		AiPromptRepo: aiPromptRepo,
		HealthRepo:   healthRepo,
		FinanceRepo:  financeRepo,
		ScheduleRepo: scheduleRepo,
	}
}

func (sv *AiPromptService) CreateAIPrompt(id string) error {
	Userdata, err := sv.UserRepo.FindByID(id)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> InsertLifeGoal: %s \n", err)
		fmt.Println("Error fetching user by ID:", err)
		return err
	}
	lifeGoaldata, err := sv.LifeGoalRepo.FindByUserID(id)
	if err != nil {
		fiberlog.Errorf("LifeGoal -> FindByID: %s \n", err)
		fmt.Println("Error fetching life goal by ID:", err)
		return err
	}
	HealthData, err := sv.HealthRepo.FindByUserID(id)
	if err != nil {
		fiberlog.Errorf("HealthBackgroundService -> GetHealthByUserID: %s \n", err)
		fmt.Println("Error fetching health background by user ID:", err)
		return err
	}
	FinanceData, err := sv.FinanceRepo.GetAllFinanceByUserID(id)
	if err != nil {
		fiberlog.Errorf("FinanceService -> GetAllFinanceByUserID: %s \n", err)
		fmt.Println("Error fetching finance data by user ID:", err)
		return err
	}
	ScheDuleData, err := sv.ScheduleRepo.GetScheduleByUserID(id)
	if err != nil {
		fiberlog.Errorf("ScheduleService -> GetScheduleByUserID: %s \n", err)
		fmt.Println("Error fetching schedule by user ID:", err)
		return err
	}
	var data entities.AiPromptResponse
	data.UserID = id
	data.Prompt = fmt.Sprintf("Generate a life goal for me based on my profile information. \nMy LongTermGoal is %s and \nMy ShorttermGoal is %s.\nRight now I am %d years old %s . \nThis is my Health Background \nMy weight is %f kg, height is %f cm, medical condition is %s , allergies %s, current medication %s ,sleeppattern is %s and fitness level is %s \n My financial situation \n My income is %f %s ,Monthly expenses is %f %s \n I expect to save money %f %s, Risk Tolerence for investments is %s.\n I have workhour %s, available time %s, my most busy day is %s , preferred time for activity is %s." , lifeGoaldata.LongTerm, lifeGoaldata.ShortTerm, Userdata.Age, Userdata.Gender, Userdata.Weight, Userdata.Height, strings.Join(HealthData.Medical_Conditions, ","), strings.Join(HealthData.Allergies, ","), strings.Join(HealthData.Medications, ","), HealthData.Sleep_Pattern, HealthData.Fitness_Level, FinanceData.Income, FinanceData.Currency, FinanceData.Expenses, FinanceData.Currency, FinanceData.SavingsGoal, FinanceData.Currency, FinanceData.Risk_Tolerance, ScheDuleData.WorkHours, ScheDuleData.AvailableTime, strings.Join(ScheDuleData.BusyDays, ","), strings.Join(ScheDuleData.PreferredTime, ","))
	data.LifeGoalID = lifeGoaldata.ID
	data.HealthID = HealthData.ID
	data.FinanceID = FinanceData.ID
	data.ScheduleID = ScheDuleData.ID
	data.CreatedAt = time.Now().Add(7 * time.Hour)
	// data.UpdatedAt = data.UpdatedAt.Add(7 * time.Hour)
	err = sv.AiPromptRepo.InsertAIPrompt(data)
	if err != nil {
		fiberlog.Errorf("AiPromptService -> InsertAIPrompt: %s \n", err)
		fmt.Println("Error inserting AI prompt:", err)
		return err
	}
	return nil
}

func (sv *AiPromptService)DeleteAIPrompt(id string) error {
	err := sv.AiPromptRepo.DeletePromptByID(id)
	if err != nil {
		fiberlog.Errorf("AiPromptService -> GetAllAIPrompts: %s \n", err)
		fmt.Println("Error Deleteing AI prompts by id:", err)
		return err
	}
	return  nil
}