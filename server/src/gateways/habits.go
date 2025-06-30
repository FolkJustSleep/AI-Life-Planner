package gateways

import (
	"go-fiber-template/domain/entities"
	"github.com/gofiber/fiber/v2"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

// @Summary Create a new Habit
// @Description Create a new Habits For User
// @Tags Habits
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyHealthBackground body entities.HabitResponse true "Habit Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/habit/{id} [post]
func (h *HTTPGateway) CreateHabit(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}
	bodyData := entities.HabitResponse{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	fiberlog.Info("TargetCount", bodyData.TargetCount)
	if err := h.HabitsService.CreateHabit(id, bodyData); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot create new habit"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}
// @Summary Get Habit by UserId
// @Description Get Habits by user ID
// @Tags Habits
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/habit/{id} [get]
func (h *HTTPGateway) GetHabitByUserID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}
	data, err := h.HabitsService.GetHabitsByUserID(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get habits"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}