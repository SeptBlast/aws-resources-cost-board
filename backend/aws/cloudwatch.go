package aws

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs"
	"github.com/devesh-kumar/aws-resources-cost-board/models"
)

// GetCloudWatchLogGroups returns all CloudWatch log groups
func (c *ClientsConfig) GetCloudWatchLogGroups(ctx context.Context) ([]models.CloudWatchLogGroup, error) {
	var logGroups []models.CloudWatchLogGroup
	var nextToken *string

	for {
		input := &cloudwatchlogs.DescribeLogGroupsInput{
			NextToken: nextToken,
		}

		result, err := c.CloudWatchLogsClient.DescribeLogGroups(ctx, input)
		if err != nil {
			log.Printf("Error describing CloudWatch log groups: %v", err)
			return nil, err
		}

		for _, lg := range result.LogGroups {
			// Get metric filters count to understand usage patterns
			filterInput := &cloudwatchlogs.DescribeMetricFiltersInput{
				LogGroupName: lg.LogGroupName,
				Limit:        intPtr(1), // We only need to know if there are any
			}

			filterResult, err := c.CloudWatchLogsClient.DescribeMetricFilters(ctx, filterInput)
			metricFilterCount := int32(0)
			if err == nil {
				metricFilterCount = int32(len(filterResult.MetricFilters))
			}

			// Convert from AWS SDK model to our model
			retentionDays := int32(0)
			if lg.RetentionInDays != nil {
				retentionDays = *lg.RetentionInDays
			}

			storedBytes := int64(0)
			if lg.StoredBytes != nil {
				storedBytes = *lg.StoredBytes
			}

			logGroup := models.CloudWatchLogGroup{
				Name:              *lg.LogGroupName,
				ARN:               *lg.Arn,
				StoredBytes:       storedBytes,
				RetentionDays:     retentionDays,
				CreationTime:      millisecondsToTime(lg.CreationTime),
				MetricFilterCount: metricFilterCount,
			}

			logGroups = append(logGroups, logGroup)
		}

		// Break if there are no more log groups
		if result.NextToken == nil {
			break
		}
		nextToken = result.NextToken
	}

	return logGroups, nil
}

// millisecondsToTime converts milliseconds since epoch to time.Time
func millisecondsToTime(milliseconds *int64) time.Time {
	if milliseconds == nil {
		return time.Time{}
	}
	return time.Unix(0, *milliseconds*int64(time.Millisecond))
}

func intPtr(i int32) *int32 {
	return &i
}
