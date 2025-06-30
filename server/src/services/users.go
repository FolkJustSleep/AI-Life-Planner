package services

import (
	"fmt"
	"go-fiber-template/domain/entities"
	"go-fiber-template/domain/repositories"

	// "go-fiber-template/httpclient"
	"time"

	fiberlog"github.com/gofiber/fiber/v2/log"
)

type usersService struct {
	UsersRepository repositories.IUsersRepository
	LifeGoalRepo repositories.ILifeGoalRepository
	UserRepo     repositories.IUsersRepository
	HealthRepo   repositories.IHealthBackgroundRepository
	FinanceRepo  repositories.IFinanceRepository
	ScheduleRepo repositories.IScheduleRepository
}

type IUsersService interface {
	GetAllUsers() (*[]entities.UserProfileModel, error)
	InsertNewUser(id string,data entities.UserProfileResponse) error
	FindUserByID(id string) (*entities.UserProfileModel, error)
	UpdateUser(data entities.UserProfileModel) error
	DeleteAllData(userid string) error
}

func NewUsersService(repo0 repositories.IUsersRepository, repo1 repositories.ILifeGoalRepository, repo2 repositories.IUsersRepository, repo3 repositories.IHealthBackgroundRepository, repo4 repositories.IFinanceRepository, repo5 repositories.IScheduleRepository) IUsersService {
	return &usersService{
		UsersRepository: repo0,
		LifeGoalRepo: repo1,
		UserRepo:     repo2,
		HealthRepo:   repo3,
		FinanceRepo:  repo4,
		ScheduleRepo: repo5,
	}
}

func (sv *usersService) GetAllUsers() (*[]entities.UserProfileModel, error) {
	data, err := sv.UsersRepository.FindAll()
	if err != nil {
		return nil, err
	}

	return data, nil

}

func (sv *usersService) InsertNewUser(id string, data entities.UserProfileResponse) error {
	data.UserID = id
	data.CreatedAt = time.Now().Add(7 * time.Hour)
	data.UpdatedAt = time.Now().Add(7 * time.Hour)
	err := sv.UsersRepository.InsertUser(data)
	if err != nil {
		fiberlog.Errorf("Users -> InsertNewUser: %s \n", err)
		fmt.Println("Error inserting new user:", err)		
		return err
	}
	return nil
}

func (sv *usersService) FindUserByID(id string) (*entities.UserProfileModel, error) {
	data, err := sv.UsersRepository.FindByID(id)
	if err != nil {
		return nil, err
	}

	return data, nil
}

func (sv *usersService) UpdateUser(data entities.UserProfileModel) error {
	OriginalData,err := sv.UsersRepository.FindByID(data.UserID)
	if err != nil {
		fiberlog.Errorf("Users -> UpdateUser: %s \n", err)
		fmt.Println("Error fetching original user data:", err)
		return err
	}
	data.UpdatedAt = time.Now().Add(7 * time.Hour)
	if data.CreatedAt.IsZero() {
		data.CreatedAt = OriginalData.CreatedAt
	}
	if data.ID == "" {
		data.ID = OriginalData.ID
	}
	if data.Age == 0 {
		data.Age = OriginalData.Age
	}
	if data.Weight == 0 {
		data.Weight = OriginalData.Weight
	}
	if data.Height == 0 {
		data.Height = OriginalData.Height	
	}
	if data.Fullname == "" {
		data.Fullname = OriginalData.Fullname
	}
	if data.Gender == "" {
		data.Gender = OriginalData.Gender
	}
	if data.Fullname == "" {
		data.Fullname = OriginalData.Fullname
	}

	err = sv.UsersRepository.UpdateUser(data)
	if err != nil {
		fiberlog.Errorf("Users -> UpdateUser: %s \n", err)
		fmt.Println("Error updating user:", err)		
		return err
	}	

	return nil
}

func (sv *usersService) DeleteAllData(userid string) error {
    lifegoal_data, err := sv.LifeGoalRepo.FindByUserID(userid)
    if err != nil {
        fiberlog.Errorf("AiGenService -> DeleteGenChatByUserID: %s \n", err)
        fmt.Println("Error Deleting GenChat by User ID:\n", err)
        return err
    }
    err = sv.LifeGoalRepo.DeleteLifeGoal(lifegoal_data.ID)
    if err != nil {
        fiberlog.Errorf("LifeGoalService -> DeleteLifeGoalByID: %s \n", err)
        fmt.Println("Error deleting life goal by ID:", err)
        return err
    }
	Financedata , err := sv.FinanceRepo.GetAllFinanceByUserID(userid)
	if err != nil {
		fiberlog.Errorf("AiGenService -> DeleteGenChatByUserID: %s \n", err)
		fmt.Println("Error Deleting GenChat by User ID:\n", err)
		return err
	}
    err = sv.FinanceRepo.DeleteFinance(Financedata.ID)
    if err != nil {
        fiberlog.Errorf("FinanceService -> DeleteFinanceByID: %s \n", err)
        fmt.Println("Error deleting finance by ID:", err)
        return err
    }
	HealthData ,err := sv.HealthRepo.FindByUserID(userid)
	if err != nil {
		fiberlog.Errorf("AiGenService -> DeleteGenChatByUserID: %s \n", err)
		fmt.Println("Error Deleting GenChat by User ID:\n", err)
		return err
	}
    err = sv.HealthRepo.DeleteHealthBackground(HealthData.ID)
    if err != nil {
        fiberlog.Errorf("HealthBackgroundService -> DeleteHealthBackgroundByID: %s \n", err)
        fmt.Println("Error deleting health background by ID:", err)
        return err
    }
	ScheduleData ,err := sv.ScheduleRepo.GetScheduleByUserID(userid)
	if err != nil {
		fiberlog.Errorf("AiGenService -> DeleteGenChatByUserID: %s \n", err)
		fmt.Println("Error Deleting GenChat by User ID:\n", err)
		return err
	}
    err = sv.ScheduleRepo.DeleteSchedule(ScheduleData.ID)
    if err != nil {
        fiberlog.Errorf("ScheduleService -> DeleteScheduleByID: %s \n", err)
        fmt.Println("Error deleting schedule by ID:", err)
        return err
    }
    return nil
}