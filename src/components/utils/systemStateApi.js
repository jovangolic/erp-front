import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const isSystemStatusValid = ["RUNNING","MAINTENANCE","OFFLINE","RESTARTING"];
const url = `${import.meta.env.VITE_API_BASE_URL}/system-states`;

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
        const response = await api.put(url,requestBody,{
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja stanja");
    }
}

export async function getOneById(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati id "+id+" za system-state, nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog system-state po "+id+" id-iju");
    }
}

export async function getAllSystemStates(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getCurrentState()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih system-state");
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
            throw new Error("Dati status "+statusMessage+" poruke nije pronadjen");
        }
        const response = await api.get(url+`/search/by-status-message`,{
            params:{statusMessage:statusMessage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+statusMessage+" poruke");
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
            throw new Error("Data statusna "+statusMessage+" poruka nije pronadjena");
        }
        const response = await api.get(url+`/search/exists-status-message`,{
            params:{statusMessage:statusMessage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje statusne "+statusMessage+" poruke");
    }
}

export async function countByStatusMessage(statusMessage){
    try{
        if(!statusMessage || typeof statusMessage !== "string" || statusMessage.trim() === ""){
            throw new Error("Dati broj statusnih "+statusMessage+" poruka nije pronadjeno");
        }
        const response = await api.get(url+`/search/count-status-message`,{
            params:{statusMessage:statusMessage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj "+statusMessage+" statusnih poruka");
    }
}

export async function findBySystemVersion(systemVersion){
    try{
        if(!systemVersion || typeof systemVersion !== "string" || systemVersion.trim() === ""){
            throw new Error("Data verzija "+systemVersion+" sustema nije pronadjena");
        }
        const response = await api.get(url+`/search/by-system-version`,{
            params:{systemVersion:systemVersion},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli verziju "+systemVersion+" datog sistema");
    }
}

export async function findByLastRestartTime(lastRestartTime){
    try{
        const validateDate = moment.isMoment(lastRestartTime) || moment(lastRestartTime,"YYYY-MM-DD-THH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati posledji "+validateDate+" restart nije pronadjen");
        }
        const response = await api.get(url+`/search/last-restart-time`,{
            params:{
                lastRestartTime:moment(validateDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme "+lastRestartTime+" kada je poslednji put uradjen restart");
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
            throw new Error("Dati status "+statusMessage+" poruke i verzija "+systemVersion+" sistema nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli status "+statusMessage+" poruke i verziju "+systemVersion+" sistema");
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
            throw new Error("Dato postojanje statusne "+statusMessage+" poruke i verzije "+systemVersion+" sistema nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli postojanje statusne poruke "+statusMessage+" i verzije "+systemVersion+" sistema");
    }
}

export async function findByLastRestartTimeAfter(time){
    try{
        const validateDate = moment.isMoment(time) || moment(time,"YYYY-MM-DD-THH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dato vreme posle "+validateDate+" nije pronadjeno");
        }
        const response = await api.get(url+`/search/last-restart-time-after`,{
            params:{
                time:moment(validateDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme posle "+time+" poslednjeg restart");
    }
}

export async function findByLastRestartTimeBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD-THH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(e,"YYYY-MM-DD-THH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dato vreme "+validateDateStart+" - "+validateDateEnd+" opesage poslednjeg restarta nije pronadjeno");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za krja ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/last-restart-time-between`,{
            params:{
                start:moment(validateDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(validateDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme "+start+" - "+end+" opsega poslednjeg restart");
    }
}

