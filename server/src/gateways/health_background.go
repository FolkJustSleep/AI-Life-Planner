package gateways

import (
	"github.com/gofiber/fiber/v2"
	"go-fiber-template/domain/entities"
)

//@Summary Get All Health Background
// @Description Get all health background data
// @Tags Health Background
// @Accept json
// @Produce json
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/health_background [get]
func (gateway *HTTPGateway) GetHealth(ctx *fiber.Ctx) error {
	// Call the health check service
	data, err := gateway.HealthBackgroundService.GetAllHealth()
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all health data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Get Health Background by User ID
// @Description Get health background by User ID
// @Tags Health Background
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/health_background/{id} [get]
func (gateway *HTTPGateway) GetHealthByUserID(ctx *fiber.Ctx) error {
	userID := ctx.Params("id")
	if userID == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}

	data, err := gateway.HealthBackgroundService.GetHealthByUserID(userID)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get health data by user ID"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Create a new health background
// @Description Create a new health background for a user
// @Tags Health Background
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyHealthBackground body entities.HealthBackgroundResponse true "Health Background Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/health_background/{id} [post]
func (gateway *HTTPGateway) InsertHealth(ctx *fiber.Ctx) error {
	bodyData := entities.HealthBackgroundResponse{}
	userID := ctx.Params("id")
	if userID == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}

	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	if bodyData.Medical_Conditions == nil || bodyData.Allergies == nil || bodyData.Medications == nil || bodyData.Fitness_Level == "" || bodyData.Sleep_Pattern == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body please fill all"})
	}
	if err := gateway.HealthBackgroundService.InsertHealth(bodyData, userID); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new health background"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully created new health background"})
}