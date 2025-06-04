import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createEditOpt(name,value,type,editable,visible){
    try{
        const requestBody = {name,value,type: (type || "").toUpperCase(),editable,visible};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja editOpt: ${error.message}`);
        }
    }
}

export async function updateEditOpt(id,name,value,type,editable,visible){
    try{
        const requestBody = {name,value,type: (type || "").toUpperCase(),editable,visible};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja editOpt: ${error.message}`);
        }
    }
}

export async function deleteEditOpt(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/delete/${id}`,{

            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function getById(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja jednog");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getByType(type){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/by-type/${type}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po tipu");
    }
}




function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}