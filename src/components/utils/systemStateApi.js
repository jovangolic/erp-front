import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isSystemStatusValid = ["RUNNING","MAINTENANCE","OFFLINE","RESTARTING"];

export async function getCurrentState(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/system-states/current-state`,{
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
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/system-states/restart`,{
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
            `${import.meta.env.VITE_API_BASE_URL}/system-states/maintenance-mode?enabled=${enabled}`,
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
            `${import.meta.env.VITE_API_BASE_URL}/system-states/registration-enabled?enabled=${enabled}`,
            null,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom promene podešavanja registracije");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}