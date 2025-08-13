import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/accounts`;

const isAccountTypeValid = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

export async function createAccount({accountNumber,accountName,type,balance}){
    try{
        if(
            !accountNumber || typeof accountNumber !=="string" || accountNumber.trim()==="" ||
            !accountName || typeof accountName !=="string" || accountName.trim()==="" ||
            !isAccountTypeValid.includes(type?.toUpperCase()) ||
            isNaN(parseFloat(balance)) || parseFloat(balance) <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {accountNumber,accountName, type, balance};
        const response = await api.post(url+`/create/new-account`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateAccount({id,accountNumber,accountName,type,balance}){
    try{
        if(
            !id ||
            !accountNumber || typeof accountNumber !=="string" || accountNumber.trim()==="" ||
            !accountName || typeof accountName !=="string" || accountName.trim()==="" ||
            !isAccountTypeValid.includes(type?.toUpperCase()) ||
            isNaN(parseFloat(balance)) || parseFloat(balance) <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {accountNumber,accountName, type, balance};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteAccount(id){
    try{
        if(!id){
            throw new Error("Dati ID "+id+" za account nije pronadjen");
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
            throw new Error("Dati ID "+id+" za account nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog racuna po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih racuna  ");
    }
}

export async function findByType(type){
    try{
        if(!isAccountTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-account-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu "+type+" racuna");
    }
}

export async function findByBalance(balance){
    try {
        const parsed = parseFloat(balance);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error("Dati balans "+parsed+" nije validan");
        }

        const response = await api.get(url + `/by-balance`, {
            params: {
                balance: parsed
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom traženja po balansu "+balance);
    }
}

export async function findByBalanceBetween({min, max}){
    try{
        if(isNaN(parseFloat(min)) || parseFloat(min) < 0 ||
            isNaN(parseFloat(max)) || parseFloat(max) <= 0){
                throw new Error("Dati opseg balansa za min "+min+" i max "+max+" nisu pronadjeni");
            } 
        const response = await api.get(url+`/balance-between`,{
            params:{
                min:parseFloat(min),
                max:parseFloat(max)
            },
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega "+min+" - "+max+" balansa");
    }
}

export async function findByBalanceGreaterThan(amount){
    try{
        if(isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
            throw new Error("Dati amount "+amount+" nije pronadjen");
        }
        const response = await api.get(url+`/balance-greater-than`,{
            params:{
                amount:parseFloat(amount)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja balansa veceg od "+amount+" amount-a");
    }
}

export async function findByBalanceLessThan(amount){
    try{
        if(isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
            throw new Error("Dati amount "+amount+" nije pronadjen");
        }
        const response = await api.get(url+`/balance-less-than`,{
            params:{
                amount:parseFloat(amount)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja balansa manjeg od "+amount+" amount-a");
    }
}

export async function findByAccountName(accountName){
    try{
        if(!accountName || typeof accountName !=="string" || accountName.trim() === ""){
            throw new Error("Dati naziv "+accountName+" racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-accountName`,{
            params:{
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja naziva "+accountName+" racuna");
    }
}

export async function findByAccountNameIgnoreCase(accountName){
    try{
        if(!accountName || typeof accountName !=="string" || accountName.trim() === ""){
            throw new Error("Dati naziv "+accountName+" racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-accName-ignoreCase`,{
            params:{
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazena racuna sa ignorisanjem malih i velikih slova");
    }
}

export async function findByAccountNumber(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !=="string" || accountNumber.trim() === ""){
            throw new Error("Dati broj "+accountNumber+" racuna nije pronadjen");
        }
        const response = await api.get(url+`/by-accountNumber`,{
            params:{
                accountNumber:accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema broju "+accountNumber+" racuna");
    }
}

export async function findByAccountNameAndAccountNumber({accountName, accountNumber}){
    try{
        if(
            !accountNumber || typeof accountNumber !=="string" || accountNumber.trim()==="" ||
            !accountName || typeof accountName !=="string" || accountName.trim()===""
        ){
            throw new Error("Dati naziv "+accountName+" i broj "+accountNumber+" racuna nisu pronadjeni");
        }
        const response = await api.get(url+`/by-accNumber-and-accName`,{
            params:{
                accountName:accountName,
                accountNumber:accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu "+accountName+" i broju "+accountNumber+" racuna");
    }
}