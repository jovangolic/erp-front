import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/transactions`;
const isTransactionTypeValid = ["TRANSFER","DEPOSIT","WITHDRAWAL","PAYMENT","REFUND","CASH","DEBIT"];
const isPaymentMethodValid = ["BANK_TRANSFER", "CASH", "CARD", "PAYPAL"];
const isAccountTypeValid = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

export async function createTransaction({amount,transactionDate,transactionType,sourceAccountId,targetAccountId,userId}){
    try{
        const parseAmount = parseFloat(amount);
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            isNaN(parseAmount) || parseAmount <= 0 || !validateTransactionDate ||
            !isTransactionTypeValid.includes(transactionType?.toUpperCase()) || isNaN(sourceAccountId) || sourceAccountId == null ||
            isNaN(targetAccountId) || targetAccountId == null || isNaN(userId) || userId == null){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {amount,transactionDate,transactionType,sourceAccountId,targetAccountId,userId};
        const response = await api.post(url+`/create/new-transaction`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prrilikom kreiranja transakcije");
    }
}

export async function updateTransaction({id,amount,transactionDate,transactionType,sourceAccountId,targetAccountId,userId}){
    try{
        const parseAmount = parseFloat(amount);
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            id == null || isNaN(id) ||
            isNaN(parseAmount) || parseAmount <= 0 || !validateTransactionDate ||
            !isTransactionTypeValid.includes(transactionType?.toUpperCase()) || isNaN(sourceAccountId) || sourceAccountId == null ||
            isNaN(targetAccountId) || targetAccountId == null || isNaN(userId) || userId == null){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {amount,transactionDate,transactionType,sourceAccountId,targetAccountId,userId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prrilikom azuriranja transakcije");
    }
}

export async function deleteTransaction(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" transakcije nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja jedne transakcije po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" transakcije nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenje jedne transakcije po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih transakcija");
    }
}

export async function findByAmount(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Kolicina novca "+parseAmount+" za datu transakciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-amount`,{
            params:{
                amount:parseAmount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu novca "+amount+" za datu transakciju");
    }
}

export async function findByAmountGreaterThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Kolicina novca veca od "+parseAmount+" za datu transakciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-amount-greater-than`,{
            params:{
                amount:parseAmount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu novca vecu od "+amount+" za datu transakciju");
    }
}

export async function findByAmountLessThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Kolicina novca manja od "+parseAmount+" za datu transakciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-amount-less-than`,{
            params:{
                amount:parseAmount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu novca manju od "+amount+" za datu transakciju");
    }
}

