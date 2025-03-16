package models

import "time"

// ResourceType defines the type of AWS resource
type ResourceType string

const (
	EC2Instance ResourceType = "EC2Instance"
	RDSInstance ResourceType = "RDSInstance"
	S3Bucket    ResourceType = "S3Bucket"
	// Add more resource types as needed
)

// Resource represents an AWS resource with cost information
type Resource struct {
	ID          string       `json:"id"`
	Name        string       `json:"name"`
	Type        ResourceType `json:"type"`
	Region      string       `json:"region"`
	Status      string       `json:"status"`
	CreatedAt   time.Time    `json:"createdAt"`
	Details     interface{}  `json:"details"`
	DailyCost   float64      `json:"dailyCost"`
	MonthlyCost float64      `json:"monthlyCost"`
	Tags        []Tag        `json:"tags"`
}

// Tag represents a resource tag
type Tag struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// CostSummary provides cost information for all resources
type CostSummary struct {
	TotalDailyCost   float64                `json:"totalDailyCost"`
	TotalMonthlyCost float64                `json:"totalMonthlyCost"`
	ByServiceCost    map[string]ServiceCost `json:"byServiceCost"`
	LastUpdated      time.Time              `json:"lastUpdated"`
}

// ServiceCost represents cost for a specific AWS service
type ServiceCost struct {
	ServiceName   string  `json:"serviceName"`
	DailyCost     float64 `json:"dailyCost"`
	MonthlyCost   float64 `json:"monthlyCost"`
	ResourceCount int     `json:"resourceCount"`
}
