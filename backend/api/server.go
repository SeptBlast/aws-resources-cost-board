package api

import (
	"github.com/devesh-kumar/aws-resources-cost-board/aws"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Server represents the API server
type Server struct {
	router *gin.Engine
	aws    *aws.ClientsConfig
}

// NewServer creates a new API server
func NewServer(aws *aws.ClientsConfig) *Server {
	server := &Server{
		router: gin.Default(),
		aws:    aws,
	}

	// Configure CORS
	server.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Register routes
	server.registerRoutes()

	return server
}

// Run starts the API server
func (s *Server) Run() error {
	return s.router.Run(":8080")
}

// registerRoutes registers all API routes
func (s *Server) registerRoutes() {
	api := s.router.Group("/api")
	{
		api.GET("/resources", s.getResources)
		api.GET("/ec2", s.getEC2Instances)
		api.GET("/rds", s.getRDSInstances)
		api.GET("/ebs", s.getEBSVolumes)
		api.GET("/cost", s.getCost)
		api.GET("/summary", s.getSummary)
	}
}

// SetupAndRun configures and starts the server
func SetupAndRun() {
	awsConfig := aws.NewClientsConfig()
	server := NewServer(awsConfig)
	server.Run()
}
