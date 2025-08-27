import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/inspections`;
const isInspectionTypeValid = ["INCOMING", "IN_PROCESS", "FINAL", "PRE_SHIPMENT", "POST_DELIVERY", "AUDIT", "SAMPLING"];
const isInspectionResultValid = ["PASS","FAIL","REWORK","PENDING","ACCEPTED_WITH_DEVIATION","SCRAP","ON_HOLD"];


export async function createInspection({code,type,date,batchId,productId,inspectorId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId}){
    try{
        const parseQuantityInspected = parseInt(quantityInspected, 10);
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(!code || typeof code !== "string" || code.trim() === "" || !isInspectionTypeValid.includes(type?.toUpperCase()) ||
           !isInspectionResultValid.includes(result?.toUpperCase()) || !moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           isNaN(batchId) || batchId == null || isNaN(productId) || productId == null || isNaN(inspectorId) || inspectorId == null ||
           isNaN(parseQuantityInspected) || parseQuantityInspected <= 0 || isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0 ||
           isNaN(parseQuantityRejected) || parseQuantityRejected <= 0 || !notes || typeof notes !== "string" || notes.trim() === "" ||
           isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {code,type,date,batchId,productId,inspectorId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId};
        const response = await api.post(url+`/create/new-inspection`,requestBody,{
            headers:getHeade()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja inspekcije");
    }
}

export async function updateInspection({id,code,type,date,batchId,productId,inspectorId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId}){
    try{
        const parseQuantityInspected = parseInt(quantityInspected, 10);
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(id) || id == null ||
           !code || typeof code !== "string" || code.trim() === "" || !isInspectionTypeValid.includes(type?.toUpperCase()) ||
           !isInspectionResultValid.includes(result?.toUpperCase()) || !moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           isNaN(batchId) || batchId == null || isNaN(productId) || productId == null || isNaN(inspectorId) || inspectorId == null ||
           isNaN(parseQuantityInspected) || parseQuantityInspected <= 0 || isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0 ||
           isNaN(parseQuantityRejected) || parseQuantityRejected <= 0 || !notes || typeof notes !== "string" || notes.trim() === "" ||
           isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {code,type,date,batchId,productId,inspectorId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeade()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja inspekcije");
    }
}

export async function deleteInspection(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za inspekciju, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja inspekcije po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jedne inspekcije po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih inspekcija");
    }
}

export async function searchInspections({storageName, storageLocation, minCapacity, maxCapacity}){
    try{
        const parseMinCapacity = parseFloat(minCapacity);
        const parseMaxCapacity = parseFloat(maxCapacity);
        if(isNaN(parseMinCapacity) || parseMinCapacity <= 0 || isNaN(parseMaxCapacity) || parseMaxCapacity <= 0 ||
          !storageName || typeof storageName !== "string" || storageName.trim() === "" ||
          !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Parametri za pretragu: "+parseMinCapacity+" ,"+parseMaxCapacity+" ,"+storageLocation+" ,"+storageName+" ne daju ocekivani rezultat");
        }
        if(parseMinCapacity > parseMaxCapacity){
            throw new Error("Minimalni kapacitet ne sme biti veci od maksimalnog kapaciteta");
        }
        const response = await api.get(url+`/search-inspections`,{
            params:{
                storageName:storageName,
                storageLocation:storageLocation,
                minCapacity:parseMinCapacity,
                maxCapacity:parseMaxCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Dati parametri: "+storageName+" ,"+storageLocation+" ,"+minCapacity+" ,"+maxCapacity+" ne daju ocekivani rezultat");
    }
}

export async function getQuantityInspected(inspectionId){
    try{
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Dati id "+inspectionId+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-inspected/${inspectionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectionId+" inspekcije za proverenu kolicinu");
    }
}

export async function getQuantityAccepted(inspectionId){
    try{
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Dati id "+inspectionId+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-accepted/${inspectionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectionId+" inspekcije za prihvacenu kolicinu");
    }
}

export async function getQuantityRejected(inspectionId){
    try{
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Dati id "+inspectionId+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-rejected/${inspectionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectionId+" inspekcije za odbacenu kolicinu");
    }
}

export async function getQuantityInspectedSummary(){
    try{
        const response = await api.get(url+`/quantity-inspected-summary`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir pregledane kolicine");
    }
}

export async function getQuantityAcceptedSummary(){
    try{
        const response = await api.get(url+`/quantity-accepted-summary`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir prihvacene kolicine");
    }
}

export async function getQuantityRejectedSummary(){
    try{
        const response = await api.get(url+`/quantity-rejected-summary`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir odbacene kolicine");
    }
}

export async function existsByCode(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" inspekcije, ne postoji");
        }
        const response = await api.get(url+`/exists/by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje koda "+code+" za inspekciju");
    }
}

export async function findByCode(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-code`,{
            params:{
                code:code
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod "+code+" za datu inspekciju");
    }
}

export async function findByType(type){
    try{
        if(!isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:handleApiError()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" za datu inspekciju");
    }
}

export async function findByResult(result){
    try{
        if(!isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Dati rezultat "+result+" inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/by-result`,{
            params:{
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat "+result+" za datu inspekciju");
    }
}

export async function findByNotes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Data beleska "+notes+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-notes`,{
            params:{notes:notes},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" za datu inspekciju");
    }
}

export async function findByTypeAndResult({type, result}){
    try{
        if(!isInspectionResultValid.includes(result?.toUpperCase()) || !isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" i rezultat "+result+" inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/type-and-result`,{
            params:{
                type:(type || "").toUpperCase(),
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" i rezultat "+result+" date inspekcije");
    }
}

