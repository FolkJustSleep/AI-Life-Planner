package gateways

import (
	"go-fiber-template/domain/entities"
	"github.com/gofiber/fiber/v2"
)

//@Summary Create a new AI GenPlan
// @Description generate a new AI GenPlan base ai prompt that we create base on data that user input 
// @Tags Ai Gen
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/ai_gen/create_ai_gen/{id} [post]
func (gateway *HTTPGateway) CreateAiGen(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	err := gateway.AIPromptService.CreateAIPrompt(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot create new AI prompt."})
	}
	respond, err := gateway.AiGenService.GenerateLifeGoal(id);
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot create new AI gen."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "successfully created new AI gen", Data: respond})
}

func (gateway *HTTPGateway) GetAllGenGoal(ctx *fiber.Ctx) error{
	data, err := gateway.AiGenService.GetAllGenGoal()
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all gen goal."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

//@Summary Get AI gennerated plan
// @Description get Gennerated plan that generate by ai base on ai prompt that we create from base user input
// @Tags Ai Gen
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/ai_gen/ai_gen/{id} [get]
func (gateway *HTTPGateway) GetGenGoalByUserID(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	data, err := gateway.AiGenService.GetGenGoalByUserID(id)
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get gen goal."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

//@Summary Sent a new message to AI Chat
// @Description Sent the new message to AI Chat Assistant
// @Tags Ai Gen
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyHealthBackground body entities.AIChatResponse true "AI Chat Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/ai_gen/chat/{id} [post]
func (gateway *HTTPGateway) GenerateAiAssitant(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	bodyData := entities.AIChatResponse{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	if bodyData.Sender != "user" && bodyData.Sender == "ai" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid sender"})
	}
	data, err := gateway.AiGenService.GenereateAiAssist(id, bodyData)
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get gen chat."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

//@Summary Get AI Chat By userID
// @Description Get AI Chat history By userID
// @Tags Ai Gen
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/ai_gen/chat/{id} [get]
func (gateway *HTTPGateway) GetAiGenChatByUserID(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	data, err := gateway.AiGenService.GetGenChatByUserID(id)
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get gen goal."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}
//@Summary Delete AI Chat By userID
// @Description Delete all history AI Chat By userID
// @Tags Ai Gen
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/ai_gen/chat/{id} [delete]
func (gateway *HTTPGateway) DeleteGenChat(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	err := gateway.AiGenService.DeleteGenChatByUserID(id)
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all gen chat."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}

//@Summary Delete AI GeneratedPlan By ID
// @Description Delete AI goal that we generate from ai By ID of that goal
// @Tags Ai Gen
// @Accept json
// @Produce json
// @Param id path string true "GeneratedPlan ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/ai_gen/goal/{id} [delete]
func (gateway *HTTPGateway) DeleteGenGoal(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	err := gateway.AiGenService.DeleteGenGoalByID(id)
	if  err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all gen goal."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}