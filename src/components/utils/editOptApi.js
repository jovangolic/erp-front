import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isEditOptTypeValid = ["NOTIFICATION_METHOD","REPORT_FORMAT","USER_PERMISSION","DASHBOARD_WIDGET"];
    
export async function createEditOpt({name,value,type,editable,visible}){
    try{
        if(
            !name || typeof name !=="string" || name.trim() === "" ||
            !value || typeof value !=="string" || value.trim() === "" ||
            !isEditOptTypeValid.includes(type?.toUpperCase()) ||
            typeof editable !=="boolean" || typeof visible !== "boolean"
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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

export async function updateEditOpt({id,name,value,type,editable,visible}){
    try{
        if(
            !id ||
            !name || typeof name !=="string" || name.trim() === "" ||
            !value || typeof value !=="string" || value.trim() === "" ||
            !isEditOptTypeValid.includes(type?.toUpperCase()) ||
            typeof editable !=="boolean" || typeof visible !== "boolean"
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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
        if(!id){
            throw new Error("Dati ID za editOpt nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati ID za editOpt nije pronadjen");
        }
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
        if(
            !isEditOptTypeValid.includes(type?.toUpperCase())
        ){
            throw new Error("Dati tip ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/by-type/${type}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po tipu");
    }
}

export async function findByName(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv za edit-opt nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.datal
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli edit-opt po nazivu");
    }
}

export async function findByValue(value){
    try{
        if(!value || typeof value !== "string" || value.trim() === ""){
            throw new Error("Data vrednost za edit-opt nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/edit-opt/by-value`,{
            params:{value:value},
            headers:getHeader()
        });
        return response.datal
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli edit-opt po vrednosti");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}