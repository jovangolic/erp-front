import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isPaymentMethodValid = ["BANK_TRANSFER","CASH","CARD","PAYPAL"]; 
const isPaymentStatusValid = ["PENDING","COMPLETED","FAILED"];  

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createPayment({amount, paymentDate, method, status,referenceNumber, buyerId, relatedSalesId}){
    try{
        const parseAmount = parseFloat(amount);
        const validatePaymentDate = moment.isMoment(paymentDate) || moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            isNaN(parseAmount) || parseAmount <=0 ||
            !validatePaymentDate ||
            !isPaymentMethodValid.includes(method?.toUpperCase()) ||
            !isPaymentStatusValid.includes(status?.toUpperCase()) ||
            !referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim()==="" ||
            buyerId == null || isNaN(buyerId)  || 
            relatedSalesId == null || isNaN(relatedSalesId)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {amount, paymentDate,method, status, referenceNumber, buyerId, relatedSalesId};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/payments/create/new-payment`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greska prilikom kreiranja placanja: ${error.message}`);
        }
    }
}

export async function updatePayment({id,amount, paymentDate, method, status,referenceNumber, buyerId, relatedSalesId} ){
    try{
        const parseAmount = parseFloat(amount);
        const validatePaymentDate = moment.isMoment(paymentDate) || moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            id == null || isNaN(id) ||
            isNaN(parseAmount) || parseAmount <=0 ||
            !validatePaymentDate ||
            !isPaymentMethodValid.includes(method?.toUpperCase()) ||
            !isPaymentStatusValid.includes(status?.toUpperCase()) ||
            !referenceNumber || typeof referenceNumber !== "string" || referenceNumber.trim()==="" ||
            buyerId == null || isNaN(buyerId)  || 
            relatedSalesId == null || isNaN(relatedSalesId)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {amount, paymentDate,method, status, referenceNumber, buyerId, relatedSalesId};
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
            throw new Error(`Greska prilikom azuriranja za placanje: ${error.message}`);
        }
    }
}

export async function deletePayment(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za payment nije pronadjen");
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za payment nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog placanja po "+id+" id-iju");
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
        if(buyerId == null || isNaN(buyerId)){
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
            throw new Error("Status "+status+" za payment nije pronadjen");
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
        handleApiError(error,"Greska prilikom dobavljanja placanja po statusu "+status+" placanja");
    }
}

export async function getPaymentsByMethod(method){
    try{
        if(!isPaymentStatusValid.includes(method?.toUpperCase())){
            throw new Error("Metod "+method+" za payment nije pronadjen");
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
        handleApiError(error , "Greska prilikom dobavljanja placanja po metodi "+method+" placanja");
    }
}

export async function findByAmount(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina "+parseAmount+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-amount`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini "+amount);
    }
}

export async function findByAmountGreaterThan(amount){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(parseAmount) || parseAmount <= 0){
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
        if(isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Data kolicina manja od "+parseAmount+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/amount-less-than`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini manjoj od "+amount);
    }
}

