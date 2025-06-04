import axios from 'axios';
import { getHeader } from './AppFunction';
import moment from 'moment';

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

export async function getReportById(id){
  try{
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/reports/get/${id}`,{
      headers:getHeader()
    });
    return response.data;
  }
  catch(error){
    handleApiError(error,"Greska prilikom dobaavljanja jednog izvestaja")
  }
}

export async function getByType(type){
  try{
    const requestBody = {type: (type || "").toUpperCase()};
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/reports/type/${type}`,requestBody,{
      headers:getHeader()
    });
    return response.data;
  }
  catch(error){
    handleApiError(error, "Greska prilikom dobavljanja po tipu");
  }
}

export async function getReportsBetweenDates(from, to){
  try{
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/reports/date-range`,{
      params : {
        from: moment(from).format("YYYY-MM-DDTHH:mm:ss"),
        to: moment(to).format("YYYY-MM-DDTHH:mm:ss")
      },
      headers:getHeader()
    });
    return response.data;
  }
  catch(error){
    handleApiError(error, "Greska izmedju datuma");
  }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}