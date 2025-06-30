package services

import(
	"go-fiber-template/domain/repositories"
	"go-fiber-template/domain/entities"
	"time"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

type HabitsService struct {
	HabitsRepo repositories.IHabitRepository
}

type IHabitsService interface {
	CreateHabit(id string, habits entities.HabitResponse) error
	GetHabitsByUserID(userId string) (*[]entities.HabitModel, error)
}

func NewHabitsService (HabitsRepo repositories.IHabitRepository) IHabitsService {
	return &HabitsService{
		HabitsRepo: HabitsRepo,
	}
}


func (sv *HabitsService) CreateHabit(id string, habits entities.HabitResponse) error {
	habits.UserID = id
	habits.CreatedAt = time.Now().Add(7 * time.Hour)
	habits.UpdatedAt = time.Now().Add(7 * time.Hour)
	err := sv.HabitsRepo.CreateHabit(&habits)
	if err != nil {
		fiberlog.Errorf("HabitsService -> CreateHabits: %s \n", err)
		return err
	}
	return nil
}

func (sv *HabitsService) GetHabitsByUserID(id string) (*[]entities.HabitModel, error) {
	data, err := sv.HabitsRepo.GetHabitsByUserID(id)
	if err != nil {
		fiberlog.Errorf("HabitsService -> GetHabitsByUserID: %s \n", err)
		return nil, err
	}
	return data, nil
}