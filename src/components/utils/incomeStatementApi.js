import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/incomeStatements`;
const isFiscalQuarterStatusValid = ["Q1","Q2","Q3","Q4"];

export async function createIncomeStatement({periodStart,periodEnd,totalRevenue,totalExpenses,netProfit,fiscalYearId}){
    try{
        const parseTotalRevenue = parseFloat(totalRevenue);
        const parseTotalExpenses = parseFloat(totalExpenses);
        const parseNetProfit = parseFloat(netProfit);
        if(
            !moment(periodStart,"YYYY-MM-DD",true).isValid() || !moment(periodEnd,"YYYY-MM-DD",true).isValid() ||
            isNaN(parseTotalRevenue) || parseTotalRevenue <= 0 ||
            isNaN(parseTotalExpenses) || parseTotalExpenses <= 0 ||
            isNaN(parseNetProfit) || parseNetProfit <= 0 || !fiscalYearId
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {periodStart,periodEnd,totalRevenue,totalExpenses,netProfit,fiscalYearId};
        const response = await api.post(url+`/create/new-incomeStatement`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja income-statement-a");
    }
}

export async function updateIncomeStatement({id,periodStart,periodEnd,totalRevenue,totalExpenses,netProfit,fiscalYearId}){
    try{
        const parseTotalRevenue = parseFloat(totalRevenue);
        const parseTotalExpenses = parseFloat(totalExpenses);
        const parseNetProfit = parseFloat(netProfit);
        if(
            id == null || isNaN(id) ||
            !moment(periodStart,"YYYY-MM-DD",true).isValid() || !moment(periodEnd,"YYYY-MM-DD",true).isValid() ||
            isNaN(parseTotalRevenue) || parseTotalRevenue <= 0 ||
            isNaN(parseTotalExpenses) || parseTotalExpenses <= 0 ||
            isNaN(parseNetProfit) || parseNetProfit <= 0 || !fiscalYearId
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {periodStart,periodEnd,totalRevenue,totalExpenses,netProfit,fiscalYearId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteIncomeStatement(id){
    try{
        if(!id){
            throw new Error("Dati ID za incomeStatement nije pronadjen");
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
            throw new Error("Dati ID za incomeStatement nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog incomeStatement-a");
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
        handleApiError(error,"Greska prilikom trazenja svih incomeStatement-a");
    }
}

export async function findByTotalRevenue(totalRevenue){
    try{
        const parseTotalRevenue = parseFloat(totalRevenue);
        if(isNaN(parseTotalRevenue) || parseTotalRevenue <= 0){
            throw new Error("Dati ukupan-prihod nije pronadjen");
        }
        const response = await api.get(url+`/totalRevenue`,{
            params:{totalRevenue: parseTotalRevenue},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema ukupnom prihodu");
    }
}

export async function findByTotalExpenses(totalExpenses){
    try{
        const parseTotalExpenses = parseFloat(totalExpenses);
        if(isNaN(parseTotalExpenses) || parseTotalExpenses <= 0){
            throw new Error("Dati ukupni troskovi nisu pronadjeni");
        }
        const response = await api.get(url+`/totalExpenses`,{
            params:{totalExpenses:parseTotalExpenses},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po ukupnim troskovima");
    }
}

export async function findByNetProfit(netProfit){
    try{
        const parseNetProfit = parseFloat(netProfit);
        if(isNaN(parseNetProfit) || parseNetProfit <= 0){
            throw new Error("Data neto-zarada nije pronadjena");
        }
        const response = await api.get(url+`/netProfit`,{
            params:{netProfit : parseNetProfit},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema neto zaradi");
    }
}

export async function findByFiscalYear_Year(year){
    try{
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear) || parsedYear <= 0) {
            throw new Error("Data godina nije pronadjena");
        }
        const response = await api.get(url+`/by-fiscal-year`,{
            params:{ year: parsedYear },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po fiskalnoj godini");
    }
}

export async function findByFiscalYear_QuarterStatus(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartalni status nije pronadjen");
        }
        const response = await api.get(url+`/fiscalYear-quarterStatus`,{
            params:{quarterStatus:(quarterStatus || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kvartalnom statusus za fiskalnu godinu");
    }
}

export async function findByPeriodStartBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetak i kraj datuma nije pronadjen");
        }
        const response = await api.get(url+`/period-start-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju izmedju pocetka opsega perioda");
    }
}

export async function findByPeriodEndBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetak i kraj datuma nije pronadjen");
        }
        const response = await api.get(url+`/period-end-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju izmedju kraja opsega perioda");
    }
}

export async function findWithinPeriod({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetak i kraj datuma nije pronadjen");
        }
        const response = await api.get(url+`/within-period`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja unutar opsega datuma");
    }
}

export async function findByDateWithinPeriod(start){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati posetak datuma unutar perioda nije pronadjen");
        }
        const response = await api.get(url+`/contains-date`,{
            params:{start:moment(start).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage unutar odredjenog datuma");
    }
}