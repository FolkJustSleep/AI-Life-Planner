# Guide to run this backend locally

## Install golang package
```bash
go mod tidy
```

# Set Environment `.env`
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY= your_supabase_secret
PORT=1818

JWT_SECRET_KEY=Test
JWT_REFESH_SECRET_KEY=Test
```

## Run ngrok on port 1818
if you don't have domain (run via randomize domain name)
```bash
ngrok http  1818
```
if you have your domain name on ngrok
```bash
ngrok http --url=your-domain.ngrok-free.app 1818
``` 

## Change the host in main.go
change the host in main.go (link 25) to the url optained from ngrok with no http

for example 
- if the url is `https://5b07-1-4-193-206.ngrok-free.app` 
- parse `5b07-1-4-193-206.ngrok-free.app`
```go
// @title Fiber API AudioSum
// @version 1.0
// @description This is Ai-lifeplanner API
// @host <url-from-ngrok-with-no-http>
// @BasePath /
```

# Swagger Setup
```bash
swag init 

--> if using macOS
export PATH=$PATH:$HOME/go/bin
swag init
```

# Run App
```bash
go run .
```
# Your api endpoints are now ready!
visit the url obtained from ngrok your-domain.ngrok-free.app/swagger and try calling our api!

# Notice
if you modify the main.go again, you have to run swag init again. for example you change you ngrok url.

