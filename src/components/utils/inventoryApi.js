import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isInventoryValid = ["PENDING","IN_PROGRESS","COMPLETED","CANCELLED","RECONCILED","PARTIALLY_COMPLETED"];

export async function createInventory({storageEmployeeId, storageForemanId, date,aligned, inventoryItems, status}){
    try{
        if(
            !storageEmployeeId || !storageForemanId ||
            !moment(date,"YYYY-MM-DD",true).isValid() || typeof aligned !=="boolean" ||
            !Array.isArray(inventoryItems) || inventoryItems.length === 0||
            !isInventoryValid.includes(status?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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

export async function updateInventory({id,storageEmployeeId, storageForemanId, date,aligned, inventoryItems, status} ){
    try{
        if(
            id == null || isNaN(id) ||
            !storageEmployeeId || !storageForemanId ||
            !moment(date,"YYYY-MM-DD",true).isValid() || typeof aligned !=="boolean" ||
            !Array.isArray(inventoryItems) || inventoryItems.length === 0||
            !isInventoryValid.includes(status?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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
        if(!id){
            throw new Error("Dati ID za Inventory nije pronadjen");
        }
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
        if(!isInventoryValid.includes(status?.toUpperCase())){
            throw new Error("Dati status ne postoji");
        }
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
        if(!storageEmployeeId){
            throw new Error("Dati ID za storageEmployee nije pronadjen");
        }
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
        if(!storageForemanId){
            throw new Error("Dati ID za storageForeman nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati ID za Inventory nije pronadjen");
        }
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
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum mora biti ispravan i validan");
        }
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

export async function findByDateRange({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() ||
           !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Netacan opseg datuma");
           }
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

export async function changeStatus({inventoryId, newStatusStr}){
    try{
        if(!inventoryId || !newStatusStr || typeof newStatusStr !== "string" || newStatusStr.trim() === ""){
            throw new Error("Nepoznat inventoryId i newStatusStr");
        }
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