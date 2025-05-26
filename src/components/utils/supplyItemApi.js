import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSupplyItem(procurementId, vendorId, cost){
    try{
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

export async function getByDateAndCost(startDate, endDate, min, max){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/date-cost`,{
            params:{
                min:min, max:max,
                startDate: moment(startDate).toISOString(),
                endDate: moment(endDate).toISOString()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greška pri dohvatanju po datumu i ceni");
    }
}

export async function getBySupplierNameAndProcurementDateAndMaxCost(supplierName, startDate, endDate, max){
    try {
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/suppliesItems/filter-by-supplier-date-cost`,
            {
                params: {
                    supplierName: supplierName, // ✅ mora se zvati "supplierName"
                    startDate: moment(startDate).toISOString(), // ✅ ISO 8601 format
                    endDate: moment(endDate).toISOString(),
                    max: parseFloat(max) // ✅ osiguraj da je broj
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