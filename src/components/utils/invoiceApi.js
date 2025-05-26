import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createInvoice(invoiceNumber,issueDate,dueDate,status,totalAmount,buyerId,salesId,paymentId,note,salesOrderId,createdById){
    try{
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

export async function updateInvoice(invoiceId,invoiceNumber,issueDate,dueDate,status,totalAmount,buyerId,salesId,paymentId,note,salesOrderId,createdById ){
    try{
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

export async function getByBuyerAndStatus(buyerId, status){
    try{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/invoices/invoice/payment/${paymentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id placanja");
    }
}

export async function getByIssueDateBetween(startDate,endDate){
    try{
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