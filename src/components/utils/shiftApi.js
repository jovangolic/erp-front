import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createShift({startTime, endTime, shiftSupervisorId}){
    try{
        if(
            !moment(startTime, moment.ISO_8601, true).isValid() ||
            !moment(endTime, moment.ISO_8601, true).isValid() ||
            !shiftSupervisorId
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {
            startTime:moment(startTime).toISOString(), endTime:moment(endTime).toISOString(),
            shiftSupervisorId: shiftSupervisorId
        };
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/shifts/new/create-shift`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja smene: " + error.message);
        }
    }
}

export async function updateShift({id,startTime, endTime, shiftSupervisorId}){
    try{
        if(
            !id ||
            !moment(startTime, moment.ISO_8601, true).isValid() ||
            !moment(endTime, moment.ISO_8601, true).isValid() ||
            !shiftSupervisorId
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {id:id, startTime:moment(startTime).toISOString(), endTime:moment(endTime).toISOString(),
            shiftSupervisorId:shiftSupervisorId
        };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/shifts/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranja smene: " + error.message);
        }
    }
}

export async function deleteShift(id){
    try{
        if(!id){
            throw new Error("Dati ID nije nadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/shifts/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getShiftById(id){
    try{   
        if(!id){
            throw new Error("Dati ID nije nadjen");
        } 
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shifts/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom jednog dobavljanja");
    }
}

export async function getAllShifts(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shifts/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih smeni");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}