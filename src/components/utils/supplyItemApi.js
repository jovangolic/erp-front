import { api, getHeader, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSupplyItem(procurementId, vendorId, cost){
    try{
        if(!procurementId || vendorId || cost == null || cost <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            procurementId:procurementId, vendorId:vendorId, cost:cost
        };
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/create/new-supply-item`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja supply-item: " + error.message);
        }
        
    }
}

export async function updateSupplyItem(id, procurementId, vendorId, cost){
    try{
        if( !id ||!procurementId || vendorId || cost == null || cost <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            id:id, procurementId:procurementId, vendorId:vendorId, cost:cost
        };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom azuriranja supply-item: " + error.message);
        }
    }
}

export async function deleteSupplyItem(id){
    try{
        if(!id){
            throw new Error("Dati ID nije pornadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOneSupplyItem(id){
    try{
        if(!id){
            throw new Error("Dati ID nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/supplyItem/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
    }
}

export async function getAllSuppliesItems(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/get-all-supplies-items`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
       handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getByProcurementId(procurementId){
    try{
        if(!procurementId){
            throw new Error("Dati procurementId nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/procurement/${procurementId}`,{
            params:{
                procurementId:procurementId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id:");
    }
}

export async function getBySupplierId(supplierId){
    try {
        if(!supplierId){
            throw new Error("Datu supplierId noje pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/supplier/${supplierId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch(error) {
        handleApiError(error, "Greška prilikom dobavljanja po supplierId");
    }
}

export async function getByCostBetween(min, max){
    try{
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if(isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0){
                throw new Error("Polja moraju biti popunjena i validna");
            }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/cost-between`,{
            params:{
                min:min, max:max
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska izmedju cena");
    }
}

export async function getByProcurementDateBetween(startDate, endDate){
    try {
        if (
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid()
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/procurement-date-between`, {
            params: {
                startDate: moment(startDate).toISOString(), // ISO format: 2024-08-01T10:00:00Z
                endDate: moment(endDate).toISOString()
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri dohvatanju po datumu");
    }
}

export async function getByProcurementDateAndCostBetween(startDate,endDate, min, max){
    try{
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if (
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid() ||
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/date-cost-between`,{
            params:{
                min:min, max:max,
                startDate: moment(startDate).toISOString(),
                endDate: moment(endDate).toISOString()
            }
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greška pri dohvatanju cena po datumu");
    }
}

export async function getByProcurementAndVendor(procurementId, vendorId){
    try{
        if(!procurementId || vendorId){
            throw new Error("ProcurementId i vendorId nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/by-procurement-vendor/${procurementId}/${vendorId}`,{
            params:{
                procurementId: procurementId,
                vendorId: vendorId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greška pri nabavci i prodavcu:");
    }
}

export async function getByVendorAndProcurementAndCost(supplierId, procurementId, minCost){
    try {
        if(!procurementId || vendorId || isNaN(minCost) || minCost < 0){
            throw new Error("procurementId, vendorId i minCost nisu pronadjeni");
        }
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/suppliesItems/by-supplier-procurement-cost/${supplierId}/${procurementId}`,
            {
                params: {
                    minCost: parseFloat(minCost) // OBAVEZNO koristi "minCost", ne "cost"
                },
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri dohvatanju po dobavljaču, nabavci i minimalnoj ceni");
    }
}

export async function getByDateAndCost(startDate, endDate, min, max) {
    try {
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if (
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid() ||
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/date-cost`, {
            params: {
                min: parsedMin,
                max: parsedMax,
                startDate: moment(startDate).toISOString(),
                endDate: moment(endDate).toISOString()
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri dohvatanju po datumu i ceni");
    }
}

export async function getBySupplierNameAndProcurementDateAndMaxCost(supplierName, startDate, endDate, max){
    try {
        if (
            !supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid() ||
            isNaN(max) || parseFloat(max) <= 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena.");
        }
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/suppliesItems/filter-by-supplier-date-cost`,
            {
                params: {
                    supplierName: supplierName.trim(),
                    startDate: moment(startDate).toISOString(), 
                    endDate: moment(endDate).toISOString(),
                    max: parseFloat(max) 
                },
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri imenu dobavljača, datumu i maksimalnoj ceni");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}