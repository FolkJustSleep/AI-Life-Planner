package main

import (
	"go-fiber-template/configuration"
	ai "go-fiber-template/domain/aimodel"
	ds "go-fiber-template/domain/datasources"
	repo "go-fiber-template/domain/repositories"
	gw "go-fiber-template/src/gateways"
	"go-fiber-template/src/middlewares"
	sv "go-fiber-template/src/services"
	// "log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	// "github.com/joho/godotenv"

	_ "go-fiber-template/docs"
    // "github.com/gofiber/swagger"
)
// @title Fiber API AudioSum
// @version 1.0
// @description This is Ai-lifeplanner API
// @host humorous-colt-vital.ngrok-free.app
// @BasePath /
func main() {

	// // // remove this before deploy ###################
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }
	// /// ############################################

	app := fiber.New(configuration.NewFiberConfiguration())
	middlewares.Logger(app)
	app.Use(recover.New())
	app.Use(cors.New())
	// app.Get("/swagger/*", swagger.HandlerDefault)

	supabasedb := ds.NewSupabaseREST()
	gemini := ai.NewGeminiRest()


	userRepo := repo.NewUsersRepository(supabasedb)
	lifeGoalRepo := repo.NewLifeGoalRepository(supabasedb)
	aiPromptRepo := repo.NewAiPromptRepository(supabasedb)
	financeRepo := repo.NewFinanceRepository(supabasedb)
	healthBackgroundRepo := repo.NewHealthBackgroundRepository(supabasedb)
	scheduleRepo :=repo.NewScheduleRepository(supabasedb)
	aiGenRepo := repo.NewAiGenRepository(supabasedb, gemini)
	habitsRepo := repo.NewHabitRepository(supabasedb)
	moodRepo := repo.NewMoodRepository(supabasedb)

	sv0 := sv.NewUsersService(userRepo, lifeGoalRepo, userRepo, healthBackgroundRepo, financeRepo, scheduleRepo)
	sv1 := sv.NewLifeGoalService(lifeGoalRepo, userRepo)
	sv2 := sv.NewAiPromptService(lifeGoalRepo, userRepo, aiPromptRepo, healthBackgroundRepo, financeRepo, scheduleRepo)
	sv3 := sv.NewAiGenService(aiGenRepo, aiPromptRepo, lifeGoalRepo, userRepo, healthBackgroundRepo, financeRepo, scheduleRepo)
	sv4 := sv.NewFinanceService(financeRepo)
	sv5 := sv.NewHealthBackgroundService(healthBackgroundRepo)
	sv6 := sv.NewScheduleService(scheduleRepo)
	sv7 := sv.NewHabitsService(habitsRepo)
	sv8 := sv.NewMoodService(moodRepo)

	gw.NewHTTPGateway(app, sv0, sv1, sv2, sv3, sv4, sv5, sv6, sv7, sv8)

	PORT := os.Getenv("PORT")

	if PORT == "" {
		PORT = "8080"
	}

	app.Listen(":" + PORT)
}
