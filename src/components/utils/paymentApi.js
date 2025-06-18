import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isPaymentMethodValid = ["BANK_TRANSFER","CASH","CARD","PAYPAL"]; 
const isPaymentStatusValid = ["PENDING","COMPLETED","FAILED"];  

export async function createPayment(amount, paymentDate, method, status,referenceNumber, buyerId, relatedSalesId){
    try{
        if(
            isNaN(amount) || parseFloat(amount) <=0 ||
            !moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !isPaymentMethodValid.includes(method?.toUpperCase()) ||
            !isPaymentStatusValid.includes(status?.toUpperCase()) ||
            !referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim()==="" ||
            !buyerId  || !relatedSalesId
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {amount:parseFloat(amount), paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss"),
            method:method.toUpperCase(), status:status.toUpperCase(), referenceNumber, buyerId, relatedSalesId
        };
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/payments/create/new-payment`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja placanja: ${error.message}`);
        }
    }
}

export async function updatePayment(id,amount, paymentDate, method, status,referenceNumber, buyerId, relatedSalesId ){
    try{
        if(
            !id ||
            isNaN(amount) || parseFloat(amount) <=0 ||
            !moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !isPaymentMethodValid.includes(method?.toUpperCase()) ||
            !isPaymentStatusValid.includes(status?.toUpperCase()) ||
            !referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim()==="" ||
            !buyerId  || !relatedSalesId
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {amount:parseFloat(amount), paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss"),
            method:method.toUpperCase(), status:status.toUpperCase(), referenceNumber, buyerId, relatedSalesId};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/payments/update/${id}`,requestBody,{
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja za placanje: ${error.message}`);
        }
    }
}

export async function deletePayment(id){
    try{
        if(!id){
            throw new Error("Dati ID za payment nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/payments/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getPayment(id){
    try{
        if(!id){
            throw new Error("Dati ID za payment nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog placanja");
    }
}

export async function getAllPayments(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih placanja");
    }
}

export async function getPaymentsByBuyer(buyerId){
    try{
        if(!buyerId){
            throw new Error("BuyerId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja placanja po id-iju kupca");
    }
}

export async function getPaymentsByStatus(status){
    try{
        if(!isPaymentStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status za payment nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/by-status`,{
            params:{
                status:status.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja placanja po statusu placanja");
    }
}

export async function getPaymentsByMethod(method){
    try{
        if(!isPaymentStatusValid.includes(method?.toUpperCase())){
            throw new Error("Metod za payment nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/by-method`,{
            params:{
                method:method.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data
    }
    catch(error){
        handleApiError(error , "Greska prilikom dobavljanja placanja po metodi placanja");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}