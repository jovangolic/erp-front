import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const url = `${import.meta.env.VITE_API_BASE_URL}/sales`;

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createSales({buyerId, itemSales, createdAt, totalPrice, salesDescription}) {
    try {
        const validateDate = moment.isMoment(createdAt) || moment(createdAt, "YYYY-MM-DDTHH:mm:ss",true).isValid();
        const parseTotalPrice = parseFloat(totalPrice);
        if(
            buyerId == null || isNaN(buyerId) || !Array.isArray(itemSales) || itemSales.length === 0 ||
            !validateDate ||
            isNaN(parseTotalPrice) || parseTotalPrice <= 0 ||
            !salesDescription || typeof salesDescription !== "string" || salesDescription.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {
            buyerId,
            itemSales,
            createdAt,
            totalPrice,
            salesDescription
        };
        const response = await api.post(
            url+`/create/new-sale`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom kreiranja prodaje: " + error.message);
        }
    }
}

export async function updateSales({id, buyerId, itemSales, createdAt, totalPrice, salesDescription}) {
    try {
        const validateDate = moment.isMoment(createdAt) || moment(createdAt, "YYYY-MM-DDTHH:mm:ss",true).isValid();
        const parseTotalPrice = parseFloat(totalPrice);
        if(
            id == null || isNaN(id) ||
            buyerId == null || isNaN(buyerId) || !Array.isArray(itemSales) || itemSales.length === 0 ||
            !validateDate ||
            isNaN(parseTotalPrice) || parseTotalPrice <= 0 ||
            !salesDescription || typeof salesDescription !== "string" || salesDescription.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {
            buyerId,
            itemSales,
            createdAt,
            totalPrice,
            salesDescription
        };
        const response = await api.put(
            url+`/update/${id}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom ažuriranja prodaje: " + error.message);
        }
    }
}

export async function deleteSales(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.delete(url+`/delete/sale/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getByCreatedAtBetween({startDate, endDate}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate, "YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate, "YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Opseg datuma "+startDate+" - "+endDate+" mora biti ispravan");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/between-dates`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje izmedju opsega datuma "+startDate+" - "+endDate+" kreiranja");
    }
}


export async function getByTotalPrice(totalPrice){
    try{
        if(isNaN(totalPrice) || parseFloat(totalPrice) <= 0){
            throw new Error("Ukupna cena "+totalPrice+" mora biti pozitivan broj");
        }
        const response = await api.get(url+`/total-price`,{
            params:{
                totalPrice:parseFloat(totalPrice)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje po ukupnoj ceni "+totalPrice);
    }
}

export async function findBySalesId(salesId){
    try{
        if(salesId == null || isNaN(salesId)){
            throw new Error("Dati salesId "+salesId+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${salesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanja po "+salesId+" id-iju");
    }
}

export async function getSalesByDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if (!validateDate) {
            throw new Error("Datum "+date+" mora biti validan ISO string.");
        }
        const response = await api.get(url+`/sale-by-date`,{
            params:{
                date: moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje prodaje po datumu "+date);
    }
}

export async function getAllSales(){
    try{
        const response = await api.get(url+`/get-all-sales`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greksa prilikom dobavljanja svih prodaja");
    }
}

export async function findByBuyer_Id(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("Dati ID "+buyerId+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+buyerId+" ID-iju kupca");
    }
}

export async function findByBuyer_CompanyNameContainingIgnoreCase(buyerCompanyName){
    try{
        if(!buyerCompanyName || typeof buyerCompanyName !== "string" || buyerCompanyName.trim() === ""){
            throw new Error("Dati naziv "+buyerCompanyName+" kupceve kompanije nije pronadjen");
        }
        const response = await api.get(url+`/search/by-company-name`,{
            params:{buyerCompanyName:buyerCompanyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu "+buyerCompanyName+" kupceve kompanije");
    }
}

export async function findByBuyer_PibContainingIgnoreCase(buyerPib){
    try{
        if(!buyerPib || typeof buyerPib !== "string" || buyerPib.trim() === ""){
            throw new Error("Dati PIB "+buyerPib+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/by-pib`,{
            params:{buyerPib:buyerPib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+buyerPib+" PIB-u kupca");
    }
}

export async function findByBuyer_AddressContainingIgnoreCase(buyerAddress){
    try{
        if(!buyerAddress || typeof buyerAddress !== "string" || buyerAddress.trim() === ""){
            throw new Error("Data adresa "+buyerAddress+" kupca nije pronadjena");
        }
        const response = await api.get(url+`/search/by-address`,{
            params:{buyerAddress:buyerAddress},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja adrese "+buyerAddress+" kupca");
    }
}

export async function findByBuyer_ContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Data kontakt-osoba "+contactPerson+" nije pronadjena");
        }
        const response = await api.get(url+`/search/by-contact-person`,{
            params:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kontakt-osobi "+contactPerson);
    }
}

export async function findByBuyer_EmailContainingIgnoreCase(buyerEmail){
    try{
        if(!buyerEmail || typeof buyerEmail !== "string" || buyerEmail.trim() === ""){
            throw new Error("Dati email "+buyerEmail+" kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/by-email`,{
            params:{buyerEmail:buyerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po emailu "+buyerEmail+" kupca");
    }
}

export async function findByBuyer_PhoneNumber(buyerPhoneNumber){
    try{
        if(!buyerPhoneNumber || typeof buyerPhoneNumber !== "string" || buyerPhoneNumber.trim() === ""){
            throw new Error("Dati broj telefona "+buyerPhoneNumber+" kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/by-phone-number`,{
            params:{buyerPhoneNumber:buyerPhoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju telefona "+buyerPhoneNumber+" kupca");
    }
}

export async function findByTotalPriceGreaterThan(totalPrice){
    try{    
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena veca od "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/search/by-total-price-max`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od "+ totalPrice);
    }
}

export async function findByTotalPriceLessThan(totalPrice){
    try{    
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena manja od "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/search/by-total-price-min`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od "+totalPrice);
    }
}

export async function searchSales({buyerId, companyName, pib, email, phoneNumber, address, contactPerson, minTotalPrice, maxTotalPrice}){
    try{
        const parseMinTotalPrice = parseFloat(minTotalPrice);
        const parseMaxTotalPrice = parseFloat(maxTotalPrice);
        if(
            buyerId == null || isNaN(buyerId) ||
            !companyName || typeof companyName !== "string" || companyName.trim() === "" ||
            !pib || typeof pib !== "string" || pib.trim() === "" ||
            !email || typeof email !== "string" || email.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === "" ||
            isNaN(parseMinTotalPrice) || parseMinTotalPrice <= 0 || isNaN(parseMaxTotalPrice) || parseMaxTotalPrice <= 0
        ){
            throw new Error("Dati parametri za pretragu: "+buyerId+","+companyName+","+pib+","+email+","+
                phoneNumber+","+address+","+contactPerson+","+parseMinTotalPrice+","+parseMaxTotalPrice+" nisu validni");
        }
        if(parseMinTotalPrice > parseMaxTotalPrice){
            throw new Error("Manja cena ne sme biti veca od maksimalne cene");
        }
        const response = await api.get(url+`/search`,{
            params:{
                buyerId:buyerId,
                companyName:companyName,
                pib:pib,
                phoneNumber:phoneNumber,
                address:address,
                contactPerson:contactPerson,
                minTotalPrice: parseMinTotalPrice,
                maxTotalPrice: parseMaxTotalPrice
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po parametrima: "+buyerId+","+companyName+","+pib+","+email+","+
                phoneNumber+","+address+","+contactPerson+","+parseMinTotalPrice+","+parseMaxTotalPrice);
    }
}


