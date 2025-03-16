import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './CostChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CostChart = ({ costData }) => {
  const [chartType, setChartType] = useState('bar');
  const [serviceData, setServiceData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (costData && costData.results) {
      // Group by service and sum costs
      const serviceMap = costData.results.reduce((acc, item) => {
        const service = item.service;
        if (!acc[service]) {
          acc[service] = 0;
        }
        acc[service] += parseFloat(item.amount);
        return acc;
      }, {});

      // Sort services by cost (descending)
      const sortedServices = Object.entries(serviceMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 services

      const labels = sortedServices.map(([service]) => service);
      const costs = sortedServices.map(([, amount]) => amount);

      // Generate random colors for each service
      const colors = labels.map(() => 
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
      );

      setServiceData({
        labels,
        datasets: [
          {
            label: 'Cost by Service',
            data: costs,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.7', '1')),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [costData]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'AWS Cost by Service (Last 30 Days)',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'AWS Cost Distribution by Service',
      },
    },
  };

  return (
    <div className="cost-chart">
      <div className="chart-controls">
        <button
          className={chartType === 'bar' ? 'active' : ''}
          onClick={() => setChartType('bar')}
        >
          Bar Chart
        </button>
        <button
          className={chartType === 'pie' ? 'active' : ''}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
      </div>
      <div className="chart-container">
        {chartType === 'bar' ? (
          <Bar data={serviceData} options={barOptions} />
        ) : (
          <Pie data={serviceData} options={pieOptions} />
        )}
      </div>
    </div>
  );
};

export default CostChart;
