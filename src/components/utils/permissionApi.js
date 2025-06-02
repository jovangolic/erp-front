import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function cratePermission(permissionType){
    try{
        const requestBody = {permissionType: (permissionType || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/permission/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}