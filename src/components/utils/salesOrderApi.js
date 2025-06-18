import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isOrderStatusValid = ["CREATED","PAID","SHIPPED","CANCELLED","PENDING"];

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
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/salesOrders/create/new-sales-order`,requestBody,{
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

export async function updateSalesOrder(id,buyerId, items, orderDate, totalAmount, note, status, invoiceId, orderNumber ){
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
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/salesOrders/update/${id}`,requestBody,{
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
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/salesOrders/delete/${id}`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/salesOrders/get-one/${id}`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/salesOrders/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih prodajnih narudzbina");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}