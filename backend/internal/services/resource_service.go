package services

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/devesh-kumar/aws-resources-cost-board/internal/aws"
	"github.com/devesh-kumar/aws-resources-cost-board/internal/models"
)

// ResourceService handles AWS resource operations
type ResourceService struct {
	awsClient       *aws.Client
	resources       []models.Resource
	costSummary     models.CostSummary
	mu              sync.RWMutex
	lastUpdatedTime time.Time
}

// NewResourceService creates a new resource service
func NewResourceService(awsClient *aws.Client) *ResourceService {
	service := &ResourceService{
		awsClient: awsClient,
		resources: []models.Resource{},
		costSummary: models.CostSummary{
			ByServiceCost: make(map[string]models.ServiceCost),
		},
	}

	// Initialize with data
	go service.RefreshData(context.Background())

	return service
}

// GetAllResources returns all AWS resources
func (s *ResourceService) GetAllResources() []models.Resource {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.resources
}

// GetCostSummary returns cost summary
func (s *ResourceService) GetCostSummary() models.CostSummary {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.costSummary
}

// RefreshData refreshes all resource data
func (s *ResourceService) RefreshData(ctx context.Context) error {
	log.Println("Refreshing AWS resource data...")

	// Create new slices to hold the refreshed data
	var newResources []models.Resource

	// Fetch EC2 instances
	ec2Resources, err := s.fetchEC2Resources(ctx)
	if err != nil {
		log.Printf("Error fetching EC2 resources: %v", err)
	} else {
		newResources = append(newResources, ec2Resources...)
	}

	// Fetch RDS instances
	rdsResources, err := s.fetchRDSResources(ctx)
	if err != nil {
		log.Printf("Error fetching RDS resources: %v", err)
	} else {
		newResources = append(newResources, rdsResources...)
	}

	// Calculate costs
	costSummary, err := s.calculateCosts(ctx, newResources)
	if err != nil {
		log.Printf("Error calculating costs: %v", err)
	}

	// Update the stored data
	s.mu.Lock()
	s.resources = newResources
	s.costSummary = costSummary
	s.lastUpdatedTime = time.Now()
	s.mu.Unlock()

	log.Printf("Data refresh completed. Found %d resources.", len(newResources))
	return nil
}

// fetchEC2Resources fetches EC2 instances
func (s *ResourceService) fetchEC2Resources(ctx context.Context) ([]models.Resource, error) {
	// Implementation would fetch EC2 instances using the AWS SDK
	// This is a simplified version
	return []models.Resource{}, nil
}

// fetchRDSResources fetches RDS instances
func (s *ResourceService) fetchRDSResources(ctx context.Context) ([]models.Resource, error) {
	// Implementation would fetch RDS instances using the AWS SDK
	// This is a simplified version
	return []models.Resource{}, nil
}

// calculateCosts calculates costs for resources
func (s *ResourceService) calculateCosts(ctx context.Context, resources []models.Resource) (models.CostSummary, error) {
	// Implementation would calculate costs using the Cost Explorer API
	// This is a simplified version
	costSummary := models.CostSummary{
		LastUpdated:   time.Now(),
		ByServiceCost: make(map[string]models.ServiceCost),
	}
	return costSummary, nil
}
