import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createSystemSetting(key,value,description,category,dataType,editable,isVisible,defaultValue){
    try{
        const requestBody = {key,value,description,category,dataType:dataType.toUpperCase(),editable,isVisible,defaultValue};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/settings/create-setting`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja system-settings: ${error.message}`);
        }
    }
}

export async function updateSystemSetting(id,value,description,category,dataType,editable,isVisible,defaultValue){
    try{
        const requestBody = {id,value,description,category,dataType:dataType.toUpperCase(),editable,isVisible,defaultValue};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/settings/update`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja system-settings: ${error.message}`);
        }
    }
}


export async function deleteSystemSetting(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/settings/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getByKey(key){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/${key}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom dobavljanja ključa");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih kljuceva");
    }
}

export async function getByCategory(category){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/category/${category}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja prema kategoriji");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}