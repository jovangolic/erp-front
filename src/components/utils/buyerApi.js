import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/buyers`;
const isBuyerStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

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
        const response = await api.post(url+`/create/new-buyer`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja kupca: ${error.message}`);
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
            url+`/update/${pib}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(`Greška prilikom azuriranja kupca: ${error.message}`);
        }
    }
}

export async function deleteBuyer(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za kupca nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
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
            throw new Error("Dati ID "+id+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/buyer/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog kupca po "+id+" id");
    }
}

export async function getAllBuyers(){
    try{
        const response = await api.get(url+`/get-all`,{
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
            throw new Error("PIB "+pib+" je nevalidan ili prazan");
        }
        const response = await api.get(url+`/exists-by-pib`,{
            params:{
                pib
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom provere postojanja datog "+pib+" PIB-a");
    }
}

export async function searchBuyer(keyword){
    try{
        if(!keyword || typeof keyword !== "string" || keyword.trim() === ""){
            throw new Error("Pretraga po kljucnoj reci "+keyword+" je nevalidna");
        }
        const response = await api.get(url+`/search`,{
            params:{
                keyword
            },
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error, "Greska prilikom ptrezivanja kupca po zadatoj reci "+keyword);
    }
}

export async function getBuyerByPib(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB "+pib+" ne postoji");
        }
        const response = await api.get(url+`/by-pib/${pib}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po "+pib+" pib-u");
    }
}

export async function findByAddressContainingIgnoreCase(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa "+address+" kupca nije pronadjena");
        }
        const response = await api.get(url+`/by-address`,{
            params:{
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli adresu "+address+" za kupca");
    }
}

export async function findByContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Data kontakt-osoba "+contactPerson+" za kupca nije pronadjena");
        }
        const response = await api.get(url+`/by-contact-person`,{
            params:{
                contactPerson:contactPerson
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli kontakt-osobu "+contactPerson+" za kupca");
    }
}

export async function findByContactPersonContainingIgnoreCase(contactPersonFragment){
    try{
        if(!contactPersonFragment || typeof contactPersonFragment !== "string" || contactPersonFragment.trim() === ""){
            throw new Error("Data kontakt-osoba po fragmentu "+contactPersonFragment+" za kupca nije pronadjena");
        }
        const response = await api.get(url+`/search/by-contact-person-fragment`,{
            params:{
                contactPersonFragment:contactPersonFragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli kontakt-osobu po fragmentu "+contactPersonFragment+" za kupca");
    }
}

export async function findByPhoneNumberContaining(phoneFragment){
    try{
        if(!phoneFragment || typeof phoneFragment !== "string" || phoneFragment.trim() === ""){
            throw new Error("Dati kontakt-telefon po fragmentu "+phoneFragment+" za kupca nije pronadjena");
        }
        const response = await api.get(url+`/search/by-phone-fragment`,{
            params:{
                phoneFragment:phoneFragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli kontakt-telefon po fragmentu "+phoneFragment+" za kupca");
    }
}

export async function findByCompanyNameContainingIgnoreCaseAndAddressContainingIgnoreCase({companyName, address}){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Dati naziv "+companyName+" kompanije i njena adresa "+address+", nisu pronadjeni");
        }
        const response = await api.get(url+`/search/company-name-and-address`,{
            params:{
                companyName:companyName,
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutni nismo pronasli naziv "+companyName+" kompanije i njenu adresu "+address);
    }
}

export async function findBuyersWithSalesOrders(){
    try{
        const response = await api.get(url+`/search/buyer-with-sales-orders`,{
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
        const response = await api.get(url+`/search/buyer-without-sales-orders`,{
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
            throw new Error("Dati email "+email+" nije pronadjen");
        }
        const response = await api.get(url+`/exists-by-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojeci email "+email+" za kupca");
    }
}

export async function searchBuyers({companyName, email}){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati naziv "+companyName+" kompanije i email "+email+" za kupca nisu pronadjeni");
        }
        const response = await api.get(url+`/search-buyers`,{
            params:{
                companyName:companyName,
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kupca po parametrima za pretragu: naziv "+companyName+" kompanije i email "+email);
    }
}


