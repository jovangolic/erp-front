import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isOrderStatusValid = ["CREATED","PAID","SHIPPED","CANCELLED","PENDING"];
const isPaymentMethodValid = ["BANK_TRANSFER", "CASH", "CARD", "PAYPAL"];
const isPaymentStatusValid = ["PENDING", "COMPLETED", "FAILED"];
const url = `${import.meta.env.VITE_API_BASE_URL}/salesOrders`;

export async function createSalesOrder(buyerId, items, orderDate, totalAmount, note, status, invoiceId, orderNumber){
    try{
        if(
            !buyerId ||!Array.isArray(items) || items.length === 0 ||
            !moment(orderDate, moment.ISO_8601, true).isValid() ||
            isNaN(totalAmount) || parseFloat(totalAmount) <= 0 ||
            !note || typeof note !== "string" || note.trim() ===""||
            !isOrderStatusValid.includes(status?.toUpperCase()) ||
            !invoiceId || !orderNumber || typeof orderNumber !=="string" || orderNumber.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }  
        const requestBody = {buyerId, items, orderDate:moment(orderDate).toISOString(),
            totalAmount:parseFloat(totalAmount), note:note, status: status.toUpperCase(), invoiceId:invoiceId, orderNumber:orderNumber
        };
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
        if(
            !id ||
            !buyerId ||!Array.isArray(items) || items.length === 0 ||
            !moment(orderDate, moment.ISO_8601, true).isValid() ||
            isNaN(totalAmount) || parseFloat(totalAmount) <= 0 ||
            !note || typeof note !== "string" || note.trim() ===""||
            !isOrderStatusValid.includes(status?.toUpperCase()) ||
            !invoiceId || !orderNumber || typeof orderNumber !=="string" || orderNumber.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {buyerId,items, orderDate:moment(orderDate).toISOString(),totalAmount:parseFloat(totalAmount),  note,
            status: status.toUpperCase(), invoiceId, orderNumber
        };
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pronalazenja jedne prodajne narudzbine");
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
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(url+`/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kupcevom ID-iju");
    }
}

export async function findByBuyer_CompanyNameContainingIgnoreCase(companyName){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === ""){
            throw new Error("Dati naziv kompanije kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byCompanyName`,{
            params:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu kupceve kompanije");
    }
}

export async function findByBuyer_PibContainingIgnoreCase(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB  kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byPib`,{
            params:{pib:pib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu kupcevog PIB broja");
    }
}

export async function findByBuyer_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byAddress`,{
            params:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po adresi kupceve firme");
    }
}

export async function findByBuyer_ContactPerson(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Dati kontakt kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byContactPerson`,{
            params:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kontakt osobi");
    }
}

export async function findByBuyer_EmailContainingIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byEmail`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po emailu za kupca");
    }
}

export async function findByBuyer_PhoneNumberContainingIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona kupca nije pronadjen");
        }
        const response = await api.get(url+`/search/byPhoneNumber`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broku telefona za kupca");
    }
}

export async function findByInvoice_InvoiceNumberContainingIgnoreCase(invoiceNumber){
    try{
        if(!invoiceNumber || typeof invoiceNumber !== "string" || invoiceNumber.trim() === ""){
            throw new Error("Dati broj fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/byInvoiceNumber`,{
            params:{invoiceNumber:invoiceNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju fakture");
    }
}

export async function findByInvoice_TotalAmount(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
                throw new Error("Data ukupna kolicina za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/byTotalAmount`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po ukupnoj kolicini za fakturu");
    }
}

export async function findByInvoice_TotalAmountGreaterThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
                throw new Error("Data ukupna kolicina veca od za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/totalAmount/greater-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po ukupnoj kolicini vecoj od za fakturu ");
    }
}

export async function findByInvoice_TotalAmountLessThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
                throw new Error("Data ukupna kolicina manja od za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/totalAmount/less-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po ukupnoj kolicini manoj od za fakturu ");
    }
}

export async function findByInvoice_TotalAmountBetween(min, max){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg za ukupnu kolicinu nije pronadjen");
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
        handleApiError(error,"Greska prilikom trazenja po opsegu ukupne kolicine");
    }
}

