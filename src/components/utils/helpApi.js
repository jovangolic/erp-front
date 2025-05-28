import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createHelp(title,content,category,isVisible){
    try{
        const requestBody = {title,content,category: (category || "").toUpperCase(),isVisible};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/help/create/`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja help: ${error.message}`);
        }
    }
}

export async function updateHelp(id,title,content,category,isVisible){
    try{
        const requestBody = {title,content,category: (category || "").toUpperCase(),isVisible};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/help/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja help: ${error.message}`);
        }
    }
}

export async function deleteHelp(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/help/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getById(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog");
    }
}

export async function getAllHelp(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/get-all-help`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getVisible(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/visible`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom dobavljanja vidljivih helpova");
    }
}

export async function getByCategory(category){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/category/${category}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kategoriji");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}