import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/journalItems`;
const isAccountTypeValid = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

export async function createJournalItem({accountId, debit,credit}){
    try{
        const parsedDebit = parseFloat(debit);
        const parsedCredit = parseFloat(credit);
        if(accountId == null || isNaN(accountId) || isNaN(parsedDebit) || parsedDebit <= 0 || isNaN(parsedCredit) || parsedCredit <= 0){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {accountId,debit,credit};
        const response =await api.post(url+`/create/new-journalItem`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja JournalItem-a");
    }
}

export async function updateJournalItem({id,accountId,debit,credit}){
    try{
        const parsedDebit = parseFloat(debit);
        const parsedCredit = parseFloat(credit);
        if(!id || accountId == null || isNaN(accountId) || isNaN(parsedDebit) || parsedDebit < 0 || isNaN(parsedCredit) || parsedCredit < 0){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {accountId,debit,credit};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja JournalItem-a");
    }
}

export async function deleteJournalItem(id){
    try{
        if(!id){
            throw new Error("Dati ID za JournalItem nije pronadjen");
        }
        const response = await api.delete(url+`/delete'/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja JournalItem-a");
    }
}

export async function findOne(id){
    try{
        if(!id){
            throw new Error("Dati ID za JournalItem nije pronadjen");
        }
        const response = await api.delete(url+`/find-one'/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jednom JournalItem-u");
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
        handleApiError(error,"Greska prilikom dobavljanja svih JournalItem-a");
    }
}

export async function findByAccount_Id(id){
    try{
        if(!id){
            throw new Error("Dati ID za racun nije pronadjen");
        }
        const response =await api.get(url+`/account/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po ID-ju racuna");
    }
}

export async function findByAccount_AccountNumber(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !=="string" || accountNumber.trim() === ""){
            throw new Error("Dati broj racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-accountNumber`,{
            params:{accountNumber:accountNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema broju racuna");
    }
}

export async function findByAccount_AccountName(accountName){
    try{
        if(!accountName || typeof accountName !=="string" || accountName.trim() === ""){
            throw new Error("Dati naziv racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-accountName`,{
            params:{accountName:accountName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenji po nazivu racuna");
    }
}

export async function findByAccount_Type(type){
    try{
        if(!isAccountTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-accountType`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema tipu racuna");
    }
}

export async function findByDebitGreaterThan(amount){
    try{
        const parsedAmount = parseFloat(amount);
        if(isNaN(parsedAmount) || parsedAmount <= 0){
            throw new Error("Dati amount nije pronadjen");
        }
        const response = await api.get(url+`/debit-greaterThan`,{
            params:{amount:parsedAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema Debit vecem od");
    }
}

export async function findByDebitLessThan(amount){
    try{
        const parsedAmount = parseFloat(amount);
        if(isNaN(parsedAmount) || parsedAmount <= 0){
            throw new Error("Dati amount nije pronadjen");
        }
        const response = await api.get(url+`/debit-lessThan`,{
            params:{amount:parsedAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema Debit manjem od");
    }
}

export async function findByCreditGreaterThan(amount){
    try{
        const parsedAmount = parseFloat(amount);
        if(isNaN(parsedAmount) || parsedAmount <= 0){
            throw new Error("Dati amount nije pronadjen");
        }
        const response = await api.get(url+`/credit-greaterThan`,{
            params:{amount:parsedAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom retrage prema Credit vecem od");
    }
}

export async function findByCreditLessThan(amount){
    try{
        const parsedAmount = parseFloat(amount);
        if(isNaN(parsedAmount) || parsedAmount <= 0){
            throw new Error("Dati amount nije pronadjen");
        }
        const response = await api.get(url+`/credit-lessThan`,{
            params:{amount:parsedAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom retrage prema Credit manjem od");
    }
}

export async function findByDebit(debit){
    try{
        const parseDebit = parseFloat(debit);
        if(isNaN(parseDebit) || parseDebit < 0){
            throw new Error("Dati Debit nije pronadjen");
        }
        const response =await api.get(url+`/by-debit`,{
            params:{debit:parseDebit},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po Debit-u");
    }
}

export async function findByCredit(credit){
    try{
        const parseCredit = parseFloat(credit);
        if(isNaN(parseCredit) || parseCredit < 0){
            throw new Error("Dati Credit nije pronadjen");
        }
        const response =await api.get(url+`/by-credit`,{
            params:{credit:parseCredit},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po Credit-u");
    }
}

export async function findByJournalEntry_Id(journalEntryId){
    try{
        if(journalEntryId == null || isNaN(journalEntryId)){
            throw new Error("Dati ID za JournalEntry nije pronadjen");
        }
        const response = await api.get(url+`/journalEntry/${journalEntryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po ID-ju za JournalEntry");
    }
}

export async function search({ debit, credit, accountId, fromDate, toDate }) {
    try {
        const parsedDebit = parseFloat(debit);
        const parsedCredit = parseFloat(credit);
        if (
            isNaN(parsedDebit) || parsedDebit < 0 ||
            isNaN(parsedCredit) || parsedCredit < 0 ||
            accountId == null || isNaN(accountId) ||
            !moment(fromDate, "YYYY-MM-DDTHH:mm:ss", true).isValid() ||
            !moment(toDate, "YYYY-MM-DDTHH:mm:ss", true).isValid()
        ) {
            throw new Error("Dati pretraga po unesenim parametrima nije pronadjena");
        }
        const response = await api.get(url + `/search`, {
            params: {
                debit: parsedDebit,
                credit: parsedCredit,
                accountId: accountId,
                fromDate: moment(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
                toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greska prilikom pretrazivanja zahteva");
    }
}

export async function findByJournalEntry_EntryDate(entryDate){
    try{
        if(
            !moment(entryDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati datum unosa nije pronadjen");
        }
        const response = await api.get(url+`/by-entry-date`,{
            params:{entryDate:moment(entryDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu unosa");
    }
}

export async function findByJournalEntry_EntryDateBetween({entryDateStart, entryDateEnd}){
    try{
        if(
            !moment(entryDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(entryDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati opseg unosa datuma nije pronadjen");
        }
        const response = await api.get(url+`/by-date-range`,{
            params:{
                entryDateStart:moment(entryDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                entryDateEnd:moment(entryDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu datuma");
    }
}

export async function findByJournalEntry_Description(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Datu opis nije pronadjen");
        }
        const response = await api.get(url+`/by-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opisa");
    }
}