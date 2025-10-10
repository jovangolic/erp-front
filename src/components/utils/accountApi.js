import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/accounts`;

const isAccountTypeValid = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];
const isAccountStatusIsValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

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
            id == null || isNaN(id) ||
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
        if(id == null || isNaN(id)){
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
        if(id == null || isNaN(id)){
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

export async function findOneWithTransactions(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za detaljan-racun sa transakcijama, nije pronadjen");
        }
        const response = await api.get(url+`/detailed-account/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za detaljan-racun sa transakcijama");
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

export async function confirmAccount(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje racuna, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje racuna");
    }
}

export async function cancelAccount(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje racuna, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje racuna");
    }
}

export async function closeAccount(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje racuna, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje racuna");
    }
}

export async function changeStatus({id, status}){
    try{    
        if(isNaN(id) || id == null || !isAccountStatusIsValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status racuna "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status racuna "+status);
    }
}

export async function trackAccountSourceTransactions(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" izvornog-racuna za pracenje, nije pronadjen");
        }
        const response = await api.post(url+`/track-source/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" izvornog-racuna za pracenje");
    }
}

export async function trackAccountTargetTransactions(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" ciljanog-racuna za pracenje, nije pronadjen");
        }
        const response = await api.post(url+`/track-target/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" ciljanog-racuna za pracenje");
    }
}

export async function trackAll(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za precenje racuna, nije pronadjen");
        }
        const response = await api.get(url+`/track-all/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za pracenje racuna");
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


export async function saveAccount({accountNumber,accountName,balance,type,status,confirmed}){
    try{
        const parseBalance = parseFloat(balance);
        if(!accountNumber?.trim() || !accountName?.trim()){
            throw new Error("Polja 'account-number' i 'account-name' moraju biti popunjena i validna");
        }
        if(isNaN(parseBalance) || parseBalance <= 0){
            throw new Error("Polje 'balance' mora biti popunjeno i validno");
        }
        const typeUpper = type?.toUpperCase();
        const statusUpper = status?.toUpperCase();
        if(!isAccountTypeValid.includes(typeUpper)){
            throw new Error(`Nevalidan tip racuna: ${type}`);
        }
        if(!isAccountStatusIsValid.includes(statusUpper)){
            throw new Error(`Nevalidan status racuna ${status}`);
        }
        if (typeof confirmed !== "boolean") {
            throw new Error("Polje 'confirmed' mora biti boolean");
        }
        const requestBody = {
            accountNumber : accountNumber.trim(),
            accountName : accountName.trim(),
            balance : parseBalance,
            type : typeUpper,
            status : statusUpper,
            confirmed : confirmed
        };
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,accountNumber,accountName}){
    try{
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(!accountName?.trim() || !accountNumber?.trim()){
            throw new Error("Polja 'account-number' i 'account-name' moraju biti popunjena i validna");
        }
        const requestBody = {
            accountNumber: accountNumber.trim(),
            accountName: accountName.trim()
        };
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
        requests.forEach((req, index) => {
            if (req.id == null || isNaN(req.id)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if(!req.accountName?.trim() ){
                throw new Error(`Nevalidan account-name vrednost na indexu ${index}: 'account-name' je obavezan`);
            }
            if(!req.accountNumber?.trim()){
                throw new Error(`Nevalidan account-number vrednost na indexu ${index}: 'account-number' je obavezan`);
            }
            const parseBalance = parseFloat(req.balance);
            if(isNaN(parseBalance) || parseBalance <= 0){
                throw new Error(`Nevalidan balans vrednost na indexu ${index}: 'balans' je obavezan`);
            }
            const typeUpper = req.type?.toUpperCase();
            const statusUpper = req.status?.toUpperCase();
            if(!isAccountTypeValid.includes(typeUpper)){
                throw new Error(`Nevalidan tip racuna: ${type}`);
            }
            if(!isAccountStatusIsValid.includes(statusUpper)){
                throw new Error(`Nevalidan status racuna ${status}`);
            }
            if (typeof confirmed !== "boolean") {
                throw new Error("Polje 'confirmed' mora biti boolean");
            }
        });
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}