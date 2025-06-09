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

export async function getTranslationsForOption(optionId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/option/${optionId}/translations`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prevodjenja");
    }
}

export async function addTranslationForOption(optionId, { languageId, localizedLabel }) {
    try {
        const requestBody = {
            languageId,
            localizedLabel
            // optionId NE IDE u body jer se nalazi u URL-u
        };

        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/localizedOption/option/${optionId}/translations`,
            requestBody,
            {
                headers: getHeader()
            }
        );

        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom dodavanja prevoda");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}