package config

import (
	"os"
)

// Config holds the application configuration
type Config struct {
	Port        string
	AWSRegion   string
	CorsAllowed string
	RefreshRate int // minutes
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = "us-east-1"
	}

	cors := os.Getenv("CORS_ALLOWED_ORIGINS")
	if cors == "" {
		cors = "*"
	}

	// Default refresh rate is 60 minutes (1 hour)
	refreshRate := 60

	return &Config{
		Port:        port,
		AWSRegion:   region,
		CorsAllowed: cors,
		RefreshRate: refreshRate,
	}, nil
}
