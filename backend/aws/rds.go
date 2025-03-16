package aws

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/service/rds"
	"github.com/devesh-kumar/aws-resources-cost-board/models"
)

// GetRunningRDSInstances returns all running RDS instances
func (c *ClientsConfig) GetRunningRDSInstances(ctx context.Context) ([]models.RDSInstance, error) {
	input := &rds.DescribeDBInstancesInput{}
	result, err := c.RDSClient.DescribeDBInstances(ctx, input)
	if err != nil {
		log.Printf("Error describing RDS instances: %v", err)
		return nil, err
	}

	var instances []models.RDSInstance
	for _, instance := range result.DBInstances {
		// Only include instances that are available
		if instance.DBInstanceStatus != nil && *instance.DBInstanceStatus == "available" {
			instances = append(instances, models.RDSInstance{
				ID:               *instance.DBInstanceIdentifier,
				Class:            *instance.DBInstanceClass,
				Engine:           *instance.Engine,
				EngineVersion:    *instance.EngineVersion,
				Status:           *instance.DBInstanceStatus,
				AllocatedStorage: *instance.AllocatedStorage,
			})
		}
	}

	return instances, nil
}
