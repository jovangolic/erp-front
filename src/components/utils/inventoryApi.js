import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createInventory(storageEmployeeId, storageForemanId, date,aligned, inventoryItems, status){
    try{
        const requestBody = {storageEmployeeId,storageForemanId,date:moment(date).format("YYYY-MM-DD"), aligned,inventoryItems,status:status.toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/inventories/create/new-inventory`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function updateInventory(id,storageEmployeeId, storageForemanId, date,aligned, inventoryItems, status ){
    try{
        const requestBody = {storageEmployeeId,storageForemanId,date:moment(date).format("YYYY-MM-DD"), aligned,inventoryItems,status:status.toUpperCase()};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/inventories/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function deleteInventory(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/inventories/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findInventoryByStatus(status){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/find-by-status`,{
            params:{
                status:status.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog");
    }
}

export async function findByStorageEmployeeId(storageEmployeeId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/by-storageEmployeeId`,{
            params:{
                storageEmployeeId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja inventara po magacioneru");
    }
}

export async function findByStorageForemanId(storageForemanId){
    try{
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/by-storageForemanId`,{
        params:{
            storageForemanId
        },
        headers:getHeader()
    });
    return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage inventara po smenovodji");
    }
}

export async function findOneInventory(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog inventara");
    }
}

export async function findAllInventories(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja svih inventara");
    }
}

export async function findByDate(date){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/find-by-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage inventara po datumu");
    }
}

export async function findByDateRange(startDate, endDate){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/find-by-date-range`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja inventara po opsegu datuma");
    }
}

export async function changeStatus(inventoryId, newStatusStr){
    try{
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/inventories/changeStatus/${inventoryId}`,{
            params:{
                newStatusStr:newStatusStr.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po statusu inventara");
    }
}

export async function findPendingInventories(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventories/find-by-pending-inventories`,{
            headers:getHeader()
        });
        return response.data
    }
    catch(error){
        handleApiError(error," Greska prilikom trazenja po cekanju");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}