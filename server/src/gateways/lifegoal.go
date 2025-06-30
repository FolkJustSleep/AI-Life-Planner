package gateways

import (
	"go-fiber-template/domain/entities"

	"github.com/gofiber/fiber/v2"
)
// @Summary Create a new life goal
// @Description Create a new life goal for a user
// @Tags Life Goal
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyLifeGoal body entities.LifeGoalBody true "Life Goal Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/lifegoals/add_lifegoal/{id} [post]
func (gateway *HTTPGateway) CreateLifeGoal(ctx *fiber.Ctx) error {
	bodyData := entities.LifeGoalBody{}
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}

	if bodyData.ShortTerm == nil || bodyData.LongTerm == nil || bodyData.Priorities == nil || bodyData.TimeFrame == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}

	if err := gateway.LifeGoalService.InsertLifeGoal(bodyData,id); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new life goal."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully created new life goal"})
}

// @Summary Get all life goals
// @Description Get all life goals for a user
// @Tags Life Goal
// @Accept json
// @Produce json
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/lifegoals/lifegoals [get]
func (gateway *HTTPGateway) GetAllLifeGoals(c *fiber.Ctx) error {
	data, err := gateway.LifeGoalService.GetAllLifeGoals()
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all life goals"})
	}
	return c.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Get life goals by User ID
// @Description Get life goals by User ID
// @Tags Life Goal
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/lifegoals/users/{id} [get]
func (gateway *HTTPGateway) GetLifeGoalByUserID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid life goal id"})
	}

	data, err := gateway.LifeGoalService.FindLifeGoalByUserID(id)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get life goal data"})
	}
	return c.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}


// @Summary Get life goals by ID
// @Description Get life goals by ID
// @Tags Life Goal
// @Accept json
// @Produce json
// @Param id path string true "Life Goal ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/lifegoals/lifegoal/{id} [get]
func (gateway *HTTPGateway) GetLifeGoalByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid life goal id"})
	}

	data, err := gateway.LifeGoalService.FindLifeGoalByID(id)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get life goal data"})
	}
	return c.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Update life goal
// @Description Update life goal by ID
// @Tags Life Goal
// @Accept json
// @Produce json
// @Param id path string true "Life Goal ID"
// @Param bodyLifeGoal body entities.LifeGoalUpdateBody true "Life Goal Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/lifegoals/update_lifegoal/{id} [patch]
func (gateway *HTTPGateway) UpdateLifeGoal(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid life goal id"})
	}
	bodyData := entities.LifeGoalUpdateBody{}
	if err := c.BodyParser(&bodyData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}

	if err := gateway.LifeGoalService.UpdateLifeGoal(id,bodyData); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot update life goal"})
	}
	return c.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully updated life goal"})
}