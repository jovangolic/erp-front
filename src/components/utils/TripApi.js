import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/trips`;
const isTripStatusValid = ["PLANNED","IN_PROGRESS","COMPLETED","CANCELLED"];
const isTripTypeStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];
const isDriverStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createTrip({startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed}){
    try{
        if(!startLocation || typeof startLocation !== "string" || startLocation.trim() === "" ||
           !endLocation || typeof endLocation !== "string" || endLocation.trim() === "" ||
           !moment(startTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !isTripStatusValid.includes(status?.toUpperCase()) || !isTripTypeStatusValid.includes(typeStatus?.toUpperCase()) ||
           isNaN(driverId) || driverId == null || typeof confirmed !== "boolean" ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed};
        const response = await api.post(url+`/create/new-trip`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja putovanja/trip");
    }
}

export async function updateTrip({id, startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed}){
    try{
        if(isNaN(id) || id == null ||
           !startLocation || typeof startLocation !== "string" || startLocation.trim() === "" ||
           !endLocation || typeof endLocation !== "string" || endLocation.trim() === "" ||
           !moment(startTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !isTripStatusValid.includes(status?.toUpperCase()) || !isTripTypeStatusValid.includes(typeStatus?.toUpperCase()) ||
           isNaN(driverId) || driverId == null || typeof confirmed !== "boolean" ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja putovanja/trip");
    }
}

export async function deleteTrip(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za putovanje/trip, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja jednog putovanja/trip po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za putovanje/trip, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog pitovanja/trip po "+id+" id-iju");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih putovanja");
    }
}