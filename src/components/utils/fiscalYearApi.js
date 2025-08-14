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

export async function createFiscalYear({year, startDate, endDate, yearStatus, quarterStatus, quarters}) {
    try {
        // Validacija osnovnih polja
        if (
            isNaN(parseInt(year)) || parseInt(year) <= 0 ||
            !moment(startDate, "YYYY-MM-DD", true).isValid() ||
            !moment(endDate, "YYYY-MM-DD", true).isValid() ||
            !yearStatus || !quarterStatus ||
            !Array.isArray(quarters) || quarters.length === 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        // Validacija svakog kvartala
        for (const quarter of quarters) {
            if (
                !quarter.quarterStatus ||
                !moment(quarter.startDate, "YYYY-MM-DD", true).isValid() ||
                !moment(quarter.endDate, "YYYY-MM-DD", true).isValid()
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
        if (
            !id ||
            isNaN(parseInt(year)) || parseInt(year) <= 0 ||
            !moment(startDate, "YYYY-MM-DD", true).isValid() ||
            !moment(endDate, "YYYY-MM-DD", true).isValid() ||
            !yearStatus || !quarterStatus ||
            !Array.isArray(quarters) || quarters.length === 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        // Validacija svakog kvartala
        for (const quarter of quarters) {
            if (
                !quarter.quarterStatus ||
                !moment(quarter.startDate, "YYYY-MM-DD", true).isValid() ||
                !moment(quarter.endDate, "YYYY-MM-DD", true).isValid()
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
        if(!id){
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
        if(!id){
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
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati opseg "+start+" - "+end+" godina je ne-validan");
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
        if (isNaN(parsedYear) || parsedYear <= 0) {
            throw new Error("Data godina "+year+" nije pronadjena");
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
        if(isNaN(parsedYear) || parsedYear <= 0 || !isFiscalYearStatusValid.includes(status?.toUpperCase())){
            throw new Error("Data fiskalna godina "+year+" i fiskalni status "+status+" nisu pronadjeni");
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
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum "+date+" nije pronadjen");
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
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum kraja pre "+date+" nije pronadjen");
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