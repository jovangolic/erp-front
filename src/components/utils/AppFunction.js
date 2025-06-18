import axios from "axios";
import moment from "moment";

// Axios instanca sa baseURL iz .env fajla
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true // ako koristiš cookies za auth
});

// Helper za dohvat tokena
export const getToken = () => localStorage.getItem("token");

// Header za JSON zahteve
export const getHeader = () => {
    const token = getToken();
    if (!token) {
        throw new Error("Niste ulogovani. Molimo vas da se prijavite!");
    }
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

// Header za FormData zahteve (bez Content-Type)
export const getHeaderForFormData = () => {
    const token = getToken();
    if (!token) {
        throw new Error("Niste ulogovani. Molimo vas da se prijavite!");
    }
    return {
        Authorization: `Bearer ${token}`
    };
};

export const getDashboardData = async () => {
    const headers = getHeader();
    const res = await api.get("/dashboard", { headers });
    return res.data;
};

export async function sendEmail(emailRequest) {
    try{
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/email/send`,emailRequest,{
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        console.error("Error sending email. ",error);
        throw error;
    }
}

/*funkcija koja dobavlja jednog korisnika*/
export async function getUser(userId, token){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,{
            headers : getHeader()
        });
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function deleteUser(userId){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/users/delete/${userId}`,{
            headers : getHeader()
        })        
        return response.data;
    }
    catch(error){
        return error.message;
    }
}

/*funkicja za logovanje, kao parametar se prosledjuje login objekat */
export async function loginUser(identifier,password){
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
export async function registerUser(firstName,lastName,email,username,password,phoneNumber,address,roleIds){
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
export async function createUserByAdmin(firstName,lastName,email,username,password,phoneNumber,address,roleIds){
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

/* funckija za resetPasswordTest (za testiranje, privremeno)*/
export async function resetPasswordTest(email, newPassword) {
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

/*funkcija za getAllUsers*/
export async function getAllUsers() {
    try {
        const response = await api.get(`/users/get-all`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
}

/*funkcija za getUserByEmail */
export async function getUserByEmail(email) {
    try {
        const response = await api.get(`/users/email/${email}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}

/*funkcija za getUserByIdentifier*/
export async function getUserByIdentifier(identifier) {
    try {
        const response = await api.get(`/users/identifier/${identifier}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user by identifier:", error);
        throw error;
    }
}

export async function updateUser(userId, userUpdateData) {
    try {
        const response = await api.put(`/users/update/${userId}`, userUpdateData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export async function getUsersByRole(roleName) {
    try {
        const response = await api.get(`/users/role/${roleName}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users by role:", error);
        throw error;
    }
}

export async function getUserByUsername(username) {
    try {
        const response = await api.get(`/users/username/${username}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user by username:", error);
        throw error;
    }
}

/*funkcija za createSuperAdmin */
export async function createSuperAdmin(userRequest) {
    try {
        const response = await api.post(`/users/create-superadmin`, userRequest,{
            headers:getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error creating super admin:", error);
        throw error;
    }
}

/*funkcija za createAdmin */
export async function createAdmin(userRequest) {
    try {
        const response = await api.post(`/users/create-admin`, userRequest,{
            headers:getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error creating admin:", error);
        throw error;
    }
}


