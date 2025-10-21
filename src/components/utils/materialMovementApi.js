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
        const validateDate = moment.isMoment(movementDate) || moment(movementDate,"YYYY-MM-DD",true).isValid();
        const parseQuantity = parseFloat(quantity);
        if(
            isNaN(materialId) || materialId == null || 
            !validateDate ||
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
        const validateDate = moment.isMoment(movementDate) || moment(movementDate,"YYYY-MM-DD",true).isValid();
        const parseQuantity = parseFloat(quantity);
        if(
            id == null || isNaN(id) ||
            isNaN(materialId) || materialId == null || 
            !validateDate ||
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
            throw new Error("Dati id "+id+" nije pronadjen");
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
            throw new Error("Dati id "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-movement po "+id+" id-iju");
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
            throw new Error("Dati tip "+type+" za material-movement, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovom tipu "+type);
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+" za material-movement nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovoj kolicini "+quantity);
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za material-movement veca od "+parseQuantity+", nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovoj kolicini vecoj od "+quantity);
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za material-movement manja od "+parseQuantity+", nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli material-movement po njegovoj kolicini manjoj od "+quantity);
    }
}

export async function findByFromStorage_Id(fromStorageId){
    try{
        if(isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id "+fromStorageId+" za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/fromStorage/${fromStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement koji dolazi od "+fromStorageId+" skladista");
    }
}

export async function findByToStorage_Id(toStorageId){
    try{
        if(isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id "+toStorageId+" za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/toStorage/${toStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli material-movement koji dolazi do skladista "+toStorageId);
    }
}

export async function findByFromStorage_NameContainingIgnoreCase(fromStorageName){
    try{
        if(!fromStorageName || typeof fromStorageName !== "string" || fromStorageName.trim() === ""){
            throw new Error("Dati naziv "+fromStorageName+" za from-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+fromStorageName+" from-storage, za material-movement");
    }
}

export async function findByToStorage_NameContainingIgnoreCase(toStorageName){
    try{
        if(!toStorageName || typeof toStorageName !== "string" || toStorageName.trim() === ""){
            throw new Error("Dati naziv "+toStorageName+" za to-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+toStorageName+" to-storage, za material-movement");
    }
}

export async function findByFromStorage_LocationContainingIgnoreCase(fromStorageLocation){
    try{
        if(!fromStorageLocation || typeof fromStorageLocation !== "string" || fromStorageLocation.trim() === ""){
            throw new Error("Data lokacija "+fromStorageLocation+" za from-storage, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+fromStorageLocation+" from-storage, za material-movement");
    }
}

export async function findByToStorage_LocationContainingIgnoreCase(toStorageLocation){
    try{
        if(!toStorageLocation || typeof toStorageLocation !== "string" || toStorageLocation.trim() === ""){
            throw new Error("Data lokacija "+toStorageLocation+" za to-storage, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+toStorageLocation+"to-storage, za material-movement");
    }
}

export async function findByFromStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/from-storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" from-storage za material-movement");
    }
}

export async function findByToStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/to-storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" to-storage za material-movement");
    }
}

export async function findByMovementDate(movementDate){
    try{
        const validateDate = moment.isMoment(movementDate) || moment(movementDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum kretanja "+movementDate+" za material-movement, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum "+movementDate+" kretanja za material-movement");
    }
}

export async function findByMovementDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati datumski opseg "+start+" - "+end+" za material-movement, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Trenutno nismo pronasli datumski opseg "+start+" - "+end+" za material-movement");
    }
}

export async function findByMovementDateGreaterThanEqual(date){
    try{
        const validateDateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart){
            throw new Error("Dati datum veci od "+date+" za material-movement, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum veci od "+date+" za material-movement");
    }
}

export async function findByMovementDateAfterOrEqual(movementDate){
    try{
        const validateDateStart = moment.isMoment(movementDate) || moment(movementDate,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart){
            throw new Error("Dati datum posle "+movementDate+" za material-movement, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum posle "+movementDate+" za material-movement");
    }
}

export async function countAvailableCapacityFromStorage(fromStorageId){
    try{
        if(isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id "+fromStorageId+" za from-storage, nije pronadjen");
        }
        const response = await api.get(url+`/from-storage/${fromStorageId}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupan kapacitet za from-storage po "+fromStorageId+" id-iju");
    }
}

export async function allocateCapacityFromStorage({fromStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id "+fromStorageId+" za from-storage i njegova kolicina "+parseAmount+" za alociranje, nisu pronadjeni");
        }
        const response = await api.get(url+`/from-storage/${fromStorageId}/allocate`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu kolicinu "+amount+" za alociranje kapaciteta from-storage");
    }
}

export async function releaseCapacityFromStorage({fromStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(fromStorageId) || fromStorageId == null){
            throw new Error("Dati id "+fromStorageId+" i kolicina za oslobadjanje "+parseAmount+", nisu pronadjeni");
        }
        const response = await api.get(url+`/from-storage/${fromStorageId}/release`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+amount+" za oslobadjanje kapaciteta from-storage");
    }
}

export async function countAvailableCapacityToStorage(toStorageId){
    try{
        if(isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id "+toStorageId+" za to-storage, nije pronadjen");
        }
        const response = await api.get(url+`/to-storage/${toStorageId}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupan kapacitet za to-storage po "+toStorageId+" id-iju");
    }
}

export async function allocateCapacityToStorage({toStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount)  || parseAmount <= 0 || isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id "+toStorageId+" za to-storage i njegova kolicina "+parseAmount+" za alociranje, nisu pronadjeni");
        }
        const response = await api.get(url+`/to-storage/${toStorageId}/allocate`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu kolicinu "+amount+" za alociranje kapaciteta to-storage");
    }
}

export async function releaseCapacityToStorage({toStorageId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0 || isNaN(toStorageId) || toStorageId == null){
            throw new Error("Dati id "+toStorageId+" i kolicina "+parseAmount+" za oslobadjanje, nisu pronadjeni");
        }
        const response = await api.get(url+`/to-storage/${toStorageId}/release`,{
            params:{amount: parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+amount+" za oslobadjanje kapaciteta to-storage");
    }
}

export async function findByFromStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" za from-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od "+capacity+" from-storage,za material-movement");
    }
}

export async function findByToStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" za to-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od "+capacity+" to-storage,za material-movement");
    }
}

export async function findByFromStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" za from-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od "+capacity+" from-storage,za material-movement");
    }
}

export async function findByToStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" za to-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od "+capacity+" to-storage,za material-movement");
    }
}

export async function findByFromStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" za from-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" from-storage, za material-movement");
    }
}

export async function findByToStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" za to-storage, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" to-storage, za material-movement");
    }
}

export async function findByFromStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" from-storage nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" from-storage za material-movement");
    }
}

export async function findByToStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" to-storage nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" to-storage za material-movement");
    }
}