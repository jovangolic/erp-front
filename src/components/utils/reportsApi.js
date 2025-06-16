import axios from 'axios';
import { getHeader } from './AppFunction';
import moment from 'moment';

const API_URL = '/reports';

const isReportValidate = ["INVENTORY","USERS","","ACTIVITY_LOG","ORDERS"]; 

export const generateReport = async (reportType) => {
  try {
    if (!reportType || !isReportValidate.includes(reportType)) {
      throw new Error("Polja moraju biti popunjena i tip mora biti validan");
    }
    const requestBody = {
      type: reportType,
      generatedAt: new Date().toISOString(), // ako se traži, backend može sam da postavi
      filePath: null // ili undefined ako nije obavezno
    };
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reports/generate`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

export const downloadReport = async (reportId) => {
  try {
    if(!reportId){
      throw new Error("Id od report-a nije pronadjen.");
    }
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/download/${reportId}`, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error("Error downloading report:", error);
    throw error;
  }
};

export async function getReportById(id){
  try{
    if(!reportId){
      throw new Error("Id od report-a nije pronadjen.");
    }
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
    if(!isReportValidate.includes(type.toUpperCase())){
        throw new Error("Tip izvestaja nije pronadjen");
    }
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
    if(!moment(startDate, moment.ISO_8601, true).isValid() ||
        !moment(endDate, moment.ISO_8601, true).isValid()){
          throw new Error("Dati izvestaj nije pronadjen u opsegu datuma");
        }
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