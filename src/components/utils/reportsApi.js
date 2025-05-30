import axios from 'axios';

const API_URL = '/reports';

export const generateReport = async (reportType) => {
  try {
    const response = await axios.get(`${API_URL}/generate`, { params: { reportType } });
    return response.data;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

export const downloadReport = async (reportId) => {
  try {
    const response = await axios.get(`${API_URL}/download/${reportId}`, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error("Error downloading report:", error);
    throw error;
  }
};