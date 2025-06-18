import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createVendor(name, email, phoneNumber, address) {
    try{
        if(!name || name.trim() ==="" || typeof name !== "string" ||
        !email || email.trim()==="" || typeof email !=="string" || 
        !phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim()==="" || 
        !address || address.trim() ==="" || typeof address !=="string"){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {name:name, email:email, phoneNumber:phoneNumber, address:address};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/vendors/create/new-vendor`, requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja prodavca: " + error.message);
        }
    }
}

export async function updateVendor(id, name, email,phoneNumber, address){
    try{
        if(
        !id || !name || name.trim() ==="" || typeof name !== "string" ||
        !email || email.trim()==="" || typeof email !=="string" || 
        !phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim()==="" || 
        !address || address.trim() ==="" || typeof address !=="string"){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {id:id, name:name, email:email, phoneNumber:phoneNumber, address:address};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/vendors/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranja prodavca: " + error.message);
        }
    }
}

export async function deleteVendor(id){
    try{
        if(!id){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/vendors/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getVendorByName(name){
    try{
        if(!name || name.trim() ==="" || typeof name !== "string"){
            throw new Error("Naziv prodavca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vendors/vendor/by-name`,{
            params:{
                name: name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po imenu");
    }
}

export async function getVendorByAddress(address){
    try{
        if(!address || address.trim() ==="" || typeof address !== "string"){
            throw new Error("Adresa nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vendors/vendor/by-address`,{
            params:{
                address : address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po adresi");
    }
}

export async function getVendorByEmail(email){
    try{
        if(!email || email.trim() ==="" || typeof email !== "string"){
            throw new Error("Email nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vendors/vendor/by-email`,{
            params:{
                email : email
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po email");
    }
}

export async function getById(id){
    try{
        if(!id){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vendors/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
    }
}

export async function getAllVendors(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/vendors/get-all-vendors`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}