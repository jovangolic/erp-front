import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isSettingDataTypeValid = ["STRING","INTEGER","BOOLEAN","DOUBLE","DATE","TIME","DATETIME"];

export async function createSystemSetting(key,value,description,category,dataType,editable,isVisible,defaultValue){
    try{
        if(
            !key || typeof key !== "string" || key.trim() === "" ||
            !value || typeof value !== "string" || value.trim() === "" ||
            !description || typeof description !== "string" || description.trim() === "" ||
            !category || typeof category !== "string" || category.trim() === "" ||
            !isSettingDataTypeValid.includes(dataType?.toUpperCase()) ||
            typeof editable !=="boolean" || typeof isVisible !=="boolean" ||
            !defaultValue || typeof defaultValue !== "string" || defaultValue.trim() === "" 
        ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {key,value,description,category,dataType:dataType.toUpperCase(),editable,isVisible,defaultValue};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/settings/create-setting`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja system-settings: ${error.message}`);
        }
    }
}

export async function updateSystemSetting(id,value,description,category,dataType,editable,isVisible,defaultValue){
    try{
        if(
            !id ||
            !value || typeof value !== "string" || value.trim() === "" ||
            !description || typeof description !== "string" || description.trim() === "" ||
            !category || typeof category !== "string" || category.trim() === "" ||
            !isSettingDataTypeValid.includes(dataType?.toUpperCase()) ||
            typeof editable !=="boolean" || typeof isVisible !=="boolean" ||
            !defaultValue || typeof defaultValue !== "string" || defaultValue.trim() === "" 
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {id,value,description,category,dataType:dataType.toUpperCase(),editable,isVisible,defaultValue};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/settings/update`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja system-settings: ${error.message}`);
        }
    }
}

export async function getOneById(id){
    try{
        if(!id){
            throw new Error("Dati ID za systemSetting nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom jednog dobavljanja");
    }
}

export async function deleteSystemSetting(id){
    try{
        if(!id){
            throw new Error("Dati ID za systemSetting nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/settings/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getByKey(key){
    try{
        if(!key || typeof key !== "string" || key.trim() === ""){
            throw new Error("Dati kljuc nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/${key}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom dobavljanja ključa");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih kljuceva");
    }
}

export async function getByCategory(category){
    try{
        if(!category || typeof category !== "string" || category.trim() === ""){
            throw new Error("Data kategorija nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/settings/category/${category}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja prema kategoriji");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}