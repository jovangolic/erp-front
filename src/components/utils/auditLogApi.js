import { act, use } from "react";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function log({action, userId, details}){
    try{
        if(
            !action || typeof action !== "string" || action.trim() === ""||
            !userId || !details || typeof details !== "string" || details.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {userId,action,details};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}audit-logs/log`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska za log");
    }
}

export async function getById(id){
    try{
        if(!id){
            throw new Error("Dati ID za AuditLog ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
    }
}

export async function getLogsBetweenDates({startDate, endDate}){
    try{
        if(
            !moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati datumi log-a nisu u opsegu");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/between-dates`,{
            params:{
                startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po opsegu datuma");
    }
}

export async function getLogsByAction(action){
    try{
        if(!action || typeof action !== "string" || act.trim() === ""){
            throw new Error("Dati log po akciji ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/get-by-action`,{
            params:{
                action
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po actions");
    }
}

export async function getLogsByUserId(userId){
    try{
        if(!userId){
            throw new Error("Dati userId ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/user/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greksa prilikom dobavljanja po korisniku");
    }
}

export async function getAllLogs(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/get-all-logs`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}