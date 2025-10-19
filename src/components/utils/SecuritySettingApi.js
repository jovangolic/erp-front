import { api, getHeader } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/securitySettings`;

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(`${customMessage}: ${error.response.data}`);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function getByName(name) {
    try {
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Pretraga po nazivu "+name+" je nepoznata");
        }
        const response = await api.get(url+`/${name}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greska prilikom dobavljanja po nazivu "+name);
    }
}

export async function updateSetting({id, settingName, value}) {
    try {
        if(id == null || Number.isNaN(Number(id)) || !settingName?.trim() || !value?.trim()){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = { id, settingName, value };
        const response = await api.put(url+`/update/${id}`, requestBody, {
            headers: getHeader()
        });
        return response.data; // Očekujemo SecuritySettingResponse: { id, settingName, value }
    } catch (error) {
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function getAllSettings() {
    try {
        const response = await api.get(url+`/get-all`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greska prilikom dobavljanja svih podesavanja");
    }
}

export async function saveSecuritySettings({settingName,value}){
    try{
        if(!settingName || typeof settingName !== "string" || settingName.trim() === "" ||
           !value || typeof value !=="string" || value.trim() === ""){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {settingName,value};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}



