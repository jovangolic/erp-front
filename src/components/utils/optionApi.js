import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isOptionCategoryValid = ["GENDER","ROLE","STATUS","LANGUAGE","THEME"]; 

export async function createOption({label,value,category,active}){
    try{
        if(
            !label || typeof label !=="string" || label.trim()==="" ||
            !value || typeof value !=="string" || value.trim()==="" ||
            !isOptionCategoryValid.includes(category?.toUpperCase()) ||
            typeof active !=="boolean"
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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

export async function updateOption({id,label,value,category,active}){
    try{
        if(
            id == null || Number.isNaN(Number(id)) ||
            !label || typeof label !=="string" || label.trim()==="" ||
            !value || typeof value !=="string" || value.trim()==="" ||
            !isOptionCategoryValid.includes(category?.toUpperCase()) ||
            typeof active !=="boolean"
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za option nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/option/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOne(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/option/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobaljvanja jednog option-a po "+id+" id-iju");
    }
}

export async function getAllOptions(){
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
        if(!isOptionCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data kategorija "+category+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/option/category/${category}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po kategorij "+category);
    }
}

export async function findByCategoryAndActiveTrue(category){
    try{
        if(!isOptionCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data kategorija "+category+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/option/category-is-active`,{
            params:{category:(category || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kategoriji "+category+" i aktivnosti");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}