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
const isFiscalYearStatusValid = ["OPEN", "CLOSED", "ARCHIVED"];

export async function createFiscalQarter({quarterStatus,startDate,endDate,fiscalYearId}){
    try{
        if( 
            fiscalYearId == null || isNaN(parseInt(fiscalYearId)) ||
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

export async function updateFiscalQuarter({id,quarterStatus,startDate,endDate,fiscalYearId}){
    try{
        if(
            !id || fiscalYearId == null || isNaN(parseInt(fiscalYearId)) ||
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

export async function findByFiscalYear_Id(fiscalYearId) {
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

export async function findByStartDateBetween({start, end}){
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

export async function findByFiscalYearIdAndQuarterStatus({fiscalYearId,status}){
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

export async function findByFiscalYear_YearStatus(yearStatus){
    try{
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati godisnji status nije pronadjen");
        }
        const response = await api.get(url+`/fiscalYear-year-status`,{
            params:{yearStatus:(yearStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema godini statusa");
    }
}

export async function findByEndDate(endDate){
    try{
        if(!moment(endDate,"YYY-MM-DD",true).isValid()){
            throw new Error("Dati datum za kraj nije pronadjen");
        }
        const response = await api.get(url+`/by-end-date`,{
            params:{endDate:moment(endDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema kraju datuma");
    }
}

export async function findByFiscalYear_StartDateBetween({start, end}){
    try{
        if(
            !moment(start,"YYY-MM-DD",true).isValid() || !moment(end,"YYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati opseg datuma za start i end nije pronadjen");
        }
        const response = await api.get(url+`/fiscalYear-start-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema opsegu pocetnog datuma za fiskalnu godinu");
    }
}

export async function findByQuarterStatusQ1(){
    try{
        const response = await api.get(url+`/quarter-status-q1`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvartalni status = 'Q1'");
    }
}

export async function findByQuarterStatusQ2(){
    try{
        const response = await api.get(url+`/quarter-status-q2`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvartalni status = 'Q2'");
    }
}

export async function findByQuarterStatusQ3(){
    try{
        const response = await api.get(url+`/quarter-status-q3`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvartalni status = 'Q3'");
    }
}

export async function findByQuarterStatusQ4(){
    try{
        const response = await api.get(url+`/quarter-status-q4`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvartalni status = 'Q4'");
    }
}

export async function findByFiscalYearStatusOpen(){
    try{
        const response = await api.get(url+`/search/year-status-open`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli godisnji status = 'OPEN'");
    }
}

export async function findByFiscalYearStatusClosed(){
    try{
        const response = await api.get(url+`/search/year-status-closed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli godisnji status = 'CLOSED'");
    }
}

export async function findByFiscalYearStatusArchived(){
    try{
        const response = await api.get(url+`/search/year-status-archived`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli godisnji status = 'ARCHIVED'");
    }
}

export async function findByFiscalYearStartDate(startDate){
    try{    
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetni datum za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/year-start-date`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa pocetnim datumom");
    }
}

export async function findByFiscalYearStartDateAfter(startDate){
    try{    
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetni datum posle za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/year-start-date-after`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa pocetnim datumom posle");
    }
}

export async function findByFiscalYearStartDateBefore(startDate){
    try{    
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetni datum pre za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/year-start-date-before`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa pocetnim datumom pre");
    }
}

export async function findByFiscalYearEndDate(endDate){
    try{    
        if(!moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati kraj datuma za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/year-end-date`,{
            params:{
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa end datumom");
    }
}

export async function findByFiscalYearStartDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid(0)){
            throw new Error("Dati pocetni opseg datuma za fiskalnu godinu, nije pronadjen");
        }
        const response = await api.get(url+`/search/year-start-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu sa pocetnim opsegom datuma");
    }
}

export async function findByFiscalYearEndDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid(0)){
            throw new Error("Dati end opseg datuma za fiskalnu godinu, nije pronadjen");
        }
        const response = await api.get(url+`/search/year-end-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu sa end opsegom datuma");
    }
}

export async function findByFiscalYear_QuarterStatus(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartalni status za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/year-quarter-status`,{
            params:{
                quarterStatus:(quarterStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu za kvartalni status");
    }
}

export async function findActiveQuarters(){
    try{
        const response = await api.get(url+`/search-active-quarters`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli aktivne kvartale");
    }
}

export async function findQuartersEndingSoon(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum koji se zavrsavaju uskoro, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/quarters-end-soon`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvartale koji se uskoro zavrsavaju");
    }
}

export async function findByFiscalYear_YearAndQuarterStatus({year, status}){
    try{
        const parsedYear = parseInt(year,10);
        if(isNaN(parsedYear) || parsedYear <= 0 || !isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("Data fiskalna godina i kvartalni status, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/year-and-quarter-status`,{
            params:{
                year:parsedYear,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu i kvartalni status");
    }
}

export async function findByFiscalYearBetweenYears({start, end}){
    try{
        const parseStart = parseInt(start,10);
        const parseEnd = parseInt(end,10);
        if(isNaN(parseStart) || parseStart <= 0 || isNaN(parseEnd) || parseEnd <= 0){
            throw new Error("Dati opseg za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/year-range`,{
            params:{
                start:parseStart,
                end:parseEnd
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg za fiskalnu godinu");
    }
}
