# AWS Resources Cost Board

A comprehensive dashboard to visualize AWS resource usage and associated costs.

## Features

- Track running EC2 instances and their details
- Monitor RDS instances and database information
- View cost breakdown by AWS service
- Analyze cost trends over time
- Filter and sort resources for better insights

## Project Structure

```
aws-resources-cost-board/
├── backend/             # Go backend API
│   ├── api/             # API handlers and server setup
│   ├── aws/             # AWS service clients and operations
│   ├── models/          # Data models
│   └── main.go          # Entry point
└── frontend/            # React frontend
    ├── public/          # Static files
    └── src/             # React components and services
        ├── components/  # UI components
        └── services/    # API service calls
```

## Setup and Installation

### Backend

1. Make sure you have Go 1.24.1 or later installed
2. Configure your AWS credentials (AWS CLI, environment variables, or instance profile)
3. Navigate to the backend directory
4. Run the server:

```bash
cd backend
go run main.go
```

### Frontend

1. Make sure you have Node.js and npm installed
2. Navigate to the frontend directory
3. Install dependencies and start the development server:

```bash
cd frontend
npm install
npm start
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## AWS Permissions Required

The application needs the following AWS permissions:
- `ec2:DescribeInstances`
- `rds:DescribeDBInstances`
- `ce:GetCostAndUsage`

## License

MIT
