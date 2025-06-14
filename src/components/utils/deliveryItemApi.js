import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/delivery-items`;

export async function createinboundDeliveryId(productId,quantity,inboundDeliveryId,outbouboundDeliveryId){
    try{
        const requestBody = {productId, quantity,inboundDeliveryId, outbouboundDeliveryId};
        const response = await api.post(url+`/create/new-delivery-item`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja stavke za dostavu");
    }
}

export async function update(id,productId,quantity,inboundDeliveryId,outbouboundDeliveryId){
    try{    
        const requestBody = {productId, quantity,inboundDeliveryId, outbouboundDeliveryId};
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