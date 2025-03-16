package aws

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/rds"
)

// Client encapsulates all AWS service clients
type Client struct {
	EC2Client          *ec2.Client
	RDSClient          *rds.Client
	CostExplorerClient *costexplorer.Client
}

// NewClient creates a new AWS client
func NewClient(ctx context.Context, region string) (*Client, error) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	return &Client{
		EC2Client:          ec2.NewFromConfig(cfg),
		RDSClient:          rds.NewFromConfig(cfg),
		CostExplorerClient: costexplorer.NewFromConfig(cfg),
	}, nil
}
