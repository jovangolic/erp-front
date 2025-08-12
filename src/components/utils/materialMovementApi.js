import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/materialMovements`;
const isMovementTypeValid = ["INBOUND","OUTBOUND","TRANSFER"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createMaterialMovement({materialId,movementDate,type,quantity,fromStorageId,toStorageId}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(materialId) || materialId == null || 
            !moment(movementDate,"YYYY-MM-DD",true).isValid() ||
            !isMovementTypeValid.includes(type?.toUpperCase() || isNaN(parseQuantity) || parseQuantity <= 0 ||
            isNaN(fromStorageId) || fromStorageId == null || isNaN(toStorageId) || toStorageId == null)){
            throw new Error("Sva polja moraju biti popunjena i valididrana");
        }
        const requestBody = {materialId,movementDate,type,quantity,fromStorageId,toStorageId};
        const response = await api.post(url+`/create/new-materialMovement`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateMaterialMovement({id,materialId,movementDate,type,quantity,fromStorageId,toStorageId}){
    try{
        const parseQuantity = parseFloat(quantity);
        if( id == null || isNaN(id) ||
            isNaN(materialId) || materialId == null || 
            !moment(movementDate,"YYYY-MM-DD",true).isValid() ||
            !isMovementTypeValid.includes(type?.toUpperCase() || isNaN(parseQuantity) || parseQuantity <= 0 ||
            isNaN(fromStorageId) || fromStorageId == null || isNaN(toStorageId) || toStorageId == null)){
            throw new Error("Sva polja moraju biti popunjena i valididrana");
        }
        const requestBody = {materialId,movementDate,type,quantity,fromStorageId,toStorageId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteMaterialMovement(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-movement");
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
        handleApiError(error,"Greska prilikom trazenja svih");
    }
}

export async function findByType(type){
    try{
        if(!isMovementTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip za material-movement, nije pronadjen");
        }
        const response = await api.get(url+`/by-movement-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovom tipu");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za material-movement nije pronadjen");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovoj kolicini");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za material-movement veca od, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-greater-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovoj kolicini vecoj od");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za material-movement manja od, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-less-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovoj kolicini manjoj od");
    }
}

export async function findByFromStorage_Id(fromStorageId){
    try{
        if(isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/fromStorage/${fromStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement koji dolazi od skladista");
    }
}

export async function findByToStorage_Id(toStorageId){
    try{
        if(isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/toStorage/${toStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement koji dolazi do skladista");
    }
}

export async function findByFromStorage_NameContainingIgnoreCase(fromStorageName){
    try{
        if(!fromStorageName || typeof fromStorageName !== "string" || fromStorageName.trim() === ""){
            throw new Error("Dati naziv za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/from-storage-name`,{
            params:{
                fromStorageName:fromStorageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv from-storage, za material-movement");
    }
}

export async function findByToStorage_NameContainingIgnoreCase(toStorageName){
    try{
        if(!toStorageName || typeof toStorageName !== "string" || toStorageName.trim() === ""){
            throw new Error("Dati naziv za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/to-storage-name`,{
            params:{
                toStorageName:toStorageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv to-storage, za material-movement");
    }
}

export async function findByFromStorage_LocationContainingIgnoreCase(fromStorageLocation){
    try{
        if(!fromStorageLocation || typeof fromStorageLocation !== "string" || fromStorageLocation.trim() === ""){
            throw new Error("Data lokacija za from-storage, nije pronadjena");
        }
        const response = await api.get(url+`/from-storage-location`,{
            params:{
                fromStorageLocation:fromStorageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju from-storage, za material-movement");
    }
}

export async function findByToStorage_LocationContainingIgnoreCase(toStorageLocation){
    try{
        if(!toStorageLocation || typeof toStorageLocation !== "string" || toStorageLocation.trim() === ""){
            throw new Error("Data lokacija za to-storage, nije pronadjena");
        }
        const response = await api.get(url+`/to-storage-location`,{
            params:{
                toStorageLocation:toStorageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju to-storage, za material-movement");
    }
}

export async function findByFromStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/from-storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet from-storage za material-movement");
    }
}

export async function findByToStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/to-storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet to-storage za material-movement");
    }
}

export async function findByMovementDate(movementDate){
    try{
        if(!moment(movementDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum kretanja za material-movement, nije pronadjen");
        }
        const response = await api.get(url+`/by-movement-date`,{
            params:{
                movementDate:moment(movementDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum kretanja za material-movement");
    }
}

export async function findByMovementDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || 
            !moment(end,"YYYY-MM-DD",true).isValid()){
                throw new Error("Dati datumski opseg za material-movement, nije pronadjen");
            }
        const response = await api.get(url+`/between-dates`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datumski opseg za material-movement");
    }
}

export async function findByMovementDateGreaterThanEqual(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum veci od za material-movement, nije pronadjen");
        }
        const response = await api.get(url+`/date-greater-than-equal`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum veci od, za material-movement");
    }
}

export async function findByMovementDateAfterOrEqual(movementDate){
    try{
        if(!moment(movementDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum posle za material-movement, nije pronadjen");
        }
        const response = await api.get(url+`/by-movement-date-after-equal`,{
            params:{
                movementDate:moment(movementDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle za material-movement");
    }
}

export async function countAvailableCapacityFromStorage(fromStorageId){
    try{
        if(isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/from-storage/${fromStorageId}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupan kapacitet za from-storage");
    }
}

export async function allocateCapacityFromStorage({fromStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id za from-storage i njegova kolicina za alociranje, nisu pronadjeni");
        }
        const response = await api.get(url+`/from-storage/${fromStorageId}/allocate`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu kolicinu za alociranje kapaciteta from-storage");
    }
}

export async function releaseCapacityFromStorage({fromStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id i kolicina za oslobadjanje, nisu pronadjeni");
        }
        const response = await api.get(url+`/from-storage/${fromStorageId}/release`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu za oslobadjanje kapaciteta from-storage");
    }
}

export async function countAvailableCapacityToStorage(toStorageId){
    try{
        if(isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/to-storage/${toStorageId}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupan kapacitet za to-storage");
    }
}

export async function allocateCapacityToStorage({toStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id za to-storage i njegova kolicina za alociranje, nisu pronadjeni");
        }
        const response = await api.get(url+`/to-storage/${toStorageId}/allocate`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu kolicinu za alociranje kapaciteta to-storage");
    }
}

export async function releaseCapacityToStorage({toStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id i kolicina za oslobadjanje, nisu pronadjeni");
        }
        const response = await api.get(url+`/to-storage/${toStorageId}/release`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu za oslobadjanje kapaciteta to-storage");
    }
}

export async function findByFromStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/search/from-storage-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od from-storage,za material-movement");
    }
}

export async function findByToStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/search/to-storage-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od to-storage,za material-movement");
    }
}

export async function findByFromStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/search/from-storage-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od from-storage,za material-movement");
    }
}

export async function findByToStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/search/to-storage-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od to-storage,za material-movement");
    }
}

export async function findByFromStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/search/from-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip from-storage, za material-movement");
    }
}

export async function findByToStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/search/to-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip to-storage, za material-movement");
    }
}

export async function findByFromStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status from-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/from-storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status from-storage za material-movement");
    }
}

export async function findByToStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/to-storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status to-storage za material-movement");
    }
}