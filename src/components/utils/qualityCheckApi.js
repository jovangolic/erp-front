import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/qualityChecks`;
const isReferenceTypeValid = ["GOODS_RECEIPT","PRODUCTION_ORDER","STORAGE_ITEM","BATCH","MATERIAL"];
const isQualityCheckTypeValid = ["VISUAL","DIMENSIONAL","CHEMICAL","FUNCTIONAL","TEMPERATURE","HUMIDITY","OTHER"];
const isQualityCheckStatusValid = ["PASSED","FILED","CONDITIONAL","PENDING"];

export async function createQualityCheck({locDate,inspectorId,referenceType,referenceId,checkType,status,notes}){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        const validateLocDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            !validateLocDate || isNaN(inspectorId) || inspectorId == null ||
            !isReferenceTypeValid.includes(referenceType?.toUpperCase()) || isNaN(parseReferenceId) || parseReferenceId <= 0 ||
            !isQualityCheckTypeValid.includes(checkType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase()) ||
            !notes || typeof notes !== "string" || notes.trim() === ""){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {locDate,inspectorId,referenceType,referenceId: parseReferenceId,checkType,status,notes};
        const response = await api.post(url+`/create/new-quality-check`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja potvrde-kvaliteta");
    }
}

export async function updateQualityCheck({}){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        const validateLocDate = moment.isMoment(locDate) || moment(locDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            id == null || isNaN(id) ||
            !validateLocDate || isNaN(inspectorId) || inspectorId == null ||
            !isReferenceTypeValid.includes(referenceType?.toUpperCase()) || isNaN(parseReferenceId) || parseReferenceId <= 0 ||
            !isQualityCheckTypeValid.includes(checkType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase()) ||
            !notes || typeof notes !== "string" || notes.trim() === ""){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {locDate,inspectorId,referenceType,referenceId: parseReferenceId,checkType,status,notes};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja potvrde-kvaliteta");
    }
}

export async function deleteQualityCheck(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja potvrde-kvaliteta po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jedne potvrdae-kvaliteta po "+id+" id-iju");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(errorr){
        handleApiError(errorr,"Greska prilikom trazenja svi potvrda-kvaliteta");
    }
}

export async function findByReferenceType(referenceType){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/by-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" za potvrdu-kvaliteta");
    }
}

export async function findByCheckType(checkType){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Tip potvrde "+checkType+" za potvrdu-kvaliteta, nije pronadjena");
        }
        const response = await api.get(url+`/by-check-type"`,{
            params:{
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip potvrde "+checkType+" za potvrdu-kvaliteta");
    }
}

