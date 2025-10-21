import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isOrderStatusValid = ["CREATED","PAID","SHIPPED","CANCELLED","PENDING"];
const isPaymentMethodValid = ["BANK_TRANSFER", "CASH", "CARD", "PAYPAL"];
const isPaymentStatusValid = ["PENDING", "COMPLETED", "FAILED"];
const url = `${import.meta.env.VITE_API_BASE_URL}/salesOrders`;

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createSalesOrder(buyerId, items, orderDate, totalAmount, note, status, invoiceId, orderNumber){
    try{
        const validateDate = moment.isMoment(orderDate) || moment(orderDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const parseAmount = parseFloat(amount);
        if(
            buyerId == null || isNaN(buyerId) ||!Array.isArray(items) || items.length === 0 ||
            !validateDate ||
            isNaN(parseAmount) || parseAmount <= 0 ||
            !note || typeof note !== "string" || note.trim() ===""||
            !isOrderStatusValid.includes(status?.toUpperCase()) ||
            invoiceId == null || isNaN(invoiceId) || 
            !orderNumber || typeof orderNumber !=="string" || orderNumber.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }  
        const requestBody = {buyerId, items, orderDate,totalAmount, note:note, status, invoiceId:invoiceId,orderNumber};
        const response = await api.post(url+`/create/new-sales-order`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja prodajne narudzbine: " + error.message);
        }
    }
}

export async function updateSalesOrder({id,buyerId, items, orderDate, totalAmount, note, status, invoiceId, orderNumber} ){
    try{
        const validateDate = moment.isMoment(orderDate) || moment(orderDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const parseAmount = parseFloat(amount);
        if(
            id == null || isNaN(id) ||
            buyerId == null || isNaN(buyerId) ||!Array.isArray(items) || items.length === 0 ||
            !validateDate ||
            isNaN(parseAmount) || parseAmount <= 0 ||
            !note || typeof note !== "string" || note.trim() ===""||
            !isOrderStatusValid.includes(status?.toUpperCase()) ||
            invoiceId == null || isNaN(invoiceId) || 
            !orderNumber || typeof orderNumber !=="string" || orderNumber.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }  
        const requestBody = {buyerId, items, orderDate,totalAmount, note:note, status, invoiceId:invoiceId,orderNumber};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja prodajne narudzbine: " + error.message);
        }
    }
}

export async function deleteSalesOrder(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getSalesOrderById(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pronalazenja jedne prodajne narudzbine po "+id+" id-iju");
    }
}

export async function getAllSalesOrders(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih prodajnih narudzbina");
    }
}

export async function findByBuyer_Id(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("Dati ID "+buyerId+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kupcevom "+buyerId+" ID-iju");
    }
}

export async function findByBuyer_CompanyNameContainingIgnoreCase(companyName){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === ""){
            throw new Error("Dati naziv "+companyName+" kompanije kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byCompanyName`,{
            params:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu "+companyName+" kupceve kompanije");
    }
}

export async function findByBuyer_PibContainingIgnoreCase(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB "+pib+"  kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byPib`,{
            params:{pib:pib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu kupcevog "+pib+" PIB broja");
    }
}

export async function findByBuyer_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa "+address+" kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byAddress`,{
            params:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po adresi "+address+" kupceve firme");
    }
}

export async function findByBuyer_ContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Dati kontakt kupca "+contactPerson+"  nije pronadjen");
        }
        const response = await api.get(url+`/search/byContactPerson`,{
            params:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kontakt osobi "+contactPerson);
    }
}

export async function findByBuyer_EmailContainingIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byEmail`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po emailu "+email+" za kupca");
    }
}

export async function findByBuyer_PhoneNumberContainingIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona "+phoneNumber+" kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byPhoneNumber`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju telefona "+phoneNumber+" za kupca");
    }
}

