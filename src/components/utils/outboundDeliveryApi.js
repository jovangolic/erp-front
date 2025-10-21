import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/outboundDeliveries`;

const validateStatus = ["PENDING","IN_TRANSIT","DELIVERED","CANCELLED"];

export function isValidOutboundDelivery({
    deliveryDate,
    buyerId,
    status,
    itemRequest
    }) {
    // Osnovne provere
    if (
        (!moment(deliveryDate, "YYYY-MM-DD", true).isValid() &&
        !moment(deliveryDate).isValid()) || 
        buyerId == null || Number.isNaN(Number(buyerId)) ||
        !status ||
        !validateStatus.includes(status?.toUpperCase()) ||
        !Array.isArray(itemRequest) ||
        itemRequest.length === 0
    ) {
        return false;
    }
    // Validacija svake stavke u itemRequest
    for (const item of itemRequest) {
        if (
        !item.productId ||
        item.quantity == null || item.quantity <= 0 ||
        !item.outboundDeliveryId
        ) {
        return false;
        }
    }
    return true;
}

export async function create(data){
    try{
        if(!isValidOutboundDelivery({...data,validateStatus})){
            throw new Error("Sva polja moraju biti popunjena i validna."); 
        }
        const response = await api.post(url+`/create/new-outboundDelivery`,data,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update({id, data}){
    try{
        if(id == null || isNaN(id) || !isValidOutboundDelivery({ ...data, validateStatus })){
            throw new Error("Sva polja moraju biti popunjena i validna."); 
        }
        const response = await api.put(url+`/update/${id}`,data,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteOutboundDelivery(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog outboundDelivery-ja");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih");
    }
}

export async function findByStatus(status){
    try{
        if(!validateStatus.includes(status?.toUpperCase())){
            return false;
        }
        const response = await api.get(url+`/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom traazenja po statusu "+status);
    }
}

export async function findByDeliveryDateBetween({from, to}) {
    try {
        const isFromValid = moment.isMoment(from) ||  moment(from, "YYYY-MM-DD", true).isValid();
        const isToValid = moment.isMoment(to) || moment(to, "YYYY-MM-DD", true).isValid();
        if (!isFromValid || !isToValid) {
            return false;
        }
        if(moment(to).isBefore(moment(from))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url + `/date-range`, {
        params: {
            from: moment(from).format("YYYY-MM-DD"),
            to: moment(to).format("YYYY-MM-DD")
        },
            headers: getHeader()
        });
        return response.data;
    } 
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja prema dostavi datuma opsega "+from+" - "+to);
    }
}

export async function findByBuyerId(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("ID "+buyerId+" prenosa mora biti prosledjen");
        }
        const response = await api.get(url+`/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po buyerId-ju "+buyerId);
    }
}

export async function createAll(outboundDeliveryList) {
    try {
        // Validacija moze da se doda po potrebi
        if (!Array.isArray(outboundDeliveryList) || outboundDeliveryList.length === 0) {
            throw new Error("Lista unosa ne sme biti prazna.");
        }
        const response = await api.post(url + `/bulk`, outboundDeliveryList, {
        headers: getHeader(),
        });
        return response.data; // Lista InboundDeliveryResponse objekata
    } 
    catch (error) {
        handleApiError(error, "Greška prilikom kreiranja više dostava");
    }
}

export async function deleteAllByIds(ids) {
    try {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("Lista ID-jeva za brisanje je prazna.");
        }
        const response = await api.delete(url + `/bulk`, {
        data: ids, // Ovde se koristi 'data' jer axios ne podrzava body direktno u DELETE kao treci parametar
        headers: getHeader(),
        });
        return response.status === 204;
    } 
    catch (error) {
        handleApiError(error, "Greška prilikom brisanja više unosa");
    }
}

export async function findByBuyer_CompanyName(companyName){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === ""){
            throw new Error("Dati naziv "+companyName+" kompanije kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/buyer-company-name`,{
            param:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+companyName+"kompanije za kupca");
    }
}

export async function findByBuyer_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa "+address+" kupca nije pronadjena");
        }
        const response = await api.get(url+`/search/buyer-address`,{
            param:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu "+address+" za kupca");
    }
}

export async function findByBuyer_ContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Data kontakt-osoba "+contactPerson+" za kupca nije pronadjena");
        }
        const response = await api.get(url+`/search/buyer-contact-person`,{
            param:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kontakt-osobu "+contactPerson+" za kupca");
    }
}

export async function findByBuyer_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/buyer-email`,{
            param:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+email+" za kupca");
    }
}

export async function findByBuyer_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/buyer-phone-number`,{
            param:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phoneNumber+" za kupca");
    }
}

export async function findByDeliveryDate(deliveryDate){
    try{
        const validateDate = moment.isMoment(deliveryDate) || moment(deliveryDate, "YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+deliveryDate+" dostave nije pronadjen");
        }
        const response = await api.get(url+`/delivery-date`,{
            params:{
                deliveryDate:moment(deliveryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati "+deliveryDate+" datum dostave");
    }
}

export async function findByDeliveryDateAfter(deliveryDate){
    try{
        const validateDate = moment.isMoment(deliveryDate) || moment(deliveryDate, "YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum dostave posle "+deliveryDate+", nije pronadjen");
        }
        const response = await api.get(url+`/delivery-date-after`,{
            params:{
                deliveryDate:moment(deliveryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+deliveryDate+" za dostavu");
    }
}

export async function findByDeliveryDateBefore(deliveryDate){
    try{
        const validateDate = moment.isMoment(deliveryDate) || moment(deliveryDate, "YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum dostave pre "+deliveryDate+", nije pronadjen");
        }
        const response = await api.get(url+`/delivery-date-before`,{
            params:{
                deliveryDate:moment(valideliveryDatedateDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+deliveryDate+" za dostavu");
    }
}