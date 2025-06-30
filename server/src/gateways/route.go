package gateways

import "github.com/gofiber/fiber/v2"

func GatewayUsers(gateway HTTPGateway, app *fiber.App) {
	api := app.Group("/api/v1/users")

	api.Post("/add_user/:id", gateway.CreateUser)
	api.Get("/users", gateway.GetAllUserData)
	api.Get("/user/:id", gateway.GetUserByID)
	api.Patch("/update_user/:id", gateway.UpdateUser)
	api.Delete("/user/:id", gateway.DeleteUserData)

	api.Post("/finance_info/:id", gateway.CreateFinance)
	api.Get("/finance_info", gateway.GetAllFinance)
	api.Get("/finance_info/:id", gateway.GetFinanceByUserID)


	api.Get("/health_background/", gateway.GetHealth)
	api.Get("/health_background/:id", gateway.GetHealthByUserID)
	api.Post("/health_background/:id", gateway.InsertHealth)


	api.Get("/schedule", gateway.GetAllSchedules)
	api.Get("/schedule/:id", gateway.GetScheduleByID)
	api.Post("/schedule/:id", gateway.CreateSchedule)
	api.Get("/user/schedule/:id", gateway.GetScheduleByUserID)

	api.Get("/habit/:id", gateway.GetHabitByUserID)
	api.Post("/habit/:id", gateway.CreateHabit)

	api.Get("/mood", gateway.GetAllMood)
	api.Get("/mood/:id", gateway.GetMoodByID)
	api.Post("/mood/:id", gateway.NewMood)

	api.Post("/user/add_alldata/:id", gateway.PostAllInfomation)
}

func GatewayLifeGoals(gateway HTTPGateway, app *fiber.App) {
	api := app.Group("/api/v1/lifegoals")

	api.Post("/add_lifegoal/:id", gateway.CreateLifeGoal)
	api.Get("/lifegoals", gateway.GetAllLifeGoals)
	api.Get("/users/:id", gateway.GetLifeGoalByUserID)
	api.Get("/lifegoal/:id", gateway.GetLifeGoalByID)
	api.Patch("/update_lifegoal/:id", gateway.UpdateLifeGoal)
	
}
func GatewayAiGen(gateway HTTPGateway, app *fiber.App) {
	api := app.Group("/api/v1/ai_gen")

	api.Post("/add_ai_prompt/:id", gateway.CreateAIPrompt)
	api.Post("/create_ai_gen/:id", gateway.CreateAiGen)
	api.Get("/ai_gens", gateway.GetAllGenGoal)
	api.Get("/ai_gen/:id", gateway.GetGenGoalByUserID)
	api.Delete("/goal/:id", gateway.DeleteGenGoal)

	api.Get("/chat/:id", gateway.GetAiGenChatByUserID)
	api.Post("/chat/:id", gateway.GenerateAiAssitant)
	api.Delete("/chat/:id", gateway.DeleteGenChat)
}