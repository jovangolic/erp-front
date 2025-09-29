import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/driver-report`;

export async function generateDriverReport(driverId){
    try{
        if(isNaN(driverId) || driverId == null){
            throw new Error("Dati id "+driverId+" vozaca, za generisanje izvestaja, nije pronadjen");
        }
        const response = await api.get(url+`/${driverId}/report`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom generisanja vozacevog izvestaja");
    }
}

export async function downloadDriverReportExcel(driverId){
    try{
        if(isNaN(driverId) || driverId == null){
            throw new Error("Dati id "+driverId+" vozaca, za generisanje Excel/CSV izvestaja, nije pronadjen");
        }
        const response = await api.get(url+`/${driverId}/report/excel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom generisanja Excel/CSV vozacevog izvestaja");
    }
}

export async function downloadDriverReportPdf(driverId){
    try{
        if(isNaN(driverId) || driverId == null){
            throw new Error("Dati id "+driverId+" vozaca, za generisanje PDF izvestaja, nije pronadjen");
        }
        const response = await api.get(url+`/${driverId}/report/pdf`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom generisanja PDF vozacevog izvestaja");
    }
}