package aimodel

import (
	"context"
	"go-fiber-template/domain/entities"
	"log"
	"os"

	"google.golang.org/genai"
)

type GeminiRest struct {
	Context context.Context
	Client *genai.Client
}

func NewGeminiRest() *GeminiRest {
	client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey: os.Getenv("GEMINI_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatal("Failed to create Gemini client: " + err.Error())
	}
	return &GeminiRest{
		Context: context.Background(),
		Client:  client,
	}
}


func (g *GeminiRest) GenerateText(prompt string) (string, error) {
	req, err := g.Client.Models.GenerateContent(g.Context, "gemini-2.0-flash", genai.Text(prompt), nil)
	if err != nil {
		return "", err
	}
	response := req.Text()
	return response , nil
}

func (g *GeminiRest) AIChat(historychat []entities.AIChat, prompt string) (string, error) {
	history := []*genai.Content{}
	for _, chat := range historychat {
		if chat.Sender == "user" {
			history = append(history, genai.NewContentFromText(chat.Message, genai.RoleUser))
		}else if chat.Sender == "ai" {
			history = append(history, genai.NewContentFromText(chat.Message, genai.RoleModel))
		}
	}
	req, err := g.Client.Chats.Create(g.Context, "gemini-2.0-flash", nil, history)
	if err != nil {
		return "", err
	}
	res, err := req.SendMessage(g.Context,genai.Part{Text: prompt})
	if len(res.Candidates) < 0 {
		return "", err
  }
	return res.Candidates[0].Content.Parts[0].Text , nil
}

