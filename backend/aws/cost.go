package aws

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/costexplorer"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer/types"
	"github.com/devesh-kumar/aws-resources-cost-board/models"
)

// GetCostAndUsage returns cost and usage data for the specified time period
func (c *ClientsConfig) GetCostAndUsage(ctx context.Context, startDate, endDate string) (*models.CostData, error) {
	input := &costexplorer.GetCostAndUsageInput{
		TimePeriod: &types.DateInterval{
			Start: &startDate,
			End:   &endDate,
		},
		Granularity: types.GranularityDaily,
		Metrics:     []string{"BlendedCost"},
		GroupBy: []types.GroupDefinition{
			{
				Type: types.GroupDefinitionTypeDimension,
				Key:  stringPtr("SERVICE"),
			},
		},
	}

	result, err := c.CostExplorerClient.GetCostAndUsage(ctx, input)
	if err != nil {
		log.Printf("Error getting cost and usage: %v", err)
		return nil, err
	}

	costData := &models.CostData{
		TimeStart: startDate,
		TimeEnd:   endDate,
		Results:   make([]models.CostByService, 0),
	}

	for _, resultByTime := range result.ResultsByTime {
		for _, group := range resultByTime.Groups {
			serviceName := group.Keys[0]
			amount := *group.Metrics["BlendedCost"].Amount
			unit := *group.Metrics["BlendedCost"].Unit

			costData.Results = append(costData.Results, models.CostByService{
				Service: serviceName,
				Amount:  amount,
				Unit:    unit,
				Date:    *resultByTime.TimePeriod.Start,
			})
		}
	}

	return costData, nil
}

// GetDefaultDateRange returns the default date range (last 30 days)
func GetDefaultDateRange() (string, string) {
	now := time.Now()
	end := now.Format("2006-01-02")
	start := now.AddDate(0, 0, -30).Format("2006-01-02")
	return start, end
}
