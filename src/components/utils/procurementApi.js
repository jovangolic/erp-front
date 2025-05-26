import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createProcurement(date, totalCost, itemSalesIds, supplyItemIds){
    try{
        const requestBody = {date:moment(date).format("YYYY-MM-DDTHH:mm:ss"), totalCost:parseFloat(totalCost), itemSalesIds, supplyItemIds};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/procurements/create/new-procurement`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja nabavke: " + error.message);
        }
    }
}

export async function updateProcurement(id, date, totalCost, itemSalesIds, supplyItemIds){
    try{
        const requestBody = {date:moment(date).format("YYYY-MM-DDTHH:mm:ss"), totalCost:parseFloat(totalCost), itemSalesIds, supplyItemIds};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/procurements/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom auriranja nabavke: " + error.message);
        }
    }
}

export async function deleteProcurement(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/procurements/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom brisanja");
    }
}

export async function getByProcurementId(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/procurement/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne nabavke");
    }
}

export async function getAllProcurement(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/all-procurement`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih nabavki");
    }
}

export async function getByTotalCost(totalCost){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/procurement/total-cost`,{
            params:{
                totalCost:parseFloat(totalCost)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po ukupnoj ceni");
    }
}

export async function getByDateBetween(startDate, endDate){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/procurement/date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po pocetnom i krajnjem datumu");
    }
}

export async function getByTotalCostBetween(min, max){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/procurement/cost/min-max`,{
            params:{
                min:parseFloat(min), max:parseFloat(max)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja izmedju minimalne i maksimalne cene");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}