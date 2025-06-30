package services


import(
	"go-fiber-template/domain/repositories"
	"go-fiber-template/domain/entities"
	"time"
	fiberlog "github.com/gofiber/fiber/v2/log"
	"fmt"
)
type LifeGoalService struct {
	LifeGoalRepo repositories.ILifeGoalRepository
	UserRepo     repositories.IUsersRepository
}
type ILifeGoalService interface {
	InsertLifeGoal(data entities.LifeGoalBody, userID string) error
	GetAllLifeGoals() (*[]entities.LifeGoalModel, error)
	FindLifeGoalByUserID(id string) (*entities.LifeGoalModel, error)
	UpdateLifeGoal(lifeGoalID string, data entities.LifeGoalUpdateBody) error
	FindLifeGoalByID(id string) (*entities.LifeGoalModel, error)
}

func NewLifeGoalService(lifegoalrepo repositories.ILifeGoalRepository, userRepo repositories.IUsersRepository) ILifeGoalService {
	return &LifeGoalService{
		LifeGoalRepo: lifegoalrepo,
		UserRepo:     userRepo,
	}
}

func (sv *LifeGoalService) InsertLifeGoal(body entities.LifeGoalBody, userID string) error {
	var data entities.LifeGoalResponse
	if userID == "" {
    return fmt.Errorf("userID cannot be empty")
}
	data.UserID = userID
	data.ShortTerm= body.ShortTerm
	data.LongTerm = body.LongTerm
	data.Priorities = body.Priorities
	data.TimeFrame = body.TimeFrame
	data.CreatedAt = time.Now().Add(7 * time.Hour)
	data.UpdatedAt = time.Now().Add(7 * time.Hour)
	if data.UserID == "" {
		return fmt.Errorf("userID cannot be empty")
	}
	err := sv.LifeGoalRepo.InsertLifeGoal(data)
	if err != nil {
		fiberlog.Errorf("LifeGoalService -> InsertLifeGoal: %s \n", err)
		fmt.Println("Error inserting life goal:", err)
		return err
	}
	return nil
}

func (sv *LifeGoalService) GetAllLifeGoals() (*[]entities.LifeGoalModel, error) {
	data, err := sv.LifeGoalRepo.FindAll()
	if err != nil {
		fiberlog.Errorf("LifeGoalService -> GetAllLifeGoals: %s \n", err)
		fmt.Println("Error fetching all life goals:", err)
		return nil, err
	}
	return data, nil
}

func (sv *LifeGoalService) FindLifeGoalByUserID(id string) (*entities.LifeGoalModel, error) {
	data, err := sv.LifeGoalRepo.FindByUserID(id)
	if err != nil {
		fiberlog.Errorf("LifeGoalService -> FindLifeGoalByUserID: %s \n", err)
		fmt.Println("Error fetching life goal by User ID:", err)
		return nil, err
	}
	return data, nil
}


//finish the ai prompt 
// Add method to query all table

func (sv *LifeGoalService) FindLifeGoalByID(id string) (*entities.LifeGoalModel, error) {
	data, err := sv.LifeGoalRepo.FindByID(id)
	if err != nil {
		fiberlog.Errorf("LifeGoalService -> FindLifeGoalByID: %s \n", err)
		fmt.Println("Error fetching life goal by ID:", err)
		return nil, err
	}
	return data, nil
}
func (sv *LifeGoalService) UpdateLifeGoal(lifegoals_id string, data entities.LifeGoalUpdateBody) error {
	data.UpdatedAt = time.Now().Add(7 * time.Hour)
	err := sv.LifeGoalRepo.UpdateLifeGoal(lifegoals_id,data)
	if err != nil {
		fiberlog.Errorf("LifeGoalService -> UpdateLifeGoal: %s \n", err)
		fmt.Println("Error updating life goal:", err)
		return err
	}
	return nil
}