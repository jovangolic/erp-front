import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSales(buyerId, itemSales, createdAt, totalPrice, salesDescription) {
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

export async function updateSales(id, buyerId, itemSales, createdAt, totalPrice, salesDescription) {
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

export async function getByCreatedAtBetween(startDate, endDate){
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

export async function getSalesByBuyer(buyerId){
    try{
        if(!buyerId){
            throw new Error("Dati buyerId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/sales/get-by-buyer`,{
            params:{
                buyerId:buyerId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazanje po kupcu");
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

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}