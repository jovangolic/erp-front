import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/shipments`

const validateStatus = ["PENDING","SHIPPED","IN_TRANSIT","DELIVERED","DELAYED","CANCELLED"];
export function isValidShipmentData({
  status,
  validateStatus = [],
  shipmentDate,
  storageId,
  providerId,
  outboundDeliveryId,
  trackingInfo = {}
}) {
  // Validacija statusa po enum vrednostima
  if (!status || !validateStatus.includes(status?.toUpperCase())) {
    return false;
  }

  // Validacija datuma
  if (!shipmentDate || !moment(shipmentDate, "YYYY-MM-DD", true).isValid()) {
    return false;
  }

  // Osnovne vrednosti
  if (!storageId || !providerId || !outboundDeliveryId) {
    return false;
  }

  // Validacija trackingInfo objekta
  if (
    !trackingInfo.trackingNumber ||
    !trackingInfo.currentLocation ||
    !trackingInfo.estimatedDelivery ||
    !moment(trackingInfo.estimatedDelivery, "YYYY-MM-DD", true).isValid() ||
    !trackingInfo.currentStatus ||
    !validateStatus.includes(trackingInfo.currentStatus?.toUpperCase())
  ) {
    return false;
  }

  return true;
}

export async function createShipment(data) {
    if (!isValidShipmentData({ ...data, validateStatus })) {
        throw new Error("Sva polja moraju biti popunjena i validna.");
    }
    try {
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/shipments/create`, data, {
        headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom kreiranja pošiljke");
    }
}

export async function update(id,date){
    try{
        if (!id || !isValidShipmentData({ ...data, validateStatus })) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.put(url+`/update/${id}`,date,{
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
        if(!id){
            throw new Error(`ID nije pronadjen`);
        }
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
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
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
        if(!outboundId){
            throw new Error("Dati outboundId nije pronadjen");
        }
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
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Status nije pronadjen");
        }
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
        const isFromValid = moment(from, "YYYY-MM-DD", true).isValid();
        const isToValid = moment(to, "YYYY-MM-DD", true).isValid();
        if (!isFromValid || !isToValid) {
            return false;
         }
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
        if(!providerId){
            throw new Error("ProviderId nije pornadjen");
        }
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
        if(!name || typeof name !== "string" || name.trim() ===""){
            throw new Error("Naziv providera nije pronadjen");
        }
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
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Status nije pronadjen");
        }
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
        if(!trackingInfoId){
            throw new Error("TrackingInfo ID nije pronadjen");
        }
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
        if(!storageId){
            throw new Error("StorageId nije pornadjen");
        }
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
        if(!name || typeof name !== "string" || name.trim() ===""){
            throw new Error("Naziv skladista nije pronadjen");
        }
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
        if(!location || typeof location !== "string" || location.trim() ===""){
            throw new Error("Originalna lokacija skladista nije pronadjena");
        }
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
        if(!validateStatus.includes(type?.toUpperCase())){
            throw new Error("");
        }
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
        if(!storageId || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("StorageId I status nisu pronadjeni");
        }
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
        if(!name || typeof name !=="string" || name.trim() ===""){
            throw new Error("Pretraga po nazivu skladista nije pronadjena");
        }
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
        if(!location || typeof location !=="string" || location.trim() ===""){
            throw new Error("Lokacija trackingInfo-a nije pronadjena");
        }
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