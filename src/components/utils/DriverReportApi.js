import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/driver-report`;
const isTripStatusValid = ["PLANNED","IN_PROGRESS","COMPLETED","CANCELLED"];
const isDriverStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

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

export async function generateAdvancedDriverReport({startDate, endDate, tripStatuses, driverGroupIds, driverStatuses, confirmed}) {
    try {
        // Validacija datuma
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error(`Datum za pocetak ${startDate} i kraj ${endDate} moraju biti ispravni`);
        }
        if(moment(startDate).isAfter(moment(endDate))){
            throw new Error("Datum za pocetak ne sme biti posle datuma za kraj");
        }
        // Validacija tripStatuses
        if(!Array.isArray(tripStatuses) || tripStatuses.length === 0){
            throw new Error("Lista statusa za putovanje ne sme biti prazna");
        }
        const tripStatusesUpper = tripStatuses.map(ts => ts.toUpperCase());
        if(!tripStatusesUpper.every(ts => isTripStatusValid.includes(ts))){
            throw new Error(`Nevalidan status putovanja: ${tripStatuses}`);
        }
        // Validacija driverStatuses
        if(!Array.isArray(driverStatuses) || driverStatuses.length === 0){
            throw new Error("Lista statusa za vozaca ne sme biti prazna");
        }
        const driverStatusesUpper = driverStatuses.map(ds => ds.toUpperCase());
        if(!driverStatusesUpper.every(ds => isDriverStatusValid.includes(ds))){
            throw new Error(`Nevalidan status vozaca: ${driverStatuses}`);
        }
        // Validacija driverGroupIds
        if(!Array.isArray(driverGroupIds) || driverGroupIds.length === 0){
            throw new Error("Lista ID-jeva grupa vozaca ne sme biti prazna");
        }
        // Validacija confirmed
        if(typeof confirmed !== "boolean"){
            throw new Error("Polje 'confirmed' mora biti boolean");
        }
        const response = await api.get(`${url}/drivers-report`, {
            params: {
                startDate: moment(startDate).format("YYYY-MM-DD"),
                endDate: moment(endDate).format("YYYY-MM-DD"),
                tripStatuses: tripStatusesUpper,
                driverGroupIds: driverGroupIds,
                driverStatuses: driverStatusesUpper,
                confirmed: confirmed
            },
            headers: getHeader()
        });
        return response.data;
    } 
    catch(error) {
        handleApiError(error, "Greska prilikom generisanja vozacevih izvestaja na osnovu razlicitih parametara");
    }
}