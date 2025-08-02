import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createShelf({rowCount, cols, storageId, goods}){
    try{
        if(
            isNaN(rowCount) || parseInt(rowCount) <= 0 ||
            isNaN(cols) || parseInt(cols) <= 0 || !storageId ||
            !Array.isArray(goods) || goods.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody={rowCount, cols, storageId,goods};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/shelves/create/new-shelf`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja polica: " + error.message);
        }
    }
}

export async function updateShelf({id, rowCount, cols, storageId, goods}){
    try{
        if(
            !id ||
            isNaN(rowCount) || parseInt(rowCount) <= 0 ||
            isNaN(cols) || parseInt(cols) <= 0 || !storageId ||
            !Array.isArray(goods) || goods.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {rowCount, cols, storageId,goods};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/shelves/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranju polica: " + error.message);
        }
    }
}

export async function deleteShelf(id){
    try{
        if(!id){
            throw new Error("Dati shelf po id nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/shelves/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
        if(!id){
            throw new Error("Dati ID za shelf nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jedne police");
    }
}

export async function findAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih polica");
    }
}

export async function existsByRowCountAndStorageId({storageId, rowCount}){
    try{
        if(isNaN(rowCount) || parseInt(rowCount) <= 0 || !storageId){
            throw new Error("Greska, nepostojeci red polica i id skladista");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom proveravanja postojanja reda i storageId");
    }
}

export async function existsByColsAndStorageId({storageId, cols}){
    try{
        if(isNaN(cols) || parseInt(cols) <= 0 || !storageId){
            throw new Error("Greska, nepostojeca kolona polica i id skladista");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/cols/${cols}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom proveravanja postojanja kolone i storageId");
    }
}

export async function existsByRowCountAndColumnAndStorageId({storageId, rowCount, cols}){
    try{
        if(isNaN(rowCount) || parseInt(rowCount) <= 0 ||
            isNaN(cols) || parseInt(cols) <= 0 || !storageId){
                throw new Error("Greska, nepostojeci red i kolona polica kao i ID skladista");
            }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}/cols/${cols}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom proveravanja postojanjareda, kolone i storageId");
    }
}

export async function findByStorageId(storageId){
    try{
        if(!storageId){
            throw new Error("Dati ID skladista je nepostojeci");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po storageId");
    }
}   

export async function findByRowCountAndStorageId({storageId, rowCount}){
    try{
        if(isNaN(rowCount) || parseInt(rowCount) <= 0 || !storageId){
            throw new Error("Greks prilikom trazenja reda polica i ID skladista");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po redu i storageId");
    }
}

export async function findByColumnAndStorageId({storageId, cols}){
    try{
        if(isNaN(cols) || parseInt(cols) <= 0 || !storageId){
            throw new Error("Greks prilikom trazenja kolone polica i ID skladista");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/cols/${cols}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po koloni i storageId");
    }
}

export async function findByRowCountAndColsAndStorageId({storageId, rowCount, cols}){
    try{
        if(isNaN(rowCount) || parseInt(rowCount) <= 0 ||
            isNaN(cols) || parseInt(cols) <= 0 || !storageId){
            throw new Error("Greska, prilikom trazenja reda i kolone polica kao i ID skladista");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}/cols/${cols}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po redu, koloni i storageId");
    }
}

export async function getShelfWithGoods(shelfId){
    try{
        if(!shelfId){
            throw new Error("ShelfId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/${shelfId}/with-goods`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska, polica je prazna");
    }
}

export const getShelvesByStorageId = async (storageId) => {
    try{
        if(!storageId){
            throw new Error("Dati storageId za Shelf nije pronadjen");
        }
        const response = await api.get(`/${import.meta.env.VITE_API_BASE_URL}/shelves/by-storage/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska ID skladista ne odgovara policama");
    }
};

export async function findByStorage_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim()===""){
            throw new Error("Dati naziv skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu skladista za police");
    }
}

export async function findByStorage_Location(location){
    try{
        if(!location || typeof location !== "string" || location.trim()===""){
            throw new Error("Data lokacija skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage-location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po lokaciji skladista za police");
    }
}

export async function findByStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu skladista");
    }
}

export async function findByStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista veceg od, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kapacitetu skladista veceg od");
    }
}

export async function findByStorage_NameAndStorage_Type({name, type}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati naziv i tip skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage-name-and-type`,{
            params:{
                name:name,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po naziv i tipu skladista za police");
    }
}

export async function countAvailableCapacity(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati ID skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/${id}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj dostupnosti kapaciteta za dato skaldiste");
    }
}

export async function allocateCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati ID skladista i njegova kolicina za alociranje nisu pronadjeni");
        }
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/shelves/${id}/allocate`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista i njegovu kolicinu za alociranje");
    }
}

export async function releaseCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati ID skladista i njegova kolicina za premestanje nisu pronadjeni");
        }
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/shelves/${id}/release`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista i njegovu kolicinu za premestanje");
    }
}

export async function findByStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista manji od, nie pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista manji od");
    }
}

export async function findByStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista, nie pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet skladista");
    }
}

export async function findByStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati status skladista");
    }
}

export async function findByStorageTypeAndStatus({type, status}){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase()) ||
            !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip i status skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-type-and-status`,{
            params:{
                type:(type || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip i status datog skladista");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndLocationContainingIgnoreCase({name, location}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati naziv i lokacija skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-name-and-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv i lokaciju datog skladista");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndCapacity({name, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!name || typeof name !== "string" || name.trim() === "" || isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati naziv i kapacitet skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-name-and-capacity`,{
            params:{
                name:name,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv i kapacitet skaldista");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndCapacityGreaterThan({name, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!name || typeof name !== "string" || name.trim() === "" || isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati naziv i kapacitet skladista veci od, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-name-and-capacity-greater-than`,{
            params:{
                name:name,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv i kapacitet skaldista veceg od");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndCapacityLessThan({name, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!name || typeof name !== "string" || name.trim() === "" || isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati naziv i kapacitet skladista manji od, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-name-and-capacity-less-than`,{
            params:{
                name:name,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv i kapacitet skaldista manji od");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndStatus({name, status}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati naziv i status skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-name-and-status`,{
            params:{
                name:name,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv i status datog skladista");
    }
}

export async function findByStorageCapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg kapaciteta skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/search/storage-capacity-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pseg kapaciteta skladista");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}