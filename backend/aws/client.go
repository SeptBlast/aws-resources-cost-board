package aws

import (
	"context"
	"log"

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
	cfg, err := config.LoadDefaultConfig(ctx)
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
