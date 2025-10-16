import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/fiscalYears`;
const isFiscalYearStatusValid = ["OPEN", "CLOSED","ARCHIVED"];
const isFiscalQuarterStatusValid = ["Q1","Q2","Q3","Q4"];
const isFiscalYearTypeStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createFiscalYear({year, startDate, endDate, yearStatus, quarterStatus, quarters}) {
    try {
        // Validacija osnovnih polja
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if (
            Number.isNaN(Number((year))) || parseInt(year) <= 0 ||
            !validateStart || ! validateEnd || 
            !yearStatus || !quarterStatus ||
            !Array.isArray(quarters) || quarters.length === 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        if(moment(validateEnd).isAfter(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datum za pocetak");
        }
        // Validacija svakog kvartala
        for (const quarter of quarters) {
            if (
                !quarter.quarterStatus ||
                !validateStart ||
                !validateEnd
            ) {
                throw new Error("Svi kvartali moraju biti validni");
            }
        }
        const requestBody = {
            year,
            startDate,
            endDate,
            yearStatus,
            quarterStatus,
            quarters 
        };
        const response = await api.post(url+`/create/new-fiscalYear`, requestBody, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom kreiranja fiskalne godine");
    }
}

export async function updateFiscalYear({id,year, startDate, endDate, yearStatus, quarterStatus, quarters}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if (
            Number.isNaN(Number(id)) || id == null ||
            Number.isNaN(Number((year))) || parseInt(year) <= 0 ||
            !validateStart || ! validateEnd || 
            !yearStatus || !quarterStatus ||
            !Array.isArray(quarters) || quarters.length === 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        if(moment(validateEnd).isAfter(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datum za pocetak");
        }
        // Validacija svakog kvartala
        for (const quarter of quarters) {
            if (
                !quarter.quarterStatus ||
                !validateStart ||
                !validateEnd
            ) {
                throw new Error("Svi kvartali moraju biti validni");
            }
        }
        const requestBody = {
            year,
            startDate,
            endDate,
            yearStatus,
            quarterStatus,
            quarters 
        };
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja fiskalne godine");
    }
}

export async function deleteFiscalYear(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" za fiskalnu godinu nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja fiskalne godine");
    }
}

export async function findOne(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih fiskalnih godina");
    }
}

export async function findBetweenStartAndEndDates({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati opseg "+validateStart+" - "+validateEnd+" godina je ne-validan");
        }
        if(moment(validateEnd).isAfter(moment(validateStart))){
            throw new Error(`Datum za kraj ne sme biti ispred datuma za pocetak`);
        }
        const response = await api.get(url+`/date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega "+start+" - "+end+" fiskalnih godina");
    }
}

