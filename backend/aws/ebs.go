package aws

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/devesh-kumar/aws-resources-cost-board/models"
)

// GetEBSVolumes returns all EBS volumes
func (c *ClientsConfig) GetEBSVolumes(ctx context.Context) ([]models.EBSVolume, error) {
	input := &ec2.DescribeVolumesInput{}
	result, err := c.EC2Client.DescribeVolumes(ctx, input)
	if err != nil {
		log.Printf("Error describing EBS volumes: %v", err)
		return nil, err
	}

	var volumes []models.EBSVolume
	for _, volume := range result.Volumes {
		name := getNameFromTags(volume.Tags)
		attachedTo := ""

		// Get attached instance ID if the volume is attached
		if len(volume.Attachments) > 0 && volume.Attachments[0].InstanceId != nil {
			attachedTo = *volume.Attachments[0].InstanceId
		}

		volumes = append(volumes, models.EBSVolume{
			ID:               *volume.VolumeId,
			Name:             name,
			Size:             volume.Size,
			VolumeType:       string(volume.VolumeType),
			State:            string(volume.State),
			CreationTime:     *volume.CreateTime,
			AvailabilityZone: *volume.AvailabilityZone,
			Encrypted:        volume.Encrypted,
			AttachedTo:       attachedTo,
		})
	}

	return volumes, nil
}
