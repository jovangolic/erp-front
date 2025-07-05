import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isPaymentMethodValid = ["BANK_TRANSFER","CASH","CARD","PAYPAL"]; 
const isPaymentStatusValid = ["PENDING","COMPLETED","FAILED"];  

export async function createPayment({amount, paymentDate, method, status,referenceNumber, buyerId, relatedSalesId}){
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

export async function updatePayment({id,amount, paymentDate, method, status,referenceNumber, buyerId, relatedSalesId} ){
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

export async function findByAmount(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || params <= 0){
            throw new Error("Data kolicina nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-amount`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini");
    }
}

export async function findByAmountGreaterThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || params <= 0){
            throw new Error("Data kolicina nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/amount-greater-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini vecoj od");
    }
}

export async function findByAmountLessThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || params <= 0){
            throw new Error("Data kolicina nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/amount-less-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini manjoj od");
    }
}

export async function findByPaymentDate(paymentDate){
    try{
        if(
            !moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati datum placanja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment-date`,{
            params:{paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja placanja po datumum i vremenu");
    }
}

export async function findByBuyer_CompanyNameContainingIgnoreCase(buyerCompanyName){
    try{
        if(!buyerCompanyName || typeof buyerCompanyName !== "string" || buyerCompanyName.trim() === ""){
            throw new Error("Dati kupcev naziv firme nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-company-name`,{
            params:{buyerCompanyName:buyerCompanyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja kupca po nazivu firme");
    }
}

export async function findByBuyer_PibContainingIgnoreCase(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB za firmu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/pib`,{
            params:{pib:pib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po PIB-u firme");
    }
}

export async function findByBuyer_AddressContainingIgnoreCase(buyerAddress){
    try{
        if(!buyerAddress || typeof buyerAddress !== "string" || buyerAddress.trim() === ""){
            throw new Error("Data adresa firme nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-address`,{
            params:{buyerAddress:buyerAddress},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja adrese firme");
    }
}

export async function findByBuyer_EmailContainingIgnoreCase(buyerEmail){
    try{
        if(!buyerEmail || typeof buyerEmail !== "string" || buyerEmail.trim() === ""){
            throw new Error("Dati email za firmu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-email`,{
            params:{buyerEmail:buyerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja email-a za firmu");
    }
}

export async function findByBuyer_PhoneNumber(buyerPhoneNumber){
    try{
        if(!buyerPhoneNumber || typeof buyerPhoneNumber !== "string" || buyerPhoneNumber.trim() === ""){
            throw new Error("Dati broj telefona firme nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-phone-number`,{
            params:{buyerPhoneNumber:buyerPhoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju telefona firme");
    }
}

export async function findByRelatedSales_Id(relatedSalesId){
    try{
        if(relatedSalesId == null || isNaN(relatedSalesId)){
            throw new Error("Dati ID za relatedSales nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/sales/${relatedSalesId}}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju za relatedSales");
    }
}

export async function findByRelatedSales_CreatedAt(createdAt){
    try{
        if(!moment(createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum kreiraja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-created-at`,{
            params:{
                createdAt:moment(createdAt).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja datuma kreiranja");
    }
}

export async function findByRelatedSales_TotalPrice(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena za prodaju nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-total-price`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ukupnoj ceni");
    }
}

export async function findByRelatedSales_TotalPriceLessThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena za prodaju nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-total-price-less-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ukupnoj ceni manjoj od");
    }
}

export async function findByRelatedSales_TotalPriceGreaterThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena za prodaju nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-total-price-greter-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ukupnoj ceni vecoj od");
    }
}

export async function findByRelatedSales_SalesDescriptionContainingIgnoreCase(salesDescription){
    try{
        if(!salesDescription || typeof salesDescription !== "string" || salesDescription.trim()===""){
            throw new Error("Dati opis prodaje nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/sales-description`,{
            params:{salesDescription:salesDescription},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opisu prodaje");
    }
}

export async function findByBuyer_IdAndStatus(buyerId, status){
    try{
        if(isNaN(buyerId) || buyerId == null ||
            !isPaymentStatusValid.includes(status?.toUpperCase())){
            throw new Error("Ssati ID za kupca i status placanja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/buyer/${buyerId}/status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju kupca i status placanja");
    }
}

export async function findByPaymentDateBetweenAndMethod(start, end, method){
    try{
        if(
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !isPaymentMethodValid.includes(method?.toUpperCase())
        ){
            throw new Error("Dati opseg datuma placanja i metod placanja nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/filter-by-date-and-method`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss"),
                method:(method || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom treazenja opsega datuma placanja i metode placanja");
    }
}

export async function findByRelatedSales_SalesDescriptionContainingIgnoreCaseAndBuyer_Id(description, buyerId){
    try{
        if(!description || typeof description !== "string" || description.trim() === "" ||
            isNaN(buyerId) || buyerId == null){
            throw new Error("Dati opis prodaje i ID kupca nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/buyer/${buyerId}/search-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja op opsiu prodaje i Id-ju kupca");
    }
}

export async function countByBuyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payments/count`,{
            params:{buyerId:buyerId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupnog broja kupaca po ID-ju kupca");
    }
}

export async function findByRelatedSales_Buyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID kupca za prodaju nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/sales/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ID-iju kupca");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}