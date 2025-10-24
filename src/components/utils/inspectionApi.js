import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/inspections`;
const isInspectionTypeValid = ["INCOMING", "IN_PROCESS", "FINAL_INSPECTION", "PRE_SHIPMENT", "POST_DELIVERY", "AUDIT", "SAMPLING"];
const isInspectionResultValid = ["PASS","FAIL","REWORK","PENDING","ACCEPTED_WITH_DEVIATION","SCRAP","ON_HOLD"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const iseStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isGoodsTypeValid = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isReferenceTypeValid = ["GOODS_RECEIPT","PRODUCTION_ORDER","STORAGE_ITEM","BATCH","MATERIAL"];
const isQualityCheckTypeValid = ["VISUAL","DIMENSIONAL","CHEMICAL","FUNCTIONAL","TEMPERATURE","HUMIDITY","OTHER"];
const isQualityCheckStatusValid = ["PASSED","FILED","CONDITIONAL","PENDING"];
const isInspectionStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createInspection({code,type,date,batchId,productId,inspectorId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId}){
    try{
        const parseQuantityInspected = parseInt(quantityInspected, 10);
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        const parseQuantityRejected = parseInt(quantityRejected,10);
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(
            !code || typeof code !== "string" || code.trim() === "" || !isInspectionTypeValid.includes(type?.toUpperCase()) ||
            !isInspectionResultValid.includes(result?.toUpperCase()) || !validateDate ||
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
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(
            id == null || isNaN(id) ||
            !code || typeof code !== "string" || code.trim() === "" || !isInspectionTypeValid.includes(type?.toUpperCase()) ||
            !isInspectionResultValid.includes(result?.toUpperCase()) || !validateDate ||
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
        if(
            isNaN(parseMinCapacity) || parseMinCapacity <= 0 || isNaN(parseMaxCapacity) || parseMaxCapacity <= 0 ||
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

export async function findByNotesAndType({notes, type}){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === "" || !isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Data beleska "+notes+" i tip inspekcije "+type+" nisu pronadjeni");
        }    
        const response = await api.get(url+`/notes-and-type`,{
            params:{
                notes:notes,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" i tip "+type+" date inspekcije");
    }
}

export async function findByNotesAndResult({notes, result}){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === "" || !isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Data beleska "+notes+" i rezultat inspekcije "+result+" nisu pronadjeni");
        }
        const response = await api.get(url+`/notes-and-result`,{
            params:{
                notes:notes,
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" i rezultat "+result+" za datu inspekciju");
    }
}

export async function findByInspectionDate(inspectionDate){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDate){
            throw new Error("Datum za datu inspekciju "+inspectionDate+" nije pronadjen");
        }
        const response = await api.get(url+`/inspection-date`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum date inspekcije "+inspectionDate);
    }
}

export async function findByInspectionDateBefore(inspectionDate){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDate){
            throw new Error("Datum pre za datu inspekciju "+i+" nije pronadjen");
        }
        const response = await api.get(url+`/inspection-date-before`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre, inspekcije "+inspectionDate);
    }
}

export async function findByInspectionDateAfter(inspectionDate){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDate){
            throw new Error("Datum posle za datu inspekciju "+inspectionDate+" nije pronadjen");
        }
        const response = await api.get(url+`/inspection-date-after`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle, inspekcije "+inspectionDate);
    }
}

export async function findByInspectionDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss").isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Opseg datuma "+start+" - "+end+" inspekcije, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum kraja inspekcije ne sme biti ispred datuma pocetka inspekcije");
        }
        const response = await api.get(url+`/inspection-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" inspekcije");
    }
}

export async function findByInspectionDateAndResult({inspectionDate, result}){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate|| !isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Datum inspekcije "+inspectionDate+" i njen rezultat "+result+" nisu pronadjeni");
        }
        const response = await api.get(url+`/inspection-date-and-result`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss"),
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum inspekcije "+inspectionDate+" i njen rezultat "+result);
    }
}

