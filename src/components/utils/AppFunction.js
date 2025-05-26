import axios from "axios";
import moment from "moment";

// Axios instanca sa baseURL iz .env fajla
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true // ako koristiš cookies za auth
});

// Helper za dohvat tokena
const getToken = () => localStorage.getItem("token");

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
export async function loginUser(login){
    try{
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login` , login);
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
export async function registerUser(registration){
    try{
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register-user`, registration);
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
export async function createUserByAdmin(registration){
    try{
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/create-user`,registration);
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




