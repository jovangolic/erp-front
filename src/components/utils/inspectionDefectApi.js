import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/inspectionDefects`;
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
const isSeverityLevelValid = ["TRIVIAL_SEVERITY", "MINOR_SEVERITY", "MODERATE_SEVERITY", "MAJOR_SEVERITY", "CRITICAL_SEVERITY"];

export async function createInspectionDefect({quantityAffected,inspectionId,defectId}){
    try{    
        const parseQuantityAffected = parseInt(quantityAffected,10);
        if(
            isNaN(parseQuantityAffected) || parseQuantityAffected <= 0 || isNaN(inspectionId) || inspectionId == null ||
            isNaN(defectId) || defectId == null){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {quantityAffected,inspectionId,defectId};
        const response = await api.post(url+`/crete/new-inspectionDefects`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja inspection-defect");
    }
}

export async function updateInspectionDefect({id,quantityAffected,inspectionId,defectId}){
    try{    
        const parseQuantityAffected = parseInt(quantityAffected,10);
        if(
            id == null || isNaN(id) ||
            isNaN(parseQuantityAffected) || parseQuantityAffected <= 0 || isNaN(inspectionId) || inspectionId == null ||
            isNaN(defectId) || defectId == null){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {quantityAffected,inspectionId,defectId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja inspection-defect");
    }
}

export async function deleteInspectionDefect(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za inspection-defect, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja inspection-defect po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska rpilikom trazenja jednog inspection-defect po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih inspection-defects");
    }
}

export async function findByQuantityAffected(quantityAffected){
    try{
        const parseQuantityAffected = parseInt(quantityAffected,10);
        if(isNaN(parseQuantityAffected) || parseQuantityAffected <= 0){
            throw new Error("Data obuhvacena kolicina "+parseQuantityAffected+" za inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-affected`,{
            params:{
                quantityAffected:parseQuantityAffected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli obuhvacenu kolicinu "+quantityAffected+" za dati inspection-defect");
    }
}