export async function findByBatchId(batchId){
    try{
        if(isNaN(batchId) || batchId == null){
            throw new Error("Dati batch id "+batchId+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/batch/${batchId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+batchId+" batch-a za inspekciju");
    }
}

export async function findByBatchCode(batchCode){
    try{
        if(!batchCode || typeof batchCode !== "string" || batchCode.trim() === ""){
            throw new Error("Dati batch-code "+batchCode+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch-code`,{
            params:{batchCode:batchCode},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch-code "+batchCode+" za datu inspekciju");
    }
}

export async function existsByBatchCode(batchCode){
    try{
        if(!batchCode || typeof batchCode !== "string" || batchCode.trim() === ""){
            throw new Error("Postojanje batch-code "+batchCode+" za inspekciju, nije pronadjeno");
        }
        const response = await api.get(url+`/exists/batch-code`,{
            params:{
                batchCode:batchCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje batch-code "+batchCode+" za datu inspekciju");
    }
}

export async function findByBatch_ExpiryDate(expiryDate){
    try{
        const validateDate = moment.isMoment(expiryDate) || moment(expiryDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum isticanja "+expiryDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/expiry-date`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isticajna "+expiryDate+" za dati batch");
    }
}

export async function findByBatch_ExpiryDateAfter(expiryDate){
    try{
        const validateDate = moment.isMoment(expiryDate) || moment(expiryDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum isticanja posle "+expiryDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/expiry-date-after`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isticanja posle "+expiryDate+" za dati batch");
    }
}

export async function findByBatch_ExpiryDateBefore(expiryDate){
    try{
        const validateDate = moment.isMoment(expiryDate) || moment(expiryDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum isticanja pre "+expiryDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/expiry-date-before`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isticanja pre "+expiryDate+" za dati batch");
    }
}

export async function findByBatch_ExpiryDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Datum opsega "+start+" - "+end+" isticanja za dati batch, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum isticanja za kraj ne sme biti ispred datuma isticanja za pocetak");
        }
        const response = await api.get(url+`/search/batch/expiry-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum opsega "+start+" - "+end+" isticanja za dati batch");
    }
}

export async function findByBatch_ProductionDate(productionDate){
    try{
        const validateDate = moment.isMoment(productionDate) || moment(productionDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum proizvodnje "+productionDate+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/production-date`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje "+productionDate+" za dati batch");
    }
}

export async function findByBatch_ProductionDateAfter(productionDate){
    try{
        const validateDate = moment.isMoment(productionDate) || moment(productionDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum proizvodnje posle "+productionDate+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/production-date-after`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje posle "+productionDate+" za dati batch");
    }
}

export async function findByBatch_ProductionDateBefore(productionDate){
    try{
        const validateDate = moment.isMoment(productionDate) || moment(productionDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum proizvodnje pre "+productionDate+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/production-date-before`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje pre "+productionDate+" za dati batch");
    }
}

export async function findByBatch_ProductionDateBetween({productionDateStart, productionDateEnd}){
    try{
        const validateDateStart = moment.isMoment(productionDateStart) || moment(productionDateStart,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(productionDateEnd) || moment(productionDateEnd,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Opseg datuma proizvodnje "+productionDateStart+" - "+productionDateEnd+" za batch, nije pronadjen");
        }
        if(moment(productionDateEnd).isBefore(moment(productionDateStart))){
            throw new Error("Datum za kraj proizvodnje ne sme biti ispred datuma za pocetak proizvodnje");
        }
        const response = await api.get(url+`/search/batch/production-date-range`,{
            params:{
                productionDateStart:moment(productionDateStart).format("YYYY-MM-DD"),
                productionDateEnd:moment(productionDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma proizvodnje "+productionDateStart+" - "+productionDateEnd+" za dati batch");
    }
}

export async function findByBatch_ProductionDateEqualsDateNow(){
    try{
        const response = await api.get(url+`/search/batch/production-date-now`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje za batch koji je jednak danasnjem datumu");
    }
}

export async function findByBatch_ExpiryDateLessThanEqualDateNow(){
    try{
        const response = await api.get(url+`/search/batch/expiry-date-less-than-equal-now`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum istica batch-a koji je <= danasnjem datumu");
    }
}

export async function findByBatch_ProductionDateGreaterThanEqualDateNow(){
    try{
        const response = await api.get(url+`/search/batch/production-date-greater-than-now`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutrno nismo pronasli datum proizvodnje batcha >= danasnjem datumu");
    }
}

export async function findByBatch_ExpiryDateGreaterThanEqual(expiryDate){
    try{
        const validateDate = moment.isMoment(expiryDate) || moment().isValid(expiryDate,"YYYY-MM-DD",true);
        if(!validateDate){
            throw new Error("Datum isticanja batcha >= "+expiryDate+" datumu, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/expiry-date-greater-than-equal`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isticanja batch koji je >= "+expiryDate+" datumu");
    }
}

export async function findByBatch_ProductionDateLessThanEqual(productionDate){
    try{
        const validateDate = moment.isMoment(productionDate) || moment().isValid(productionDate,"YYYY-MM-DD",true);
        if(!validateDate){
            throw new Error("Datum proizvodnje batcha <= "+productionDate+" datuum, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/production-date-less-than-equal`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje batcha <= "+productionDate+" datumu");
    }
}

export async function findByBatchExpiryDateAfterToday(){
    try{
        const response = await api.get(url+`/search/batch/expiry-date-after-today`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isticanja batcha posle danasnjeg datuma");
    }
}

export async function findByBatch_ExpiryDateIsNotNull(){
    try{
        const response = await api.get(url+`/search/batch/expiry-date-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isicanja batcha, gde datum isticanja postoji");
    }
}

export async function findByBatch_ProductionDateIsNull(){
    try{
        const response = await api.get(url+`/search/batch/production-date-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje batcha, koji ne postoji");
    }
}

export async function findByBatch_ProductionDateIsNotNull(){
    try{
        const response = await api.get(url+`/search/batch/production-date-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje za batch koji nije null");
    }
}

export async function findByBatch_ExpiryDateIsNull(){
    try{
        const response = await api.get(url+`/search/batch/expiry-date-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isticanja batch-a gde je datum null");
    }
}

export async function findByBatch_QuantityProduced(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Proizvedena kolicina "+parseQuantityProduced+" za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/quantity-produced`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu "+quantityProduced+" za dati batch");
    }
}

export async function findByBatch_QuantityProducedGreaterThan(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Proizvedena kolicina veca od "+parseQuantityProduced+" za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/quantity-produced-greater-than`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu vecu od "+quantityProduced+" za dati batch");
    }
}

export async function findByBatch_QuantityProducedLessThan(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Proizvedena kolicina manja od "+parseQuantityProduced+" za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/quantity-produced-less-than`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu manju od "+quantityProduced+" za dati batch");
    }
}

export async function findByBatch_QuantityProducedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max,10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax  <= 0){
            throw new Error("Opseg proixvedene kolicine "+parseMin+" - "+parseMax+" za dati batch, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna proizvedena kolicina ne sme biti veca od maksimalne proizvedene kolicine");
        }
        const response = await api.get(url+`/search/batch/quantity-produced-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg proizvedene kolicine "+min+" - "+max+" za dati batch");
    }
}

export async function findByBatch_ProductId(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id "+productId+" proizvoda za batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductCurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina "+parseCurrentQuantity+" proizvoda za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/product-current-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductCurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina veca od "+parseCurrentQuantity+" proizvoda za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/product-current-quantity-greater-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu vecu od "+currentQuantity+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductCurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina manja od "+parseCurrentQuantity+" proizvoda za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/product-current-quantity-less-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu manju od "+currentQuantity+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductCurrentQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg proizvedene kolicine "+parseMin+" - "+parseMax+" za dati batch, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna proizvedena kolicina ne sme biti veca od maksimalne proizvedene kolicine");
        }
        const response = await api.get(url+`/search/batch/product-current-quantity-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg proizvedene kolicine "+min+" - "+max+" za dati batch");
    }
}

export async function findByBatch_ProductNameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv proizvoda "+productName+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv proizvoda "+productName+" za dati batch");
    }
}

export async function findByBatch_ProductUnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" proizvoda za dati batch, nije pronadjena");
        }
        const response = await api.get(url+`/search/batch/product-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductSupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Tip dobavljaca "+supplierType+" proizvoda za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca "+supplierType+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductStorageType(storageType){
    try{
        if(!isSupplierTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Tip skladista "+storageType+" proizvoda za batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista "+storageType+" proizvoda za dati batch");
    }
}

export async function findByBatch_ProductGoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Tip robe "+goodsType+" proizvoda za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe "+goodsType+" proizvoda za dati batch");
    }
}

export async function findByBatch_Product_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("ID skladista "+storageId+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista "+storageId+" proizvoda za dati batch");
    }
}

export async function findByBatch_Product_ShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("ID "+shelfId+" police za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police za batch");
    }
}

export async function findByBatch_Product_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("ID "+supplyId+" dobavljaca zadati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/batch/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za dati batch");
    }
}

export async function findByInspectorId(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("ID "+inspectorId+" inspektora za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/inspector/${inspectorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectorId+" inspektora za dati batch");
    }
}

export async function findByInspectorFirstNameContainingIgnoreCaseAndInspectorLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" ||
           !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" inspektora za dati batch, nije pronadjeno");
        }
        const response = await api.get(url+`/search/inspector-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime "+lastName+" inspektora za dati batch");
    }
}

export async function findByInspectorEmailLikeIgnoreCase(inspectorEmail){
    try{
        if(!inspectorEmail || typeof inspectorEmail !== "string" || inspectorEmail.trim() === ""){
            throw new Error("Email "+inspectorEmail+" inspektora za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspector-email`,{
            params:{
                inspectorEmail:inspectorEmail
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+inspectorEmail+" inspektora za dati batch");
    }
}

export async function findByInspectorPhoneNumberLikeIgnoreCase(inspectorPhoneNumber){
    try{
        if(!inspectorPhoneNumber || typeof inspectorPhoneNumber !== "string" || inspectorPhoneNumber.trim() === ""){
            throw new Error("Broj-telefona "+inspectorPhoneNumber+" inspektora za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspector-phone-number`,{
            params:{
                inspectorPhoneNumber:inspectorPhoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+inspectorPhoneNumber+" inspektora za dati batch");
    }
}

export async function findByProductId(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("ID "+productId+" proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda za datu inspekciju");
    }
}

export async function findByProductCurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina "+parseCurrentQuantity+" proizvoda za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" proizvoda za datu inspekciju");
    }
}

export async function findByProductCurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina veca od "+parseCurrentQuantity+" proizvoda za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity-greater-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od "+currentQuantity+" proizvoda za datu inspekciju");
    }
}

export async function findByProductCurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina manja od "+parseCurrentQuantity+" proizvoda za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity-less-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od "+currentQuantity+" proizvoda za datu inspekciju");
    }
}

