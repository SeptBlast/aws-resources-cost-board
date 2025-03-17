package api

import (
	"context"
	"net/http"
	"time"

	"github.com/devesh-kumar/aws-resources-cost-board/aws"
	"github.com/devesh-kumar/aws-resources-cost-board/models"
	"github.com/gin-gonic/gin"
)

// getEC2Instances returns all running EC2 instances
func (s *Server) getEC2Instances(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 30000*time.Second)
	defer cancel()

	instances, err := s.aws.GetRunningEC2Instances(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, instances)
}

// getRDSInstances returns all running RDS instances
func (s *Server) getRDSInstances(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 30000*time.Second)
	defer cancel()

	instances, err := s.aws.GetRunningRDSInstances(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, instances)
}

// getEBSVolumes returns all EBS volumes
func (s *Server) getEBSVolumes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 30000*time.Second)
	defer cancel()

	volumes, err := s.aws.GetEBSVolumes(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, volumes)
}

// getCost returns cost data for the specified time period
func (s *Server) getCost(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 30000*time.Second)
	defer cancel()

	start := c.DefaultQuery("start", "")
	end := c.DefaultQuery("end", "")

	if start == "" || end == "" {
		start, end = aws.GetDefaultDateRange()
	}

	costData, err := s.aws.GetCostAndUsage(ctx, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, costData)
}

// getResources returns all resources (EC2, RDS, EBS, CloudWatch Log Groups)
func (s *Server) getResources(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 30000*time.Second)
	defer cancel()

	ec2Instances, err := s.aws.GetRunningEC2Instances(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rdsInstances, err := s.aws.GetRunningRDSInstances(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ebsVolumes, err := s.aws.GetEBSVolumes(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	logGroups, err := s.aws.GetCloudWatchLogGroups(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ec2":             ec2Instances,
		"rds":             rdsInstances,
		"ebs":             ebsVolumes,
		"cloudwatch_logs": logGroups,
	})
}

// getSummary returns a summary of resources and their costs
func (s *Server) getSummary(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3000*time.Second)
	defer cancel()

	ec2Instances, err := s.aws.GetRunningEC2Instances(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rdsInstances, err := s.aws.GetRunningRDSInstances(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ebsVolumes, err := s.aws.GetEBSVolumes(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	logGroups, err := s.aws.GetCloudWatchLogGroups(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	start, end := aws.GetDefaultDateRange()
	costData, err := s.aws.GetCostAndUsage(ctx, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	summary := models.ResourcesSummary{
		EC2Instances:        ec2Instances,
		RDSInstances:        rdsInstances,
		EBSVolumes:          ebsVolumes,
		CloudWatchLogGroups: logGroups,
		CostData:            costData,
	}

	c.JSON(http.StatusOK, summary)
}

// getCloudWatchLogGroups returns all CloudWatch Log Groups
func (s *Server) getCloudWatchLogGroups(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3000*time.Second)
	defer cancel()

	logGroups, err := s.aws.GetCloudWatchLogGroups(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logGroups)
}
