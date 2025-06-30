package services


import (
	"go-fiber-template/domain/repositories"
	"go-fiber-template/domain/entities"
	"time"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

type MoodService struct {
	MoodRepository repositories.IMoodRepository
}

type IMoodService interface {
	NewMood(mood entities.MoodResponse) (entities.MoodResponse, error)
	GetMoodByUserId(userId string) (*[]entities.MoodModel, error)
	GetAllMood() (*[]entities.MoodModel, error)
}

func NewMoodService(moodRepository repositories.IMoodRepository) *MoodService {
	return &MoodService{
		MoodRepository: moodRepository,
	}
}

func (service *MoodService) NewMood(mood entities.MoodResponse) (entities.MoodResponse, error) {
	mood.CreatedAt = time.Now().Add(7 * time.Hour)
	err := service.MoodRepository.NewMood(mood)
	if err != nil {
		fiberlog.Error("Cannot insert mood",err)
		return entities.MoodResponse{}, err
	}
	return mood, nil
}

func (service *MoodService) GetMoodByUserId(userId string) (*[]entities.MoodModel, error) {
	data,err :=service.MoodRepository.GetMoodById(userId)
	if err != nil {
		fiberlog.Error("Cannot get all moods",err)
		return nil, err
	}
	return data,nil
}

func (service *MoodService) GetAllMood() (*[]entities.MoodModel, error) {
	data,err :=service.MoodRepository.GetMood()
	if err != nil {
		fiberlog.Error("Cannot get all moods",err)
		return nil, err
	}
	return data,nil
}