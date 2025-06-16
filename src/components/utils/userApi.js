import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createSuperAdmin(
  firstName, lastName, email, username, password, phoneNumber, address, roleIds
) {
  try {
    // VALIDACIJA
    if (
      !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
      !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
      !email || typeof email !== "string" || email.trim() === "" ||
      !username || typeof username !== "string" || username.trim() === "" ||
      !password || typeof password !== "string" || password.trim() === "" || password.length < 6 ||
      !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
      !address || typeof address !== "string" || address.trim() === "" ||
      !(roleIds instanceof Set) || roleIds.size === 0
    ) {
      throw new Error("Sva polja moraju biti popunjena i validna.");
    }
    // Pretvaranje seta u niz, ako backend očekuje listu (što verovatno jeste slučaj)
    const roleIdsArray = Array.from(roleIds);
    const requestBody = {
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
      address,
      roleIds: roleIdsArray
    };
    const response = await api.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/create-superadmin`,
      requestBody,
      { headers: getHeader() }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Greška prilikom kreiranja naloga za super-admina: ${error.message}`);
    }
  }
}

export async function createUserByAdmin(firstName,lastName,email,username,password,phoneNumber, address,roleIds){
    try{
        if (
      !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
      !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
      !email || typeof email !== "string" || email.trim() === "" ||
      !username || typeof username !== "string" || username.trim() === "" ||
      !password || typeof password !== "string" || password.trim() === "" || password.length < 6 ||
      !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
      !address || typeof address !== "string" || address.trim() === "" ||
      !(roleIds instanceof Set) || roleIds.size === 0
    ) {
      throw new Error("Sva polja moraju biti popunjena i validna.");
    }
    // Pretvaranje seta u niz, ako backend očekuje listu (što verovatno jeste slučaj)
    const roleIdsArray = Array.from(roleIds);
    const requestBody = {
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
      address,
      roleIds: roleIdsArray
    };
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
        if (
      !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
      !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
      !email || typeof email !== "string" || email.trim() === "" ||
      !username || typeof username !== "string" || username.trim() === "" ||
      !password || typeof password !== "string" || password.trim() === "" || password.length < 6 ||
      !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
      !address || typeof address !== "string" || address.trim() === "" ||
      !(roleIds instanceof Set) || roleIds.size === 0
    ) {
      throw new Error("Sva polja moraju biti popunjena i validna.");
    }
    // Pretvaranje seta u niz, ako backend očekuje listu (što verovatno jeste slučaj)
    const roleIdsArray = Array.from(roleIds);
    const requestBody = {
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
      address,
      roleIds: roleIdsArray
    };
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
        if(!userId){
            throw new Error("Dati userId nij pronadjen");
        }
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
        if(!email || typeof email !=="string" || email.trim()===""){
            throw new Error("Dati email nije pronadjen");
        }
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
        if(!identifier || typeof identifier !=="string" || identifier.trim()===""){
            throw new Error("Dati identifier nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
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
        if (
      !id ||      
      !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
      !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
      !email || typeof email !== "string" || email.trim() === "" ||
      !username || typeof username !== "string" || username.trim() === "" ||
      !password || typeof password !== "string" || password.trim() === "" || password.length < 6 ||
      !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
      !address || typeof address !== "string" || address.trim() === "" ||
      !(roleIds instanceof Set) || roleIds.size === 0
    ) {
      throw new Error("Sva polja moraju biti popunjena i validna.");
    }
    // Pretvaranje seta u niz, ako backend očekuje listu (što verovatno jeste slučaj)
    const roleIdsArray = Array.from(roleIds);
    const requestBody = {
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
      address,
      roleIds: roleIdsArray
    };
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
        if(!username || typeof username !=="string" || username.trim()===""){
            throw new Error("username mora biti popunjeno");
        }
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