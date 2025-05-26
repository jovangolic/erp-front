import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createSuperAdmin(firstName,lastName,email,username,password,phoneNumber, address,roleIds){
    try{
        const requestBody = {firstName,lastName,email,username,password,phoneNumber,address,roleIds};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/users/create-superadmin`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja naloga za super-admina: ${error.message}`);
        }
    }
}

export async function createUserByAdmin(firstName,lastName,email,username,password,phoneNumber, address,roleIds){
    try{
        const requestBody = {firstName,lastName,email,username,password,phoneNumber,address,roleIds};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/users/admin/create-user`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja zaposlenog od strane admina: ${error.message}`);
        }
    }
}

export async function getAllUsers(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih zaposlenih");
    }
}

export async function createAdmin(firstName,lastName,email,username,password,phoneNumber, address,roleIds){
    try{
        const requestBody = {firstName,lastName,email,username,password,phoneNumber,address,roleIds};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/users/create-admin`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
      if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja admina: ${error.message}`);
        }  
    }
}

export async function deleteUser(userId){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/users/delete/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja zaposlenog");
    }
}

export async function getUserByEmail(email){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/email/${email}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja zaposlenog preko mejla");
    }
}

export async function getUserByIdentifier(identifier){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/identifier/${identifier}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja zaposlenog preko identifier-a");
    }
}

export async function getUserById(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja zaposlenog preko id");
    }
}

export async function updateUser(id,firstName,lastName,email,username,password,phoneNumber, address,roleIds ){
    try{
        const requestBody = {firstName,lastName,email,username,password,phoneNumber, address,roleIds};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/users/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja zaposlenog: ${error.message}`);
        }
    }
}

export async function getUsersByRole(roleName){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/role/${roleName}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage zaposlenog prema ulozi/roli");
    }
}

export async function getUserByUsername(username){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/username/${username}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage zaposlenog prema korisnickom-imenu");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}