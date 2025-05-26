import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function sendEmail(to, subject, text){
    try{
        const requestBody = {to, subject, text};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/email/send`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom slanja email-a : ${error.message}`);
        }
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}