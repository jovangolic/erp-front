import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function revokeToken(id){
    try{
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/tokens/revoke/${id}`,
            {}, // prazan body
            {
                headers: getHeader()
            }
        );
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom povlacenja tokena");
    }
}

export async function refreshToken(refreshToken){
    try{
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/tokens/refresh`,
            {}, // prazan body
            {
                params: { refreshToken },
                headers: getHeader()
            }
        );
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom osvezavanja tokena");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}