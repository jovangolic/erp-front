import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function getDashboardData(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja podataka za dashboard");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}