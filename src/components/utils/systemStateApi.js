import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isSystemStatusValid = ["RUNNING","MAINTENANCE","OFFLINE","RESTARTING"];
const url = '${import.meta.env.VITE_API_BASE_URL}/system-states';

export async function getCurrentState(){
    try{
        const response = await api.get(url+`/current-state`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja trenutnog stanja");
    }
}

export async function updateState({maintenanceMode,registrationEnabled, systemVersion, statusMessage}){
    try{
        if(
            typeof maintenanceMode !=="boolean" || typeof registrationEnabled !== "boolean" ||
            !systemVersion || typeof systemVersion !== "string" || systemVersion.trim() === "" ||
            !isSystemStatusValid.includes(statusMessage?.toUpperCase())
        ){
            throw new Error("Sva polj amoraju biti validna i popunnjena");
        }
            const requestBody = {
            maintenanceMode: maintenanceMode ?? false,
            registrationEnabled: registrationEnabled ?? false,
            systemVersion,
            statusMessage: (statusMessage || "").toUpperCase()
            };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/system-states`,requestBody,{
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja stanja");
    }
}

export async function restartSystem(){
    try{
        const response = await api.put(url+`/restart`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom resetovanja sistema");
    }
}

export async function toggleMaintenanceMode(enabled) {
    try {
        if(typeof enabled !== "boolean"){
            throw new Error("Greska u odobrenoj odrzavanju");
        }
        const response = await api.put(
            url+`/maintenance-mode?enabled=${enabled}`,
            null, // jer PUT ne koristi telo već query parametar
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom promene maintenance režima");
    }
}

export async function toggleRegistrationEnabled(enabled) {
    try {
        if(typeof enabled !== "boolean"){
            throw new Error("Greska u odobrenoj registraziji");
        }
        const response = await api.put(
            url+`/registration-enabled?enabled=${enabled}`,
            null,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom promene podešavanja registracije");
    }
}

export async function findByStatusMessage(statusMessage){
    try{
        if(!statusMessage || typeof statusMessage !== "string" || statusMessage.trim() === ""){
            throw new Error("Dati status poruke nije pronadjen");
        }
        const response = await api.get(url+`/search/by-status-message`,{
            params:{statusMessage:statusMessage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status poruke");
    }
}

export async function findRunning(){
    try{
        const response = await api.get(url+`/search/by-status-running`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za sistem koji je 'Running'");
    }
}

export async function findMaintenance(){
    try{
        const response = await api.get(url+`/search/by-status-maintenance`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za sistem koji je 'Maintenance'");
    }
}

export async function findOffline(){
    try{
        const response = await api.get(url+`/search/by-status-offline`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za sistem koji je 'Offline'");
    }
}

export async function findRestarting(){
    try{
        const response = await api.get(url+`/search/by-status-restarting`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za sistem koji je 'Restarting'");
    }
}

export async function existsByStatusMessage(statusMessage){
    try{
        if(!statusMessage || typeof statusMessage !== "string" || statusMessage.trim() === ""){
            throw new Error("Data statusna poruka nije pronadjena");
        }
        const response = await api.get(url+`/search/exists-status-message`,{
            params:{statusMessage:statusMessage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje statusne poruke");
    }
}

export async function countByStatusMessage(statusMessage){
    try{
        if(!statusMessage || typeof statusMessage !== "string" || statusMessage.trim() === ""){
            throw new Error("Dati broj statusnih poruka nije pronadjeno");
        }
        const response = await api.get(url+`/search/count-status-message`,{
            params:{statusMessage:statusMessage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj statusnih poruka");
    }
}

export async function findBySystemVersion(systemVersion){
    try{
        if(!systemVersion || typeof systemVersion !== "string" || systemVersion.trim() === ""){
            throw new Error("Data verzija sustema nije pronadjena");
        }
        const response = await api.get(url+`/search/by-system-version`,{
            params:{systemVersion:systemVersion},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli verziju datog sistema");
    }
}

export async function findByLastRestartTime(lastRestartTime){
    try{
        if(!moment(lastRestartTime,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati posledji restart nije pronadjen");
        }
        const response = await api.get(url+`/search/last-restart-time`,{
            params:{
                lastRestartTime:moment(lastRestartTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme kada je poslednji put uradjen restart");
    }
}

export async function existsByMaintenanceMode(){
    try{
        const response = await api.get(url+`/search/exists-by-maintenance-mode`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje maintenanceMode-a");
    }
}

export async function existsByRegistrationEnabled(){
    try{
        const response = await api.get(url+`/search/exists-by-registration-enabled`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje registrationEnabled-a");
    }
}

export async function findByStatusMessageAndSystemVersion({statusMessage, systemVersion}){
    try{
        if(!statusMessage || typeof statusMessage !== "string" || statusMessage.trim() === "" ||
            !systemVersion || typeof systemVersion !== "string" || systemVersion.trim() === ""){
            throw new Error("Dati status poruke i verzija sistema nije pronadjena");
        }
        const response = await api.get(url+`/search/status-message-and-system-version`,{
            params:{
                statusMessage:statusMessage,
                systemVersion:systemVersion
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status poruke i verziju sistema");
    }
}

export async function findByRegistrationEnabledTrueAndMaintenanceModeFalse(){
    try{
        const response = await api.get(url+`/search/registration-enabled-and-maintenance-mode`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli registrationEnabled da je tacno i maintenanceMode da je netacno");
    }
}

export async function findTopByOrderByLastRestartTimeDesc(){
    try{
        const response = await api.get(url+`/search/last-restart-time-desc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli poredak po opadajucem redu za lastRestartTime");
    }
}

export async function countByMaintenanceModeTrue(){
    try{
        const response = await api.get(url+`/count/maintenance-true`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj za maintenanceMode gde je true/tacno");
    }
}

export async function countByRegistrationEnabledTrue(){
    try{
        const response = await api.get(url+`/count/registration-enabled-true`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj za registrationEnabled gde je true/tacno");
    }
}

export async function existsByStatusMessageAndSystemVersion({statusMessage, systemVersion}){
    try{
        if(
            !statusMessage || typeof statusMessage !== "string" || statusMessage.trim() === "" ||
            !systemVersion || typeof systemVersion !== "string" || systemVersion.trim() === ""
        ){
            throw new Error("Dato postojanje statusne poruke i verzije sistema nisu pronadjeni");
        }
        const response = await api.get(url+`/search/exists-status-message-and-system-version`,{
            params:{
                statusMessage:statusMessage,
                systemVersion:systemVersion
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje statusne poruke i verzije sistema");
    }
}

export async function findByLastRestartTimeAfter(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme nije pronadjeno");
        }
        const response = await api.get(url+`/search/last-restart-time-after`,{
            params:{
                time:moment(time).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme posle poslednjeg restart");
    }
}

export async function findByLastRestartTimeBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme opesage poslednjeg restarta nije pronadjeno");
        }
        const response = await api.get(url+`/search/last-restart-time-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYU-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme opsega poslednjeg restart");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}