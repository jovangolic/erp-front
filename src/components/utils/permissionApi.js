import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isPermisionTypeValid = ["VIEW_INVENTORY","CREATE_ORDER","CREATE_STORAGE_EMPLOYEE","CREATE_STORAGE_MANAGER"];

export async function cratePermission(permissionType){
    try{
        if(
            !isPermisionTypeValid.includes(permissionType?.toUpperCase())
        ){
            throw new Error("Tip mora biti validan i popunjen");
        }
        const requestBody = {permissionType: (permissionType || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/permission/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih");
    }
}

export async function deletePermission(id){
    try{
        if(!id){
            throw new Error("Dati ID za permisson nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/permission/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function updatePermission(id, permissionType){
    try{
        if(
            !id ||
            !isPermisionTypeValid.includes(permissionType?.toUpperCase())
        ){
            throw new Error("Tip mora biti validan i popunjen");
        }
        const requestBody = {permissionType: (permissionType || "").toUpperCase()};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/permission/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Gresja prilikom azuriranja");
    }
}

export async function getPermissionById(id){
    try{
        if(!id){
            throw new Error("Dati ID za permision nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/get/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}