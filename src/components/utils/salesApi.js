import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSales(buyerId, itemSales, createdAt, totalPrice, salesDescription) {
    try {
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

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}