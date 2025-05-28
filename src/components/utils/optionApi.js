import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createOption(label,value,category,active){
    try{
        const requestBody = {label,value,category: (category || "").toUpperCase(),active};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/option/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja option: ${error.message}`);
        }
    }
}

export async function updateOption(id,label,value,category,active){
    try{
        const requestBody = {label,value,category: (category || "").toUpperCase(),active};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/option/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja option: ${error.message}`);
        }
    }
}

export async function deleteOption(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/option/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/option/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih");
    }
}

export async function getByCategory(category){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/option/category/${category}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po kategoriji");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}