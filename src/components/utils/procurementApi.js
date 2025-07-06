import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createProcurement({date, totalCost, itemSalesIds, supplyItemIds}){
    try{
        if(
            !moment(date, "YYYY-MM-DDTHH:mm:ss", true).isValid() ||
            isNaN(totalCost) || parseFloat(totalCost) <= 0 ||
            !Array.isArray(itemSalesIds) || itemSalesIds.length === 0 ||
            !Array.isArray(supplyItemIds) || supplyItemIds.length === 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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

export async function updateProcurement({id, date, totalCost, itemSalesIds, supplyItemIds}){
    try{
        if(
            !id ||
            !moment(date, "YYYY-MM-DDTHH:mm:ss", true).isValid() ||
            isNaN(totalCost) || parseFloat(totalCost) <= 0 ||
            !Array.isArray(itemSalesIds) || itemSalesIds.length === 0 ||
            !Array.isArray(supplyItemIds) || supplyItemIds.length === 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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
        if(!id){
            throw new Error("Dati id za procurement nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati id za procurement nije pronadjen");
        }
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
        if(isNaN(totalCost) || parseFloat(totalCost) <= 0){
            throw new Error("TotalCost ne sme biti ne-negativan broj");
        }
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

export async function getByDateBetween({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endDate,"YYYY-MM-DDTHH:mm:ss", true).isValid()){
            throw new Error("Datum mora biti ispravan");
        }
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

export async function getByTotalCostBetween({min, max}){
    try{
        if(isNaN(min) || parseFloat(min) < 0 || isNaN(max) || parseFloat(max) <= 0){
            throw new Error("Min i max moraju biti pozitivni");
        }
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

export async function getByTotalCostGreaterThan(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena veca od nije prtonadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/total-cost-greater-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od");
    }
}

export async function getByTotalCostLessThan(totalCost){
 try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena manja od nije prtonadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/total-cost-less-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}