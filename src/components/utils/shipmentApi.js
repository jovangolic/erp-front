import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/shipments`

export async function create(shipmentDate,status,providerId,outboundDeliveryId,trackingInfo,originStorageId){
    try{
        const requestBody = {shipmentDate:moment(shipmentDate).format("YYYY-MM-DD"),status:(status || "").toUpperCase(), providerId,outboundDeliveryId,trackingInfo,originStorageId};
        const response = await api.post(url+`/create/new-shipment`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja shipment-a");
    }
}

export async function update(id,shipmentDate,status,providerId,outboundDeliveryId,trackingInfo,originStorageId ){
    try{
        const requestBody = {shipmentDate:moment(shipmentDate).format("YYYY-MM-DD"),status:(status || "").toUpperCase(), providerId,outboundDeliveryId,trackingInfo,originStorageId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteShipment(id){
    try{
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska p[rilikom trazenja jednog shipment-a");
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
        handleApiError(error,"Greska prilikom trazenja svih shipments-a");
    }
}

export async function findByOutboundDeliveryId(outboundId){
    try{
        const response = await api.get(url+`/outboundDelivery/${outboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja outboundDelivery");
    }
}

export async function findByStatus(status){
    try{
        const response = await api.get(url+`/shipment-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema statusu");
    }
}

export async function findByShipmentDateBetween(from, to) {
    try{
        const response = await api.get(url+`/date-ranges`,{
            params:{
                from:moment(from).format("YYYY-MM-DD"),
                to:moment(to).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja prema datumu opsega");
    } 
}

export async function findByProviderId(providerId){
    try{
        const response = await api.get(url+`/provider/${providerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po provajder id-iju");
    }
}

export async function findByProvider_NameContainingIgnoreCase(name){
    try{
        const response = await api.get(url+`/provider-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju po nazivu provajdera");
    }
}

export async function findByTrackingInfo_CurrentStatus(status){
    try{
        const response = await api.get(url+`/trackingInfo-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trackingIfo-u i trenutnom statusu");
    }
}

export async function findByTrackingInfoId(trackingInfoId){
    try{
        const response = await api.get(url+`/trackingInfo/${trackingInfoId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po trackingInfo id-iju");
    }
}

export async function findByOriginStorageId(storageId){
    try{
        const response = await api.get(url+`/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po id-iju originalnog skladista");
    }
}

export async function findByOriginStorage_Name(name){
    try{
        const response = await api.get(url+`/storage-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po nazivu originalnog skladista");
    }
}

export async function findByOriginStorage_Location(location){
    try{
        const response = await api.get(url+`/storage-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po lokaciji skladista");
    }
}

export async function findByOriginStorage_Type(type){
    try{
        const response = await api.get(url+`/storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po tipu skladista");
    }
}

export async function findByOriginStorageIdAndStatus(storageId, status){
    try{
        const response = await api.get(url+`/storage-and-status`,{
            params:{
                storageId:storageId,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po id-iju skladista i njegovom statusu");
    }
}

export async function searchByOriginStorageName(name){
    try{
        const response = await api.get(url+`/by-storage-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po nazivu skladista");
    }
}

export async function findByTrackingInfo_CurrentLocationContainingIgnoreCase(location){
    try{
        const response = await api.get(url+`/tracking-info-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po trackingInfo-u i trenutnoj lokaciji");
    }
}

export async function findOverdueDelayedShipments(){
    try{
        const response = await api.get(url+`/overdue-delayed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema zakasneloj dostavi");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}