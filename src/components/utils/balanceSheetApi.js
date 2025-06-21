import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/balanceSheets`;

export async function createBalanceSheet(date,totalAssets,totalLiabilities,totalEquity,fiscalYearId){
    try{
        if(
            !moment(date,"YYYY-MM-DD",true).isValid() ||
            isNaN(parseFloat(totalAssets)) || parseFloat(totalAssets) <= 0 ||
            isNaN(parseFloat(totalLiabilities)) || parseFloat(totalLiabilities) <= 0 ||
            isNaN(parseFloat(totalEquity)) || parseFloat(totalEquity) <= 0 ||
            Number.isInteger(fiscalYearId) && fiscalYearId > 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {date,totalAssets,totalLiabilities,totalEquity,fiscalYearId};
        const response = await api.post(url+`/create/new-balance-sheet`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja balanceSheet-a");
    }
}

export async function updateBalanceSheet(id, date,totalAssets,totalLiabilities,totalEquity,fiscalYearId){
    try{
        if(
            !moment(date,"YYYY-MM-DD",true).isValid() ||
            isNaN(parseFloat(totalAssets)) || parseFloat(totalAssets) <= 0 ||
            isNaN(parseFloat(totalLiabilities)) || parseFloat(totalLiabilities) <= 0 ||
            isNaN(parseFloat(totalEquity)) || parseFloat(totalEquity) <= 0 ||
            Number.isInteger(fiscalYearId) && fiscalYearId > 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {date,totalAssets,totalLiabilities,totalEquity,fiscalYearId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteBalanceSheet(id){
    try{
        if(!id){
            throw new Error("Dati ID za balanceSheet nije pronadjen");
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
            throw new Error("Dati ID za balanceSheet nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pronalazenja jednog balanceSheet-a");
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
        handleApiError(error,"Greska prilikom trazenja svih");
    }
}

export async function findByDate(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum nije pronadjen");
        }
        const response = await api.get(url+`/by-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu");
    }
}

export async function findByDateBetween(start, end){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()) {
            throw new Error("Dati opseg datuma nije pronadjen");
        }
        const response = await api.get(url+`/date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu datuma ");
    }
}

export async function findByTotalLiabilities(totalLiabilities){
    try{
        if(isNaN(parseFloat(totalLiabilities)) || parseFloat(totalLiabilities) <= 0){
            throw new Error("Dati totalLiabilities nije pornadjen");
        }
        const response = await api.get(url+`/totalLiabilities`,{
            params:{
                totalLiabilities:totalLiabilities
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po totalLiabilities");
    }
}

export async function findByTotalEquity(totalEquity){
    try{
        if(isNaN(parseFloat(totalEquity)) || parseFloat(totalEquity) <= 0){
            throw new Error("Dati totalEquity nije pronadjen");
        }
        const response = await api.get(url+`/totalEquity`,{
            params:{
                totalEquity:totalEquity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po totalEquity");
    }
}

export async function findByTotalAssets(totalAssets){
    try{
        if(isNaN(parseFloat(totalAssets)) || parseFloat(totalAssets) <= 0){
            throw new Error("Dati totalAssets nije pronadjen");
        }
        const response = await api.get(url+`/totalAssets`,{
            params:{
                totalAssets:totalAssets
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema totalAssets-u");
    }
}

export async function findByFiscalYear_Id(id){
    try{
        if(!id){
            throw new Error("Dati ID za fiscalYear nije pronadjen");
        }
        const response = await api.get(url+`/fiscalYear/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po fiscalYear ID-iju");
    }
}