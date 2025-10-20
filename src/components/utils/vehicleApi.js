import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const validateStatus = ["AVAILABLE","IN_USE","UNDER_MAINTENANCE","OUT_OF_SERVICE","RESERVED"];
const isVehicleFuelValid = ["PETROL","DIESEL","ELECTRIC","CNG","LPG_PETROL","HYBRID_PETROL","HYBRID_DIESEL"];
const isVehicleTypeStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

const url = `${import.meta.env.VITE_API_BASE_URL}/vehicles`;

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createVehicle({registrationNumber,model,status,fuel,typeStatus,confirmed = false}){
    try{
        if(
            !registrationNumber || registrationNumber.trim() === "" || typeof registrationNumber !=="string" || 
            !model || model.trim() ===""|| typeof model !=="string" || typeof confirmed !== "boolean" ||
            !status || !validateStatus.includes(status?.toUpperCase()) ||
            !isVehicleFuelValid.includes(fuel?.toUpperCase()) ||
            !isVehicleTypeStatusValid.includes(typeStatus?.toUpperCase())){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {registrationNumber, model, status, fuel, typeStatus, confirmed};
        const response = await api.post(url+`/create/new-vehicle`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja vozila");
    }
}

export async function updateVehicle({id,registrationNumber,model,status}){
    try{
        if(
            id == null || Number.isNaN(Number(id)) ||
            !registrationNumber || registrationNumber.trim() === "" || typeof registrationNumber !=="string" || 
            !model || model.trim() ===""|| typeof model !=="string" || typeof confirmed !== "boolean" ||
            !status || !validateStatus.includes(status?.toUpperCase()) ||
            !isVehicleFuelValid.includes(fuel?.toUpperCase()) ||
            !isVehicleTypeStatusValid.includes(typeStatus?.toUpperCase())){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {registrationNumber, model, status, fuel, typeStatus, confirmed};
        const response = await api.put(url+`/update/${id}`,requestBody,{
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
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
        const response = await api.get(url+`/find-all-vehicles`,{
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
        const response = await api.get(url+`/find-by-model`,{
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
        const response = await api.get(url+`/by-registration-number`,{
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
        const response = await api.get(url+`/status`,{
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
        const response = await api.get(url+`/filter-by-model-and-status`,{
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
        const response = await api.get(url+`/search`,{
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
        const response = await api.get(url+`/filter`,{
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
        const response = await api.get(url+`/modelFragment`,{
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

