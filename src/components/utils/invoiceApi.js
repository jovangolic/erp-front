import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isInvoiceStatusValid = ["DRAFT","ISSUED","PAID","CANCELLED","OVERDUE"];  
const isPaymentMethodValid = ["BANK_TRANSFER", "CASH", "CARD", "PAYPAL"];
const isOrderStatusValid = ["CREATED", "PAID", "SHIPPED", "CANCELLED", "PENDING"];

export async function createInvoice({invoiceNumber,issueDate,dueDate,status,totalAmount,buyerId,salesId,paymentId,note,salesOrderId,createdById}){
    try{
        if(
            !invoiceNumber || typeof invoiceNumber !=="string" || invoiceNumber.trim() === "" ||
            !moment(issueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(dueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !isInvoiceStatusValid.includes(status?.toUpperCase()) ||
            isNaN(totalAmount) || parseFloat(totalAmount) <= 0 ||
            !buyerId || !salesId || !paymentId ||
            !note || typeof note !== "string" || note.trim() === "" ||
            !salesOrderId || !createdById
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {invoiceNumber, issueDate:moment(issueDate).format("YYYY-MM-DDTHH:mm:ss"), dueDate:moment(dueDate).format("YYYY-MM-DDTHH:mm:ss"),
            status:status.toUpperCase(), totalAmount:parseFloat(totalAmount),buyerId,salesId,paymentId,note,
            salesOrderId, createdById
        };
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/invoices/create/new-invoice`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja fakture: ${error.message}`);
        }
    }
}

export async function updateInvoice({invoiceId,invoiceNumber,issueDate,dueDate,status,totalAmount,buyerId,salesId,paymentId,note,salesOrderId,createdById} ){
    try{
        if(
            invoiceId == null || isNan(invoiceId) ||
            !invoiceNumber || typeof invoiceNumber !=="string" || invoiceNumber.trim() === "" ||
            !moment(issueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(dueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !isInvoiceStatusValid.includes(status?.toUpperCase()) ||
            isNaN(totalAmount) || parseFloat(totalAmount) <= 0 ||
            !buyerId || !salesId || !paymentId ||
            !note || typeof note !== "string" || note.trim() === "" ||
            !salesOrderId || !createdById
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {invoiceNumber, issueDate:moment(issueDate).format("YYYY-MM-DDTHH:mm:ss"), dueDate:moment(dueDate).format("YYYY-MM-DDTHH:mm:ss"),
            status:status.toUpperCase(), totalAmount:parseFloat(totalAmount),buyerId,salesId,paymentId,note,
            salesOrderId, createdById
        };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/invoices/update/${invoiceId}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja fakture: ${error.message}`);
        }
    }
}

export async function deleteInvoice(invoiceId){
    try{
        if(invoiceId == null || isNan(invoiceId)){
            throw new Error("Dati Id za Invoice nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/invoices/delete/${invoiceId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getInvoiceById(id){
    try{
        if(invoiceId == null || isNan(invoiceId)){
            throw new Error("Dati Id za Invoice nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne fakture");
    }
}

export async function getAllInvoices(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/all-invoices`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih faktura");
    }
}

export async function getByInvoiceStatus(status){
    try{
        if(!isInvoiceStatusValid.includes(status?.toUpperCase())){
            throw new Error("Nepostojeci status");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice-status`,{
            params:{
                status:status.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po statusu fakture");
    }
}

export async function getByBuyerAndStatus({buyerId, status}){
    try{
        if(!buyerId || !isInvoiceStatusValid.includes(status?.toUpperCase())){
            throw new Error("Nepostojeci buyerId i status");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/buyer-status`,{
            params:{
                buyerId, status:status.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id kupca i po statusu fakture");
    }
}

export async function getByTotalAmount(totalAmount){
    try{
        if(isNaN(totalAmount) || parseFloat(totalAmount) <= 0){
            throw new Error("Ukupan iznos mora biti pozitivan");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/total-amount`,{
            params:{
                totalAmount:parseFloat(totalAmount)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po ukupnoj ceni");
    }
}

export async function getByBuyerId(buyerId){
    try{
        if(!buyerId){
            throw new Error("Dati id za buyer nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/buyer/${buyerId}`,{
            headers: getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id kupca");
    }
}

export async function getBySalesId(salesId){
    try{
        if(salesId == null || isNaN(salesId)){
            throw new Error("Dati id za sales nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/sales/${salesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id prodaje");
    }
}

export async function getByPaymentId(paymentId){
    try{
        if(paymentId == null || isNaN(paymentId)){
            throw new Error("Dati id za payment nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/payment/${paymentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id placanja");
    }
}

export async function getByIssueDateBetween({startDate,endDate}){
    try{
        if(
            !moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Nevalidan datum.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/issue-date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja izmedju datuma pocetka i kraja datuma");
    }
}

export async function getByDueDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum mora biti validan");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/due-date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja pre isteka datuma");
    }
}

export async function searchByInvoiceNumberFragment(fragment){
    try{
        if(!fragment || typeof fragment !== "string" || fragment.trim() === ""){
            throw new Error("Dati fragment nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/search-fragment/${fragment}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po fragmentu");
    }
}

export async function existsByInvoiceNumber(invoiceNumber){
    try{
        if(!invoiceNumber || typeof invoiceNumber !== "string" || invoiceNumber.trim() === ""){
            throw new Error("InvoiceNumber mora biti validan i popunjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/exists`,{
            params:{
                invoiceNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po broju fakture");
    }
}

export async function getInvoicesByBuyerSortedByIssueDate(buyerId){
    try{
        if(!buyerId){
            throw new Error("Dati id za buyer nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/sorted-buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po sortiranju: fakture,kupca i datuma");
    }
}

export async function findByBuyerCompanyNameContainingIgnoreCase(companyName){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === ""){
            throw new Error("Company name nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-company-name`,{
            params:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja kupca po nazivu");
    }
}

export async function findByBuyerPib(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-pib`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja buyer-a po PIB-u");
    }
}

export async function findByBuyerEmailContainingIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email za Buyer nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-email`,{
            params:{pib:pib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po buyer-ovom email-u");
    }
}

export async function findByBuyerPhoneNumber(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona za Buyer-a nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po Buyer-ovom broju telefona");
    }
}

export async function findByNoteContainingIgnoreCase(note){
    try{
        if(!note || typeof note !== "string" || note.trim() === ""){
            throw new Error("Dati Note nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/by-note`,{
            params:{note:note},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema Note-u");
    }
}

export async function findByRelatedSales_Id(relatedSalesId){
    try{
        if(relatedSalesId == null || isNaN(relatedSalesId)){
            throw new Error("Dati ID za relatedSales nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales/${relatedSalesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po relatedSalesId-ju");
    }
}

export async function findByRelatedSales_TotalPrice(totalPrice){
    try{
        const parseTotalPrice =parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales-totalPrice`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za RelatedSales");
    }
}

export async function findByRelatedSales_TotalPriceGreaterThan(totalPrice){
    try{
        const parseTotalPrice =parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales-totalPrice-greate-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od za RelatedSales");
    }
}

export async function findByRelatedSales_TotalPriceLessThan(totalPrice){
    try{
        const parseTotalPrice =parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales-totalPrice-less-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od za RelatedSales");
    }
}

export async function findByPayment_Amount(amount){
    try{
        const parseAmout = parseFloat(amount);
        if(isNaN(parseAmout) || parseAmout <= 0){
            throw new Error("Data kolicina za Payment nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-amount`,{
            params:{amount:parseAmout},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po amount za Payment");
    }
}

export async function findByPayment_PaymentDate(paymentDate){
    try{
        if(moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum placanja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-date`,{
            params:{paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pilikom trazenja Payment-a po datumu placanja");
    }
}

export async function findByPayment_PaymentDateBetween(paymentDateStart, paymentDateEnd){
    try{
        if(moment(paymentDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() || moment(paymentDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datuma za placanje nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-date-range`,{
            params:{
                paymentDateStart:moment(paymentDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                paymentDateEnd:moment(paymentDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        handleApiError(error,"Greska prilikom trazenja prema opsegu datuma za placanje");
    }
}

export async function findByPayment_Method(method){
    try{
        if(!isPaymentMethodValid.includes(method?.toUpperCase())){
            throw new Error("Dati metod za placanje nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-method`,{
            params:{method:(method || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja metoda za placanje");
    }
}

export async function findByPayment_ReferenceNumberContainingIgnoreCase(referenceNumber){
    try{
        if(!referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim() === ""){
            throw new Error("Dati referentni broj nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-reference-number`,{
            params: {referenceNumber:referenceNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja placanja po referentom broju");
    }
}

export async function findBySalesOrder_Id(salesOrderId){
    try{
        if(salesOrderId == null || isNaN(salesOrderId)){
            throw new Error("Dati ID za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder/${salesOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju za salesOrder");
    }
}

export async function findBySalesOrder_OrderDate(orderDate){
    try{
        if(!moment(orderDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum narudzbine nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-date`,{
            params:{orderDate:moment(orderDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po SalesOrder datumu narucivanja");
    }
}

export async function findBySalesOrder_OrderDateBetween(orderDateStart, orderDateEnd){
    try{
        if(!moment(orderDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(orderDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datuma za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-date-range`,{
            params:{
                orderDateStart:moment(orderDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                orderDateEnd:moment(orderDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmount(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina za SalesOrder nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-total-amount`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj kolicini za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountGreaterThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina za SalesOrder nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-total-amount-greater-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj kolicini vecoj od za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountLessThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina za SalesOrder nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-total-amount-less-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj kolicini manjoj od za SalesOrder");
    }
}

export async function findBySalesOrder_Status(status){
    try{
        if(!isOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu za SalesOrder");
    }
}

export async function findBySalesOrder_NoteContainingIgnoreCase(note){
    try{
        if(!note || typeof note !== "string" || note.trim() === ""){
            throw new Error("Dati note za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-note`,{
            params:{note:note},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po SalesOrder note-u");
    }
}

export async function findByCreatedBy_Id(createdById){
    try{
        if(createdById == null || isNaN(createdById)){
            throw new Error("Dati ID za korisnika koji je napravio nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/createdBy/${createdById}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID-ija ko je napravio");
    }
}

export async function findByCreatedBy_EmailContainingIgnoreCase(createdByEmail){
    try{
        if(!createdByEmail || typeof createdByEmail !== "string" || createdByEmail.trim() === ""){
            throw new Error("Dati email za createdBy nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/createdBy-email`,{
            params:{createdByEmail:createdByEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikoim trazenja email-a za korisnika koji je createdBy");
    }
}

export async function findByCreatedBy_FirstNameContainingIgnoreCaseAndCreatedBy_LastNameContainingIgnoreCase({createdByFirstName, createdByLastName}){
    try{
        if(!createdByFirstName || typeof createdByFirstName !== "string" || createdByFirstName.trim() === "" ||
            !createdByLastName || typeof createdByLastName !== "string" || createdByLastName.trim() === ""){
                throw new Error("Dato ime i prezime za createdBy nije pronadjeno");
            }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/createdBy-first-last-name`,{
            params:{
                createdByFirstName:createdByFirstName,
                createdByLastName:createdByLastName
            },
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja createdBy po imenu i prezimenu");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}