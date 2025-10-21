import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}
const url = `${import.meta.env.VITE_API_BASE_URL}/procurements`;

export async function createProcurement({date, totalCost, itemSalesIds, supplyItemIds}){
    try{
        const parseTotalCost = parseFloat(totalCost);
        const validateDate = moment.isMoment(date) || moment(date, "YYYY-MM-DDTHH:mm:ss", true).isValid();
        if(
            !validateDate ||
            isNaN(parseTotalCost) || parseTotalCost <= 0 ||
            !Array.isArray(itemSalesIds) || itemSalesIds.length === 0 ||
            !Array.isArray(supplyItemIds) || supplyItemIds.length === 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {date, totalCost, itemSalesIds, supplyItemIds};
        const response = await api.post(url+`/create/new-procurement`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom kreiranja nabavke: " + error.message);
        }
    }
}

export async function updateProcurement({id, date, totalCost, itemSalesIds, supplyItemIds}){
    try{
        const parseTotalCost = parseFloat(totalCost);
        const validateDate = moment.isMoment(date) || moment(date, "YYYY-MM-DDTHH:mm:ss", true).isValid();
        if(
            isNaN(id) || id == null ||
            !validateDate ||
            isNaN(parseTotalCost) || parseTotalCost <= 0 ||
            !Array.isArray(itemSalesIds) || itemSalesIds.length === 0 ||
            !Array.isArray(supplyItemIds) || supplyItemIds.length === 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {date, totalCost, itemSalesIds, supplyItemIds};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom auriranja nabavke: " + error.message);
        }
    }
}

export async function deleteProcurement(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za procurement nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom brisanja");
    }
}

export async function getByProcurementId(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za procurement nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne nabavke po "+id+" id-iju");
    }
}

export async function getAllProcurement(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih nabavki");
    }
}

export async function getByTotalCost(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Ukupna-cena "+parseTotalCost+" za nabavku, nije pronadjena");
        }
        const response = await api.get(url+`/total-cost`,{
            params:{
                totalCost:parseTotalCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja po ukupnoj ceni "+totalCost);
    }
}

export async function getByDateBetween({startDate, endDate}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati opseg datuma "+startDate+" - "+endDate+" nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error, "Greska prilikom dobavljanja po opsegu datuma "+startDate+" - "+endDate+" .");
    }
}

export async function getByTotalCostBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin < 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg ukupne cene "+parseMin+" - "+parseMax+" nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna ukupna cena ne sme biti veca od maksimalne ukupne cene");
        }
        const response = await api.get(url+`/total-cost-range`,{
            params:{
                min:parseMin,
                 max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja izmedju minimalne "+min+" i maksimalne "+max+" cene");
    }
}

export async function getByTotalCostGreaterThan(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena veca od "+parseTotalCost+" nije prtonadjena");
        }
        const response = await api.get(url+`/total-cost-greater-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od "+totalCost);
    }
}

export async function getByTotalCostLessThan(totalCost){
 try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena manja od "+parseTotalCost+" nije prtonadjena");
        }
        const response = await api.get(url+`/total-cost-less-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od "+totalCost);
    }
}

export async function findByDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Datum "+date+" za nabavku nije pronadjen");
        }
        const response = await api.get(url+`/payment-date`,{
            params:{
                date : moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavku po datumu "+date);
    }
}
