import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/audit/transactions`;
const isTransactionTypeValid = ["TRANSFER","DEPOSIT","WITHDRAWAL","PAYMENT","REFUND","CASH","DEBIT","CARD_PAYMENT"];

export async function findByUserId(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati id "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/user/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po id "+id+" korisnika");
    }
}

export async function findByTransactionId(transactionId){
    try{
        if(Number.isNaN(Number(transactionId)) || transactionId == null){
            throw new Error("Dati id "+transactionId+" transakcije, nije pronadjen");
        }
        const response = await api.get(url+`//transaction/${transactionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+transactionId+" transakcije");
    }
}

export async function findBySourceAccountNumberContainingIgnoreCase(sourceAccountNumber){
    try{    
        if(!sourceAccountNumber?.trim()){
            throw new Error("Naziv izvornog racuna "+sourceAccountNumber+" nije pronadjen");
        }
        const response = await api.get(url+`/by-source-account-number`,{
            params:{
                sourceAccountNumber:sourceAccountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv izvornog racuna "+sourceAccountNumber);
    }
}

export async function findByTargetAccountNumberContainingIgnoreCase(targetAccountNumber){
    try{    
        if(!targetAccountNumber?.trim()){
            throw new Error("Naziv ciljnog racuna "+targetAccountNumber+" nije pronadjen");
        }
        const response = await api.get(url+`/by-target-account-number`,{
            params:{
                targetAccountNumber:targetAccountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv ciljnog racuna "+targetAccountNumber);
    }
}

export async function findByTransactionType(transactionType){
    try{    
        if(!isTransactionTypeValid.includes(transactionType?.toUpperCase())){
            throw new Error("Tip transakcije "+transactionType+" nije pronadjen");
        }
        const response = await api.get(url+`/by-transaction-type`,{
            params:{
                transactionType:(transactionType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip transakcije "+transactionType);
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
        handleApiError(error,"Greska prilikom trazenja svih transakcijskih revizija");
    }
}