export async function findByQuantityAffectedGreaterThan(quantityAffected){
    try{
        const parseQuantityAffected = parseInt(quantityAffected,10);
        if(isNaN(parseQuantityAffected) || parseQuantityAffected <= 0){
            throw new Error("Obuhvacena kolicina veca od "+parseQuantityAffected+" za inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-affected-greater-than`,{
            params:{
                quantityAffected:parseQuantityAffected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli obuhvacenu kolicinu vecu od "+quantityAffected+" za dati inspection-defect");
    }
}

export async function findByQuantityAffectedLessThan(quantityAffected){
    try{
        const parseQuantityAffected = parseInt(quantityAffected,10);
        if(isNaN(parseQuantityAffected) || parseQuantityAffected <= 0){
            throw new Error("Obuhvacena kolicina manja od "+parseQuantityAffected+" za inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-affected-less-than`,{
            params:{
                quantityAffected:parseQuantityAffected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli obuhvacenu kolicinu manju od "+quantityAffected+" za dati inspection-defect");
    }
}

export async function findByQuantityAffectedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max,10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg obuhvacene kolicine "+parseMin+" - "+parseMax+" za dati inspection-defect, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna obuhvacena kolicina ne sme biti veca od maksimalne obuhvacene kolicine");
        }
        const response = await api.get(irl+`/by-quantity-affected-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg obuhvacene kolicine "+min+" - "+max+" za dati inspection-defect");
    }
}

export async function findByInspectionId(inspectionId){
    try{
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Dati id "+inspectionId+" inspekcije za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/inspection/${inspectionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectionId+" inspekcije za dati inspection-defect");
    }
}

export async function existsByInspectionCode(inspectionCode){
    try{
        if(!inspectionCode || typeof inspectionCode !== "string" || inspectionCode.trim() === ""){
            throw new Error("Dati inspekcijski kod "+inspectionCode+" za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/exist/inspection-code`,{
            params:{
                inspectionCode:inspectionCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje "+inspectionCode+" inspekcijskog koda za dati inspection-defect");
    }
}

export async function findByInspection_CodeLikeIgnoreCase(inspectionCode){
    try{
        if(!inspectionCode || typeof inspectionCode !== "string" || inspectionCode.trim() === ""){
            throw new Error("Dati inspekcijski kod "+inspectionCode+" za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-code`,{
            params:{
                inspectionCode:inspectionCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli "+inspectionCode+" inspekcijski kod za dati inspection-defect");
    }
}

export async function findByInspection_Type(type){
    try{
        if(!isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" inspekcije za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" inspekcije za inspcetion-defect");
    }
}

export async function findByInspection_Result(result){
    try{
        if(!isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Dati rezultat "+result+" inspekcije za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-result`,{
            params:{
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat "+result+" inspekcije za dati inspection-defect");
    }
}

export async function findByInspection_Notes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Data beleska "+notes+" inspekcije za inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection-notes`,{
            params:{
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" inspekcije za dati inspection-defect");
    }
}

export async function findByInspection_TypeAndInspection_Result({type, result}){
    try{
        if(!isInspectionResultValid.includes(result?.toUpperCase()) || !isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Tip "+type+" i rezultat "+result+" inspekcije za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection-type-and-result`,{
            params:{
                result:(result || "").toUpperCase(),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" i rezultat "+result+" inspekcije za dati inspection-defect");
    }
}

export async function findByInspection_NotesAndInspection_Type({notes, type}){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === "" || !isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Beleska "+notes+" i tip "+type+" inspekcije za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection-notes-and-type`,{
            params:{
                notes:notes,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" i tip "+type+" inspekcije za dati inspection-defect");
    }
}

export async function findByInspection_NotesAndInspection_Result({notes, result}){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === "" || !isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Beleska "+notes+" i rezultat "+result+" inspekcije za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection-notes-result`,{
            params:{
                notes:notes,
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" i rezultat "+result+" inspekcije za dati inspection-defect");
    }
}

export async function findByInspection_InspectionDate(inspectionDate){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum inspekcije "+inspectionDate+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum inspekcije "+inspectionDate+" za dati inspection-defect");
    }
}

export async function findByInspection_InspectionDateBefore(inspectionDate){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum inspekcije pre "+inspectionDate+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date-before`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum inspekcije pre "+inspectionDate+" za dati inspection-defect");
    }
}

export async function findByInspection_InspectionDateAfter(inspectionDate){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum inspekcije posle "+inspectionDate+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date-after`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum inspekcije posle "+inspectionDate+" za dati inspection-defect");
    }
}

export async function findByInspection_InspectionDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Opseg datuma inspekcije "+start+" - "+end+" za dati inspection-defect, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme doci pre datuma za pocetak");
        }
        const response = await api.get(url+`/search/inspection-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma inspekcije "+start+" - "+end+" za dati inspection-defect");
    }
}

export async function findByInspection_InspectionDateAndInspection_Result({inspectionDate, result}){
    try{
        const validateDate = moment.isMoment(inspectionDate) || moment(inspectionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!isInspectionResultValid.includes(result?.toUpperCase()) || !validateDate){
            throw new Error("Datum inspekcije "+inspectionDate+" i rezultat "+result+" za inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection-date-and-result`,{
            params:{
                inspectionDate:moment(inspectionDate).format("YYYY-MM-DDTHH:mm:ss"),
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(errorr){
        handleApiError(errorr,"Trenutno nismo pronasli datum inspekcije "+inspectionDate+" i rezultat "+result+" za dati inspection-defect");
    }
}

export async function findByInspection_InspectorId(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("Dati id "+inspectorId+" inspektora za inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/inspector/${inspectorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectorId+" inspektora za dati inspection-defect");
    }
}

export async function findByInspection_InspectorFirstNameContainingIgnoreCaseAndInspection_InspectorLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" ||
           !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" inspektora za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection/inspector-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime"+lastName+" inspektora za dati inspection-defect");
    }
}

export async function findByInspection_InspectorEmailLikeIgnoreCase(inspectorEmail){
    try{
        if(!inspectorEmail || typeof inspectorEmail !== "string" || inspectorEmail.trim() === ""){
            throw new Error("Email "+inspectorEmail+" inspektora za dati inspection-defect, nije proandjen");
        }
        const response = await api.get(url+`/search/inspection/inspector-email`,{
            package:{
                inspectorEmail:inspectorEmail
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+inspectorEmail+" inspektora za dati inspection-defect");
    }
}

export async function findByInspection_InspectorPhoneNumberLikeIgnoreCase(inspectorPhoneNumber){
    try{
        if(!inspectorPhoneNumber || typeof inspectorPhoneNumber !== "string" || inspectorPhoneNumber.trim() === ""){
            throw new Error("Broj-telefona "+inspectorPhoneNumber+" inspektora za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/inspector-phone-number`,{
            params:{
                inspectorPhoneNumber:inspectorPhoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+inspectorPhoneNumber+" inspektora za dati inspection-defect");
    }
}

export async function findByInspection_QuantityInspected(quantityInspected){
    try{
        const parseQuantityInspected = parseInt(quantityInspected,10);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina "+parseQuantityInspected+" za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pregledanu kolicinu "+quantityInspected+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityInspectedGreaterThan(quantityInspected){
    try{
        const parseQuantityInspected = parseInt(quantityInspected,10);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina veca od "+parseQuantityInspected+" za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected-greater-than`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pregledanu kolicinu vecu od "+quantityInspected+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityInspectedLessThan(quantityInspected){
    try{
        const parseQuantityInspected = parseInt(quantityInspected,10);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Pregledana kolicina manja od "+parseQuantityInspected+" za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected-less-than`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pregledanu kolicinu manju od "+quantityInspected+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityInspectedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max,10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg pregledane kolicine "+parseMin+" - "+parseMax+" za dati inspection-defect, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna pregledana kolicina ne sme biti veca od maksimalne pregledane kolicine");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg pregledane kolicine "+min+" - "+max+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityAccepted(quantityAccepted){
    try{
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina "+parseQuantityAccepted+" za dati inspection-defect, nije proandjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prhivacenu kolicinu "+quantityAccepted+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityAcceptedGreaterThan(quantityAccepted){
    try{
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina veca od "+parseQuantityAccepted+" za dati inspection-defect, nije proandjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted-greater-than`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prhivacenu kolicinu vecu od "+quantityAccepted+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityAcceptedLessThan(quantityAccepted){
    try{
        const parseQuantityAccepted = parseInt(quantityAccepted,10);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina manja od "+parseQuantityAccepted+" za dati inspection-defect, nije proandjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted-less-than`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prhivacenu kolicinu manju od "+quantityAccepted+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityAcceptedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max,10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg prihvacene kolicine "+parseMin+" - "+parseMax+" za dati inspection-defect, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna prihvacena kolicina ne sme biti veca od maskimalne prihvacene kolicine");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg prihvacene kolicine "+min+" - "+max+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityRejected(quantityRejected){
    try{
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina "+parseQuantityRejected+" za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu "+quantityRejected+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityRejectedGreaterThan(quantityRejected){
    try{
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina veca od "+parseQuantityRejected+" za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected-greater-than`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu vecu od "+quantityRejected+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityRejectedLessThan(quantityRejected){
    try{
        const parseQuantityRejected = parseInt(quantityRejected,10);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina manja od "+parseQuantityRejected+" za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected-less-than`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu manju od "+quantityRejected+" za dati inspection-defect");
    }
}

export async function findByInspection_QuantityRejectedBetween({min, max}){
    try{
        const parseMin = parseInt(min,10);
        const parseMax = parseInt(max,10);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg odbacene kolicine "+parseMin+" - "+parseMax+" za dati inspection-defect, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna odbacena kolicina ne sme biti veca od maksimalne odbacene kolicine");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg odbacene kolicine "+min+" - "+max+" za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_Id(qualityCheckId){
    try{
        if(isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("ID "+qualityCheckId+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check/${qualityCheckId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id"+qualityCheckId+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_LocDate(locDate){
    try{
        const validateDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum  "+locDate+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-loc-date`,{
            params:{
                locDate:moment(locDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+locDate+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_LocDateAfter(locDate){
    try{
        const validateDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum posle "+locDate+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-loc-date-after`,{
            params:{
                locDate:moment(locDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+locDate+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_LocDateBefore(locDate){
    try{
        const validateDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum pre "+locDate+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-loc-date-before`,{
            params:{
                locDate:moment(locDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+locDate+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_LocDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Opseg datuma "+start+" - "+end+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti pre datuma za pocetak");
        }
        const response = await api.get(url+`/search/inspection/quality-check-loc-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" provere-kvaliteta za dati insepction-defect");
    }
}

export async function findByInspection_QualityCheck_Notes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Beleska "+notes+" provere-kvaliteta za inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quality-check-notes`,{
            params:{
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_ReferenceId(referenceId){
    try{
        const parseReferenceId =parseInt(referenceId);
        if(isNaN(parseReferenceId) || parseReferenceId <= 0){
            throw new Error("Id reference "+parseReferenceId+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-reference-id`,{
            params:{
                referenceId:parseReferenceId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_ReferenceType(referenceType){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_CheckType(checkType){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Tip potvrde "+checkType+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check/check-type`,{
            params:{
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip provere "+checkType+" za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_Status(status){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" provere-kvaliteta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" provere-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_ReferenceTypeAndInspection_QualityCheck_CheckType({referenceType, checkType}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" i tip potvrde "+checkType+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check/reference-type-and-check-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" i tip potvrde "+checkType+" za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_ReferenceTypeAndInspection_QualityCheck_Status({referenceType, status}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" i status "+status+" potvrde-kvaliteta za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection/quality-check/reference-type-status`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" i status"+status+" potvrde-kvaliteta za dati inspection-defect");
    }
}

export async function findByInspection_QualityCheck_CheckTypeAndInspection_QualityCheck_Status({checkType, status}){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Tip potvrde "+checkType+" i status "+status+" za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection/quality-check/check-type-status`,{
            params:{
                checkType:(checkType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip potvrde "+checkType+" i status "+status+" za dati inspection-defect");
    }
}

export async function findByInspection_Product_Id(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("ID "+productId+" proizvoda za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina "+parseCurrentQuantity+" proizvoda za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity)  || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina veca od "+parseCurrentQuantity+" proizvoda za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity-greater-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu vecu od "+currentQuantity+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity)  || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina manja od "+parseCurrentQuantity+" proizvoda za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity-less-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu manju od "+currentQuantity+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_CurrentQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg trenutne kolicine "+parseMin+" - "+parseMax+" proizvoda za dati inspection-defect, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna kolicina proizvoda ne sme biti veca od maksimalne kolicine proizvoda");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg trenutne kolicine "+min+" - "+max+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_NameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv proizvoda "+productName+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv proizvoda "+productName+" za dati inspection-defect");
    }
}

export async function findByInspection_Product_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Jedinca mere "+unitMeasure+" proizvoda za dati inspection-defect, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Tip dobavljaca "+supplierType+" proizvoda za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca "+supplierType+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_StorageType(storageType){
    try{
        if(!iseStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Tip skladista "+storageType+" proizvoda za dati inspection-defect, nije proandjen");
        }
        const response = await api.get(url+`/search/inspection/product-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista "+storageType+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Product_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Tip robe "+goodsType+" proizvoda za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trwnutno nismo pronasli tip robe "+goodsType+" proizvoda za dati inspection-defect");
    }
}

export async function findByInspection_Batch_Id(batchId){
    try{
        if(isNaN(batchId) || batchId == null){
            throw new Error("Dati id "+batchId+" batch za inspection-defect, nije proandjen");
        }
        const response = await api.get(url+`/search/inspection/batch/${batchId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+batchId+" batcha za dati inspection-defect");
    }
}

export async function findByDefect_CodeContainingIgnoreCase(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Kod "+code+" za defekat koji pripada inspection-defect, nije pronadjen");
        } 
        const response = await api.get(url+`/search/defect-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod "+code+" za defekat koji pripada inspection-defect");
    }
}

export async function findByDefect_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Naziv defekta "+name+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/defect-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv defekta "+name+" za dati inspection-defect");
    }
}

export async function findByDefect_DescriptionContainingIgnoreCase(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Opis defekta "+description+" za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/defect-description`,{
            params:{
                description:description
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opis defekta "+description+" za dati inspection-defect");
    }
}

export async function findByDefect_CodeContainingIgnoreCaseAndDefect_NameContainingIgnoreCase({code, name}){
    try{
        if(!code || typeof code !== "string" || code.trim() === "" ||
           !name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Kod "+code+" i naziv "+name+" defekta za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/defect/code-and-name`,{
            params:{
                code:code,
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod "+code+" i naziv "+name+" defekta za dati inspection-defect");
    }
}

export async function findByDefect_Severity(severity){
    try{
        if(!isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Tip ozbiljnosti "+severity+" defekta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/search/defect-severity`,{
            params:{
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Treutno nismo pronasli tip ozbiljnosti "+severity+" defekta za dati inspection-defect");
    }
}

export async function findByDefect_CodeContainingIgnoreCaseAndDefect_Severity({code, severity}){
    try{
        if(!code || typeof code !== "string" || code.trim() === "" || !isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Kod "+code+" i tip ozbiljnosti "+severity+" defekta za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/defect/code-and-severity`,{
            params:{
                code:code,
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod "+code+" i tip ozbiljnost "+severity+" defekta za dati inspection-defect");
    }
}

export async function findByDefect_NameContainingIgnoreCaseAndDefect_Severity({name, severity}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" || !isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Naziv "+name+" i tip ozbiljnosti "+severity+" defekta za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/defect/name-and-severity`,{
            params:{
                name:name,
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i tip ozbiljnost "+severity+" defekta za dati inspection-defect");
    }
}

export async function findByDefect_SeverityAndDefect_DescriptionContainingIgnoreCase({severity, descPart}){
    try{
        if(!descPart || typeof descPart !== "string" || descPart.trim() === "" || !isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Opis "+descPart+" i tip ozbiljnosti "+severity+" defekta za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/defect/severity-and-desc-part`,{
            params:{
                descPart:descPart,
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opis "+descPart+" i tip ozbiljnosti "+severity+" defetka za dati inspection-defect");
    }
}

export async function countByDefect_Severity(severity){
    try{
        if(!isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Tip ozbiljnosti "+severity+" defekta za dati inspection-defect, nisu pronadjeni");
        }
        const response = await api.get(url+`/count/defect-severity`,{
            params:{
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj tipa ozbiljnosti "+severity+" defekta za dati inspection-defect");
    }
}

export async function countByDefect_Code(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Kod "+code+" defekta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/count/defect-code`,{
            params:{
                code:code
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj koda "+code+" defekta za dati inspection-defect");
    }
}

export async function countByDefect_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Kod "+name+" defekta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/count/defect-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj koda "+name+" defekta za dati inspection-defect");
    }
}

export async function existsByDefect_Code(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Kod "+code+" defekta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/exist/defect-code`,{
            params:{
                code:code
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje koda "+code+" defekta za dati inspection-defect");
    }
}

export async function existsByDefect_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Naziv "+name+" defekta za dati inspection-defect, nije pronadjen");
        }
        const response = await api.get(url+`/exist/defect-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje naziv "+name+" defekta za dati inspection-defect");
    }
}

export async function findByConfirmed(confirmed){
    try{
        if(typeof confirmed !== "boolean"){
            throw new Error("Status potvrde "+confirmed+" mora biti tru/false, tacno/netacno");
        }
        const response = await api.get(url+`/confirmed`,{
            params:{
                confirmed:confirmed
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+confirmed+" za potvrdu.");
    }
}

export async function findByDefectIdAndConfirmed({defectId, confirmed}){
    try{
        if(isNaN(defectId) || defectId ==  null || typeof confirmed !== "boolean"){
            throw new Error("ID "+defectId+" defekta i status potvrde "+confirmed+" za inspekciju-defekta, nisu pronadjeni");
        }
        const response = await api.get(url+`/defects/${defectId}/confirmed`,{
            params:{
                confirmed:confirmed
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+defectId+" defekta i njegov status potvrde "+confirmed);
    }
}