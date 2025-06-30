package repositories

import (
	"encoding/json"
	"fmt"
	"go-fiber-template/domain/datasources"
	"go-fiber-template/domain/entities"
	"net/http"

	fiberlog "github.com/gofiber/fiber/v2/log"
)



type financeRepository struct {
	SupabaseClient *datasources.SupabaseREST
}
type IFinanceRepository interface {
	GetAllFinance() (*[]entities.FinanceModel, error)
	GetAllFinanceByUserID(userID string) (*entities.FinanceModel, error)
	CreateFinance(finance entities.FinanceRespond)  error
	// UpdateFinance(id string, finance entities.FinanceModel) (entities.FinanceModel, error)
	DeleteFinance(id string) error		
}

func NewFinanceRepository(client *datasources.SupabaseREST) IFinanceRepository {
	return &financeRepository{
		SupabaseClient: client,
	}
}
//@
func (repo *financeRepository) GetAllFinance() (*[]entities.FinanceModel, error) {
	respond, err := repo.SupabaseClient.Query("financial_info", http.MethodGet, "", nil)
	if err != nil {
		fiberlog.Errorf("Finance -> GetAllFinance: %s \n", err)
		fmt.Println("Error fetching all finance records:", err)
		return nil, err
	}

	var finances []entities.FinanceModel
	if err := json.Unmarshal(respond, &finances); err != nil {
		fiberlog.Errorf("Finance -> GetAllFinance: %s \n", err)
		fmt.Println("Error unmarshalling finance records:", err)
		return nil, err
	}
	return &finances, nil
}

func (repo *financeRepository) GetAllFinanceByUserID(userID string) (*entities.FinanceModel, error) {
	queryParams := fmt.Sprintf("?user_id=eq.%s", userID)
	respond, err := repo.SupabaseClient.Query("financial_info", http.MethodGet, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("Finance -> GetAllFinanceByUserID: %s \n", err)
		fmt.Println("Error fetching finance records by user ID:", err)
		return nil, err
	}

	var finance []entities.FinanceModel
	if err := json.Unmarshal(respond, &finance); err != nil {
		fiberlog.Errorf("Finance -> GetAllFinanceByUserID: %s \n", err)
		fmt.Println("Error unmarshalling finance record by user ID:", err)
		return nil, err
	}
	if len(finance) == 0 {
		return nil, fmt.Errorf("no finance records found for user ID: %s", userID)
	}
	return &finance[0], nil
}

func (repo *financeRepository) CreateFinance(finance entities.FinanceRespond)  error {
	_, err := repo.SupabaseClient.Query("financial_info", http.MethodPost, "", finance)
	if err != nil {
		fiberlog.Errorf("Finance -> CreateFinance: %s \n", err)
		fmt.Println("Error creating finance record:", err)
		return  err
	}
	return  nil
}

func (repo *financeRepository) DeleteFinance(id string) error {
	queryParams := fmt.Sprintf("?id=eq.%s", id)
	_, err := repo.SupabaseClient.Query("financial_info", http.MethodDelete, queryParams, nil)
	if err != nil {
		fiberlog.Errorf("Finance -> DeleteFinance: %s \n", err)
		fmt.Println("Error deleting finance record:", err)
		return err
	}
	return nil
}
