import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const url = `${import.meta.env.VITE_API_BASE_URL}/roles`;
const isRoleTypeValid = ["SUPER_ADMIN", "ADMIN", "STORAGE_FOREMAN", "STORAGE_EMPLOYEE", "STORAGE_MANAGER"];

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createRole({name, users, roleTypes, permissionIds}){
    try{
        if(!name || typeof name !== "string" || name.trim() ==="" ||
            !Array.isArray(users) || users.length === 0 ||
            !isRoleTypeValid.includes(roleTypes?.toUpperCase()) ||
            !(permissionIds instanceof Set) || permissionIds.size === 0){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {name, users,roleTypes, permissionIds};
        const response = await api.post(url+`/create-new-role`,requestBody,{
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

export async function updateRole({roleId, name, users, roleTypes, permissionIds}){
    try{
        if(
            roleId == null || Number.isNaN(Number(roleId)) ||
            !name || typeof name !== "string" || name.trim() ==="" ||
            !Array.isArray(users) || users.length === 0 ||
            !isRoleTypeValid.includes(roleTypes?.toUpperCase()) ||
            !(permissionIds instanceof Set) || permissionIds.size === 0){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {name, users,roleTypes, permissionIds};
        const response = await api.put(url+`/update/${roleId}`,requestBody,{
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
        if(roleId == null || Number.isNaN(Number(roleId))){
            throw new Error("Dati ID za role nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${roleId}`,{
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getAllRoles(){
    try{
        const response = await api.get(url+`/get-all-roles`,{
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih uloga");
    }
}

export async function getRoleById(roleId){
    try{
        if(roleId == null || Number.isNaN(Number(roleId))){
            throw new Error("Dati ID za role nije pronadjen");
        }
        const response = await api.get(url+`/role/${roleId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jedne uloge");
    }
}

export async function assignUserToRole({roleId, userId}){
    try{
        if(roleId == null || Number.isNaN(Number(roleId)) || userId == null || Number.isNaN(Number(userId))){
            throw new Error("Dati roleId i userId nisu pronadjeni");
        }
        const response = await api.post(url+`/${roleId}/assign/${userId}`,null,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom promene dodeljivanja uloga");
    }
}

