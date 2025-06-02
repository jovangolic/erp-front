import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function create(languageCodeType, languageNameType){
    try{
        const requestBody = {languageCodeType: (languageCodeType || "").toUpperCase(),languageNameType:(languageNameType || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/language/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function getALL(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/language/get-all`,{
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