export async function findByInvoice_InvoiceNumberContainingIgnoreCase(invoiceNumber){
    try{
        if(!invoiceNumber || typeof invoiceNumber !== "string" || invoiceNumber.trim() === ""){
            throw new Error("Dati broj fakture "+invoiceNumber+" nije pronadjen");
        }
        const response = await api.get(url+`/search/byInvoiceNumber`,{
            params:{invoiceNumber:invoiceNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju fakture "+invoiceNumber);
    }
}

export async function findByInvoice_TotalAmount(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
                throw new Error("Data ukupna kolicina "+parseTotalAmount+" za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/byTotalAmount`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po ukupnoj kolicini "+totalAmount+" za fakturu");
    }
}

export async function findByInvoice_TotalAmountGreaterThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
                throw new Error("Data ukupna kolicina veca od "+parseTotalAmount+" za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/totalAmount/greater-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po ukupnoj kolicini vecoj od "+totalAmount+" za fakturu ");
    }
}

export async function findByInvoice_TotalAmountLessThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
                throw new Error("Data ukupna kolicina manja od "+parseTotalAmount+" za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/totalAmount/less-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po ukupnoj kolicini manoj od "+totalAmount+" za fakturu ");
    }
}

export async function findByInvoice_TotalAmountBetween(min, max){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg "+parseMin+" - "+parseMax+" za ukupnu kolicinu nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Manja kolicina ne sme biti veca max kolicine");
        }
        const response = await api.get(url+`/search/totalAmount/between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu "+min+" - "+max+" ukupne kolicine");
    }
}

export async function findByInvoice_IssueDate(issueDate){
    try{
        const validateIssueDate = moment.isMoment(issueDate) || moment(issueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateIssueDate){
            throw new Error("Dati datum "+issueDate+" izdavanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/issueDate`,{
            params:{issueDate:moment(issueDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu "+issueDate+" izdavanja fakture");
    }
}

export async function findByInvoice_IssueDateAfter(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum posle "+date+" izdavanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/issue-date-after`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu posle "+date+" izdavanja fakture");
    }
}

export async function findByInvoice_IssueDateBefore(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum pre "+date+" izdavanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/issue-date-before`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu pre "+date+" izdavanja fakture");
    }
}

export async function findByInvoice_IssueDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg "+start+" - "+end+" datum izdavanja fakture nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/issue-date-range`,{
            params:{start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                    end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu "+start+" - "+end+" datuma izdavanja fakture");
    }
}

export async function findByInvoice_DueDate(dueDate){
    try{
        const validateDueDate = moment.isMoment(dueDate) || moment(dueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDueDate){
            throw new Error("Dati datum dospeca "+dueDate+" fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/due-date`,{
            params:{dueDate:moment(dueDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu dospeca "+dueDate+" fakture");
    }
}

export async function findByInvoice_DueDateAfter(date){
    try{
        const validateDueDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDueDate){
            throw new Error("Dati datum posle "+dueDate+" dospeca fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/due-date-after`,{
            params:{date:moment(dueDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu posle "+date+" dospeca fakture");
    }
}

export async function findByInvoice_DueDateBefore(date){
    try{
        const validateDueDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDueDate){
            throw new Error("Dati datum pre "+date+" dospeca fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/due-date-before`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu pre "+date+" dospeca fakture");
    }
}

export async function findByInvoice_DueDateBetween({start, end}){
    try{
        const validateDueDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDueDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDueDateStart || !validateDueDateEnd){
            throw new Error("Dati datum opsega "+start+" - "+end+" dospeca fakture nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/due-date-range"`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu "+start+" - "+end+" datuma dospeca fakture");
    }
}

export async function findByInvoice_NoteContainingIgnoreCase(note){
    try{
        if(!note || typeof note !=="string" || normalizeUnits.trim() === ""){
            throw new Error("Data beleska "+note+" fakture nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice-note`,{
            params:{note:note},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po belesci "+note+" fakture");
    }
}

export async function findByInvoice_Buyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID "+buyerId+" kupca za fakturu nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja  ID-ja "+buyerId+" po fakturi kupca");
    }
}

export async function findByInvoice_RelatedSales_Id(relatedSalesId){
    try{
        if(isNaN(relatedSalesId) || relatedSalesId == null){
            throw new Error("Dati ID "+relatedSalesId+" za prodaju fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/relatedSales/${relatedSalesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju "+relatedSalesId+" prodaje za fakturu");
    }
}

export async function findByInvoice_Payment_Id(paymentId){
    try{
        if(isNaN(paymentId) || paymentId == null){
            throw new Error("Dati ID "+paymentId+" za placanje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment/${paymentId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju "+paymentId+" za placanje fakture");
    }
}

export async function findByInvoice_Payment_Amount(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina placanja "+parseAmount+" za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice/payment/amount`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazaenja po kolicini "+amount+" placanja za fakturu");
    }
}

export async function findByInvoice_Payment_AmountGreaterThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina placanja veca od "+parseAmount+" za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice/payment/amount-greater-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazaenja po kolicini placanja vecoj od "+amount+" za fakturu");
    }
}

export async function findByInvoice_Payment_AmountLessThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina placanja manjoj od "+parseAmount+" za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice/payment/amount-less-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazaenja po kolicini placanja manjoj od "+amount+" za fakturu");
    }
}

export async function findByInvoice_Payment_Method(method){
    try{
        if(!isPaymentMethodValid.includes(method?.toUpperCase())){
            throw new Error("Dati metod "+method+" placanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-method`,{
            params:{method:(method || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po metodi "+method+" placanja fakture");
    }
}

export async function findByInvoice_Payment_Status(status){
    try{
        if(!isPaymentStatusValid.includes(method?.toUpperCase())){
            throw new Error("Dati status "+status+" placanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu "+status+" placanja fakture");
    }
}

export async function findByInvoice_Payment_ReferenceNumberLikeIgnoreCase(referenceNumber){
    try{    
        if(!referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim() === ""){
            throw new Error("Dati referentni broj "+referenceNumber+" placanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-reference-number`,{
            params:{referenceNumber:referenceNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po referntnom broju "+referenceNumber+" placanja fakture");
    }
}

export async function findByInvoice_Payment_PaymentDate(paymentDate){
    try{
        const validatePaymentDate = moment.isMoment(paymentDate) || moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validatePaymentDate){
            throw new Error("Dati datum "+paymentDate+" placanja fakture nije p[ronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-date`,{
            params:{paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu "+paymentDate+" placanja fakture");
    }
}

export async function findByInvoice_Payment_PaymentDateBetween({startDate, endDate}){
    try{
        const validatePaymentDateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validatePaymentDateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validatePaymentDateStart || !validatePaymentDateEnd){
            throw new Error("Dati opseg "+startDate+" - "+endDate+" datuma placanja fakture nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/invoice/payment-date-range`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opsegu "+startDate+" - "+endDate+" datuma placanja fakture");
    }
}

export async function findByInvoice_CreatedBy_Id(userId){
    try{
        if(isNaN(userId) || userId == null){
            throw new Error("Dati ID "+userId+" za lice koje je kreiralo fakturu nije pronadjeno");
        }
        const response = await api.get(url+`/search/invoice/createdBy/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po id "+userId+" licu koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !=="string" || email.trim() === ""){
            throw new Error("Dati email "+email+" zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po "+email+" email-u koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_Address(address){
    try{
        if(!address || typeof address !=="string" || address.trim() === ""){
            throw new Error("Data adresa "+address+" zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-address`,{
            params:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po adresi "+address+" koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po broju-telefona "+phoneNumber+" koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_FirstNameLikeIgnoreCaseAndLastNameLikeIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !=="string" || firstName.trim() === "" || 
            !lastName || typeof lastName !=="string" || lastName.trim() === ""){
            throw new Error("Dato ime "+firstName+" i prezime "+lastName+" zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-fullName`,{
            params:{firstName:firstName, lastName:lastName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po imenu "+firstName+" i prezimenu "+lastName+" koji je kreirao fakturu");
    }
}



