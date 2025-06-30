package services

import (
	"go-fiber-template/domain/entities"
	"go-fiber-template/domain/repositories"
	"time"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type FinanceService struct {
	FinanceRepo repositories.IFinanceRepository
}

type IFinanceService interface {
	GetAllFinance() (*[]entities.FinanceModel, error)
	GetAllFinanceByUserID(userID string) (*entities.FinanceModel, error)
	CreateFinance(id string, finance entities.FinanceRespond) error
	// UpdateFinance(id string, finance entities.FinanceModel) (entities.FinanceModel, error)
	// DeleteFinance(id string) error
}	

func NewFinanceService(financeRepo repositories.IFinanceRepository) IFinanceService {
	return &FinanceService{
		FinanceRepo: financeRepo,
	}
}

func (sv *FinanceService) GetAllFinance() (*[]entities.FinanceModel, error) {
	data, err := sv.FinanceRepo.GetAllFinance()
	if err != nil {
		fiberlog.Errorf("FinanceService -> GetAllFinance: %s \n", err)
		return nil, err
	}
	return data, nil
}

func (sv *FinanceService) GetAllFinanceByUserID(userID string) (*entities.FinanceModel, error) {
	data, err := sv.FinanceRepo.GetAllFinanceByUserID(userID)
	if err != nil {
		fiberlog.Errorf("FinanceService -> GetAllFinanceByUserID: %s \n", err)
		return nil, err
	}
	return data, nil
}

func (sv *FinanceService) CreateFinance(id string, finance entities.FinanceRespond) error {
	finance.UserID = id
	finance.CreatedAt = time.Now().Add(7 * time.Hour)
	finance.UpdatedAt = time.Now().Add(7 * time.Hour)
	err := sv.FinanceRepo.CreateFinance(finance)
	if err != nil {
		fiberlog.Errorf("FinanceService -> CreateFinance: %s \n", err)
		return err
	}
	return nil
}