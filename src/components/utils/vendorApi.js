import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/vendors`;
const isMaterialTransactionStatusValid = ["PENDING", "APPROVED", "SENT_TO_LAB", "LAB_CONFIRMED", "COMPLETED", "REJECTED"];

export async function createVendor({name, email, phoneNumber, address}) {
    try{
        if(!name || name.trim() ==="" || typeof name !== "string" ||
        !email || email.trim()==="" || typeof email !=="string" || 
        !phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim()==="" || 
        !address || address.trim() ==="" || typeof address !=="string"){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {name:name, email:email, phoneNumber:phoneNumber, address:address};
        const response = await api.post(url+`/create/new-vendor`, requestBody,{
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

export async function updateVendor({id, name, email,phoneNumber, address}){
    try{
        if(
        id == null || isNaN(id) || !name || name.trim() ==="" || typeof name !== "string" ||
        !email || email.trim()==="" || typeof email !=="string" || 
        !phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim()==="" || 
        !address || address.trim() ==="" || typeof address !=="string"){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {id:id, name:name, email:email, phoneNumber:phoneNumber, address:address};
        const response = await api.put(url+`/update/${id}`,requestBody,{
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
        if(id == null || isNaN(id)){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
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
        const response = await api.get(url+`/vendor/by-name`,{
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
        const response = await api.get(url+`/vendor/by-address`,{
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
        const response = await api.get(url+`/vendor/by-email`,{
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
        if(id == null || isNaN(id)){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
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
        const response = await api.get(url+`/get-all-vendors`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function findByPhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona za vendora nije pronadjen");
        }
        const response = await api.get(url+`/by-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona za vendora");
    }
}

export async function searchByName(nameFragment){
    try{
        if(!nameFragment || typeof nameFragment !== "string" || nameFragment.trim() === ""){
            throw new Error("Dati fragment za naziv vendora nije pronadjen");
        }
        const response = await api.get(url+`/by-name-fragment`,{
            params:{nameFragment:nameFragment},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo naziv vendora po fragmentu");
    }
}

export async function findByNameIgnoreCaseContainingAndAddressIgnoreCaseContaining({name, address}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Dati naziv i adresa vendora nisu pronadjeni");
        }
        const response = await api.get(url+`/by-name-and-address`,{
            params:{
                name:name,
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo vendora po nazivu i adresi");
    }
}

export async function findByIdBetween({startId, endId}){
    try{
        if(startId == null || isNaN(startId) || endId == null || isNaN(endId)){
            throw new Error("Dati opseg indeksa nije pornadjen");
        }
        const response = await api.get(url+`/search/between-ids`,{
            params:{
                startId:startId,
                endId:endId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo opseg indeksa za vendora");
    }
}

export async function findByEmailContainingIgnoreCase(emailFragment){
    try{
        if(!emailFragment || typeof emailFragment !== "string" || emailFragment.trim() === ""){
            throw new Error("Dati fragment email-a nije pronadjen");
        }
        const response = await api.get(url+`/search/by-email-fragment`,{
            params:{emailFragment:emailFragment},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo vendora po fragmentu email-a");
    }
}

export async function findByPhoneNumberContaining(phoneNumberFragment){
    try{
        if(!phoneNumberFragment || typeof phoneNumberFragment !== "string" || phoneNumberFragment.trim() === ""){
            throw new Error("Dati fragment broja telefona nije pronadjen");
        }
        const response = await api.get(url+`/search/by-phone-number-fragment`,{
            params:{phoneNumberFragment:phoneNumberFragment},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo vendora po fragmentu broja telefona");
    }
}

export async function findVendorsByMaterialTransactionStatus(status){
    try{
        if(!isMaterialTransactionStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status vezan za transakcije materijala nije pronadjen");
        }
        const response = await api.get(url+`/search/by-material-transaction-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vendore po statusu transakcije materijala");
    }
}

export async function countByAddressContainingIgnoreCase(addressFragment){
    try{
        if(!addressFragment || typeof addressFragment !== "string" || addressFragment.trim() === ""){
            throw new Error("Dati broj adresnih fragmenata nije pronadjen");
        }
        const response = await api.get(url+`/search/count-by-address-fragment`,{
            params:{addressFragment:addressFragment},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo ukupan broj adresa koje sadrze fragmente date adrese");
    }
}

export async function countByNameContainingIgnoreCase(nameFragment){
    try{
        if(!nameFragment || typeof nameFragment !== "string" || nameFragment.trim() === ""){
            throw new Error("Dati broj fragmenata za naziv nije pronadjen");
        }
        const response = await api.get(url+`/search/count-by-address-fragment`,{
            params:{nameFragment:nameFragment},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo ukupan broj naziva koje sadrze fragmente datog naziva");
    }
}

export async function existsByEmail(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dato postojanje email-a za vendora nije pronadjeno");
        }
        const response = await api.get(url+`/exists-by-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspela da pronadjemo postojanje email-a za vendora");
    }
}

export async function findAllByOrderByNameAsc(){
    try{
        const response = await api.get(url+`/search/by-name-ascending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjeno sve nazive venodra koji su soritrani po rastucem poretku");
    }
}

export async function findAllByOrderByNameDesc(){
    try{
        const response = await api.get(url+`/search/by-name-descending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjeno sve nazive venodra koji su soritrani po padajucem poretku");
    }
}

export async function findVendorsByTransactionStatuses(statuses){
    try{
        if(!isMaterialTransactionStatusValid.includes(statuses?.toUpperCase())){
            throw new Error("Dati statusi za transakcije materijala, nisu pronadjeni");
        }
        const response = await api.get(url+`/search-statuses"`,{
            params:{
                statuses:arrayStatus
            },
            paramsSerializer: params => {
                return params.arrayStatus.map(s => `arrayStuts=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo sve vendore po statusu transakcije materijala");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}