import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isInvoiceStatusValid = ["DRAFT","ISSUED","PAID","CANCELLED","OVERDUE"];  
const isPaymentMethodValid = ["BANK_TRANSFER", "CASH", "CARD", "PAYPAL"];
const isOrderStatusValid = ["CREATED", "PAID", "SHIPPED", "CANCELLED", "PENDING"];

export async function createInvoice({invoiceNumber,issueDate,dueDate,status,totalAmount,buyerId,salesId,paymentId,note,salesOrderId,createdById}){
    try{
        const validateIssueDate = moment.isMoment(issueDate) || moment(issueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDueDate = moment.isMoment(dueDate) || moment(dueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const parseAmout = parseFloat(amount);
        if(
            !invoiceNumber || typeof invoiceNumber !=="string" || invoiceNumber.trim() === "" ||
            !validateIssueDate ||
            !validateDueDate ||
            !isInvoiceStatusValid.includes(status?.toUpperCase()) ||
            isNaN(parseAmout) || parseAmout <= 0 ||
            buyerId == null ||isNaN(buyerId) || 
            salesId == null || isNaN(salesId) || 
            paymentId == null || isNaN(paymentId) ||
            !note || typeof note !== "string" || note.trim() === "" ||
            salesOrderId == null || isNaN(salesOrderId) || 
            createdById == null || isNaN(createdById)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {invoiceNumber, issueDate, dueDate,status, totalAmount,buyerId,salesId,paymentId,note,salesOrderId, createdById
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
        const validateIssueDate = moment.isMoment(issueDate) || moment(issueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDueDate = moment.isMoment(dueDate) || moment(dueDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const parseAmout = parseFloat(amount);
        if(
            id == null || isNaN(id) ||
            !invoiceNumber || typeof invoiceNumber !=="string" || invoiceNumber.trim() === "" ||
            !validateIssueDate ||
            !validateDueDate ||
            !isInvoiceStatusValid.includes(status?.toUpperCase()) ||
            isNaN(parseAmout) || parseAmout <= 0 ||
            buyerId == null ||isNaN(buyerId) || 
            salesId == null || isNaN(salesId) || 
            paymentId == null || isNaN(paymentId) ||
            !note || typeof note !== "string" || note.trim() === "" ||
            salesOrderId == null || isNaN(salesOrderId) || 
            createdById == null || isNaN(createdById)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {invoiceNumber, issueDate, dueDate,status, totalAmount,buyerId,salesId,paymentId,note,salesOrderId, createdById
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
        if(invoiceId == null || sNan(invoiceId)){
            throw new Error("Dati Id "+invoiceId+" za Invoice nije pronadjen");
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
        if(invoiceId == null || sNan(invoiceId)){
            throw new Error("Dati Id "+invoiceId+" za Invoice nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne fakture po "+invoiceId+" id-iju");
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
            throw new Error("Dati status "+status+" nije pronadjen");
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
        handleApiError(error, "Greska prilikom dobavljanja po statusu "+status+" fakture");
    }
}

export async function getByBuyerAndStatus({buyerId, status}){
    try{
        if(buyerId == null || sNaN(buyerId) || !isInvoiceStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati id za kupca "+buyerId+" i status "+status+" nije pronadjen");
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
        handleApiError(error, "Greska prilikom dobavljanja po id "+buyerId+" kupca i po statusu "+status+" fakture");
    }
}

export async function getByTotalAmount(totalAmount){
    try{
        const parseAmout = parseFloat(totalAmount);
        if(isNaN(parseAmout) || parseAmout <= 0){
            throw new Error("Ukupan iznos "+parseAmout+" mora biti pozitivan");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/total-amount`,{
            params:{
                totalAmount:parseAmout
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po ukupnoj ceni "+totalAmount);
    }
}

export async function getByBuyerId(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("Dati id "+buyerId+" za buyer nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/buyer/${buyerId}`,{
            headers: getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id "+buyerId+" kupca");
    }
}

export async function getBySalesId(salesId){
    try{
        if(salesId == null || isNaN(salesId)){
            throw new Error("Dati id "+salesId+" za sales nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/sales/${salesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id "+salesId+" prodaje");
    }
}

export async function getByPaymentId(paymentId){
    try{
        if(paymentId == null || isNaN(paymentId)){
            throw new Error("Dati id "+paymentId+" za payment nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/payment/${paymentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id "+paymentId+" placanja");
    }
}

export async function getByIssueDateBetween({startDate,endDate}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            !validateStart||!validateEnd
        ){
            throw new Error("Dti datumski opseg "+startDate+" - "+endDate+" nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error, "Greska prilikom dobavljanja izmedju datuma pocetka "+startDate+" i kraja "+endDate+" datuma");
    }
}

export async function getByDueDateBefore(date){
    try{
        const validateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart){
            throw new Error("Datum "+date+" mora biti validan");
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
        handleApiError(error, "Greska prilikom dobavljanja pre isteka datuma "+date);
    }
}

export async function searchByInvoiceNumberFragment(fragment){
    try{
        if(!fragment || typeof fragment !== "string" || fragment.trim() === ""){
            throw new Error("Dati fragment "+fragment+"nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/search-fragment/${fragment}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po fragmentu "+fragment);
    }
}

export async function existsByInvoiceNumber(invoiceNumber){
    try{
        if(!invoiceNumber || typeof invoiceNumber !== "string" || invoiceNumber.trim() === ""){
            throw new Error("Broj-fakture "+invoiceNumber+" mora biti validan i popunjen");
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
        handleApiError(error, "Greska prilikom pretrage po broju fakture "+invoiceNumber);
    }
}

export async function getInvoicesByBuyerSortedByIssueDate(buyerId){
    try{
        if(buyerId ==  null || isNaN(buyerId)){
            throw new Error("Dati id "+buyerId+" za kupca nije pronadjen");
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
            throw new Error("Naziv kompanije "+companyName+" kupca, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-company-name`,{
            params:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja kupca po nazivu kompanije "+companyName);
    }
}

export async function findByBuyerPib(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB "+pib+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-pib`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja buyer-a po PIB-u "+pib);
    }
}

export async function findByBuyerEmailContainingIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" za Buyer nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-email`,{
            params:{pib:pib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po buyer-ovom email-u "+email);
    }
}

export async function findByBuyerPhoneNumber(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona "+phoneNumber+" za Buyer-a nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/buyer-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po Buyer-ovom broju telefona "+phoneNumber);
    }
}

export async function findByNoteContainingIgnoreCase(note){
    try{
        if(!note || typeof note !== "string" || note.trim() === ""){
            throw new Error("Data beleska "+note+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/by-note`,{
            params:{note:note},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema belesci "+note);
    }
}

export async function findByRelatedSales_Id(relatedSalesId){
    try{
        if(relatedSalesId == null || isNaN(relatedSalesId)){
            throw new Error("Dati ID "+relatedSalesId+" za relatedSales nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales/${relatedSalesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po relatedSalesId-ju "+relatedSalesId);
    }
}

export async function findByRelatedSales_TotalPrice(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales-totalPrice`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni "+totalPrice+" za RelatedSales");
    }
}

export async function findByRelatedSales_TotalPriceGreaterThan(totalPrice){
    try{
        const parseTotalPrice =parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales-totalPrice-greate-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od "+totalPrice+" za RelatedSales");
    }
}

export async function findByRelatedSales_TotalPriceLessThan(totalPrice){
    try{
        const parseTotalPrice =parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/relatedSales-totalPrice-less-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od "+totalPrice+" za RelatedSales");
    }
}

export async function findByPayment_Amount(amount){
    try{
        const parseAmout = parseFloat(amount);
        if(isNaN(parseAmout) || parseAmout <= 0){
            throw new Error("Data kolicina "+parseAmout+" za Payment nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-amount`,{
            params:{amount:parseAmout},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini "+amount+" za Payment");
    }
}

export async function findByPayment_PaymentDate(paymentDate){
    try{
        const validateStart = moment.isMoment(paymentDate) || moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart){
            throw new Error("Dati datum "+paymentDate+" placanja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-date`,{
            params:{paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pilikom trazenja Payment-a po datumu placanja "+paymentDate);
    }
}

export async function findByPayment_PaymentDateBetween(paymentDateStart, paymentDateEnd){
    try{
        const validateStart = moment.isMoment(paymentDateStart) || moment(paymentDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(paymentDateEnd) || moment(paymentDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati opseg datuma "+paymentDateStart+" - "+paymentDateEnd+" za placanje nije pronadjen");
        }
        if(moment(paymentDateEnd).isBefore(moment(paymentDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Greska prilikom trazenja prema opsegu datuma "+paymentDateStart+" - "+paymentDateEnd+" za placanje");
    }
}

export async function findByPayment_Method(method){
    try{
        if(!isPaymentMethodValid.includes(method?.toUpperCase())){
            throw new Error("Dati metod "+method+" za placanje nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-method`,{
            params:{method:(method || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja metoda "+method+" za placanje");
    }
}

export async function findByPayment_ReferenceNumberContainingIgnoreCase(referenceNumber){
    try{
        if(!referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim() === ""){
            throw new Error("Dati referentni broj "+referenceNumber+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/payment-reference-number`,{
            params: {referenceNumber:referenceNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja placanja po referentom broju "+referenceNumber);
    }
}

export async function findBySalesOrder_Id(salesOrderId){
    try{
        if(salesOrderId == null || isNaN(salesOrderId)){
            throw new Error("Dati ID "+salesOrderId+" za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder/${salesOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju "+salesOrderId+" za salesOrder");
    }
}

export async function findBySalesOrder_OrderDate(orderDate){
    try{
        const validateStart = moment.isMoment(orderDate) || moment(orderDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart){
            throw new Error("Dati datum "+orderDate+" narudzbine nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-date`,{
            params:{orderDate:moment(orderDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po SalesOrder datumu "+orderDate+" narucivanja");
    }
}

export async function findBySalesOrder_OrderDateBetween(orderDateStart, orderDateEnd){
    try{
        const validateStart = moment.isMoment(orderDateStart) || moment(orderDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(orderDateEnd) || moment(orderDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati opseg datuma "+orderDateStart+" - "+orderDateEnd+" za SalesOrder nije pronadjen");
        }
        if(moment(orderDateEnd).isBefore(moment(orderDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-date-range`,{
            params:{
                orderDateStart:moment(orderDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                orderDateEnd:moment(validateorderDateEndEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma "+orderDateStart+" - "+orderDateEnd+" za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmount(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina "+parseTotalAmount+" za SalesOrder nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-total-amount`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj kolicini "+totalAmount+" za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountGreaterThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina veca od "+parseTotalAmount+" za SalesOrder nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-total-amount-greater-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj kolicini vecoj od "+totalAmount+" za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountLessThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina manja od "+parseTotalAmount+" za SalesOrder nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-total-amount-less-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj kolicini manjoj od "+totalAmount+" za SalesOrder");
    }
}

export async function findBySalesOrder_Status(status){
    try{
        if(!isOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu "+status+" za SalesOrder");
    }
}

export async function findBySalesOrder_NoteContainingIgnoreCase(note){
    try{
        if(!note || typeof note !== "string" || note.trim() === ""){
            throw new Error("Data beleska "+note+" za SalesOrder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/salesOrder-note`,{
            params:{note:note},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po SalesOrder belesci "+note);
    }
}

export async function findByCreatedBy_Id(createdById){
    try{
        if(createdById == null || isNaN(createdById)){
            throw new Error("Dati ID "+createdById+" za korisnika koji je napravio nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/createdBy/${createdById}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID-ija "+createdById+" ko je napravio");
    }
}

export async function findByCreatedBy_EmailContainingIgnoreCase(createdByEmail){
    try{
        if(!createdByEmail || typeof createdByEmail !== "string" || createdByEmail.trim() === ""){
            throw new Error("Dati email "+email+" za createdBy nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/createdBy-email`,{
            params:{createdByEmail:createdByEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikoim trazenja email-a "+email+" za korisnika koji je createdBy");
    }
}

export async function findByCreatedBy_FirstNameContainingIgnoreCaseAndCreatedBy_LastNameContainingIgnoreCase({createdByFirstName, createdByLastName}){
    try{
        if(!createdByFirstName || typeof createdByFirstName !== "string" || createdByFirstName.trim() === "" ||
            !createdByLastName || typeof createdByLastName !== "string" || createdByLastName.trim() === ""){
                throw new Error("Dato ime "+createdByFirstName+" i prezime "+createdByLastName+" za createdBy nije pronadjeno");
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
        handleApiError(error,"Greska prilikom trazenja createdBy po imenu "+createdByFirstName+" i prezimenu "+createdByLastName);
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}