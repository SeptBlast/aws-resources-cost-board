package models

import (
	"time"
)

// EC2Instance represents an EC2 instance
type EC2Instance struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	LaunchTime time.Time `json:"launchTime"`
	State      string    `json:"state"`
}

// RDSInstance represents an RDS instance
type RDSInstance struct {
	ID               string `json:"id"`
	Class            string `json:"class"`
	Engine           string `json:"engine"`
	EngineVersion    string `json:"engineVersion"`
	Status           string `json:"status"`
	AllocatedStorage int32  `json:"allocatedStorage"`
}

// EBSVolume represents an EBS volume
type EBSVolume struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	Size             int32     `json:"size"`
	VolumeType       string    `json:"volumeType"`
	State            string    `json:"state"`
	CreationTime     time.Time `json:"creationTime"`
	AvailabilityZone string    `json:"availabilityZone"`
	Encrypted        bool      `json:"encrypted"`
	AttachedTo       string    `json:"attachedTo"`
}

// CostByService represents the cost data for a specific service
type CostByService struct {
	Service string `json:"service"`
	Amount  string `json:"amount"`
	Unit    string `json:"unit"`
	Date    string `json:"date"`
}

// CostData represents the aggregated cost data
type CostData struct {
	TimeStart string          `json:"timeStart"`
	TimeEnd   string          `json:"timeEnd"`
	Results   []CostByService `json:"results"`
}

// ResourcesSummary represents a summary of all resources
type ResourcesSummary struct {
	EC2Instances []EC2Instance `json:"ec2Instances"`
	RDSInstances []RDSInstance `json:"rdsInstances"`
	EBSVolumes   []EBSVolume   `json:"ebsVolumes"`
	CostData     *CostData     `json:"costData"`
}
