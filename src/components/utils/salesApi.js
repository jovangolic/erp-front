import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSales({buyerId, itemSales, createdAt, totalPrice, salesDescription}) {
    try {
        if(
            !buyerId || !Array.isArray(itemSales) || itemSales.length === 0 ||
            !moment(createSales,moment.ISO_8601, true).isValid() ||
            isNaN(totalPrice) || parseFloat(totalPrice) <= 0 ||
            !salesDescription || typeof salesDescription !== "string" || salesDescription.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {
            buyerId,
            itemSales,
            createdAt: moment(createdAt).format("YYYY-MM-DDTHH:mm:ss"),
            totalPrice: totalPrice ? parseFloat(totalPrice) : 0,
            salesDescription
        };
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/sales/create/new-sale`,
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
        if(
            !id ||
            !buyerId || !Array.isArray(itemSales) || itemSales.length === 0 ||
            !moment(createSales,moment.ISO_8601, true).isValid() ||
            isNaN(totalPrice) || parseFloat(totalPrice) <= 0 ||
            !salesDescription || typeof salesDescription !== "string" || salesDescription.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {
            buyerId,
            itemSales,
            createdAt: moment(createdAt).format("YYYY-MM-DDTHH:mm:ss"),
            totalPrice: totalPrice ? parseFloat(totalPrice) : 0,
            salesDescription
        };
        const response = await api.put(
            `${import.meta.env.VITE_API_BASE_URL}/sales/update/${id}`,
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/sales/delete/sale/${id}`,{
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
        if(
            !moment(startDate,moment.ISO_8601, true).isValid() ||
            !moment(endDate,moment.ISO_8601, true).isValid()
        ){
            throw new Error("Opseg datuma mora biti ispravan");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/between-dates`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje izmedju datuma kreiranja");
    }
}


export async function getByTotalPrice(totalPrice){
    try{
        if(isNaN(totalPrice) || parseFloat(totalPrice) <= 0){
            throw new Error("Ukupna cena mora biti pozitivan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/sale/total-price`,{
            params:{
                totalPrice:parseFloat(totalPrice)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje po ukupnoj ceni");
    }
}

export async function findBySalesId(salesId){
    try{
        if(!salesId){
            throw new Error("Dati salesId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/sale/${salesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanja po id-iju");
    }
}

export async function getSalesByDate(date){
    try{
        if (typeof date !== "string" || !moment(date, moment.ISO_8601, true).isValid()) {
            throw new Error("Datum mora biti validan ISO string.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/sale-by-date`,{
            params:{
                date: moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje prodaje po datumu");
    }
}

export async function getAllSales(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/get-all-sales`,{
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
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju kupca");
    }
}

export async function findByBuyer_CompanyNameContainingIgnoreCase(buyerCompanyName){
    try{
        if(!buyerCompanyName || typeof buyerCompanyName !== "string" || buyerCompanyName.trim() === ""){
            throw new Error("Dati naziv kupceve kompanije nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-company-name`,{
            params:{buyerCompanyName:buyerCompanyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu kupceve kompanije");
    }
}

export async function findByBuyer_PibContainingIgnoreCase(buyerPib){
    try{
        if(!buyerPib || typeof buyerPib !== "string" || buyerPib.trim() === ""){
            throw new Error("Dati PIB za kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-pib`,{
            params:{buyerPib:buyerPib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po PIB-u kupca");
    }
}

export async function findByBuyer_AddressContainingIgnoreCase(buyerAddress){
    try{
        if(!buyerAddress || typeof buyerAddress !== "string" || buyerAddress.trim() === ""){
            throw new Error("Data adresa kupca nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-address`,{
            params:{buyerAddress:buyerAddress},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja adrese kupca");
    }
}

export async function findByBuyer_ContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Data kontakt-osoba nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-contact-person`,{
            params:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kontakt-osobi");
    }
}

export async function findByBuyer_EmailContainingIgnoreCase(buyerEmail){
    try{
        if(!buyerEmail || typeof buyerEmail !== "string" || buyerEmail.trim() === ""){
            throw new Error("Dati email kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-email`,{
            params:{buyerEmail:buyerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po emailu kupca");
    }
}

export async function findByBuyer_PhoneNumber(buyerPhoneNumber){
    try{
        if(!buyerPhoneNumber || typeof buyerPhoneNumber !== "string" || buyerPhoneNumber.trim() === ""){
            throw new Error("Dati broj telefona kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-phone-number`,{
            params:{buyerPhoneNumber:buyerPhoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju telefona kupca");
    }
}

export async function findByTotalPriceGreaterThan(totalPrice){
    try{    
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-total-price-max`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od");
    }
}

export async function findByTotalPriceLessThan(totalPrice){
    try{    
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search/by-total-price-min`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od");
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
            throw new Error("Dati parametri za pretragu nisu validni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/search`,{
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
        handleApiError(error,"Greska prilikom pretrage po parametrima");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}