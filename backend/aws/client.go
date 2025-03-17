package aws

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/rds"
)

// ClientsConfig holds all AWS service clients
type ClientsConfig struct {
	EC2Client            *ec2.Client
	RDSClient            *rds.Client
	CostExplorerClient   *costexplorer.Client
	CloudWatchLogsClient *cloudwatchlogs.Client
	// EC2Client is reused for EBS operations since they're part of the same service
}

// NewClientsConfig creates and returns AWS service clients
func NewClientsConfig() *ClientsConfig {
	ctx := context.TODO()

	// Load AWS profile from environment variable or use default
	profile := os.Getenv("AWS_PROFILE")
	if profile == "" {
		profile = "default"
		log.Printf("AWS_PROFILE not set, using default profile")
	} else {
		log.Printf("Using AWS profile: %s", profile)
	}

	// Load AWS region from environment variable
	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = "us-east-1"
		log.Printf("AWS_REGION not set, using region from config")
	} else {
		log.Printf("Using AWS region: %s", region)
	}

	// Create config options with profile and region
	opts := []func(*config.LoadOptions) error{
		config.WithSharedConfigProfile(profile),
	}

	// Add region option if specified
	if region != "" {
		opts = append(opts, config.WithRegion(region))
	}

	cfg, err := config.LoadDefaultConfig(ctx, opts...)
	if err != nil {
		log.Fatalf("failed to load AWS configuration: %v", err)
	}

	return &ClientsConfig{
		EC2Client:            ec2.NewFromConfig(cfg),
		RDSClient:            rds.NewFromConfig(cfg),
		CostExplorerClient:   costexplorer.NewFromConfig(cfg),
		CloudWatchLogsClient: cloudwatchlogs.NewFromConfig(cfg),
	}
}
