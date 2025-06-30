package gateways

import (
	"go-fiber-template/domain/entities"
	"github.com/gofiber/fiber/v2"
)

//@Summary Get All user finance records
// @Description Get finance records of all user 
// @Tags Finance
// @Accept json
// @Produce json
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/finance_info [get]
func (gateway *HTTPGateway) GetAllFinance(c *fiber.Ctx) error {
	data, err := gateway.FinanceService.GetAllFinance()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(entities.ResponseModel{Message: "failed to fetch finance records"})
	}
	return c.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully fetched finance records", Data: data})
}

//@Summary Get finance records by User ID
// @Description Get finance records by User ID
// @Tags Finance
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/finance_info/{id} [get]
func (gateway *HTTPGateway) GetFinanceByUserID(c *fiber.Ctx) error {
	userID := c.Params("id")
	if userID == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}

	data, err := gateway.FinanceService.GetAllFinanceByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(entities.ResponseModel{Message: "failed to fetch finance records for user"})
	}
	return c.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully fetched finance records for user", Data: data})
}
//@Summary create new finance records by User ID
// @Description create new finance records by User ID
// @Tags Finance
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyFinance body entities.FinanceRespond true "Finance Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/finance_info/{id} [post]
func (gateway *HTTPGateway) CreateFinance(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}
	body := entities.FinanceRespond{}
	if err := ctx.BodyParser(&body); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	if body.Currency == "" || body.Risk_Tolerance == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	if err := gateway.FinanceService.CreateFinance(id, body); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot create new finance."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully created new finance"})
}