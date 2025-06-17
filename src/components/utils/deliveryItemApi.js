import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/delivery-items`;

export async function createinboundDeliveryId(productId,quantity,inboundDeliveryId,outboundDeliveryId){
    if(!productId || !inboundDeliveryId || !outboundDeliveryId || quantity == null || quantity <= 0){
        throw new Error("Sva polja moraju biti popunjena");
    }
    try{
        const requestBody = {productId, quantity,inboundDeliveryId, outboundDeliveryId};
        const response = await api.post(url+`/create/new-delivery-item`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja stavke za dostavu");
    }
}

export async function update(id,productId,quantity,inboundDeliveryId,outboundDeliveryId){
    try{    
        if(!id || !productId || !inboundDeliveryId || !outboundDeliveryId || quantity == null || quantity <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {productId, quantity,inboundDeliveryId, outboundDeliveryId};
        const response = await api.put(utl+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteDeliveryItem(id){
    try{
        if(!id){
            throw new Error("Dati Id za inboundDelivery nije pronadjen");
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

export async function findById(id){
    try{
        if(!id){
            throw new Error("Dati Id za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska priliko dobavljanja jednog delivery-item-a");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja svih deliveryItem-a");
    }
}

export async function findByQuantity(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Kolicina mora biti pozitivan broj");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kolicini");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Kolicina mora biti veca od nula");
        }
        const response = await api.get(url+`/quantity-greater-than`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kolicini vecoj od: ");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) < 0){
            throw new Error("Kolicina ne sme biti negativan broj");
        }
        const response = await api.get(url+`quantity-less-than`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kolicini manjoj od:");
    }
}

export async function findByInboundDelivery_DeliveryDateBetween(start, end){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg inboundDelivery datuma nije dobar");
        }
        const response = await api.get(url+`/inbound-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju po ulaznoj dostavi");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween(start,end){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg outboundDelivery datuma nije dobar");
        }
        const response = await api.get(url+`/outbound-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dobavljanu po izlazoj dostavi");
    }
}

export async function findByProduct(productId){
    try{
        if(!productId){
            throw new Error("Dati id za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dobavljanju po id-ju proizvoda");
    }
}

export async function findByInboundDeliveryId(inboundId){
    try{
        if(!inboundId){
            throw new Error("Dati id za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/inbound/${inboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po inbound(dolazu) id-ju");
    }
}

export async function findByOutboundDeliveryId(outboundId){
    try{
        if(!outboundId){
            throw new Error("Dati id za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound/${outboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po outbound(odlazeci) id-iju");
    }
}

export async function findByProduct_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv proizvoda nije pronadjen");
        }
        const response = await api.get(url+`/name/${name}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po nazivu deliveryItem-a");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}