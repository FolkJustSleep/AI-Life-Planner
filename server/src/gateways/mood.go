package gateways

import (
	"go-fiber-template/domain/entities"
	"github.com/gofiber/fiber/v2"
)

// @Summary Get all MoodData
// @Description Get all MoodData
// @Tags Mood
// @Accept json
// @Produce json
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/mood [get]
func (gateway *HTTPGateway) GetAllMood(ctx *fiber.Ctx) error {
	mood, err := gateway.MoodService.GetAllMood()
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get mood."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: mood})
}

// @Summary Get MoodData by id
// @Description Get MoodData by id
// @Tags Mood
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/mood/{id} [get]
func (gateway *HTTPGateway) GetMoodByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}
	mood, err := gateway.MoodService.GetMoodByUserId(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get mood."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: mood})
}

// @Summary Get MoodData by id
// @Description Get MoodData by id
// @Tags Mood
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyMood body entities.MoodResponse true "Mood Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/mood/{id} [post]
func (gateway *HTTPGateway) NewMood(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	bodyData := entities.MoodResponse{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	bodyData.UserID = id
	data, err := gateway.MoodService.NewMood(bodyData);
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert mood data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success" ,Data: data})
}