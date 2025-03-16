package api

import (
	"context"
	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/devesh-kumar/aws-resources-cost-board/internal/aws"
	"github.com/devesh-kumar/aws-resources-cost-board/internal/config"
	"github.com/devesh-kumar/aws-resources-cost-board/internal/services"
)

// Server represents the API server
type Server struct {
	router          *gin.Engine
	config          *config.Config
	resourceService *services.ResourceService
}

// NewServer creates a new API server
func NewServer(cfg *config.Config) *Server {
	router := gin.Default()

	// Set up CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CorsAllowed},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Create AWS client
	awsClient, err := aws.NewClient(context.Background(), cfg.AWSRegion)
	if err != nil {
		panic(fmt.Sprintf("Failed to create AWS client: %v", err))
	}

	resourceService := services.NewResourceService(awsClient)

	server := &Server{
		router:          router,
		config:          cfg,
		resourceService: resourceService,
	}

	server.setupRoutes()

	// Set up periodic refresh
	go server.startPeriodicRefresh()

	return server
}

// setupRoutes sets up the API routes
func (s *Server) setupRoutes() {
	api := s.router.Group("/api")
	{
		api.GET("/resources", s.GetResources)
		api.GET("/cost-summary", s.GetCostSummary)
		api.POST("/refresh", s.RefreshData)
	}
}

// Start starts the server
func (s *Server) Start() error {
	return s.router.Run(":" + s.config.Port)
}

// startPeriodicRefresh starts periodic refresh of AWS data
func (s *Server) startPeriodicRefresh() {
	ticker := time.NewTicker(time.Duration(s.config.RefreshRate) * time.Minute)
	defer ticker.Stop()

	for {
		<-ticker.C
		s.resourceService.RefreshData(context.Background())
	}
}

// GetResources handles GET /api/resources
func (s *Server) GetResources(c *gin.Context) {
	resources := s.resourceService.GetAllResources()
	c.JSON(200, resources)
}

// GetCostSummary handles GET /api/cost-summary
func (s *Server) GetCostSummary(c *gin.Context) {
	summary := s.resourceService.GetCostSummary()
	c.JSON(200, summary)
}

// RefreshData handles POST /api/refresh
func (s *Server) RefreshData(c *gin.Context) {
	err := s.resourceService.RefreshData(c)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Data refreshed successfully"})
}
