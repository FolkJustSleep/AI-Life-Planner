package gateways

import (
	service "go-fiber-template/src/services"

	"github.com/gofiber/fiber/v2"
)

type HTTPGateway struct {
	UserService service.IUsersService
	LifeGoalService service.ILifeGoalService
	AIPromptService service.IAiPromptService
	AiGenService service.IAiGenService
	FinanceService service.IFinanceService
	HealthBackgroundService service.IHealthBackgroundService
	ScheduleService service.IScheduleService
	HabitsService service.IHabitsService
	MoodService service.IMoodService
}

func NewHTTPGateway(app *fiber.App, users service.IUsersService, lifeGoals service.ILifeGoalService, aiPrompts service.IAiPromptService, aiGen service.IAiGenService, finance service.IFinanceService, healthBackground service.IHealthBackgroundService, schedule service.IScheduleService, habits service.IHabitsService, mood service.IMoodService) {
	gateway := &HTTPGateway{
		UserService: users,
		LifeGoalService: lifeGoals,
		AIPromptService: aiPrompts,
		AiGenService: aiGen,
		FinanceService: finance,
		HealthBackgroundService: healthBackground,
		ScheduleService: schedule,
		HabitsService: habits,
		MoodService: mood,
	}
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to the Go Fiber")
		// return c.SendString("Welcome to the Go Fiber Template API! use /swagger for documentation.")
	})
	GatewayUsers(*gateway, app)
	GatewayLifeGoals(*gateway, app)
	GatewayAiGen(*gateway, app)
}