export async function findByPaymentDate(paymentDate){
    try{
        const validatePaymentDate = moment.isMoment(paymentDate) || moment(paymentDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validatePaymentDate){
            throw new Error("Dati datum "+paymentDate+" placanja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment-date`,{
            params:{paymentDate:moment(paymentDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja placanja po datumum i vremenu "+paymentDate);
    }
}

export async function findByBuyer_CompanyNameContainingIgnoreCase(buyerCompanyName){
    try{
        if(!buyerCompanyName || typeof buyerCompanyName !== "string" || buyerCompanyName.trim() === ""){
            throw new Error("Dati kupcev naziv "+buyerCompanyName+" firme nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-company-name`,{
            params:{buyerCompanyName:buyerCompanyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja kupca po nazivu firme "+buyerCompanyName);
    }
}

export async function findByBuyer_PibContainingIgnoreCase(pib){
    try{
        if(!pib || typeof pib !== "string" || pib.trim() === ""){
            throw new Error("Dati PIB "+pib+" za firmu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/pib`,{
            params:{pib:pib},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+pib+" PIB-u firme");
    }
}

export async function findByBuyer_AddressContainingIgnoreCase(buyerAddress){
    try{
        if(!buyerAddress || typeof buyerAddress !== "string" || buyerAddress.trim() === ""){
            throw new Error("Data adresa "+buyerAddress+" firme nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-address`,{
            params:{buyerAddress:buyerAddress},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja adrese "+buyerAddress+" firme");
    }
}

export async function findByBuyer_EmailContainingIgnoreCase(buyerEmail){
    try{
        if(!buyerEmail || typeof buyerEmail !== "string" || buyerEmail.trim() === ""){
            throw new Error("Dati email "+buyerEmail+" za firmu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-email`,{
            params:{buyerEmail:buyerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja "+buyerEmail+" email-a za firmu");
    }
}

export async function findByBuyer_PhoneNumber(buyerPhoneNumber){
    try{
        if(!buyerPhoneNumber || typeof buyerPhoneNumber !== "string" || buyerPhoneNumber.trim() === ""){
            throw new Error("Dati broj telefona "+buyerPhoneNumber+" firme nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/buyer-phone-number`,{
            params:{buyerPhoneNumber:buyerPhoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju telefona "+buyerPhoneNumber+" firme");
    }
}

export async function findByRelatedSales_Id(relatedSalesId){
    try{
        if(relatedSalesId == null || isNaN(relatedSalesId)){
            throw new Error("Dati ID "+relatedSalesId+" za relatedSales nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/sales/${relatedSalesId}}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+relatedSalesId+" ID-ju za relatedSales");
    }
}

export async function findByRelatedSales_CreatedAt(createdAt){
    try{
        const valdiateCreatedAt = moment.isMoment(createdAt) || moment(createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!valdiateCreatedAt){
            throw new Error("Dati datum "+createdAt+"kreiraja nije pronadjen");
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
        handleApiError(error,"Greska prilikom trazenja datuma kreiranja "+createdAt);
    }
}

export async function findByRelatedSales_TotalPrice(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena "+parseTotalPrice+" za prodaju nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-total-price`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ukupnoj ceni "+totalPrice);
    }
}

export async function findByRelatedSales_TotalPriceLessThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena manja od "+parseTotalPrice+" za prodaju nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-total-price-less-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ukupnoj ceni manjoj od "+totalPrice);
    }
}

export async function findByRelatedSales_TotalPriceGreaterThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena veca od "+parseTotalPrice+" za prodaju nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/by-sale-total-price-greter-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po ukupnoj ceni vecoj od "+totalPrice);
    }
}

export async function findByRelatedSales_SalesDescriptionContainingIgnoreCase(salesDescription){
    try{
        if(!salesDescription || typeof salesDescription !== "string" || salesDescription.trim()===""){
            throw new Error("Dati opis "+salesDescription+" prodaje nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/sales-description`,{
            params:{salesDescription:salesDescription},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po opisu prodaje "+salesDescription);
    }
}

export async function findByBuyer_IdAndStatus(buyerId, status){
    try{
        if(
            isNaN(buyerId) || buyerId == null ||
            !isPaymentStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati ID "+buyerId+" za kupca i status "+status+" placanja nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/buyer/${buyerId}/status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+buyerId+" ID-iju kupca i status "+status+" placanja");
    }
}

export async function findByPaymentDateBetweenAndMethod(start, end, method){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if( !validateStart || !validateEnd ||
            !isPaymentMethodValid.includes(method?.toUpperCase())
        ){
            throw new Error("Dati opseg "+start+" - "+end+" datuma placanja i metod "+method+" placanja nisu pronadjeni");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Greska prilikom treazenja opsega "+start+" - "+end+" datuma placanja i metode "+method+" placanja");
    }
}

export async function findByRelatedSales_SalesDescriptionContainingIgnoreCaseAndBuyer_Id(description, buyerId){
    try{
        if(!description || typeof description !== "string" || description.trim() === "" ||
            isNaN(buyerId) || buyerId == null){
            throw new Error("Dati opis "+description+" prodaje i ID "+buyerId+" kupca nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/buyer/${buyerId}/search-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja op opisu "+description+" prodaje i "+buyerId+" Id-ju kupca");
    }
}

export async function countByBuyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID "+buyerId+" kupca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payments/count`,{
            params:{buyerId:buyerId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupnog broja kupaca po "+buyerId+" ID-ju kupca");
    }
}

export async function findByRelatedSales_Buyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID "+buyerId+" kupca za prodaju nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment/sales/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prodaje po "+buyerId+" ID-iju kupca");
    }
}

export async function findByDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+date+" za nabavku nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/payments/payment-date`,{
            params: {
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" za nabavku");
    }
}


