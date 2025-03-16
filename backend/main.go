package main

import (
	"log"

	"github.com/devesh-kumar/aws-resources-cost-board/api"
)

func main() {
	log.Println("Starting AWS Resources Cost Board Server")
	api.SetupAndRun()
}