export async function findByAmountBetween({amountMin, amountMax}){
    try{
        const parseAmountMin = parseFloat(amountMin);
        const parseAmountMax = parseFloat(amountMax);
        if(isNaN(parseAmountMin) || parseAmountMin <= 0 || isNaN(parseAmountMax) || parseAmountMax <= 0){
            throw new Error("Opseg kolicine novca "+parseAmountMax+" - "+parseAmountMax+" za transakciju, nije pronadjen");
        }
        if(parseAmountMin > parseAmountMax){
            throw new Error("Minimalna kolicina novca ne sme biti veca od maksimalne kolicine novca");
        }
        const response = await api.get(url+`/by-amount-range`,{
            params:{
                amountMin:parseAmountMin,
                amountMax:parseAmountMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kolicine novca "+amountMin+" - "+amountMax+" za datu transakciju");
    }
}

export async function findByTransactionDate(transactionDate){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateTransactionDate){
            throw new Error("Datum "+transactionDate+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-transaction-date`,{
            params:{
                transactionDate:moment(transactionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+transactionDate+" za datu transakciju");
    }
}

export async function findByTransactionDateAfter(transactionDate){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateTransactionDate){
            throw new Error("Datum posle "+transactionDate+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-transaction-date-after`,{
            params:{
                transactionDate:moment(transactionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+transactionDate+" za datu transakciju");
    }
}

export async function findByTransactionDateBefore(transactionDate){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateTransactionDate){
            throw new Error("Datum pre "+transactionDate+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-transaction-date-before`,{
            params:{
                transactionDate:moment(transactionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+transactionDate+" za datu transakciju");
    }
}

export async function findByTransactionDateBetween({transactionDateStart, transactionDateEnd}){
    try{
        const validateTransactionDateStart = moment.isMoment(transactionDateStart) || moment(transactionDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateTransactionDateEnd = moment.isMoment(transactionDateEnd) || moment(transactionDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateTransactionDateStart || !validateTransactionDateEnd){
            throw new Error("Opseg datuma "+transactionDateStart+" - "+transactionDateEnd+" za transakciju, nije pronadjen");
        }
        if (moment(transactionDateEnd).isBefore(moment(transactionDateStart))) {
            throw new Error("Datum za kraj transakcije ne sme biti pre datuma za pocetak transakcije");
        }
        const response = await api.get(url+`/by-transaction-date-range`,{
            params:{
                transactionDateStart:moment(transactionDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                transactionDateEnd:moment(transactionDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+transactionDateStart+" - "+transactionDateEnd+" za datu transakciju");
    }
}

export async function findByTransactionType(transactionType){
    try{
        if(!isTransactionTypeValid.includes(transactionType?.toUpperCase())){
            throw new Error("Tip-transakcije "+transactionType+" za transakciju, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip-transakcije "+transactionType+" za datu transakciju");
    }
}

export async function findByTransactionTypeAndTransactionDate({transactionType, transactionDate}){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!isTransactionTypeValid.includes(transactionType?.toUpperCase()) || !validateTransactionDate){
            throw new Error("Tip-transakcije "+transactionType+" i datum "+transactionDate+" za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/transaction-type-and-date`,{
            params:{
                transactionType:(transactionType || "").toUpperCase(),
                transactionDate:moment(transactionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip-transakcije "+transactionType+" i datum "+transactionDate+" za datu transakciju");
    }
}

export async function findByTransactionTypeAndTransactionDateAfter({transactionType, transactionDate}){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!isTransactionTypeValid.includes(transactionType?.toUpperCase()) || !validateTransactionDate){
            throw new Error("Tip-transakcije "+transactionType+" i datum-posle "+transactionDate+" za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/transaction-type-and-date-after`,{
            params:{
                transactionType:(transactionType || "").toUpperCase(),
                transactionDate:moment(transactionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip-transakcije "+transactionType+" i datum-posle "+transactionDate+" za datu transakciju");
    }
}

export async function findByTransactionTypeAndTransactionDateBefore({transactionType, transactionDate}){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!isTransactionTypeValid.includes(transactionType?.toUpperCase()) || !validateTransactionDate){
            throw new Error("Tip-transakcije "+transactionType+" i datum-pre "+transactionDate+" za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/transaction-type-and-date-before`,{
            params:{
                transactionType:(transactionType || "").toUpperCase(),
                transactionDate:moment(transactionDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip-transakcije "+transactionType+" i datum-pre "+transactionDate+" za datu transakciju");
    }
}

export async function findByTransactionTypeAndTransactionDateBetween({transactionType, transactionDateStart, transactionDateEnd}){
    try{
        const validateTransactionDateStart = moment.isMoment(transactionDateStart) || moment(transactionDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateTransactionDateEnd = moment.isMoment(transactionDateEnd) || moment(transactionDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!isTransactionTypeValid.includes(transactionType?.toUpperCase()) || !validateTransactionDateStart || !validateTransactionDateEnd){
            throw new Error("Tip-transakcije "+transactionType+" i opseg datuma "+validateTratransactionDateStartnsactionDateStart+" - "+transactionDateEnd+" za transakciju, nisu pronadjeni");
        }
        if(moment(transactionDateEnd).isBefore(moment(transactionDateStart))){
            throw new Error("Datum za kraj transakcije ne sme biti pre datuma za pocetak transakcije");
        }
        const response = await api.get(url+`/transaction-type-and-date-range`,{
            params:{
                transactionType:(transactionType || "").toUpperCase(),
                transactionDateStart:moment(transactionDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                transactionDateEnd:moment(transactionDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+transactionDateStart+" - "+transactionDateEnd+" i tip-transakcije "+transactionType+" za datu transakciju");
    }
}

export async function findByUserFirstNameContainingIgnoreCaseAndUserLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" || !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" korisnika za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/user-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime "+lastName+" korisnika za datu transakciju");
    }
}

export async function findByUserEmailLikeIgnoreCase(userEmail){
    try{    
        if(!userEmail || typeof userEmail !== "string" || userEmail.trim() === ""){
            throw new Error("Email "+userEmail+" korisnika za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/user-email`,{
            params:{
                userEmail:userEmail
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+userEmail+" korisnika za datu transakciju");
    }
}

export async function findBySourceAccountId(sourceAccountId){
    try{
        if(isNaN(sourceAccountId) || sourceAccountId == null){
            throw new Error("Id "+sourceAccountId+" izvornog racuna 'source-account' za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/source-account/${sourceAccountId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+sourceAccountId+" izvornog-racuna 'source-account' za datu transakciju");
    }
}

export async function findBySourceAccountAccountNumberContainingIgnoreCase(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === ""){
            throw new Error("Broj izvornog-racuna "+accountNumber+" za datu transakciju nije pronadjen");
        }
        const response = await api.get(url+`/search/source-account-number`,{
            params:{
                accountNumber:accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj izvornog-racuna "+accountNumber+" za datu transakciju");
    }
}

export async function findBySourceAccountAccountName(accountName){
    try{
        if(!accountName || typeof accountName !== "string" || accountName.trim() === ""){
            throw new Error("Naziv izvornog-racuna "+accountName+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/source-account-name`,{
            params:{
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv izvornog-racuna "+accountName+" za datu transakciju");
    }
}

export async function findBySourceAccountType(type){
    try{
        if(!isAccountTypeValid.includes(type?.toUpperCase())){
            throw new Error("Tip izvornog-racuna "+type+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/source-account-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip izvornog-racuna "+type+" za datu transakciju");
    }
}

export async function findBySourceAccountAccountNumberContainingIgnoreCaseAndSourceAccountAccountNameContainingIgnoreCase({accountNumber, accountName}){
    try{
        if(!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === "" || !accountName || typeof accountName !== "string" || accountName.trim() === ""){
            throw new Error("Broj "+accountNumber+"  i naziv izvornog-racuna "+accountName+" za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/source-account-number-and-name`,{
            params:{
                accountNumber:accountNumber,
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj "+accountNumber+" i naziv izvornog-racuna "+accountName+" za datu transakciju");
    }
}

export async function findByTargetAccountId(targetAccountId){
    try{
        if(isNaN(targetAccountId) || targetAccountId == null){
            throw new Error("Id "+targetAccountId+" ciljanog-racuna za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/target-account/${targetAccountId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno  nismo pronasli id "+targetAccountId+" ciljanog-racuna za datu transakciju");
    }
}

export async function findByTargetAccountAccountNumberContainingIgnoreCase(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === ""){
            throw new Error("Broj ciljanog-racuna "+accountNumber+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/target-account-number`,{
            params:{
                accountNumber:accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj ciljanog-racuna "+accountNumber+" za datu transakciju");
    }
}

export async function findByTargetAccountAccountName(accountName){
    try{
        if(!accountName || typeof accountName !== "string" || accountName.trim() === ""){
            throw new Error("Naziv ciljanog-racuna "+accountName+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/target-account-name`,{
            params:{
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv ciljanog-racuna "+accountName+" za datu transakciju");
    }
}

export async function findByTargetAccountType(type){
    try{
        if(!isAccountTypeValid.includes(type?.toUpperCase())){
            throw new Error("Tip ciljanog-racuna "+type+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/target-account-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pornasli tip ciljanog-racuna "+type+" za datu transakciju");
    }
}

export async function findByTargetAccountAccountNumberContainingIgnoreCaseAndTargetAccountAccountNameContainingIgnoreCase({accountNumber, accountName}){
    try{
        if(!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === "" ||
           !accountName || typeof accountName !== "string" || accountName.trim() === ""){
            throw new Error("Broj "+accountNumber+" i naziv ciljanog-racuna "+accountName+" za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/target-account-number-and-name`,{
            params:{
                accountNumber:accountNumber,
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj "+accountNumber+" i naziv ciljanog-racuna "+accountName+" za datu transakciju");
    }
}

export async function findByAmountBetweenAndTransactionDateBetween({min, max, start, end}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0 || !validateStart ||
           !validateEnd){
            throw new Error("Opseg kolicine novca "+parseMin+" - "+parseMax+" i opseg datuma transakcije "+start+" - "+end+" za transakciju, nisu pronadjeni");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalna kolicina novca ne sme biti veca od maksimalne kolicine novca");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj transakcije ne sme biti pre datuma za pocetak transakcije");
        }
        const response = await api.get(url+`/search/amount-range-and-transaction-date-range`,{
            params:{
                min:parseMin,
                max:parseMax,
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    } 
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kolicine novca "+min+" - "+max+" i opseg datuma transakcija "+start+" - "+end+" za datu transakciju");
    }
}

export async function findByUserIdAndTransactionDateBetween({userId, start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            isNaN(userId) || userId == null || !validateStart || !validateEnd){
            throw new Error("Id korisnika "+userId+" i opseg datuma transakcije "+start+" - "+end+" za transakciju, nisu pronadjeni");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj transakcije ne sme biti pre datuma za pocetak transakcije");
        }
        const response = await api.get(url+`/user/${userId}/transaction-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id korisnika "+userId+" i opseg datuma transakcije "+start+" - "+end+" za datu transakciju");
    }
}

export async function findBySourceAccountIdAndTransactionTypeAndTransactionDateBetween({accountId, transactionType, start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            isNaN(accountId) || accountId == null || !isTransactionTypeValid.includes(transactionType?.toUpperCase()) ||
            !validateStart || !validateEnd){
            throw new Error("Id izvornog-racuna "+accountId+" ,tip-transakcije "+transactionType+" i opseg datuma transakcije "+
                start+" - "+end+" za transakciju, nisu pronadjeni"
            );
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj transakcije ne sme biti pre datuma za pocetak transakcije");
        }
        const response = await api.get(url+`/source-account/${accountId}/transaction-type-date-between`,{
            params:{
                transactionType:(transactionType || "").toUpperCase(),
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id izvornog-racuna "+accountId+" , tip-transakcije "+transactionType+" i opseg datuma transakcije "+
            start+" - "+end+" za datu transakciju"
        );
    }
}

export async function sumOfOutgoingTransactions(accountId){
    try{
        if(isNaN(accountId) || accountId == null){
            throw new Error("Zbir odlazecih transakcija po datom "+accountId+" id-iju, nije pronadjen");
        }
        const response = await api.get(url+`/sum-of-outgoing-transactions/account/${accountId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir odlazecih transakcija po datom "+accountId+" id-iju");
    }
}

export async function sumOfIncomingTransactions(accountId){
    try{
        if(isNaN(accountId) || accountId == null){
            throw new Error("Zbir dolazecih transakcija po datom "+accountId+" id-iju, nije pronadjen");
        }
        const response = await api.get(url+`/sum-of-incoming-transactions/account/${accountId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir dolazecih transakcija po datom "+accountId+" id-iju");
    }
}

export async function existsBySourceAccount_AccountNumberContainingIgnoreCase(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === ""){
            throw new Error("Postojanje izvornog broja racuna "+accountNumber+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/source-account-number`,{
            params:{
                accountNumber:accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje broja izvornog-racuna "+accountNumber+" za datu transakciju");
    }
}

export async function existsBySourceAccount_AccountNameContainingIgnoreCase(accountName){
    try{
        if(!accountName || typeof accountName !== "string" || accountName.trim() === ""){
            throw new Error("Postojanje izvornog naziva racuna "+accountName+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/source-account-number`,{
            params:{
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje naziva izvornog-racuna "+accountName+" za datu transakciju");
    }
}

export async function existsByTargetAccount_AccountNumberContainingIgnoreCase(accountNumber){
    try{
        if(!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === ""){
            throw new Error("Postojanje broja ciljanog racuna "+accountNumber+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/target-account-number`,{
            params:{
                accountNumber:accountNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenurtno nismo pronasli postojanje broja ciljanog racuna "+accountNumber+" za datu transakciju");
    }
}

export async function existsByTargetAccount_AccountNumberContainingIgnoreCase(accountName){
    try{
        if(!accountName || typeof accountName !== "string" || accountName.trim() === ""){
            throw new Error("Postojanje naziva ciljanog racuna "+accountName+" za datu transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/target-account-number`,{
            params:{
                accountName:accountName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenurtno nismo pronasli postojanje naziva ciljanog racuna "+accountName+" za datu transakciju");
    }
}

export async function existsBySourceAccountIdAndTargetAccountId({sourceId, targetId}){
    try{
        if(isNaN(sourceId) || sourceId == null || isNaN(targetId) || targetId == null){
            throw new Error("Id izvornog racuna "+sourceId+" kao i id ciljanog racuna "+targetId+" za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists/source-account/${sourceId}/target-account/${targetId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id izvornog racuna "+sourceId+" kao i id ciljanog racuna "+targetId+" za datu transakciju");
    }
}

export async function fundTransfer({sourceAccountNumber, targetAccountNumber, paymentMethod, userId, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(
            isNaN(parseAmount) || parseAmount <= 0 || sNaN(userId) || userId == null || 
            !isPaymentMethodValid.includes(paymentMethod?.toUpperCase()) || !sourceAccountNumber || typeof sourceAccountNumber !== "string" || 
            sourceAccountNumber.trim() === "" || !targetAccountNumber || typeof targetAccountNumber !== "string" || targetAccountNumber.trim() === ""){
            throw new Error("Broj izvornog racuna "+sourceAccountNumber+" ,broj ciljanog racuna "+targetAccountNumber+" ,metod placanja "+paymentMethod+
                " , korisnicki id "+userId+" i kolicina novca "+parseAmount+" za transfer sredstava date transakcije, nisu pronadjeni");
        }
        const response = await api.get(url+`/fund-transfer/${userId}`,{
            params:{
                sourceAccountNumber:sourceAccountNumber,
                targetAccountNumber:targetAccountNumber,
                paymentMethod:(paymentMethod || "").toUpperCase(),
                amount:parseAmount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj izvornog-racuna "+sourceAccountNumber+
            " ,broj ciljanog racuna "+targetAccountNumber+" ,metod placanja "+paymentMethod+" ,koricniki id "+userId+
            " i kolicinu novca "+amount+" za transfer sredstava, date transakcije"
        );
    }
}

export async function cashWithdrawal({accountNumber, amount, paymentMethod, userId}){
    try{
        const parseAmount = parseFloat(amount);
        if(
            isNaN(parseAmount) || parseAmount <= 0 || isNaN(userId) || userId == null || !isPaymentMethodValid.includes(paymentMethod?.toUpperCase()) ||
            !accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === ""){
            throw new Error("Broj racuna "+accountNumber+" , kolicina novca "+parseAmount+" , metod placanja "+paymentMethod+
                " i korisnicki id "+userId+" za podizanje sredstava za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/cash-withdrawal/${userId}`,{
            params:{
                amount:parseAmount,
                accountNumber:accountNumber,
                paymentMethod:(paymentMethod || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj racuna "+accountNumber+" kolicinu novca "+amount+" ,metod placanja "+paymentMethod+
            " i korisnicki id "+userId+" za podizanje sredstava za datu transakciju");
    }
}

export async function deposit({accountNumber, amount, paymentMethod, userId}){
    try{
        const parseAmount = parseFloat(amount);
        if(
            isNaN(parseAmount) || parseAmount <= 0 || isNaN(userId) || userId == null ||
            !isPaymentMethodValid.includes(paymentMethod?.toUpperCase()) || !accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === ""){
            throw new Error("Broj ciljanog racuna "+accountNumber+" kolicina novca "+parseAmount+" ,metod placanja "+paymentMethod+
                " i korisnikcki id "+userId+" za depozit sredstava za datu transakciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/deposit/${userId}`,{
            params:{
                accountNumber:accountNumber,
                amount:parseAmount,
                paymentMethod:(paymentMethod || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.deleteTransaction;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj ciljanog racuna "+accountNumber+" kolicinu novca "+amount+
            " ,metod placanja "+paymentMethod+" i korisnicki id "+userId+" za depozit sredstava za datu transakciju");
    }
}

export async function makePayment({sourceAccountNumber, targetAccountNumber, amount, paymentMethod, userId}){
    try{
        const parseAmount = parseFloat(amount);
        if(
            isNaN(parseAmount) || parseAmount <= 0 || isNaN(userId) || userId <= 0 || !isPaymentMethodValid.includes(paymentMethod?.toUpperCase()) ||
            !sourceAccountNumber || typeof sourceAccountNumber !== "string" || sourceAccountNumber.trim() === "" ||
            !targetAccountNumber || typeof targetAccountNumber !== "string" || targetAccountNumber.trim() === ""){
                throw new Error("Broj izvornog racuna "+sourceAccountNumber+" ,broj ciljanog racuna "+targetAccountNumber+
                " ,kolicina novca "+parseAmount+" ,metod placanja "+paymentMethod+" i korisnicki id "+userId+" za izvrsavanje plavanja date transakcije, nisu pronadjeni");
        }
        const response = await api.get(url+`/make-payment/${userId}`,{
            params:{
                amount:parseAmount,
                sourceAccountNumber:sourceAccountNumber,
                targetAccountNumber:targetAccountNumber,
                paymentMethod:(paymentMethod || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj izvornog racuna "+sourceAccountNumber+" ,broj ciljanog racuna "+targetAccountNumber+
            " ,kolicina novca "+amount+" ,metod placanja "+paymentMethod+" i korisnicki id "+userId+" za izvrsavanje placanja, date transakcije");
    }
}

export async function refund({originalTransactionId, userId}){
    try{
        if(isNaN(originalTransactionId) || originalTransactionId == null || isNaN(userId) || userId == null){
            throw new Error("Id izvornog racuna "+originalTransactionId+" kao i id ciljanog racuna "+userId+" za povracaj sredstava date transakcije, nisu pronadjeni");
        }
        const response = await api.get(url+`/refund/${userId}/${originalTransactionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id izvornog racuna "+originalTransactionId+" kao i id ciljanog racuna "+userId+" za povracaj novcanih sredstava, za datu transakciju");
    }
}