import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

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

export async function updateState(maintenanceMode,registrationEnabled, systemVersion, statusMessage){
    try{
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

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}