export async function findByProductCurrentQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg kolicine "+parseMin+" - "+parseMax+" proizvoda za inspekciju, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna kolicna proizvoda ne sme biti veca od maksimalne kolicine proizvoda");
        }
        const response = await api.get(url+`/product-current-quantity-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kolicine "+min+" - "+max+" proizvoda za datu inspekciju");
    }
}

export async function findByProductNameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv "+productName+" proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+productName+" proizvoda za datu inspekciju");
    }
}

export async function findByProductUnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Jedinica mere "+unitMeasure+" proizvoda za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/product-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jednicu mere "+unitMeasure+" proizvoda za datu inspekciju");
    }
}

export async function findByProductSupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Tip "+supplierType+" dobavljaca proizvoda  za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+supplierType+" dobavljaca za datu inspekciju");
    }
}

export async function findByProductStorageType(storageType){
    try{
        if(!iseStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Tip skladista "+storageType+" proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+storageType+" skladista proizvoda za datu inspekciju");
    }
}

export async function findByProductGoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Tip robe "+goodsType+" proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe "+goodsType+" proizvoda za datu inspekciju");
    }
}

export async function findByProduct_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("ID "+supplyId+" dobavljaca proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca proizvoda za datu inspekciju");
    }
}

export async function findByProduct_ShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("ID "+shelfId+" police proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police proizvoda za datu inspekciju");
    }
}

export async function findByProduct_StorageHasShelvesForIsNull(){
    try{
        const response = await api.get(url+`/product/storage-has-shelves`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste bez polica za datu inspekciju");
    }
}

export async function findByProduct_ShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Red polica "+parseRowCount+" proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product/shelf-row-count`,{
            params:{
                rowCount:parseRowCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red police "+rowCount+" proizvoda za datu inspekciju");
    }
}

export async function findByProduct_ShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Dati raf police "+parseCols+" proizvoda za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/product/shelf-cols`,{
            params:{
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli raf "+cols+" police proizvoda za datu inspekciju");
    }
}

export async function findByProduct_ShelfRowAndColNullable({row, col}){
    try{
        const parseRow = parseInt(row,10);
        const parseCol = parseInt(col,10);
        if(isNaN(parseRow) || parseRow <= 0 || isNaN(parseCol) || parseCol <= 0){
            throw new Error("Dati red "+parseRow+" i raf "+parseCol+" police proizvoda za inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/product/shelf-row-col-nullable`,{
            params:{
                row:parseRow,
                col:parseCol
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red "+row+" i raf "+col+" police proizvoda za inspekciju");
    }
}

export async function findByProduct_ShelfRowAndColBetweenNullable({rowMin, rowMax, colMin, colMax}){
    try{
        const parseRowMin = parseInt(rowMin,10);
        const parseRowMax = parseInt(rowMax,10);
        const parseColMin = parseInt(colMin,10);
        const parseColMax = parseInt(colMax,10);
        if(isNaN(parseRowMin) || parseRowMin <= 0 || isNaN(parseRowMax) || 
            parseRowMax <= 0 || isNaN(parseColMin) || parseColMin <= 0 || isNaN(parseColMax) || parseColMax <= 0){
            throw new Error("Opseg redova "+parseRowMin+" - "+parseRowMax+" i opseg rafova "+parseColMin+" - "+parseColMax+" polica za datu inspekciju, nisu pronadjeni");
        }
        if(parseRowMin > parseRowMax){
            throw new Error("Opseg redova mora biti pozitivan broj");
        }
        if(parseColMin > parseColMax){
            throw new Error("Opseg rafova mora biti pozitivan broj");
        }
        const response = await api.get(url+`/product/shelf/row-range-and-col-range-nullable`,{
            params:{
                rowMin:parseRowMin,
                rowMax:parseRowMax,
                colMin:parseColMin,
                colMax:parseColMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg redova "+rowMin+" - "+rowMax+" i opseg rafova "+colMin+" - "+colMax+" polica za datu inspekciju");
    }
}

export async function findByQuantityInspected(quantityInspected){
    try{
        const parseQuantityInspected = parseInt(quantityInspected,10);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina "+parseQuantityInspected+" za datu inspekciju, nije proandjena");
        }
        const response = await api.get(url+`/quantity-inspected`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pregledanu kolicinu "+quantityInspected+" za datu inspekciju");
    }
}

export async function findByQuantityInspectedGreaterThan(quantityInspected){
    try{
        const parseQuantityInspected = parseInt(quantityInspected,10);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina veca od "+parseQuantityInspected+" za datu inspekciju, nije proandjena");
        }
        const response = await api.get(url+`/quantity-inspected-greater-than`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pregledanu kolicinu vecu od "+quantityInspected+" za datu inspekciju");
    }
}

export async function findByQuantityInspectedLessThan(quantityInspected){
    try{
        const parseQuantityInspected = parseInt(quantityInspected,10);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina manja od "+parseQuantityInspected+" za datu inspekciju, nije proandjena");
        }
        const response = await api.get(url+`/quantity-inspected-less-than`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pregledanu kolicinu manju od "+quantityInspected+" za datu inspekciju");
    }
}

export async function findByQuantityInspectedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max, 10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg pregledane kolicine "+parseMin+" - "+parseMax+" za datu inspekciju, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna pregledana kolicina ne sme biti veca od maksimalne pregledane kolicine"); 
        }
        const response = await api.get(url+`/quantity-inspected-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg pregledane kolicine "+min+" - "+max+" za datu inspekciju");
    }
}

export async function findByQuantityAccepted(quantityAccepted){
    try{
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina "+parseQuantityAccepted+" za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(irl+`/quantity-accepted`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihvacenu kolicinu "+quantityAccepted+" za datu inspekciju");
    }
}

export async function findByQuantityAcceptedGreaterThan(quantityAccepted){
    try{
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina veca od "+parseQuantityAccepted+" za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(irl+`/quantity-accepted-greater-than`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihvacenu kolicinu vecu od "+quantityAccepted+" za datu inspekciju");
    }
}

export async function findByQuantityAcceptedLessThan(quantityAccepted){
    try{
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina manja od "+parseQuantityAccepted+" za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(irl+`/quantity-accepted-less-than`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihvacenu kolicinu manju od "+quantityAccepted+" za datu inspekciju");
    }
}

export async function findByQuantityAcceptedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max, 10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg prihvacene kolicine "+parseMin+" - "+parseMax+" za datu inspekciju, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna prihvacena kolicina ne sme biti veca od maksimalne prihvacene kolicine");
        }
        const response = await api.get(url+`/quantity-accepted-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg prihvacene kolicine "+min+" - "+max+" za datu inspekciju");
    }
}

export async function findByQuantityRejected(quantityRejected){
    try{
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina "+parseQuantityRejected+" za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/quantity-rejected`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu "+quantityRejected+" za datu inspekciju");
    }
}

export async function findByQuantityRejectedGreaterThan(quantityRejected){
    try{
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina veca od "+parseQuantityRejected+" za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/quantity-rejected-greater-than`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu vecu od "+quantityRejected+" za datu inspekciju");
    }
}

export async function findByQuantityRejectedLessThan(quantityRejected){
    try{
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina manja od "+parseQuantityRejected+" za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/quantity-rejected-less-than`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu manju od "+quantityRejected+" za datu inspekciju");
    }
}

export async function findByQuantityRejectedBetween({min, max}){
    try{
        const parseMin = parseInt(min, 10);
        const parseMax = parseInt(max, 10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg odbacene kolicine "+parseMin+" - "+parseMax+" za datu inspekciju, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna odbacena kolicina ne sme biti veca od maksimalne odbacena kolicine");
        }
        const response = await api.get(url+`/quantity-rejected-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg odbacene kolicine "+min+" - "+max+" za datu inspekciju");
    }
}

export async function findByQualityCheckId(qualityCheckId){
    try{
        if(isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("Dati ID "+qualityCheckId+" potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/${qualityCheckId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+qualityCheckId+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckLocDate(locDate){
    try{
        const validateDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDate){
            throw new Error("Dati datum "+locDate+" potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/loc-date`,{
            params:{
                locDate:moment(locDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+locDate+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckLocDateAfter(locDate){
    try{
        const validateDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDate){
            throw new Error("Dati datum posle "+locDate+" potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/loc-date-after`,{
            params:{
                locDate:moment(locDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+locDate+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckLocDateBefore(locDate){
    try{
        const validateDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateDate){
            throw new Error("Dati datum pre "+locDate+" potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/loc-date-before`,{
            params:{
                locDate:moment(locDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+locDate+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckLocDateBetween({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss").isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Datum opsega "+start+" - "+end+" potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj pootvrde-kvaliteta ne sme niti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/quality-check/loc-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckNotes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Beleska "+notes+" potvrde-kvaliteta za datu inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/quality-check-notes"`,{
            params:{
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckReferenceId(referenceId){
    try{
        const parseRefernceId = parseInt(referenceId);
        if(isNaN(parseRefernceId) || parseRefernceId <= 0){
            throw new Error("ID "+parseRefernceId+" reference potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/reference-id`,{
            params:{
                referenceId:parseRefernceId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+referenceId+" reference potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheckReferenceType(referenceType){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" potvrde-kvaliteta za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/by-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" potvrde-kvaliteta za datu inspekciju");
    }
}

export async function findByQualityCheck_CheckType(checkType){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Tip potvrde-kvaliteta "+checkType+" za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/by-check-type`,{
            params:{
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip potvrde-kvaliteta "+checkType+" za datu inspekciju");
    }
}

export async function findByQualityCheck_Status(status){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status potvrde-kvaliteta "+status+" za datu inspekciju. nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/by-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status potvrde-kvaliteta "+status+" za datu inspekciju");
    }
}

export async function findByQualityCheck_ReferenceTypeAndQualityCheck_CheckType({referenceType, checkType}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" i potvrde-kvaliteta "+checkType+" za datu inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/quality-check/reference-type-and-check-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" i tip potvrde-kvaliteta "+checkType+" za datu inspekciju");
    }
}

export async function findByQualityCheck_ReferenceTypeAndQualityCheck_Status({referenceType, status}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" i status potvrde-kvaliteta "+status+" za datu inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/quality-check/reference-type-and-status`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" i status potvrde-kvaliteta "+status+" za datu inspekciju");
    }
}

export async function findByQualityCheck_CheckTypeAndQualityCheck_Status({checkType, status}){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Tip "+checkType+" i status potvrde-kvaliteta "+status+" za datu inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/quality-check/by-check-type-and-status`,{
            params:{
                checkType:(checkType  || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+checkType+" i status potvrde-kvaliteta "+status+" za datu inspekciju");
    }
}

export async function findByQualityCheckInspectorId(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("Dati id "+inspectorId+" inspektora za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/inspector/${inspectorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectorId+" inspektora za datu inspekciju");
    }
}

export async function findByQualityCheckInspectorEmailLikeIgnoreCase(inspectorEmail){
    try{
        if(!inspectorEmail || typeof inspectorEmail !== "string" || inspectorEmail.trim() === ""){
            throw new Error("Email "+inspectorEmail+" inspektora za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/inspector-email`,{
            params:{
                inspectorEmail:inspectorEmail
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(errorr){
        handleApiError(errorr,"Trenutno nismo pronasli email "+inspectorEmail+" inspektora za datu inspekciju");
    }
}

export async function findByQualityCheckInspectorPhoneNumberLikeIgnoreCase(inspectorPhoneNumber){
    try{
        if(!inspectorPhoneNumber || typeof inspectorPhoneNumber !== "string" || inspectorPhoneNumber.trim() === ""){
            throw new Error("Broj-telefona "+inspectorPhoneNumber+" inspektora za datu inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/quality-check/inspector-phone-number`,{
            params:{
                inspectorPhoneNumber:inspectorPhoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+inspectorPhoneNumber+" inspektora za datu inspekciju");
    }
}

export async function findByQualityCheckInspectorFirstNameContainingIgnoreCaseAndQualityCheckInspectorLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" || !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" inspektora za datu inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/quality-check/inspector-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime "+lastName+" inspektora za datu inspekciju");
    }
}

export async function countQuantityInspectedByBatch(){
    try{
        const response = await api.get(url+`/count/quantity-inspected-batch`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj pregledane kolicine za batch");
    }
}

export async function countQuantityRejectedByBatch(){
    try{
        const response = await api.get(url+`/count/quantity-rejected-batch`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj odbacene kolicine za batch");
    }
}

export async function countQuantityAcceptedByBatch(){
    try{
        const response = await api.get(url+`/count/quantity-accepted-batch`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj prihvacene kolicine za batch");
    }
}

export async function countQuantityInspectedByProduct(){
    try{
        const response = await api.get(url+`/count/quantity-inspected-product`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj pregledane kolicine za proizvod");
    }
}

export async function countQuantityAcceptedByProduct(){
    try{
        const response = await api.get(url+`/count/quantity-accepted-product`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj prihvacene kolicine za proizvod");
    }
}

export async function countQuantityRejectedByProduct(){
    try{
        const response = await api.get(url+`/count/quantity-rejected-product`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj odbacene kolicine za proizvod");
    }
}

export async function countQuantityInspectedByInspector(){
    try{
        const response = await api.get(url+`/count/quantity-inspected-inspector`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj pregledane kolicine od strane ispektora");
    }
}

export async function countQuantityAcceptedByInspector(){
    try{
        const response = await api.get(url+`/count/quantity-accepted-inspector`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj prihvacene kolicine od strane ispektora");
    }
}

export async function countQuantityRejectedByInspector(){
    try{
        const response = await api.get(url+`/count/quantity-rejected-inspector`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj odbacene kolicine od strane ispektora");
    }
}

export async function countQuantityInspectedByQualityCheck(){
    try{
        const response = await api.get(url+`/count/quantity-inspected-quality-check`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj pregledane kolicine za potvrdu kvaliteta");
    }
}

export async function countQuantityAcceptedByQualityCheck(){
    try{
        const response = await api.get(url+`/count/quantity-accepted-quality-check`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj prihvacene kolicine za potvrdu kvaliteta");
    }
}

export async function countQuantityRejectedByQualityCheck(){
    try{
        const response = await api.get(url+`/count/quantity-rejected-quality-check`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj odbacene kolicine za potvrdu kvaliteta");
    }
}

export async function countInspectionByType(){
    try{
        const response = await api.get(url+`/count/by-type`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj inspekcija po datom tipu");
    }
}

export async function countInspectionByResult(){
    try{
        const response = await api.get(url+`/count/by-result`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj inspekcija po datom tipu rezultata");
    }
}

export async function trackInspectionByInspectionDefect(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" pracenja inspekcije prema inspekciji defekta, nije pronadjen");
        }
        const response = await api.get(url+`/track-inspection-defect/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" inspekcije za pracenje prema inspekciji defekta");
    }
}

export async function trackInspectionByTestMeasurement(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" pracenja inspekcije prema merama testiranja, nije pronadjen");
        }
        const response = await api.get(url+`/track-test-measurement/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" inspekcije za pracenje prema merama testiranja");
    }
}

export async function findByReports({id, notes}){
    try{
        if(isNaN(id) || id == null || !notes?.trim()){
            throw new Error("Dati id "+id+" i zapis "+notes+" date inspekcije, nisu pronadjeni");
        }
        const response = await api.get(url+`/reports`,{
            params:{
                id : id,
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli izvestaj po "+id+" id-iju i datom zapisu "+notes);
    }
}

export async function confirmInspection(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id"+id+" za potvrdjivanje inspekcije, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za potvrdjivanje date inspekcije");
    }
}

export async function cancelInspection(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id"+id+" za otkaziveanje inspekcije, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za otkazivanje date inspekcije");
    }
}

export async function closeInspection(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id"+id+" za zatvaranje inspekcije, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za zatvaranje date inspekcije");
    }
}

export async function changeStatus({id, status}){
    try{
            if(isNaN(id) || id == null || !isInspectionStatusValid.includes(status?.toUpperCase())){
                throw new Error("ID "+id+" i status inspekcije "+status+" nisu pronadjeni");
            }
            const response = await api.post(url+`/${id}/status/${status}`,{
                headers:getHeader()
            });
            return response.data;
        }
        catch(error){
             handleApiError(error,"Trenutno nismo pronasli id "+id+" i status inspekcije "+status);
        }
}

export async function saveInspection({code,type,batchId, productId,inspectionId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId,status,confirmed = false}){
    try{
        const parseQuantityInspected = parseInt(quantityInspected, 10);
        const parseQuantityAccepted = parseInt(quantityAccepted, 10);
        const parseQuantityRejected = parseInt(quantityRejected, 10);
        if(!code?.trim()){
            throw new Error("Kod date inspekcije, mora biti unet");
        }
        if(!isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Tip inspekcije, mora biti izabran");
        }
        if(isNaN(productId) || productId == null){
            throw new Error("Neispravan id za prozivod");
        }
        if(isNaN(batchId) || batchId == null){
            throw new Error("Neisparavan id za batch");
        }
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Neispravan id za inspektora");
        }
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina, mora biti ceo broj");
        }
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina, mora biti ceo broj");
        }
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicna, mora biti ceo broj");
        }
        if(!notes?.trim()){
            throw new Error("Zapis se mora uneti");
        }
        if(!isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Tip rezultata inspekcije, se mora izabrati");
        }
        if(isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("Neispravan id za potvrdu kvaliteta");
        }
        if(!isInspectionStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status inspekcije, se mora izabrati");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrda, mora biti: tacno ili netacno");
        }
        const requestBody = {code,type,batchId, productId,inspectionId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,code,type,batchId,productId,inspectionId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId}){
    try{
        const parseQuantityInspected = parseInt(quantityInspected, 10);
        const parseQuantityAccepted = parseInt(quantityAccepted, 10);
        const parseQuantityRejected = parseInt(quantityRejected, 10);
        if(sourceId === undefined || sourceId == null || Number.isNaN(Number(sourceId))){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(!code?.trim()){
            throw new Error("Kod date inspekcije, mora biti unet");
        }
        if(!isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Tip inspekcije, mora biti izabran");
        }
        if(isNaN(productId) || productId == null){
            throw new Error("Neispravan id za prozivod");
        }
        if(isNaN(batchId) || batchId == null){
            throw new Error("Neisparavan id za batch");
        }
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Neispravan id za inspektora");
        }
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina, mora biti ceo broj");
        }
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina, mora biti ceo broj");
        }
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicna, mora biti ceo broj");
        }
        if(!notes?.trim()){
            throw new Error("Zapis se mora uneti");
        }
        if(!isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Tip rezultata inspekcije, se mora izabrati");
        }
        if(isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("Neispravan id za potvrdu kvaliteta");
        }
        const requestBody = {code,type,batchId,productId,inspectionId,quantityInspected,quantityAccepted,quantityRejected,notes,result,qualityCheckId};
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if (!Array.isArray(requests) || requests.length === 0) {
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        for(let i = 0; i < requests.length; i++){
            const req = requests[i];
            if (req.id == null || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'id' je obavezan i mora biti broj`);
            }
            if(!req.code?.trim()){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'kod' inspekcije je obavezan`);
            }
            if (!req.type || !isInspectionTypeValid.includes(req.status.toUpperCase())) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'tip' inspekcije nije ispravan`);
            }
            if (req.batchId == null || Number.isNaN(Number(req.batchId))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'batchId' je obavezan i mora biti broj`);
            }
            if (req.productId == null || Number.isNaN(Number(req.productId))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'productId' je obavezan i mora biti broj`);
            }
            if (req.inspectionId == null || Number.isNaN(Number(req.inspectionId))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'inspectionId' je obavezan i mora biti broj`);
            }
            const parseQuantityInspected = parseInt(req.quantityInspected, 10);
            const parseQuantityAccepted = parseInt(req.quantityAccepted, 10);
            const parseQuantityRejected = parseInt(req.quantityRejected, 10);
            if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'pregledana-kolicina' mora biti ceo broj`);
            }
            if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'prihvacena-kolicina' mora biti ceo broj`);
            }
            if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'odbacena-kolicina' mora biti ceo broj`);
            }
            if(!req.notes?.trim()){
                throw new Error(`Nevalida zahteva na indexu ${i}: 'zapis' je obavezan`);
            }
            if(!req.result || !isInspectionResultValid.includes(req.result?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'tip-rezultata' nije ispravan`);
            }
            if (req.qualityCheckId == null || Number.isNaN(Number(req.qualityCheckId))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'qualityCheckId' je obavezan i mora biti broj`);
            }
            if(!req.status || !isInspectionStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'status-inspekcije' nije ispravan`);
            }
            if(!req.confirmed || typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'confirmed' mora biti true ili false`);
            }
        }
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
}

export async function generalSearch(filters = {}){
    try{
        const cleanedFilters = cleanFilters(filters);
        const response = await api.post(url+`/general-search`,cleanedFilters,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom generalne pretrage");
    }
}