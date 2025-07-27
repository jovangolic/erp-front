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
const isFiscalYearStatusValid = ["OPEN", "CLOSED", "ARCHIVED"];

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

export async function getMonthlyNetProfitForYear(year){
    try{
        const parsedYear = parseInt(year);
        if(isNaN(parsedYear) || parsedYear <= 0){
            throw new Error("Data godina za mesecnu neto zaradu, nije pronadjena");
        }
        const response = await api.get(url+`/net-profit/monthly/${year}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli mesexnu neto zaradu za fiskalnu godinu");
    }
}

export async function calculateTotalNetProfitByFiscalYear(fiscalYearId){
    try{
        if(isNaN(fiscalYearId) || fiscalYearId == null){
            throw new Error("Dati ID za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/calculate-net-proft-by-year/${fiscalYearId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli izracunatu neto zaradu za odredjenu godinu");
    }
}

export async function findTotalNetProfitByFiscalYear(fiscalYearId){
    try{
        if(isNaN(fiscalYearId) || fiscalYearId == null){
            throw new Error("Dati ID za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/find-net-profit-by-year/${fiscalYearId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu neto zaradu za odredjenu godinu");
    }
}

export async function findByTotalRevenueGreaterThan(totalRevenue){
    try{
        const parseTotalRevenue = parseFloat(totalRevenue);
        if(isNaN(parseTotalRevenue) || parseTotalRevenue <= 0){
            throw new Error("Dati ukupan prihod nije pronadjen");
        }
        const response = await api.get(url+`/search/total-revenue-greater-than`,{
            params :{totalRevenue:parseTotalRevenue},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan prihod veci od");
    }
}

export async function findByTotalExpensesGreaterThan(totalExpenses){
    try{
        const parseTotalExpenses = parseFloat(totalExpenses);
        if(isNaN(parseTotalExpenses) || parseTotalExpenses <= 0){
            throw new Error("Dati ukupni troskovi nisu pronadjeni");
        }
        const response = await api.get(url+`/search/total-expenses-greater-than`,{
            params:{totalExpenses:parseTotalExpenses},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupne troskove vece od");
    }
}

export async function findByNetProfitGreaterThan(netProfit){
    try{
        const parseNetProfit = parseFloat(netProfit);
        if(isNaN(parseNetProfit) || parseNetProfit <= 0){
            throw new Error("Data neto zarada nije pronadjena");
        }
        const response = await api.get(url+`/search/net-profit-greater-than`,{
            params:{
                netProfit:parseNetProfit
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli neto zaradu vecu od");
    }
}

export async function findByTotalRevenueLessThan(totalRevenue){
    try{
        const parseTotalRevenue = parseFloat(totalRevenue);
        if(isNaN(parseTotalRevenue) || parseTotalRevenue <= 0){
            throw new Error("Dati ukupan prihod nije pronadjen");
        }
        const response = await api.get(url+`/search/total-revenue-less-than`,{
            params :{totalRevenue:parseTotalRevenue},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan prihod manji od");
    }
}

export async function findByTotalExpensesLessThan(totalExpenses){
    try{
        const parseTotalExpenses = parseFloat(totalExpenses);
        if(isNaN(parseTotalExpenses) || parseTotalExpenses <= 0){
            throw new Error("Dati ukupni troskovi nisu pronadjeni");
        }
        const response = await api.get(url+`/search/total-expenses-less-than`,{
            params:{totalExpenses:parseTotalExpenses},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupne troskove manje od");
    }
}

export async function findByNetProfitLessThan(netProfit){
    try{
        const parseNetProfit = parseFloat(netProfit);
        if(isNaN(parseNetProfit) || parseNetProfit <= 0){
            throw new Error("Data neto zarada nije pronadjena");
        }
        const response = await api.get(url+`/search/net-profit-less-than`,{
            params:{
                netProfit:parseNetProfit
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli neto zaradu manju od");
    }
}

export async function findByFiscalYear_YearStatus(yearStatus){
    try{
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati status za fiskalnu godinu, nije pronadjen");
        }
        const response = await api.get(url+`/search-year-status`,{
            params:{
                yearStatus:(yearStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za fiskalnu godinu");
    }
}

export async function findByFiscalYear_QuarterStatusAndYearStatus({yearStatus, quarterStatus}){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) ||
            !isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati status za godinu i kvartal nisu pronadjeni");
        }
        const response = await api.get(url+`/search-year-status-and-quarter-status`,{
            params:{
                yearStatus:(yearStatus || "").toUpperCase(),
                quarterStatus:(quarterStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za fiskalnu godinu i kvartal");
    }
}

export async function sumTotalRevenueBetweenDates({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datumski opseg za ukupan prihod, nije pronadjen");
        }
        const response = await api.get(url+`/search/total-revenue-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan prihod izmedju datuma");
    }
}

export async function sumTotalExpensesBetweenDates({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datumski opseg za ukupan rashod, nije pronadjen");
        }
        const response = await api.get(url+`/search/total-expenses-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan rashod izmedju datuma");
    }
}

export async function sumNetProfitBetweenDates({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datumski opseg za profit, nije pronadjen");
        }
        const response = await api.get(url+`/search/net-profit-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli profit izmedju datuma");
    }
}

export async function sumNetProfitByQuarterStatus(quarterStatus){
    try{
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())){
            throw new Error("Dati kvartal za profit, nije pronadjen");
        }
        const response = await api.get(url+`/search/net-profit-quarter-status`,{
            params:{
                quarterStatus:(quarterStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli profit po datom kvartalu");
    }
}

export async function findByQuarterStatusAndMinRevenue({quarterStatus, minRevenue}){
    try{
        const parseMinRevenue = parseFloat(minRevenue);
        if(!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase()) || 
            isNaN(parseMinRevenue) || parseMinRevenue <= 0){
            throw new Error("Dati kvartalni status i minimalan prihod, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/quarter-status-min-revenue`,{
            params:{
                quarterStatus:(quarterStatus || "").toUpperCase(),
                minRevenue:parseMinRevenue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvartalni status i minimalan prihod");
    }
}

export async function sumRevenueByFiscalYearStatus(yearStatus){
    try{
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati godisnji status za prihod, nije pronadjen");
        }
        const response = await api.get(url+`/search/revenue-by-year-status`,{
            params:{
                yearStatus:(yearStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihod po godisnjem statusu");
    }
}

export async function findByFiscalYear_StartDate(startDate){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum pocetka za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/fiscal-year-start-date`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pocetka za fiskalnu godinu");
    }
}

export async function findByFiscalYear_EndDate(endDate){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum kraja za fiskalnu godinu nije pronadjen");
        }
        const response = await api.get(url+`/search/fiscal-year-end-date`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum kraja za fiskalnu godinu");
    }
}

export async function sumTotalRevenue({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datumski opseg za ukupan prihod, nije pronadjen");
        }
        const response = await api.get(url+`/search/sum-total-revenue-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan prihod za datumski opseg");
    }
}

export async function sumTotalExpenses({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datumski opseg za ukupane troskove, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/sum-total-expenses-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupane troskove za datumski opseg");
    }
}

export async function sumNetProfit({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datumski opseg za profit, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/sum-net-profit-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli profit za datumski opseg");
    }
}

export async function sumNetProfitByYearStatus(yearStatus){
    try{
        if(!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())){
            throw new Error("Dati status godine za profit, nije pronadjen");
        }
        const response = await api.get(url+`/search/net-profit-by-year-status`,{
            params:{
                yearStatus:(yearStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli profit po statusu godine");
    }
}