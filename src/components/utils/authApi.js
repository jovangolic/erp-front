import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

/*funkicja za logovanje, kao parametar se prosledjuje login objekat */
export async function loginUser({identifier,password}){
    try{
        if(!identifier || typeof identifier !== "string" || identifier.trim() === "" ||
            !password || typeof password !== "string"  || password.trim() === ""){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {identifier, password}
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login` , requestBody,{
            headers:getHeader()
        });
        if(response.status >= 200 && response.status < 300){
            return response.data
        }
        else{
            return null;
        }
    }
    catch(error){
        console.error(error);
        return null;
    }
}

/*Za rucnu registraciju korisnika tacnije da se korisnik sam registruje */
export async function registerUser({firstName,lastName,email,username,password,phoneNumber,address,roleIds}){
    try{
        if(
            !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === "" ||
            !username || typeof username !== "string" || username.trim() === "" ||
            !password || typeof password !== "string" || password.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !(roleIds instanceof Set) || roleIds.size === 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {firstName,lastName,email,username,password,phoneNumber,address,roleIds};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register-user`, requestBody,{
            headers:getHeader()
        });
        return response.data
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`User registration error : ${error.message}`);
        }
    }
}

/*Funkcija za kreiranje zaposlenog od strane admina */
export async function createUserByAdmin({firstName,lastName,email,username,password,phoneNumber,address,roleIds}){
    try{
        if(
            !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === "" ||
            !username || typeof username !== "string" || username.trim() === "" ||
            !password || typeof password !== "string" || password.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !(roleIds instanceof Set) || roleIds.size === 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {firstName,lastName,email,username,password,phoneNumber,address,roleIds};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/create-user`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`User registration error : ${error.message}`);
        }
    }
}

/* funckija za resetPasswordTest (za testiranje, privremeno)*/
export async function resetPasswordTest({email, newPassword}) {
    try {
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password-test`, null, {
            params: { email, newPassword },
            headers: getHeader()
        });
        return response.data;
    } 
    catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
}

/*Funkcija za refresh token */
export async function refreshToken(refreshToken) {
    try {
        if (typeof refreshToken !== "string" || refreshToken.trim().length < 20) {
            throw new Error("Token nije validan.");
        }
        const response = await api.post(`/auth/refresh`, { refreshToken },{
            headers:getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}