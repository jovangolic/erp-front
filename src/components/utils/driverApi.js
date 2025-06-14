import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = '${import.meta.env.VITE_API_BASE_URL}/drivers';

export async function createDriver(name, phone){
    try{
        const requestBody = {name, phone};
        const response = await api.post(url+`/create/new-driver`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska priliko kreiranja vozaca");
    }
}

export async function updateDriver(id, name, phone){
    try{
        const requestBody = {name, phone};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteDriver(id){
    try{
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOneById(id){
    try{
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greksa prilikom dobavljanja jednog vozaca");
    }
}

export async function findAllDrivers(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih vozaca");
    }
}

export async function findByName(name){
    try{
        const response = await api.get(url+`/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja vozaca po imenu");
    }
}

export async function findByPhone(phone){
    try{
        const response = await api.get(url+`/by-phone`,{
            params:{
                phone:phone
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po broju telefona vozaca");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}