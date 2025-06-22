import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/ledgerEntries`;
const isLedgerEntryTypeValid = ["DEBIT", "CREDIT"];
const isAccountTypeValid = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

export async function createLedgerEntry({entryDate,amount,description,accountId,type}){
    try{
        const parseAmount = parseFloat(amount);
        if(
            !moment(entryDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            isNaN(parseAmount) || parseAmount <= 0 ||
            !description || typeof description !=="string" || description.trim() === "" ||
            !accountId || !isLedgerEntryTypeValid.includes(type?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {entryDate,amount,description,accountId,type};
        const response = await api.post(url+`/create/new-ledgerEntry`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateLedgerEntry({id,entryDate,amount,description,accountId,type}){
    try{
        const parseAmount = parseFloat(amount);
        if(
            !id ||
            !moment(entryDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            isNaN(parseAmount) || parseAmount <= 0 ||
            !description || typeof description !=="string" || description.trim() === "" ||
            !accountId || !isLedgerEntryTypeValid.includes(type?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {entryDate,amount,description,accountId,type};
        const response = await api.put(rul+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteLedgerEntry(id){
    try{
        if(!id){
            throw new Error("Dati ID za LedgerEntry nije pronadjen");
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
            throw new Error("Dati ID za LedgerEntry nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog LedgerEntry-a");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih LedgerEntry-ja");
    }
}

export async function findByType(type){
    try{
        if(!isLedgerEntryTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip LedgerEntry-ja nije pronadjen");
        }
        const response = await api.get(url+`/by-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu LedgerEntry-ja");
    }
}

export async function findByAmountBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if (typeof parseMin !== "number" || parseMin < 0 || typeof parseMax !== "number" || parseMax <= 0) {
            throw new Error("Dati opseg amount-a nije pronadjen");
        }
        if(isNaN(parseMin) || parseMin < 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg amount-a nije pronadjen");
        }
        const response = await api.get(url+`/amount-between-min-max`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu amount-a");
    }
}

export async function findByDescriptionContainingIgnoreCase(keyword){
    try{
        if(!keyword || typeof keyword !== "string" || keyword.trim() === ""){
            throw new Error("Data kljucna rec nije validna");
        }
        const response = await api.get(url+`/by-description`,{
            params:{keyword:keyword},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema kljucnoj reci");
    }
}

export async function findByEntryDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datuma je ne-validan");
        }
        const response = await api.get(url+`/entryDateBetween`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po opesgu unosa za datum");
    }
}

export async function findByAccount_Id(id){
    try{
        if(!id){
            throw new Error("Dati ID za racun nije pronadjen");
        }
        const response = await api.get(url+`/account/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju racuna");
    }
}

export async function findByAccount_AccountNumber(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !=="string" || accountNumber.trim() === ""){
            throw new Error("Dati broj racuna nija pronadjen");
        }
        const response = await api.get(url+`/accountNumber`,{
            params:{
                accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju racuna");
    }
}

export async function findByAccount_AccountName(accountName){
    try{
        if(!accountName || typeof accountName !=="string" || accountName.trim() === ""){
            throw new Error("Dati naziv racuna nija pronadjen");
        }
        const response = await api.get(url+`/accountName`,{
            params:{
                accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu racuna");
    }
}

export async function findByAccount_AccountNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Dati naziv racuna nija pronadjen");
        }
        const response = await api.get(url+`/search-by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrazivanja naziva racuna po kljucnoj reci");
    }
}

export async function findByAccount_Type(type){
    try{
        if(!isAccountTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip racuna nije pronadjen");
        }
        const response = await api.get(url+`/account-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu racuna");
    }
}

export async function findByAccount_Balance(balance){
    try{
        const parseBalance = parseFloat(balance);
        if (typeof parseBalance !== "number" || parseBalance <= 0) {
            throw new Error("Dati balans nije pronadjen");
        }
        if(isNaN(parseBalance) || parseBalance <= 0){
            throw new Error("Dati balans racuna nije pronadjen");
        }
        const response = await api.get(url+`/account-balance`,{
            params:{
                balance:parseBalance
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po balansu racuna");
    }
}

export async function findByEntryDateEquals(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum unosa nije pronadjen");
        }
        const response = await api.get(url+`/entryDateEquals`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom provere jednakosti datuma");
    }
}

export async function findByEntryDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati entryDateBefore nije pronadjen");
        }
        const response = await api.get(url+`/entryDateBefore`,{
            params:{date:moment(date).format("YYYY-MMM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po entryDateBefore");
    }
}

export async function findByEntryDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati entryDateAfter nije pronadjen");
        }
        const response = await api.get(url+`/entryDateAfter`,{
            params:{date:moment(date).format("YYYY-MMM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po entryDateAfter");
    }
}

export async function findByEntryDateAfterAndType({date, type}){
    try{
        if(!isLedgerEntryTypeValid.includes(type?.toUpperCase()) ||
            !moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati entryDateAfter i tip nisu pronadjeni");
        }
        const response = await api.get(url+`/dateAfter-type`,{
            params:{
                date:moment(date).format("YYYY-MM-DDDTHH:mm:ss"),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja entryDateAAfter i tipa");
    }
}

export async function findByEntryDateBetweenAndAccount_Id({start, end,accountId}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !accountId){
            throw new Error("Dati pocetak i kraju datuma kao i id racuna nisu pronadjeni");
        }
        const response = await api.get(url+`/account/${accountId}/date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega unosa datuma i ID-ija za racun");
    }
}