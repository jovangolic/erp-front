import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
export async function createFileOpt(extension,mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions){
    try{
        const requestBody = {extension: (extension || "").toUpperCase(),mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/file-opt/create/`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja fileOpt: ${error.message}`);
        }
    }
}

export async function updateFileOpt(id,extension,mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions){
    try{
        const requestBody = {extension: (extension || "").toUpperCase(),mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/file-opt/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja fileOpt: ${error.message}`);
        }
    }
}

export async function deleteFileOpt(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/file-opt/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja")
    }
}

export async function getAllFileOpts(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getFileOptById(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
    }
}

export async function getByExtension(extension){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/by-extension/${extension}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja prema ekstenziji");
    }
}

export async function getByAction(action){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/by-availableActions/${action}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja prema akciji");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}