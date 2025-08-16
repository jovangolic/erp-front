import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const validateStatus = ["AVAILABLE","IN_USE","UNDER_MAINTENANCE","OUT_OF_SERVICE","RESERVED"];

export async function createVehicle({registrationNumber,model,status}){
    if(!registrationNumber || registrationNumber.trim() === "" || typeof registrationNumber !=="string" || 
    !model || model.trim() ===""|| typeof model !=="string" || 
    !status || !validateStatus.includes(status?.toUpperCase())){
        throw new Error("Sva polja moraju biti popunjena");
    }
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

export async function updateVehicle({id,registrationNumber,model,status}){
    if(
    id == null || isNaN(id) ||    
    !registrationNumber || registrationNumber.trim() === "" || typeof registrationNumber !=="string" || 
    !model || model.trim() ===""|| typeof model !=="string" || 
    !status || !validateStatus.includes(status?.toUpperCase())){
        throw new Error("Sva polja moraju biti popunjena");
    }
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom jednog dobavljanja vozila po "+id+" id-iju");
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
        if(!model || model.trim() ===""|| typeof model !=="string"){
            throw new Error("Dati model "+model+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/find-by-model`,{
            params:{
                model:model
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska priliko dobavljanja po modelu "+model+" vozila");
    }
}

export async function findByRegistrationNumber(registrationNumber){
    try{
        if(!registrationNumber || registrationNumber.trim() ===""|| typeof registrationNumber !=="string"){
            throw new Error("Dati broj registracije "+registrationNumber+" vozila, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/by-registration-number`,{
            params:{
                registrationNumber:registrationNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema registracionoj tablici "+registrationNumber+" vozila");
    }
}

export async function findByStatus(status){
    try{
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" vozila nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po statusu "+status+" vozila");
    }
}

export async function findByModelAndStatus({model, status}){
    try{
        if(!model || model.trim() ===""|| typeof model !=="string" || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("Model "+model+" i status "+status+" vozila nisu pronadjeni");
        }
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
        handleApiError(error, "Greska prilikom trazenja prema modelu "+model+" i statusu "+status+" vozila");
    }
}

export async function search(key){
    try{
        if(!key || key.trim()==="" || typeof key !=="string"){
            throw new Error("Pretraga po odredjenom kljucu "+key+" nije dala rezultat");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/search`,{
            params:{
                key:key
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska plikom pretrage prema kljucnoj "+key+" reci");
    }
}

export async function filterVehicles({model, status}){
    try{
        if(!model || model.trim() ===""|| typeof model !=="string" || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("Model "+model+" i status "+status+" vozila nisu pronadjeni");
        }
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
        handleApiError(error, "Greska prilikom filtracije vozila po modelu "+model+" i statusu "+status);
    }
}

export async function findByModelContainingIgnoreCase(modelFragment){
    try{
        if(!modelFragment || modelFragment.trim()==="" || typeof modelFragment !=="string"){
            throw new Error("Pretraga po fragmentu "+modelFragment+" modela nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/modelFragment`,{
            params:{
                modelFragment:modelFragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema pretrazi po model-fragmentu "+modelFragment+" vozila ");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}