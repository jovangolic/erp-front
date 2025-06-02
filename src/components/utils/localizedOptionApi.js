import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function create(optionId,languageId,localizedLabel){
    try{
        const requestBody = {optionId,languageId,localizedLabel};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/localizedOption`,requestBody,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption`,{
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