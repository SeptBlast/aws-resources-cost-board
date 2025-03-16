import React, { useEffect, useState } from 'react';
import { getSummary } from '../services/api';
import CostChart from './CostChart';
import ResourcesList from './ResourcesList';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    ec2Instances: [],
    rdsInstances: [],
    ebsVolumes: [],
    costData: { results: [] }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSummary(data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalEC2 = summary.ec2Instances.length;
  const totalRDS = summary.rdsInstances.length;
  
  // Calculate total cost
  const totalCost = summary.costData.results.reduce((acc, item) => {
    return acc + parseFloat(item.amount);
  }, 0).toFixed(2);
  
  // Get the currency unit from the first cost item
  const costUnit = summary.costData.results.length > 0 ? summary.costData.results[0].unit : 'USD';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AWS Resources Cost Dashboard</h1>
      </header>
      
      <div className="summary-cards">
        <div className="card">
          <h3>EC2 Instances</h3>
          <p className="number">{totalEC2}</p>
        </div>
        <div className="card">
          <h3>RDS Instances</h3>
          <p className="number">{totalRDS}</p>
        </div>
        <div className="card">
          <h3>Total Cost (30 Days)</h3>
          <p className="number">{totalCost} {costUnit}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <CostChart costData={summary.costData} />
      </div>

      <div className="resources-section">
        <h2>Running Resources</h2>
        <ResourcesList ec2Instances={summary.ec2Instances} rdsInstances={summary.rdsInstances} />
      </div>
    </div>
  );
};

export default Dashboard;
