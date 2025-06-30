package gateways

import (
	"go-fiber-template/domain/entities"

	"github.com/gofiber/fiber/v2"
)

// @Summary Get all schedule
// @Description Get all schedule 
// @Tags Schedule
// @Accept json
// @Produce json
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/schedule [get]
func (gateway *HTTPGateway) GetAllSchedules(ctx *fiber.Ctx) error {
	data, err := gateway.ScheduleService.GetAllSchedules()
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all schedule data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Get schedule by  ID
// @Description Get schedule by ID
// @Tags Schedule
// @Accept json
// @Produce json
// @Param id path string true "Scheadule ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/schedule/{id} [get]
func (gateway *HTTPGateway) GetScheduleByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}

	data, err := gateway.ScheduleService.GetScheduleByID(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get schedule data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Get schedule by User ID
// @Description Get schedule by User ID
// @Tags Schedule
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/user/schedule/{id} [get]
func (gateway *HTTPGateway) GetScheduleByUserID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}

	data, err := gateway.ScheduleService.GetScheduleByUserID(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get schedule data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Create a new schedule
// @Description Create a new schedule
// @Tags Schedule
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyUserProfile body entities.ScheduleResponse true "Shcedule Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/schedule/{id} [post]
func (gateway *HTTPGateway) CreateSchedule(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	bodyData := entities.ScheduleResponse{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}

	if bodyData.Work_Hours == "" || bodyData.Preferred_Times == nil || bodyData.Available_Time == "" || bodyData.Busy_Days == nil  {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body please fill all"})
	}

	if err := gateway.ScheduleService.CreateSchedule(id , bodyData); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new schedule."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}
