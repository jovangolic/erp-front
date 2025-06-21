import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/fiscalQuarters`;
const isFiscalQuarterStatusValid = ["Q1","Q2","Q3","Q4"];

export async function createFiscalQarter(quarterStatus,startDate,endDate){
    try{
        if(
            !isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {quarterStatus,startDate,endDate};
        const response = await api.post(url+`/create/new-fiscalQuarter`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja ");
    }
}

export async function updateFiscalQuarter(id,quarterStatus,startDate,endDate){
    try{
        if(
            !id ||
            !isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {quarterStatus,startDate,endDate};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteFiscalQuarter(id){
    try{
        if(!id){
            throw new Error("Dati ID za fiskalni kvartal nije pronadjen");
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
        if(!id){
            throw new Error("Dati ID za fiskalni kvartal nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog fiskalnog kvartala");
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
        handleApiError(error,"Greska prilikom trazenja svih kvartala");
    }
}

export async function findByFiscalYear(fiscalYearId) {
    try {
        if (!fiscalYearId || isNaN(parseInt(fiscalYearId))) {
            throw new Error("Neispravan ID fiskalne godine");
        }
        const response = await api.get(url+`/by-fiscalYear/${fiscalYearId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom traženja po fiskalnoj godini");
    }
}

export async function findByQuarterStatus(status){
    try{
        if(!isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati kvartalnoi status nije pronadjen");
        }
        const response = await api.get(url+`/quarterStatus`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema kvartalnom statusus");
    }
}

export async function findByStartDateBetween(start, end){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati opseg datuma je pogresan ili ne-validan");
        }
        const response = await api.get(url+`/startDateBetween`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po oosegu datuma");
    }
}

export async function findByFiscalYearIdAndQuarterStatus(fiscalYearId,status){
    try{
        if(!fiscalYearId || !isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati ID za fiskalnu godinu i stastus nisu pronadjeni");
        }
        const response = await api.get(url+`/fiscalYear/${fiscalYearId}/quarters`,{
            params:{
                fiscalYearId:fiscalYearId,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja id za fiskalnu godinu i status");
    }
}

export async function findByStartDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati start-date-after nije pronadjen");
        }
        const response = await api.get(url+`/startDateAfter`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po date-after");
    }
}

export async function findByStartDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati start-date-before nije pronadjen");
        }
        const response = await api.get(url+`/startDateBefore`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po date-before");
    }
}

export async function findByFiscalYear_Year(year){
    try{
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear) || parsedYear <= 0) {
            throw new Error("Data godina nije pronadjena");
        }
        const response = await api.get(url+`/specific-fiscalYear`,{
            params:{ year: parsedYear },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po fiskalnoj godini");
    }
}

