import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/trackingInfos`;
const validateStatus = ["PENDING","SHIPPED","IN_TRANSIT","DELIVERED","DELAYED","CANCELLED"];

export function isValidTrackingInfo({
  trackingNumber,
  currentLocation,
  estimatedDelivery,
  currentStatus,
  shipmentId
}) {
  if (
    !trackingNumber ||
    !currentLocation ||
    !estimatedDelivery ||
    (!moment(estimatedDelivery, "YYYY-MM-DD", true).isValid() &&
     !moment(estimatedDelivery).isValid()) ||
    !currentStatus ||
    !validateStatus.includes(currentStatus?.toUpperCase()) || 
    !shipmentId
  ) {
    return false;
  }

  return true;
}

export async function create(date){
    try{
        if(!isValidTrackingInfo({...date,validateStatus})){
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.post(url+`/create/new-trackingInfo`,date,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja trackingInfo-a");
    }
}

export async function update(id,date){
    try{
       if(!isValidTrackingInfo({...date,validateStatus})){
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.put(url+`/update/${id}`,date,{
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
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
        if(!trackingNumber ||typeof trackingNumber !=="string" ||trackingNumber.trim()===""){
            throw new Error("Dati trackingNumber nije pronadjen");
        }
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
        if(!shipmentId){
            throw new Error("ID prenosa mora biti prosleđen.");
        }
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
        const isStartValid = moment(start, "YYYY-MM-DD", true).isValid();
        const isEndValid = moment(end, "YYYY-MM-DD", true).isValid();
            if (!isStartValid || !isEndValid) {
              return false;
            }
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
        if(!location || typeof location !=="string" || location.trim()==="" || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("Location and status moraju biti popunjeni");
        }
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
        if(!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
             alert("Molimo unesite ispravan datum transfera.");
             return;
         }
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
        const isFromValid = moment(from, "YYYY-MM-DD", true).isValid();
        const isToValid = moment(to, "YYYY-MM-DD", true).isValid();
        if (!isFromValid || !isToValid) {
            return false;
        }
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
        const isFromValid = moment(from, "YYYY-MM-DD", true).isValid();
        const isToValid = moment(to, "YYYY-MM-DD", true).isValid();
        if (!isFromValid || !isToValid) {
              return false;
        }
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
    }
}

export async function findByUpdatedAtAfter(date){
    try{
        if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
            alert("Molimo unesite ispravan datum transfera.");
            return;
        }
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