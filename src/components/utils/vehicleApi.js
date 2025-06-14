import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createVehicle(registrationNumber,model,status){
    try{
        const requestBody = {registrationNumber, model, status:(status || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/vehicles/create/new-vehicle`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja vozila");
    }
}

export async function updateVehicle(id,registrationNumber,model,status){
    try{
        const requestBody = {registrationNumber, model, status:(status || "").toUpperCase()};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/vehicles/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azururanja");
    }
}

export async function deleteVehicle(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/vehicles/delete/${id}`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom jednog dobavljanja");
    }
}

export async function findAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/find-all-vehicles`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function findByModel(model){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/find-by-model`,{
            params:{
                model:model
            },
            heeaders:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska priliko dobavljanja po modelu");
    }
}

export async function findByRegistrationNumber(registrationNumber){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/by-registration-number`,{
            params:{
                registrationNumber:registrationNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema registracionoj tablici");
    }
}

export async function findByStatus(status){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po statusu vozila");
    }
}

export async function findByModelAndStatus(model, status){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/filter-by-model-and-status`,{
            params:{
                model:model,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema modelu i status vozila");
    }
}

export async function search(key){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/search`,{
            params:{
                key:key
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska plikom pretrage prema kljucnoj reci");
    }
}

export async function filterVehicles(model, status){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/filter`,{
            params:{
                model:model,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom filtracije vozila");
    }
}

export async function findByModelContainingIgnoreCase(modelFragment){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/modelFragment`,{
            params:{
                modelFragment:modelFragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema pretrazi po model-fragmentu");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}