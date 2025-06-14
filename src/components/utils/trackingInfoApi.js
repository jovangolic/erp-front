import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/trackingInfos`;

export async function create(trackingNumber, currentLocation,estimatedDelivery,currentStatus,shipmentId){
    try{
        const requestBody = {trackingNumber, currentLocation, estimatedDelivery:moment(estimatedDelivery).format("YYYY-MM-DD"),
            currentStatus:(currentStatus || "").toUpperCase(), shipmentId
        };
        const response = await api.post(url+`/create/new-trackingInfo`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja trackingInfo-a");
    }
}

export async function update(id,trackingNumber, currentLocation,estimatedDelivery,currentStatus,shipmentId){
    try{
       const requestBody = {trackingNumber, currentLocation, estimatedDelivery:moment(estimatedDelivery).format("YYYY-MM-DD"),
            currentStatus:(currentStatus || "").toUpperCase(), shipmentId
        };
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteTrackingInfo(id){
    try{
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja trackingInfo-a");
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
        handleApiError(error, "Greska prema trazenju jednog");
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
        handleApiError(error, "Greska prema dobavljanju svih trackingIfo-a");
    }
}

export async function findByTrackingNumber(trackingNumber){
    try{
        const response = await api.get(url+`/trackingNumber`,{
            params:{
                trackingNumber:trackingNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema trackingNumber-u");
    }
}

export async function findByShipmentId(shipmentId){
    try{
        const response = await api.get(url+`/shipment/${shipmentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po shipmentId-ju");
    }
}

export async function findByEstimatedDeliveryBetween(start, end){
    try{
        const response = await api.get(url+`/estimated-time-delivery`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema vremenskoj proceni dostave");
    }
}

export async function findByCurrentLocationAndCurrentStatus(location, status){
    try{
        const response = await api.get(url+`/by-location-status`,{
            params:{
                location:location,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return  response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trenutno lokaciji i statusu");
    }
}

export async function findByEstimatedDelivery(date){
    try{
        const response = await api.get(url+`/estimated-delivery`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema vremenskoj dostavi");
    }
}

export async function findAllByOrderByEstimatedDeliveryAsc(){
    try{
        const response = await api.get(url+`/orderByEstimatedDeliveryAsc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dostavama svih porudzbina");
    }
}

export async function findByCreatedAtBetween(from, to){
    try{
        const response = await api.get(url+`/create-date-between`,{
            params:{
                from:moment(from).format("YYYY-MM-DDTHH:mm:ss"),
                to:moment(to).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju izmedju vrenema kreiranja");
    }
}

export async function findByUpdatedAtBetween(from, to){
    try{
        const response = await api.get(url+`/update-between`,{
            params:{
                from:moment(from).format("YYYY-MM-DDTHH:mm:ss"),
                to:moment(to).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema azuriranju izmedju datuma");
        return resp
    }
}

export async function findByUpdatedAtAfter(date){
    try{
        const response = await api.get(url+`/update-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema azuriranju posle datuma");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}