export async function findByInvoice_IssueDate(issueDate){
    try{
        if(!moment(issueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum izdavanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/issueDate`,{
            params:{issueDate:moment(issueDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu izdavanja fakture");
    }
}

export async function findByInvoice_IssueDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum posle izdavanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/issue-date-after`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu posle izdavanja fakture");
    }
}

export async function findByInvoice_IssueDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum pre izdavanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/issue-date-before`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu pre izdavanja fakture");
    }
}

export async function findByInvoice_IssueDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datum izdavanja fakture nije pronadjen");
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
        handleApiError(error,"Greska prilikom trazenja po opsegu datuma izdavanja fakture");
    }
}

export async function findByInvoice_DueDate(dueDate){
    try{
        if(!moment(dueDate,"YYYY-MMM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum dospeca fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/due-date`,{
            params:{dueDate:moment(dueDate).format("YYYY-MMM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu dospeca fakture");
    }
}

export async function findByInvoice_DueDateAfter(date){
    try{
        if(!moment(date,"YYYY-MMM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum posle dospeca fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/due-date-after`,{
            params:{date:moment(date).format("YYYY-MMM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu posle dospeca fakture");
    }
}

export async function findByInvoice_DueDateBefore(date){
    try{
        if(!moment(date,"YYYY-MMM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum pre dospeca fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/due-date-before`,{
            params:{date:moment(date).format("YYYY-MMM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu pre dospeca fakture");
    }
}

export async function findByInvoice_DueDateBetween({start, end}){
    try{
        if(
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati datum opsega dospeca fakture nije pronadjen");
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
        handleApiError(error,"Greska prilikom trazenja po opsegu datuma dospeca fakture");
    }
}

export async function findByInvoice_NoteContainingIgnoreCase(note){
    try{
        if(!note || typeof note !=="string" || normalizeUnits.trim() === ""){
            throw new Error("Data nota fakture nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice-note`,{
            params:{note:note},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po noti fakture");
    }
}

export async function findByInvoice_Buyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID kupca za fakturu nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID-ja po fakturi kupca");
    }
}

export async function findByInvoice_RelatedSales_Id(relatedSalesId){
    try{
        if(isNaN(relatedSalesId) || relatedSalesId == null){
            throw new Error("Dati ID za prodaju fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/relatedSales/${relatedSalesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju prodaje za fakturu");
    }
}

export async function findByInvoice_Payment_Id(paymentId){
    try{
        if(isNaN(paymentId) || paymentId == null){
            throw new Error("Dati ID za placanje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment/${paymentId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju za placanje fakture");
    }
}

export async function findByInvoice_Payment_Amount(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina placanja za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice/payment/amount`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazaenja po kolicini placanja za fakturu");
    }
}

export async function findByInvoice_Payment_AmountGreaterThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina placanja veca od za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice/payment/amount-greater-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazaenja po kolicini placanja vecoj od za fakturu");
    }
}

export async function findByInvoice_Payment_AmountLessThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina placanja manjoj od za fakturu nije pronadjena");
        }
        const response = await api.get(url+`/search/invoice/payment/amount-less-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazaenja po kolicini placanja manjoj od za fakturu");
    }
}

export async function findByInvoice_Payment_Method(method){
    try{
        if(!isPaymentMethodValid.includes(method?.toUpperCase())){
            throw new Error("Dati metod placanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-method`,{
            params:{method:(method || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po metodi placanja fakture");
    }
}

export async function findByInvoice_Payment_Status(status){
    try{
        if(!isPaymentStatusValid.includes(method?.toUpperCase())){
            throw new Error("Dati status placanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu placanja fakture");
    }
}

export async function findByInvoice_Payment_ReferenceNumberLikeIgnoreCase(referenceNumber){
    try{    
        if(!referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim() === ""){
            throw new Error("Dati referentni broj placanja fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-reference-number`,{
            params:{referenceNumber:referenceNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po referntnom broju placanja fakture");
    }
}

export async function findByInvoice_Payment_PaymentDate(paymentDate){
    try{
        if(!moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum placanja fakture nije p[ronadjen");
        }
        const response = await api.get(url+`/search/invoice/payment-date`,{
            params:{paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu placanja fakture");
    }
}

export async function findByInvoice_Payment_PaymentDateBetween({startDate, endDate}){
    try{
        if(
            !moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati opseg datuma placanja fakture nije pronadjen");
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
        handleApiError(error,"Greska prilikom trazenja po opsegu datuma placanja fakture");
    }
}

export async function findByInvoice_CreatedBy_Id(userId){
    try{
        if(isNaN(userId) || userId == null){
            throw new Error("Dati ID za lice koje je kreiralo fakturu nije pronadjeno");
        }
        const response = await api.get(url+`/search/invoice/createdBy/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po licu koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !=="string" || email.trim() === ""){
            throw new Error("Dati email zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po email-u koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_Address(address){
    try{
        if(!address || typeof address !=="string" || address.trim() === ""){
            throw new Error("Data adresa zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-address`,{
            params:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po adresi koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po broju-telefona koji je kreirao fakturu");
    }
}

export async function findByInvoice_CreatedBy_FirstNameLikeIgnoreCaseAndLastNameLikeIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !=="string" || firstName.trim() === "" || 
            !lastName || typeof lastName !=="string" || lastName.trim() === ""){
            throw new Error("Dato ime i prezime zaposleog za kreiranje fakture nije pronadjen");
        }
        const response = await api.get(url+`/search/invoice/createdBy-fullName`,{
            params:{firstName:firstName, lastName:lastName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja zaposlenog po imenu i prezimenu koji je kreirao fakturu");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}