export async function findByYear(year){
    try{
        const parsedYear = parseInt(year);
        if (Number.isNaN(Number(parsedYear)) || parsedYear <= 0) {
            throw new Error("Data godina "+parsedYear+" nije pronadjena");
        }
        const response = await api.get(url+`/by-year`,{
            params: { year: parsedYear },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po fiskalnoj godini "+year);
    }
}

export async function findByYearStatusAndYear({status, year}){
    try{
        const parsedYear = parseInt(year);
        if(Number.isNaN(Number(parsedYear)) || parsedYear <= 0 || !isFiscalYearStatusValid.includes(status?.toUpperCase())){
            throw new Error("Data fiskalna godina "+parsedYear+" i fiskalni status "+status+" nisu pronadjeni");
        }
        const response = await api.get(url+`/by-status-and-year`,{
            params:{year:parsedYear, status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po fisklanoj godini "+year+" i fiskalnom statusu "+status);
    }
}

export async function findFirstByYearStatusOrderByStartDateDesc(status){
    try{
        if(!isFiscalYearStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati fiskalni status "+status+" nije pronadjen");
        }
        const response = await api.get(url+`/by-status-order`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po fiskalnom statusu "+status);
    }
}

export async function findByStartDateAfter(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+validateDate+" nije pronadjen");
        }
        const response = await api.get(url+`/startDate-after`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po pocetku datuma "+date);
    }
}

export async function findByEndDateBefore(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum kraja pre "+validateDate+" nije pronadjen");
        }
        const response = await api.get(url+`/endDate-before`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po kraju datuma pre "+date);
    }
}

export async function findByYearStatus(yearStatus){
    try{
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati godisnji status "+yearStatus+" za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/by-yearStatus`,{
            params:{yearStatus:(yearStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po godisnjem fiskalnom statusu "+yearStatus);
    }
}

export async function findByQuarterStatus(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartalni status "+quarterStatus+" nije pronadjen");
        }
        const response = await api.get(url+`/by-quarterStatus`,{
            params:{quarterStatus:(quarterStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema kvartalnom statusu "+quarterStatus);
    }
}

export async function findByQuarterLessThan(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartalni status "+quarterStatus+" nije pronadjen");
        }
        const response = await api.get(url+`/quarterStatus-less-than`,{
            params:{quarterStatus:(quarterStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage kvartalnog statusa manjeg od "+quarterStatus);
    }
}

export async function findByQuarterGreaterThan(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartalni status nije pronadjen");
        }
        const response = await api.get(url+`/quarterStatus-greater-than"`,{
            params:{quarterStatus:(quarterStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage kvartalnog statusa veceg od "+quarterStatus);
    }
}

export async function countFiscalYearsByYearAndMonth(){
    try{
        const response = await api.get(url+`/count/by-year-and-month`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj fiskalne godine za godinu i mesec");
    }
}

export async function countByFiscalYearStatus(){
    try{
        const response = await api.get(url+`/count/by-status`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno mismo pronasli broj statusa za fiskalnu godinu");
    }
}

export async function countByFiscalYearQuarterStatus(){
    try{
        const response = await api.get(url+`/count/by-quarter-status`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj po kvartalnom statusu zA fiskalnu godinu");
    }
}

export async function trackFiscalYear(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati id "+id+" fiskalne godine za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" fiskalne godine za pracenje");
    }
}

export async function confirmFiscalYear(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("ID "+id+" za potvrdu fiskalne godine, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu fiskalne godine");
    }
}

export async function cancelFiscalYear(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("ID "+id+" za otkazivanje fiskalne godine, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje fiskalne godine");
    }
}

export async function closeFiscalYear(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("ID "+id+" za zatvaranje fiskalne godine, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje fiskalne godine");
    }
}

export async function changeStatus({id, status}){
    try{
        if(Number.isNaN(Number(id)) || id == null || !isFiscalYearTypeStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status fiskalne godine "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status fiskalne godine "+status);
    }
}

export async function saveFiscalYear({year,startDate,endDate,yearStatus,quarterStatus,status,confirmed = false}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-DD-MM",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-DD-MM",true).isValid();
        const parsedYear = parseInt(year, 10);
        if(
            Number.isNaN(Number(parsedYear)) || parsedYear <= 0 || !validateStart || !validateEnd ||
            !isFiscalYearStatusValid.includes(yearStatus?.toUpperCase()) || !isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) ||
            !isFiscalYearTypeStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {year,startDate,endDate,yearStatus,quarterStatus,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,year,endDate,yearStatus,quarterStatus}){
    try{
        if(Number.isNaN(Number(sourceId)) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        const parsedYear = parseInt(year, 10);
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-DD-MM",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-DD-MM",true).isValid();
        if(!validateEnd){
            throw new Error("Datum za kraj "+validateEnd+" mora biti postavljen");
        }
        if(Number.isNaN(Number(parsedYear)) || parsedYear <= 0){
            throw new Error("Godina "+parsedYear+" mora biti ceo btoj");
        }
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Kvartalni status "+quarterStatus+" se mora izabrati");
        }
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Godisnji status "+yearStatus+" se mora izabrati");
        }
        const requestBody = {year,endDate,yearStatus,quarterStatus};
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao.save-as");
    }
}

export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        for(let i = 0; i < requests.length; i++){
            const req = requests[i];
            if (req.id == null || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'id' je obavezan i mora biti broj`);
            }
            const parsedYear = parseInt(req.year, 10);
            const validateStart = moment.isMoment(req.startDate) || moment(req.startDate ,"YYYY-MM-DD",true).isValid();
            const validateEnd = moment.isMoment(req.endDate) || moment(req.endDate ,"YYYY-MM-DD",true).isValid();
            if(Number.isNaN(Number(parsedYear)) || parsedYear <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'godina' mora biti ceo broj`);
            }
            if(!validateStart){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'datum-pocetka' mora biti ceo broj`);
            }
            if(!validateEnd){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'datum-kraja' mora biti ceo broj`);
            }
            if(!isFiscalQuarterStatusValid.includes(req.quarterStatus?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'kvartalni-status' se mora izabrati`);
            }
            if(!isFiscalYearStatusValid.includes(req.yearStatus?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'godisnji-status' se mora izabrati`);
            }
            if(!isFiscalYearTypeStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${i}: 'tip-status' je obavezan `);
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
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/sava-all");
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