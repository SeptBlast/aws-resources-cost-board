package aws

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/ec2/types"
	"github.com/devesh-kumar/aws-resources-cost-board/models"
)

// GetRunningEC2Instances returns all running EC2 instances
func (c *ClientsConfig) GetRunningEC2Instances(ctx context.Context) ([]models.EC2Instance, error) {
	input := &ec2.DescribeInstancesInput{
		Filters: []types.Filter{
			{
				Name:   stringPtr("instance-state-name"),
				Values: []string{"running"},
			},
		},
	}

	result, err := c.EC2Client.DescribeInstances(ctx, input)
	if err != nil {
		log.Printf("Error describing EC2 instances: %v", err)
		return nil, err
	}

	var instances []models.EC2Instance
	for _, reservation := range result.Reservations {
		for _, instance := range reservation.Instances {
			name := getNameFromTags(instance.Tags)
			instances = append(instances, models.EC2Instance{
				ID:         *instance.InstanceId,
				Name:       name,
				Type:       string(instance.InstanceType),
				LaunchTime: *instance.LaunchTime,
				State:      string(instance.State.Name),
			})
		}
	}

	return instances, nil
}

func stringPtr(s string) *string {
	return &s
}

func getNameFromTags(tags []types.Tag) string {
	for _, tag := range tags {
		if *tag.Key == "Name" {
			return *tag.Value
		}
	}
	return ""
}
