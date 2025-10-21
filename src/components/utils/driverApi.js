import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/drivers`;
const isDriverStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createDriver({firstName,lastName, phone, status,confirmed}){
    if (
        !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
        !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
        !phone || typeof phone !== "string" || phone.trim() === "" ||
        !isDriverStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"
    ) {
        throw new Error("Sva polja moraju biti validna i popunjena");
    }
    try{
        const requestBody = {firstName,lastName, phone, status,confirmed};
        const response = await api.post(url+`/create/new-driver`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska priliko kreiranja vozaca");
    }
}

export async function updateDriver({id, firstName,lastName, phone, status,confirmed}){
    if (
        id == null || isNaN(id) ||
        !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
        !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
        !phone || typeof phone !== "string" || phone.trim() === "" ||
        !isDriverStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"
    ) {
        throw new Error("Sva polja moraju biti validna i popunjena");
    }
    try{
        const requestBody = {firstName,lastName, phone, status,confirmed};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteDriver(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" vozaca nije pronadjen");
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

export async function findOneById(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" vozaca nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greksa prilikom dobavljanja jednog vozaca po "+id+" id-iju");
    }
}

export async function findAllDrivers(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih vozaca");
    }
}

export async function findByPhone(phone){
    try{
        if(!phone || typeof phone !== "string" || phone.trim() === ""){
            throw new Error("Dati broj-telefona "+phone+" vozaca nije pronadjen");
        }
        const response = await api.get(url+`/by-phone`,{
            params:{
                phone:phone
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po broju telefona "+phone+"vozaca");
    }
}

export async function findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" ||
        !lastName || typeof lastName !== "string" || lastName.trim() === "" ){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" za vozaca, nisu pronadjeni");
        }
        const response = await api.get(url+`/first-name-and-last-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime "+lastName+" vozaca");
    }
}

export async function findByPhoneLikeIgnoreCase(phone){
    try{
        if(!phone || typeof phone !== "string" || phone.trim() === ""){
            throw new Error("Broj-telefona "+phone+" za vozaca, nije pronadjen");
        }
        const response = await api.get(url+`/phone-fragment`,{
            params:{phone:phone},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phone+" za datog vozaca");
    }
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
}

export async function generalSearch(filters = {}){
    try{
        const cleanedFilters = cleanFilters(filters);
        const response = await api.post(url+`/general-search`,cleanedFilters,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom generalne pretrage");
    }
}

export async function existsByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" ||
           !lastName || typeof lastName !== "string" || lastName.trim() === "" ){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" za vozaca, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists/first-name-and-last-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje za ime "+firstName+" i prezime "+lastName+" vozaca");
    }
}

export async function confirmDriver(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("ID "+id+" za potvrdu vozaca, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu vozaca");
    }
}

export async function closeDriver(id){
    try{
        if(id == null || isNaN(id)){
                throw new Error("ID "+id+" za zatvaranje vozaca, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
         return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje vozaca");
    }
}

export async function cancelDriver(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("ID "+id+" za otkazivanje vozaca, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
            handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje vozaca");
    }
}

export async function changeStatus({id, newStatus}){
    try{
        if(id == null || isNaN(id) || !isDriverStatusValid.includes(newStatus?.toUpperCase())){
            throw new Error("ID "+id+" i status vozaca "+newStatus+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${newStatus}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status defekta "+status);
    }
}

export async function saveDriver({firstName, lastName, phone, status, confirmed = false}){
    try{
        if(!firstName?.trim() || !lastName?.trim() || !phone?.trim()){
            throw new Error("Polja 'ime', 'prezime',' broj-telefona' moraju biti popunjena i validna");
        }
        const statusUpper = status?.toUpperCase();
        if(!isDriverStatusValid.includes(statusUpper)){
            throw new Error(`Nevalidan vozacev status: ${status}`);
        }
        if (typeof confirmed !== "boolean") {
            throw new Error("Polje 'confirmed' mora biti boolean");
        }
        const requestBody = {
            firstName:firstName.trim(),
            lastName: lastName.trim(),
            phone : phone.trim(),
            status: statusUpper,
            confirmed
        };
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,firstName, lastName, phone}){
    try{
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if (!code?.trim() || !name?.trim()) {
            throw new Error("Polja 'ime', 'prezime' i 'broj-telefona' moraju biti popunjena i validna");
        }
        const requestBody = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone : phone.trim()
        };
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        for(let i = 0; i < requests.length; i++){
            const req = requests[i];
            if(req.id == null || isNan(req.id)){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'id' mora biti ceo broj`);
            }
            if (!req.firstName?.trim() || !req.lastName?.trim() || !req.phone?.trim()) {
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'ime', 'prezime', 'broj-telefona' su obavezni`);
            }
            if (req.status) req.status = req.status.toUpperCase();
            if (typeof req.confirmed !== "boolean") {
                req.confirmed = false; // default ako nije prosledjeno
            }
        }
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}

export async function trackDriver(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" vozaca za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" vozaca za pracenje");
    }
}