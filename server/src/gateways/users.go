package gateways

import (
	"go-fiber-template/domain/entities"

	"github.com/gofiber/fiber/v2"
)

// @Summary Get all Userdata
// @Description Get all user data
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/users [get]
func (h *HTTPGateway) GetAllUserData(ctx *fiber.Ctx) error {

	data, err := h.UserService.GetAllUsers()
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get all users data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Insert Userdata
// @Description Insert all user data
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyUserProfile body entities.UserProfileResponse true "User Profile Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/add_user/{id} [post]
func (h *HTTPGateway) CreateUser(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	bodyData := entities.UserProfileResponse{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}

	if bodyData.Fullname == "" || bodyData.Age == 0 || bodyData.Height == 0 || bodyData.Gender == "" || bodyData.Weight == 0 {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}

	if err := h.UserService.InsertNewUser(id, bodyData); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new user account."})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}

// @Summary Get Userdata by ID
// @Description Get user data by ID
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/user/{id} [get]
func (h *HTTPGateway) GetUserByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if id == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid user id"})
	}

	data, err := h.UserService.FindUserByID(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot get user data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success", Data: data})
}

// @Summary Update Userdata
// @Description Update user data
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyUserProfile body entities.UserProfileResponse true "User Profile Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/update_user/{id} [patch]
func (h *HTTPGateway) UpdateUser(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	bodyData := entities.UserProfileModel{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	bodyData.UserID = id

	if err := h.UserService.UpdateUser(bodyData); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot update user data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}

// @Summary Insert Userdata
// @Description Insert all data
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param bodyUserProfile body entities.BodyData true "All Data"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/user/add_alldata/{id} [post]
func (h *HTTPGateway) PostAllInfomation(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	bodyData := entities.BodyData{}
	if err := ctx.BodyParser(&bodyData); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	// UserBody := entities.UserProfileResponse{
	// 	UserID:   id,
	// 	Fullname: bodyData.Fullname,
	// 	Age:      bodyData.Age,
	// 	Height:   bodyData.Height,
	// 	Gender:   bodyData.Gender,
	// 	Weight:   bodyData.Weight,
	// }
	// if bodyData.Fullname == "" || bodyData.Age == 0 || bodyData.Height == 0 || bodyData.Gender == "" || bodyData.Weight == 0 {
	// 	return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	// }
	// if err := h.UserService.InsertNewUser(id, UserBody); err != nil {
	// 	return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new user account."})
	// }
	HealthBody := entities.HealthBackgroundResponse{
		UserID:             id,
		Medical_Conditions: bodyData.Medical_Conditions,
		Allergies:          bodyData.Allergies,
		Medications:        bodyData.Medications,
		Fitness_Level:      bodyData.Fitness_Level,
		Sleep_Pattern:      bodyData.Sleep_Pattern,
	}
	if bodyData.Medical_Conditions == nil || bodyData.Allergies == nil || bodyData.Medications == nil || bodyData.Fitness_Level == "" || bodyData.Sleep_Pattern == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body please fill all"})
	}
	if err := h.HealthBackgroundService.InsertHealth(HealthBody, id); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new health background"})
	}
	ScheduleBody := entities.ScheduleResponse{
		UserID:          id,
		Work_Hours:      bodyData.Work_Hours,
		Preferred_Times: bodyData.Preferred_Times,
		Available_Time:  bodyData.Available_Time,
		Busy_Days:       bodyData.Busy_Days,
	}
	if bodyData.Work_Hours == "" || bodyData.Preferred_Times == nil || bodyData.Available_Time == "" || bodyData.Busy_Days == nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body please fill all"})
	}
	if err := h.ScheduleService.CreateSchedule(id, ScheduleBody); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new schedule."})
	}
	LifeGoalBody := entities.LifeGoalBody{
		ShortTerm:  bodyData.ShortTerm,
		LongTerm:   bodyData.LongTerm,
		Priorities: bodyData.Priorities,
		TimeFrame:  bodyData.TimeFrame,
	}
	if bodyData.ShortTerm == nil || bodyData.LongTerm == nil || bodyData.Priorities == nil || bodyData.TimeFrame == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	if err := h.LifeGoalService.InsertLifeGoal(LifeGoalBody, id); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new life goal."})
	}
	FinanceBody := entities.FinanceRespond{
		UserID:         id,
		Currency:       bodyData.Currency,
		Income:         bodyData.Income,
		Expenses:       bodyData.Expenses,
		Savings_Goal:   bodyData.Savings_Goal,
		Risk_Tolerance: bodyData.Risk_Tolerance,
	}
	if bodyData.Currency == "" || bodyData.Risk_Tolerance == "" {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(entities.ResponseMessage{Message: "invalid json body"})
	}
	if err := h.FinanceService.CreateFinance(id, FinanceBody); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot insert new finance."})
	}

	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}

// @Summary Delete Userdata by userID
// @Description delete every data by user id except user_profile
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} entities.ResponseModel
// @Failure 403 {object} entities.ResponseModel
// @Router /api/v1/users/user/{id} [delete]
func (h *HTTPGateway) DeleteUserData(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := h.UserService.DeleteAllData(id); err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(entities.ResponseModel{Message: "cannot delete user data"})
	}
	return ctx.Status(fiber.StatusOK).JSON(entities.ResponseModel{Message: "success"})
}