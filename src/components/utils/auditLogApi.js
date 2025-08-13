import { act, use } from "react";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isAuditActionTypeVali = ["LOGIN_EMAIL","SEND_EMAIL","READ_EMAIL","DELETE_EMAIL","CREATE_USER","UPDATE_USER","DELETE_USER","VIEW_PASSWORD_COLLECTOR","EXPORT_EMAILS","FAILED_LOGIN"];

export async function log({action, userId, details}){
    try{
        if(
            !isAuditActionTypeVali.includes(action?.toUpperCase()) ||
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za AuditLog ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog po "+id+" id-iju");
    }
}

export async function getLogsBetweenDates({startDate, endDate}){
    try{
        if(
            !moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati datumi log-a "+startDate+" - "+endDate+" nisu u opsegu");
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
        if(!isAuditActionTypeVali.includes(action?.toUpperCase())){
            throw new Error("Dati log po tipu "+act+" akcije ne postoji");
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
        handleApiError(error, "Greska prilikom dobavljanja po tipu "+act+" actions");
    }
}

export async function getLogsByUserId(userId){
    try{
        if(userId == null || isNaN(userId)){
            throw new Error("Dati userId "+userId+" ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/user/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greksa prilikom dobavljanja po "+userId+" id-iju korisniku");
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

export async function searchLogs(userId, action, start, end, ipAddress, userAgent){
    try{
        if(
            userId == null || isNaN(userId) || !isAuditActionTypeVali.includes(action?.toUpperCase()) ||
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !ipAddress || typeof ipAddress !== "string" || ipAddress.trim() === "" ||
            !userAgent || typeof userAgent !== "string" || userAgent.trim() === ""
        ){
            throw new Error("Dati podaci za pretragu nisu validni (userId,action,start,end,ipAddress,userAgent)");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}audit-logs/search`,{
            params:{
                userId:userId,
                action:(action || "").toUpperCase(),
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss"),
                ipAddress:ipAddress,
                userAgent:userAgent
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}