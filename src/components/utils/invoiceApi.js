import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isInvoiceStatusValid = ["DRAFT","ISSUED","PAID","CANCELLED","OVERDUE"];  

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
            !invoiceId ||
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
        if(!invoiceId){
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
        if(!invoiceId){
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
        if(!salesId){
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
        if(!paymentId){
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

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}