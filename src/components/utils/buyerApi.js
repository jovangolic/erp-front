import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createBuyer(companyName,pib, address,contactPerson, email, phoneNumber){
    try{
        if(
            !companyName || typeof companyName !=="string" || companyName.trim() === "" ||
            !pib || typeof pib !== "string" || pib.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {companyName,pib, address, contactPerson, email, phoneNumber};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/buyers/create/new-buyer`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function updateBuyer(pib, companyName, address, contactPerson, email, phoneNumber) {
    try {
        if(
            !companyName || typeof companyName !=="string" || companyName.trim() === "" ||
            !pib || typeof pib !== "string" || pib.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = { companyName, address, contactPerson, email, phoneNumber };
        const response = await api.put(
            `${import.meta.env.VITE_API_BASE_URL}/buyers/update/${pib}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(`Greška prilikom ažuriranja kupca: ${error.message}`);
        }
    }
}

export async function deleteBuyer(id){
    try{
        if(!id){
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/buyers/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska pilikom brisanja");
    }
}

export async function getBuyerById(id) {
    try{
        if(!id){
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/buyer/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog kupca po id");
    }
}

export async function getAllBuyers(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih kupaca");
    }
}

export async function existsByPib(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("PIB je nevalidan ili prazan");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/exists-by-pib`,{
            params:{
                pib
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom provere postojanja datog PIB-a");
    }
}

export async function searchBuyers(keyword){
    try{
        if(!keyword || typeof keyword !== "string" || keyword.trim() === ""){
            throw new Error("Pretraga po kljucnoj reci je nevalidna");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search`,{
            params:{
                keyword
            },
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error, "Greska prilikom ptrezivanja kupca po zadatoj reci");
    }
}

export async function getBuyerByPib(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/by-pib/${pib}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po pib-u");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}