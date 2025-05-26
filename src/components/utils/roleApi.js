import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createRole(name, users){
    try{
        const requestBody = {name, users};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/roles/create-new-role`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja role: ${error.message}`);
        }
    }
}

export async function updateRole(roleId, name, users){
    try{
        const requestBody = {name, users};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/roles/update/${roleId}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja role: ${error.message}`);
        }
    }
}

export async function deleteRole(roleId){
    try{    
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/roles/delete/${roleId}`,{
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getAllRoles(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/roles/get-all-roles`,{
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih uloga");
    }
}

export async function getRoleById(roleId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/roles/role/${roleId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jedne uloge");
    }
}

export async function assignUserToRole(roleId, userId){
    try{
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/roles/${roleId}/assign/${userId}`,null,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom promene dodeljivanja uloga");
    }
}














function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}