import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchResources = async () => {
  try {
    const response = await api.get('/resources');
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const fetchCostSummary = async () => {
  try {
    const response = await api.get('/cost-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching cost summary:', error);
    throw error;
  }
};

export const refreshData = async () => {
  try {
    const response = await api.post('/refresh');
    return response.data;
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
};

export const getEC2Instances = async () => {
  try {
    const response = await api.get('/ec2');
    return response.data;
  } catch (error) {
    console.error('Error fetching EC2 instances:', error);
    throw error;
  }
};

export const getRDSInstances = async () => {
  try {
    const response = await api.get('/rds');
    return response.data;
  } catch (error) {
    console.error('Error fetching RDS instances:', error);
    throw error;
  }
};

export const getEBSVolumes = async () => {
  try {
    const response = await api.get('/ebs');
    return response.data;
  } catch (error) {
    console.error('Error fetching EBS volumes:', error);
    throw error;
  }
};

export const getCostData = async (startDate, endDate) => {
  try {
    const response = await api.get('/cost', {
      params: {
        start: startDate,
        end: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cost data:', error);
    throw error;
  }
};

export const getSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary data:', error);
    throw error;
  }
};

export default api;
