import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createBuyer({companyName,pib, address,contactPerson, email, phoneNumber}){
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

export async function updateBuyer({pib, companyName, address, contactPerson, email, phoneNumber}) {
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
        if(id == null || isNaN(id)){
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
        if(id == null || isNaN(id)){
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

export async function findByAddressContainingIgnoreCase(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa kupca nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/by-address`,{
            params:{
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli adresu za kupca");
    }
}

export async function findByContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Dati kontakt-osoba za kupca nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/by-contact-person`,{
            params:{
                contactPerson:contactPerson
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli kontakt-osobu za kupca");
    }
}

export async function findByContactPersonContainingIgnoreCase(contactPersonFragment){
    try{
        if(!contactPersonFragment || typeof contactPersonFragment !== "string" || contactPersonFragment.trim() === ""){
            throw new Error("Dati kontakt-osoba po fragmentu za kupca nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search/by-contact-person-fragment`,{
            params:{
                contactPersonFragment:contactPersonFragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli kontakt-osobu po fragmentu za kupca");
    }
}

export async function findByPhoneNumberContaining(phoneFragment){
    try{
        if(!phoneFragment || typeof phoneFragment !== "string" || phoneFragment.trim() === ""){
            throw new Error("Dati kontakt-telefon po fragmentu za kupca nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search/by-phone-fragment`,{
            params:{
                phoneFragment:phoneFragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli kontakt-telefon po fragmentu za kupca");
    }
}

export async function findByCompanyNameContainingIgnoreCaseAndAddressContainingIgnoreCase({companyName, address}){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Dati naziv kompanije i njena adresa, nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search/company-name-and-address`,{
            params:{
                companyName:companyName,
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli naziv kompanije i njenu adresu");
    }
}

export async function findBuyersWithSalesOrders(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search/buyer-with-sales-orders`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kupce sa prodajnim narudzbinama");
    }
}

export async function findBuyersWithoutSalesOrders(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search/buyer-without-sales-orders`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kupce bez prodajnih narudzbina");
    }
}

export async function existsByEmail(email){
    try{    
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/exists-by-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli posoyjeci email za kupca");
    }
}

export async function searchBuyers({companyName, email}){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati naziv kompanije i email za kupca nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/buyers/search-buyers`,{
            params:{
                companyName:companyName,
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kupca po parametrima za pretragu: naziv kompanije i email");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}