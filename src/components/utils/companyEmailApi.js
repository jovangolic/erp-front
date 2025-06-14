import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createCompanyEmail(firstName,lastName,address, phoneNumber, types){
    try{
        const requestBody = {firstName,lastName,address,phoneNumber,types: (types || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/create-company-email`,requestBody,{
            heander:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja ");
    }
}

export async function createAllCompanyEmails(firstName,lastName,address, phoneNumber, types){
    try{
        const requestBody = {firstName,lastName,address,phoneNumber,types: (types || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/create-company-emails`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom visestrukog kreiranja");
    }
}

export async function generateCompanyEmail(firstName, lastName){
    try{
        const requestBody = {firstName, lastName};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/generate-company-email`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom generisanja email-a");
    }
}

export async function getCompanyEmail(email){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/company-email/${email}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja jednog email-a");
    }
}

export async function getAllCompanyEmails(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/company-emails`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih email-ova");
    }
}

export async function deleteCompanyEmail(email){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/company-email/${email}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko brisanja email-a");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}