package main

import (
	"log"

	"github.com/devesh-kumar/aws-resources-cost-board/internal/api"
	"github.com/devesh-kumar/aws-resources-cost-board/internal/config"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	server := api.NewServer(cfg)
	log.Printf("Starting server on port %s", cfg.Port)
	if err := server.Start(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
