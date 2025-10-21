import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/materials`;
const isUnitOfMeasureValid = ["KG","METER","PCS","LITER","BOX","PALLET"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createMaterial({code,name,unit,currentStock,storageId,reorderLevel}){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        const parseReorderlLevel = parseFloat(reorderLevel);
        if(
            !code || typeof code !== "string" || code.trim() === "" || 
            !name || typeof name !== "string" || name.trim() === "" ||
            isNaN(storageId) || storageId == null || !isUnitOfMeasureValid.includes(unit?.toUpperCase()) ||
            isNaN(parseCurrentStock) || parseCurrentStock <= 0 || isNaN(parseReorderlLevel) || parseReorderlLevel <= 0){
                throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {code,name,unit,currentStock,storageId,reorderLevel};
        const response = await api.post(url+`/create/new-material`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja materijala");
    }
}

export async function updateMaterial({id,code,name,unit,currentStock,storageId,reorderLevel}){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        const parseReorderlLevel = parseFloat(reorderLevel);
        if(
            id == null || isNaN(id) ||
            !code || typeof code !== "string" || code.trim() === "" || 
            !name || typeof name !== "string" || name.trim() === "" ||
            isNaN(storageId) || storageId == null || !isUnitOfMeasureValid.includes(unit?.toUpperCase()) ||
            isNaN(parseCurrentStock) || parseCurrentStock <= 0 || isNaN(parseReorderlLevel) || parseReorderlLevel <= 0){
                throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {code,name,unit,currentStock,storageId,reorderLevel};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja materijala");
    }
}

export async function deleteMaterial(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za materijal nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja materijala");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za materijal nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog materijala po "+id+" id-iju");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih materijala");
    }
}

export async function searchMaterials({name, code, unit, currentStock, storageId,reorderLevel}){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        const parseReorderlLevel = parseFloat(reorderLevel);
        if(
            !code || typeof code !== "string" || code.trim() === "" || 
            !name || typeof name !== "string" || name.trim() === "" ||
            isNaN(storageId) || storageId == null || !isUnitOfMeasureValid.includes(unit?.toUpperCase()) ||
            isNaN(parseCurrentStock) || parseCurrentStock <= 0 || 
            isNaN(parseReorderlLevel) || parseReorderlLevel <= 0){
            throw new Error("Dati parametri za pretragu materijala, "+name+" ,"+code+" ,"+unit+" ,"+parseCurrentStock+" ,"+storageId+" ,"+parseReorderlLevel+" nisu pronasli rezultat");
        }
        const response = await api.get(url+`/search`,{
            params:{
                name:name,
                code:code,
                unit:(unit || "").toUpperCase(),
                currentStock:parseCurrentStock,
                storageId: storageId,
                reorderLevel:parseReorderlLevel
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po parametrima pretrage: "+name+" ,"+code+" ,"+unit+" ,"+parseCurrentStock+" ,"+storageId+" ,"+parseReorderlLevel);
    }
}

export async function findByStorage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po "+storageId+" id-iju skladista");
    }
}

export async function findByCode(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po negovom kodu "+code);
    }
}

export async function findByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" materijala nije pronadjen");
        }
        const response = await api.get(url+`/search-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po njegovom nazivu "+name);
    }
}

export async function search({name, code}){
    try{
        if(!code || typeof code !== "string" || code.trim() === "" || 
            !name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+"i kod "+code+" materijala, nije pronadjen");
        }
        const response = await api.get(url+`/by-name-code`,{
            params:{
                name:name,
                code:code
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po nazivu "+name+" i kodu "+code);
    }
}

export async function findByUnit(unit){
    try{
        if(!isUnitOfMeasureValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere "+unit+" za materijal, nije pronadjena");
        }
        const response = await api.get(url+`/by-unit`,{
            params:{
                unit:(unit || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po jedinici mere "+unit);
    }
}

export async function findByStorage_Name(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" skladista za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-storage-name`,{
            params:{
                storageName:storageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po nazivu "+storageName+" skladista");
    }
}

export async function findByStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" skladista za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-storage-capacity`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po kapacitetu "+capacity+" skladista");
    }
}

export async function findByStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po tipu "+type+" skladista");
    }
}

export async function findByCurrentStock(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Data trenutna kolicina "+parseCurrentStock+" materijala, nije pronadjena");
        }
        const response = await api.get(url+`/by-current-stock`,{
            params:{
                currentStock:parseCurrentStock
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po trenutnoj kolicini "+currentStock);
    }
}

export async function findByReorderLevel(reorderLevel){
    try{
        const parseReorderlLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderlLevel) || parseReorderlLevel <= 0){
            throw new Error("Dati reorder-level "+parseReorderlLevel+" za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-reorder-level`,{
            params:{
                reorderLevel:parseReorderlLevel
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po reorder-levelu "+reorderLevel);
    }
}

export async function findByCurrentStockGreaterThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Data trenutna kolicina materijala veca od "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`/current-stock-greater-than`,{
            params:{
                currentStock:parseCurrentStock
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po trenutnoj kolicini vecoj od "+currentStock);
    }
}

export async function findByCurrentStockLessThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Data trenutna kolicina materijala manja od "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`/current-stock-less-than`,{
            params:{
                currentStock:parseCurrentStock
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po trenutnoj kolicini manjoj od "+currentStock);
    }
}

export async function countAvailableCapacity(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/${id}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj slobodnog kapaciteta skladista za materijal");
    }
}

export async function allocateCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || Number.isNaN(Number(parseAmount)) || parseAmount <= 0){
            throw new Error("Dati id "+id+" skladista i kolicina "+parseAmount+", nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/allocate`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" skladista i kolicinu "+amount+" za alociranje kapaciteta");
    }
}

export async function releaseCapacity({id, amount}){
try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati id "+id+" skladista i kolicina "+parseAmount+", nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/release`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" skladista i kolicinu "+amount+" za oslobadjanje kapaciteta");
    }
}

export async function findByReorderLevelGreaterThan(reorderLevel){
    try{
        const parseReorderlLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderlLevel) || parseReorderlLevel <= 0){
            throw new Error("Dati reorder-level za materijal veci od "+parseReorderlLevel+", nije pronadjen");
        }
        const response = await api.get(url+`/reorder-level-greater-than`,{
            params:{
                reorderLevel:parseReorderlLevel
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po reorder-levelu vecem od "+reorderLevel);
    }
}

export async function findByReorderLevelLessThan(reorderLevel){
    try{
        const parseReorderlLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderlLevel) || parseReorderlLevel <= 0){
            throw new Error("Dati reorder-level za materijal manji od "+parseReorderlLevel+", nije pronadjen");
        }
        const response = await api.get(url+`/reorder-level-less-than`,{
            params:{
                reorderLevel:parseReorderlLevel
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po reorder-levelu manjem od "+reorderLevel);
    }
}

export async function findByStorage_LocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" skladista za matgerijal, nije pronadjena");
        }
        const response = await api.get(url+`/search/storage-location`,{
            params:{
                storageLocation:storageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" skladista za dati materijal");
    }
}

export async function findByStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista za materijal veci od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po kapacitetu skladista vecem od "+capacity);
    }
}

export async function findByStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista za materijal manji od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli materijal po kapacitetu skladista manjem od "+capacity);
    }
}

export async function findByStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" skladista za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" skladista za matgerijal");
    }
}