export async function findByStatus(status){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" za potvrdu-kvaliteta, nije pronadjena");
        }
        const response = await api.get(url+`/by-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" za potvrdu-kvaliteta");
    }
}

export async function findByCheckTypeAndStatus({checkType, status}){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase()) || !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Tip potvrde "+checkType+" i status "+status+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/check-type-and-status`,{
            params:{
                checkType:(checkType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip potvrde "+checkType+" i status "+status+" za datu potvrdu-kvaliteta");
    }
}

export async function findByStatusAndReferenceType({status, referenceType}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Tip reference "+referenceType+" i status "+status+" za potvrdu-kvaliteta nisu pronadjeni");
        }
        const response = await api.get(url+`/status-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" i status "+status+" za potvrdu-kvaliteta");
    }
}

export async function findByCheckTypeAndReferenceType({checkType, referenceType}){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase()) || isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Tip potvrde "+checkType+" i tip reference "+referenceType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/check-type-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pornasli tip potvrde "+checkType+" i tip reference "+referenceType+" za potvrdu-kvaliteta");
    }
}

export async function findByReferenceIdAndReferenceType({referenceId, referenceType}){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        if(isNaN(parseReferenceId) || parseReferenceId == null || !isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Id reference "+parseReferenceId+" i tip reference "+referenceType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/reference-id-reference-type`,{
            params:{
                referenceId:parseReferenceId,
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" i tip reference "+referenceType+" za datu potvrdu-kvaliteta");
    }
}

export async function findByReferenceIdAndCheckType({referenceId, checkType}){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        if(isNaN(parseReferenceId) || parseReferenceId == null || !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Id refernce "+parseReferenceId+" i tip potvrde "+checkType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/reference-id-check-type`,{
            params:{
                referenceId:parseReferenceId,
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" i tip potvrde "+checkType+" za potvrdu-kvaliteta");
    }
}

export async function findByReferenceIdAndStatus({referenceId, status}){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        if(isNaN(parseReferenceId) || parseReferenceId == null || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Id reference "+parseReferenceId+" i status "+status+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/reference-id-status`,{
            params:{
                referenceId:parseReferenceId,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutnpo nismo pronasli id reference "+referenceId+" i status "+status+" za potvrdu-kvaliteta");
    }
}

export async function findByReferenceTypeIn(referenceTypes){
    try{
        if(!isReferenceTypeValid.includes(referenceTypes?.toUpperCase())){
            throw new Error("Dati tipovi reference za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-reference-types`,{
            params:{
                referenceTypes: arrayList
            },
            paramsSerializer: params => {
                return params.arrayList.map(s => `arrayList=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo sve tipove referenci za datu potvrdu-kvaliteta");
    }
}

export async function findByCheckTypeIn(checkTypes){
    try{
        if(!isQualityCheckTypeValid.includes(checkTypes?.toUpperCase())){
            throw new Error("Dati tipovi potvrda za potvrdu-kvaliteta nisu pronadjeni");
        }
        const response = await api.get(url+`/by-check-types`,{
            params:{
                checkTypes:arrayTypes
            },
            paramsSerializer: params => {
                return params.arrayTypes.map(s => `arrayTypes=${s.toUpperCase()}`).join("&")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronaddjemo sve tipove potvrde za datu potvrdu-kvaliteta");
    }
}

export async function findByStatusIn(statuses){
    try{
        if(!isQualityCheckStatusValid.includes(statuses?.toUpperCase())){
            throw new Error("Dati statusi za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-statuses`,{
            params:{
                statuses:arrayStatus
            },
            paramsSerializer: params => {
                return params.arrayStatus.map(s => `arrayStatus=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo sve statuse za potvrdu-kvaliteta");
    }
}

export async function findByReferenceIdAndReferenceTypeAndStatus({referenceId, referenceType, status}){
    try{
        const parseReferenceId = parseInt(referenceId, 10);
        if(isNaN(parseReferenceId) || parseReferenceId == null || !isReferenceTypeValid.includes(referenceType?.toUpperCase()) ||
           !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Id reference "+parseReferenceId+" tip reference "+referenceType+" i status "+status+" za datu potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/reference-id-reference-type-status`,{
            params:{
                referenceId:parseReferenceId,
                referenceType:(referenceType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" tip reference "+referenceType+" i status "+status+" za datu potvrdu-kvaliteta");
    }
}

export async function findByReferenceIdAndReferenceTypeAndCheckType({referenceId, referenceType, checkType}){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        if(isNaN(parseReferenceId) || parseReferenceId == null || !isReferenceTypeValid.includes(referenceType?.toUpperCase()) ||
           !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("ID reference "+parseReferenceId+" ,tip reference "+referenceType+" i tip potvrde "+checkType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/reference-id-reference-type-check-type`,{
            params:{
                referenceId:parseReferenceId,
                referenceType:(referenceType || "").toUpperCase(),
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" ,tip reference "+referenceType+" i tip potvrde "+checkType+" za datu potvrdu-kvaliteta");
    }
}

export async function findByNotes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Beleska "+notes+" za potvrdu-kvaliteta, nije pronadjena");
        }
        const response = await api.get(url+`/by-notes`,{
            params:{notes:notes},
            headers:getHeader()
        });
        return response.data;
    }
    catch(errorr){
        handleApiError(errorr,"Trenutno nismo pronasli belesku "+notes+" za datu potvrdu-kvaliteta");
    }
}

export async function findByReferenceId(referenceId){
    try{
        const parseReferenceId = parseInt(referenceId , 10);
        if(isNaN(parseReferenceId) || parseReferenceId <= 0){
            throw new Error("ID reference "+parseReferenceId+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/by-reference-id`,{
            params:{
                referenceId:parseReferenceId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" za datu potvrdu-kvaliteta");
    }
}

export async function findByLocDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum "+date+" za potvrdu kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/by-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" za datu potvrdu-kvaliteta");
    }
}

export async function findByLocDateBefore(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum pre "+date+" za potvrdu kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+date+" za datu potvrdu-kvaliteta");
    }
}

export async function findByLocDateAfter(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum posle "+date+" za potvrdu kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+date+" za datu potvrdu-kvaliteta");
    }
}

export async function findByLocDateBetween({startDate, endDate}){
    try{
        const validateDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Opseg datuma "+startDate+" - "+endDate+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj potvrde-kvaliteta ne sme biti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum opsega "+startDate+" - "+endDate+" za datu potvrdu-kvaliteta");
    }
}

export async function findByStatusAndLocDateBetween({status, startDate, endDate}){
    try{
        const validateDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd || 
           !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Opseg datuma "+startDate+" - "+endDate+" i status "+status+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj potvrde-kvaliteta ne sme biti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/by-status-and-date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss"),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+startDate+" - "+endDate+" i status "+status+" za potvrdu-kvaliteta");
    }
}

export async function findByCheckTypeAndLocDateBetween({checkType, startDate, endDate}){
    try{
        const validateDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd || 
           !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Opseg datuma "+startDate+" - "+endDate+" i tip potvrde "+checkType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj potvrde-kvaliteta ne sme biti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/by-check-type-and-date-range`,{
            params:{
                checkType:(checkType || "").toUpperCase(),
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+startDate+" - "+endDate+" i tip potvrde "+checkType+" za potvrdu-kvaliteta");
    }
}

export async function findByReferenceTypeAndLocDateBetween({referenceType, startDate, endDate}){
    try{
        const validateDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd ||  
           !isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Opseg datuma "+startDate+" - "+endDate+" i tip reference "+referenceType+" za potvrdu-kvaliteta, nisu pronadjemi");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj potvrde-kvaliteta ne sme biti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/by-reference-type-and-date-range`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+startDate+" - "+endDate+" i tip reference "+referenceType+" za potvrdu-kvaliteta");
    }
}

export async function findByReferenceIdOrderByLocDateDesc(referenceId){
    try{
        const parseReferenceId = parseInt(referenceId,10);
        if(isNaN(parseReferenceId) || parseReferenceId <= 0 ){
            throw new Error("ID reference "+parseReferenceId+" za potvrdu-kvaliteta sortiranu po opadajucem datumu, nije pronadjeno");
        }
        const response = await api.get(url+`/reference-id-order-by-date-desc`,{
            params:{referenceId:parseReferenceId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id reference "+referenceId+" za potvrdu-kvalitea soritanu po opdajucem datumu");
    }
}

export async function findByInspectorIdOrderByLocDateDesc(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("Id inspektora "+inspectorId+" za potvrdu-kvaliteta sortiranu po opadajucem datumu, nije pronadjeno");
        }
        const response = await api.get(url+`/inspector/${inspectorId}/order-by-date-desc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id inspektora "+inspectorId+" za potvrdu-kvaliteta sortiranu po opadajucem datumu");
    }
}

export async function existsByReferenceIdAndReferenceTypeAndStatus({referenceId, referenceType, status}){
    try{
        const parseReferenceId = parseInt(referenceId, 10);
        if(isNaN(parseReferenceId) || parseReferenceId <= 0 || !isReferenceTypeValid.includes(referenceType?.toUpperCase()) ||
           !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Id reference "+parseReferenceId+" ,tip reference "+referenceType+" i status "+status+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists/reference-id-reference-type-status`,{
            params:{
                referenceId:parseReferenceId,
                referenceType:(referenceType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje id reference "+referenceId+" ,tipa reference "+referenceType+" i statusa "+status+" za potvrdu-kvaliteta");
    }
}

export async function existsByInspectorIdAndLocDateBetween({inspectorId, startDate, endDate}){
    try{
        const validateDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(isNaN(inspectorId) || inspectorId == null || !validateDateStart || !validateDateEnd){
            throw new Error("ID inspektora "+inspectorId+" i opseg datuma "+startDate+" - "+endDate+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj potvrde-kvaliteta ne sme biti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/exists/inspector/${inspectorId}/date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(errorr){
        handleApiError(errorr,"Trenutno nismo pronasli postojanje id inspektora "+inspectorId+" i opseg datuma "+startDate+" - "+endDate+" za potvrdu-kvaliteta");
    }
}

export async function countByStatus(status){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Broj statusa "+status+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/search/count-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj statusa "+status+" za potvrdu-kvaliteta");
    }
}

export async function countByCheckType(checkType){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Broj tipova potvrde "+checkType+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/search/count-check-type`,{
            params:{
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj tipova potvrde za potvrdu-kvaliteta");
    }
}

export async function countByReferenceType(referenceType){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Broj tipova refernci "+referenceType+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/search/count-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj tipova referenci "+referenceType+
            " za potvrdu-kvaliteta"
        );
    }
}

export async function countByInspectorId(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("Broj ispektora po id "+inspectorId+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/search/count-inspector/${inspectorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj inspektora po "+inspectorId+" id-iju za potvrdu-kvaliteta");
    }
}

export async function countByReferenceTypeAndStatus({referenceType, status}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Broj tipova referenci "+referenceType+" i broj statusa "+status+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/count-reference-type-and-status`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj tipova referenci "+referenceType+" i broj statusa "+status+" za potvrdu-kvaliteta");
    }
}

export async function countByLocDateBetween({startDate, endDate}){
    try{
        const validateDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Broj datuma po opsegu "+startDate+" - "+endDate+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj potvrde-kvaliteta ne sme biti ispred datuma za pocetak potvrde-kvaliteta");
        }
        const response = await api.get(url+`/search/count-date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj datuma po opsegu "+startDate+" - "+endDate+" za potvrdu-kvaliteta");
    }
}

export async function findByInspectorId(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("ID inspektora "+inspectorId+" za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/inspector/${inspectorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id inspektora "+inspectorId+!" za potvrdu-kvaliteta");
    }
}

export async function findByInspectorEmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Email "+email+" inspektora za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspector-email`,{
            params:{
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+email+" inspektora za potvrdu-kvaliteta");
    }
}

export async function findByInspectorPhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Broj-telefona "+phoneNumber+" inspektora za potvrdu-kvaliteta, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspector-phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phoneNumber+" inspektora za potvrdu-kvaliteta");
    }
}

export async function findByInspector_FirstNameContainingIgnoreCaseAndInspector_LastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" || !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" inspektora za potvrdu-kvaliteta, nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime "+lastName+" inspektora za potvrdu-kvaliteta");
    }
}

export async function findByInspectorIdAndStatus({inspectorId, status}){
    try{
        if(isNaN(inspectorId) || inspectorId == null || !isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Id isnpektora "+inspectorId+" i status potvrde "+status+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspector/${inspectorId}/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id inspektora "+inspectorId+" i status potvrde "+status+" za potvrdu-kvaliteta");
    }
}

export async function findByInspectorIdAndCheckType({inspectorId, checkType}){
    try{
        if(isNaN(inspectorId) || inspectorId == null || !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Id inspektora "+inspectorId+" i tip potvrde "+checkType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspector/${inspectorId}/check-type`,{
            params:{
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id inspektora "+inspectorId+" i tip potvrde "+checkType+" za potvrdu-kvaliteta");
    }
}

export async function findByInspectorIdAndReferenceType({inspectorId, referenceType}){
    try{
        if(isNaN(inspectorId) || inspectorId == null || !isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Id inspektora "+inspectorId+" i tip reference "+referenceType+" za potvrdu-kvaliteta, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspector/${inspectorId}/reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id inspektora "+inspectorId+" i tip reference "+referenceType+" za potvrdu-kvaliteta");
    }
}

export async function countByStatusGrouped(){
    try{
        const response = await api.get(url+`/search/count-by-status-grouped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj grupisanih statusa");
    }
}

export async function countByCheckTypeGrouped(){
    try{
        const response = await api.get(url+`/search/count-by-check-type-grouped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj grupisanih tipova potvrda");
    }
}

export async function countByReferenceTypeGrouped(){
    try{
        const response = await api.get(url+`/search/count-by-reference-type-grouped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj grupisanih tipova referenci");
    }
}

export async function countByInspectorGrouped(){
    try{
        const response = await api.get(url+`/search/count-by-inspector-grouped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj grupisanih inspektora");
    }
}

export async function countByInspectorNameGrouped(){
    try{
        const response = await api.get(url+`/search/count-by-inspector-name-grouped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj grupisanih inspektora po imenu");
    }
}

export async function countByDateGrouped(){
    try{    
        const response = await api.get(url+`/search/count-by-date-grouped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj grupisanih datuma");
    }
}