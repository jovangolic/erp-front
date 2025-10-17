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
const isFiscalQuarterTypeStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createFiscalQarter({quarterStatus,startDate,endDate,fiscalYearId}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if( 
            fiscalYearId == null || Number.isNaN(Number(fiscalYearId)) ||
            !isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) ||
            !validateStart || !validateEnd
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if( 
            Number.isNaN(Number(id)) || id == null ||
            fiscalYearId == null || Number.isNaN(Number(fiscalYearId)) ||
            !isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) ||
            !validateStart || !validateEnd
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" za fiskalni kvartal nije pronadjen");
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
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" za fiskalni kvartal nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog fiskalnog kvartala po "+id+" id-iju");
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
        if (fiscalYearId == null || Number.isNaN(Number(fiscalYearId))) {
            throw new Error("Neispravan ID "+fiscalYearId+" fiskalne godine");
        }
        const response = await api.get(url+`/by-fiscalYear/${fiscalYearId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom traženja po fiskalnoj godini "+fiscalYearId);
    }
}

export async function findByQuarterStatus(status){
    try{
        if(!isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati kvartalni status "+status+" nije pronadjen");
        }
        const response = await api.get(url+`/quarterStatus`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema kvartalnom statusu "+status);
    }
}

export async function findByStartDateBetween({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati opseg datuma "+validateStart+" - "+validateEnd+" je pogresan ili ne-validan");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Greska prilikom trazenja po oosegu "+start+" - "+end+" datuma");
    }
}

export async function findByFiscalYearIdAndQuarterStatus({fiscalYearId,status}){
    try{
        if(fiscalYearId == null ||Number. isNaN(Number(fiscalYearId)) || !isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati ID "+fiscalYearId+" za fiskalnu godinu i stastus "+status+" nisu pronadjeni");
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
        handleApiError(error,"Greska prilikom trazenja id "+fiscalYearId+" za fiskalnu godinu i status "+status);
    }
}

export async function findByStartDateAfter(date){
    try{
        const validateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati start-date-after "+validateStart+" nije pronadjen");
        }
        const response = await api.get(url+`/startDateAfter`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po date-after "+date);
    }
}

export async function findByStartDateBefore(date){
    try{
        const validateStart = moment.isMoment(date) || moment(datr,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati start-date-before "+validateStart+" nije pronadjen");
        }
        const response = await api.get(url+`/startDateBefore`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po date-before "+date);
    }
}

export async function findByFiscalYear_Year(year){
    try{
        const parsedYear = parseInt(year);
        if (Number.isNaN(Number(parsedYear)) || parsedYear <= 0) {
            throw new Error("Data godina "+parsedYear+" nije pronadjena");
        }
        const response = await api.get(url+`/specific-fiscalYear`,{
            params:{ year: parsedYear },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po fiskalnoj godini "+year);
    }
}

export async function findByFiscalYear_YearStatus(yearStatus){
    try{
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati godisnji status "+yearStatus+" nije pronadjen");
        }
        const response = await api.get(url+`/fiscalYear-year-status`,{
            params:{yearStatus:(yearStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema godini statusa "+ yearStatus);
    }
}

export async function findByEndDate(endDate){
    try{
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if(!validateEnd){
            throw new Error("Dati datum za kraj "+validateEnd+" nije pronadjen");
        }
        const response = await api.get(url+`/by-end-date`,{
            params:{endDate:moment(endDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema kraju "+endDate+" datuma");
    }
}

export async function findByFiscalYear_StartDateBetween({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(
            !validateStart || !validateEnd
        ){
            throw new Error("Dati opseg datuma "+validateStart+" - "+validateEnd+" za start i end nije pronadjen");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error(`Datum za kraj ne sme biti ispred datuma za pocetak`);
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
        handleApiError(error,"Greska prilikom pretrage prema opsegu pocetnog "+start+" - "+end+" datuma za fiskalnu godinu");
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
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati pocetni datum "+validateStart+" za fiskalnu godinu nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa pocetnim datumom "+startDate);
    }
}

export async function findByFiscalYearStartDateAfter(startDate){
    try{    
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati pocetni datum posle "+validateStart+" za fiskalnu godinu nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa pocetnim datumom posle "+startDate);
    }
}

export async function findByFiscalYearStartDateBefore(startDate){
    try{    
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati pocetni datum pre "+validateStart+" za fiskalnu godinu nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa pocetnim datumom pre "+startDate);
    }
}

export async function findByFiscalYearEndDate(endDate){
    try{ 
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();   
        if(!validateEnd){
            throw new Error("Dati kraj datuma "+validateEnd+" za fiskalnu godinu nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli fisklanu godinu sa end datumom "+endDate);
    }
}

export async function findByFiscalYearStartDateBetween({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati pocetni opseg "+validateStart+" - "+validateEnd+" datuma za fiskalnu godinu, nije pronadjen");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error(`Datum za kraj ne sme biti ispred datuma za pocetak`);
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
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu sa pocetnim opsegom "+start+" - "+end+" datuma");
    }
}

export async function findByFiscalYearEndDateBetween({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati end opseg "+validateStart+" - "+validateEnd+" datuma za fiskalnu godinu, nije pronadjen");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error(`Datum za kraj ne sme biti ispred datuma za pocetak`);
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
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu sa end opsegom "+start+" - "+end+" datuma");
    }
}

export async function findByFiscalYear_QuarterStatus(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartalni status "+quarterStatus+" za fiskalnu godinu nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu za kvartalni status "+quarterStatus);
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
        const validateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati datum "+validateStart+" koji se zavrsavaju uskoro, nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli kvartale koji se uskoro zavrsavaju "+date);
    }
}

export async function findByFiscalYear_YearAndQuarterStatus({year, status}){
    try{
        const parsedYear = parseInt(year,10);
        if(Number.isNaN(Number(parsedYear)) || parsedYear <= 0 || !isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("Data fiskalna godina "+year+" i kvartalni status "+status+", nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli fiskalnu godinu "+year+" i kvartalni status "+status);
    }
}

export async function findByFiscalYearBetweenYears({start, end}){
    try{
        const parseStart = parseInt(start,10);
        const parseEnd = parseInt(end,10);
        if(Number.isNaN(Number(parseStart)) || parseStart <= 0 || Number.isNaN(Number(parseEnd)) || parseEnd <= 0){
            throw new Error("Dati opseg "+parseStart+" - "+parseEnd+" za fiskalnu godinu nije pronadjen");
        }
        if(parseStart > parseEnd){
            throw new Error("Pocetna godina ne sme biti veca od krajnje godine");
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
        handleApiError(error,"Trenutno nismo pronasli opseg "+start+" - "+end+" za fiskalnu godinu");
    }
}

export async function trackFiscalQuarter(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati id "+id+" fiskal-kvartala za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" fiskal-kvartala za pracenje");
    }
}

export async function confirmFiscalQuarter(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("ID "+id+" za potvrdu fiskal-kvartala, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
             headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu fiskal-kvartala");
    }
}

export async function cancelFiscalQuarter(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("ID "+id+" za otkazivanje fiskal-kvartala, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
             headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje fiskal-kvartala");
    }
}

export async function closeFiscalQuarter(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("ID "+id+" za zatvaranje fiskal-kvartala, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
             headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje fiskal-kvartala");
    }
}

export async function changeStatus({id, status}){
    try{
        if(Number.isNaN(Number(id)) || id == null || !isFiscalQuarterStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status fiskal-kvartala "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
             headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status fiskal-kvartala "+status);
    }
}

export async function saveFiscalQuarter({quarterStatus,startDate,endDate,fiscalYearId,status,confirmed = false}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if(
            !isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) || !validateStart  || !validateEnd ||
            Number.isNaN(Number(fiscalYearId)) || fiscalYearId == null || !isFiscalQuarterTypeStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj nse sme biti ispred datuma za pocetak");
        }
        const requestBody = {quarterStatus,startDate,endDate,fiscalYearId,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,quarterStatus,endDate,fiscalYearId,status,confirmed = false}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if(Number.isNaN(Number(sourceId)) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(Number.isNaN(Number(fiscalYearId)) || fiscalYearId == null){
            throw new Error("Id "+fiscalYearId+" mora biti ceo broj");
        }
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Kvartalni status "+quarterStatus+" se mora uneti");
        }
        if(!isFiscalQuarterTypeStatusValid.includes(status?.toUpperCase())){
            throw new Error("Tip kvartalnog statusa "+status+" se mora uneti");
        }
        if(!validateEnd){
            throw new Error("Datum za kraj "+validateEnd+" se mora uneti");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrdu "+confirmed+" treba izabrata");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj nse sme biti ispred datuma za pocetak");
        }
        const requestBody = {quarterStatus,endDate,fiscalYearId,status,};
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
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        for(let i = 0 ; i < requests.length; i++){
            const req = requests[i];
            const validateDateStart = moment.isMoment(req.startDate) || moment(req.startDate,"YYYY-MM-DD",true).isValid();
            const validateDateEnd = moment.isMoment(req.endDate) || moment(req.endDate,"YYYY-MM-DD",true).isValid();
            if (req.id == null || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'id' je obavezan i mora biti broj`);
            }
            if (req.fiscalYearId == null || Number.isNaN(Number(req.fiscalYearId))) {
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'fiscalYearId' je obavezan i mora biti broj`);
            }
            if(!validateDateStart){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'datum pocetka' je obavezan`);
            }
            if(!validateDateEnd){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'datum kraja' je obavezan`);
            }
            if(!isFiscalQuarterStatusValid(req.quarterStatus?.toUpperCase())){
                throw new Error(`Nevalisan zahtev na indexu ${i}: 'Kvartalni status' je obavezan`);
            }
            if(!isFiscalQuarterTypeStatusValid(req.status?.toUpperCase())){
                throw new Error(`Nevalisan zahtev na indexu ${i}: 'Kvartalni tip statusa' je obavezan`);
            }
            if(typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'confirmed' je obavezan `);
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
