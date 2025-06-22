import { api, getHeader } from "./AppFunction";

export async function getByName(name) {
    try {
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Pretraga po nazivu je nepoznata");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/securitySettings/${name}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom dobavljanja po nazivu");
    }
}

export async function updateSetting({id, settingName, value}) {
    try {
        const requestBody = { id, settingName, value };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/securitySettings`, requestBody, {
            headers: getHeader()
        });
        return response.data; // Očekujemo SecuritySettingResponse: { id, settingName, value }
    } catch (error) {
        handleApiError(error, "Greška prilikom ažuriranja");
    }
}

export async function getAllSettings() {
    try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/securitySettings`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom dobavljanja svih podešavanja");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(`${customMessage}: ${error.response.data}`);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

