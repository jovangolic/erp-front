import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/trackingInfos`;
const validateStatus = ["PENDING","SHIPPED","IN_TRANSIT","DELIVERED","DELAYED","CANCELLED"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];

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

export async function update({id,date}){
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju jednog tracking-info po "+id+" id-iju");
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
            throw new Error("Dati trackingNumber "+trackingNumber+" nije pronadjen");
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
        handleApiError(error,"Greska prilikom pretrage prema trackingNumber-u "+trackingNumber);
    }
}

export async function findByShipmentId(shipmentId){
    try{
        if(shipmentId == null || isNaN(shipmentId)){
            throw new Error("ID "+shipmentId+" prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/shipment/${shipmentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po shipmentId-ju "+shipmentId);
    }
}

export async function findByEstimatedDeliveryBetween({start, end}){
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
        handleApiError(error,"Trenutno nismo pronasli vremenski opseg "+start+" - "+end+" za procenejnu dostavu");
    }
}

export async function findByCurrentLocationAndCurrentStatus({location, status}){
    try{
        if(!location || typeof location !=="string" || location.trim()==="" || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("Lokacija "+location+" i status "+status+" moraju biti popunjeni");
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
        handleApiError(error, "Trenutno nismo pronasli lokaicju "+location+" i status "+status+" za tracking-info");
    }
}

export async function findByEstimatedDelivery(date){
    try{
        if(!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
             alert("Datum "+date+" unosa za dostavu, nije pronadjen");
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
        handleApiError(error, "Trenutno nismo pronasli datum "+date+" procenjene dostave");
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

export async function findByCreatedAtBetween({from, to}){
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
        handleApiError(error, "Greska prema trazenju izmedju opsega vremena "+from+" - "+end+" kreiranja");
    }
}

export async function findByUpdatedAtBetween({from, to}){
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
        handleApiError(error, "Greska prema trazenju izmedju opsega vremena "+from+" - "+end+" azuriranja");
    }
}

export async function findByUpdatedAtAfter(date){
    try{
        if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
            alert("Dati datum posle "+date+" za azuriranje, nije pronadjen");
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
        handleApiError(error,"Greska prema azuriranju prema  datumu posle "+date);
    }
}

export async function findByPending(){
    try{
        const response = await api.get(url+`/search/by-pending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista za tracking-info 'Pending'");
    }
}

export async function findByShipped(){
    try{
        const response = await api.get(url+`/search/by-shipped`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista za tracking-info 'Shipped'");
    }
}

export async function findByIn_Transit(){
    try{
        const response = await api.get(url+`/search/by-in-transit`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista za tracking-info 'In_Transit'");
    }
}

export async function findByDelivered(){
    try{
        const response = await api.get(url+`/search/by-delivered`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista za tracking-info 'Delivered'");
    }
}

export async function findByDelayed(){
    try{
        const response = await api.get(url+`/search/by-delayed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista za tracking-info 'Delayed'");
    }
}

export async function findByCancelled(){
try{
        const response = await api.get(url+`/search/by-cancelled`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista za tracking-info 'Cancelled'");
    }
}

export async function findByShipment_ShipmentDate(shipmentDate){
    try{
        if(!moment(shipmentDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum  "+shipmentDate+" za posiljku nije pronadjen");
        }
        const response = await api.get(url+`/search/shipment-date`,{
            params:{
                shipmentDate:moment(shipmentDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli posiljku za odredjeni datum "+shipmentDate);
    }
}

export async function findByShipment_ShipmentDateBetween({shipmentDateStart, shipmentDateEnd}){
    try{
        if(
            !moment(shipmentDateStart,"YYYY-MM-DD",true).isValid() ||
            !moment(shipmentDateEnd,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati opseg "+shipmentDateStart+" - "+shipmentDateEnd+" datuma za posiljke nije pronadjen");
        }
        const response = await api.get(url+`/search/shipment-date-range`,{
            params:{
                shipmentDateStart:moment(shipmentDateStart).format("YYYY-MM-DD"),
                shipmentDateEnd:moment(shipmentDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli posiljke za odredjeni opseg "+shipmentDateStart+" - "+shipmentDateEnd+" datuma");
    }
}

export async function findByShipment_Provider_Id(providerId){
    try{
        if(providerId == null || isNaN(providerId)){
            throw new Error("Dati ID "+providerId+" za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/shipment/provider/${providerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli logistickog provajdera po "+providerId+" id-iju za posiljku");
    }
}

export async function findByShipment_OutboundDelivery_Id(outboundDeliveryId){
    try{
        if(outboundDeliveryId == null || isNaN(outboundDeliveryId)){
            throw new Error("Dati otbound-delivery ID "+outboundDeliveryId+" nije pronadjen");
        }
        const response = await api.get(url+`/shipment/outbound-delivery/${outboundDeliveryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli outbound-delivery po "+outboundDeliveryId+" id-iju za posiljku");
    }
}

export async function findByShipment_OriginStorage_Id(originStorageId){
    try{
        if(originStorageId == null || isNaN(originStorageId)){
            throw new Error("Dati ID "+originStorageId+" za originalno skadiste nije pronadjen");
        }
        const response = await api.get(url+`/shipment/origin-storage/${originStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli orignalno skladiste po "+originStorageId+" id-iju  za posiljku");
    }
}

export async function findByTrackingNumberAndCurrentLocation({trackingNumber, currentLocation}){
    try{
        if(!trackingNumber || typeof trackingNumber !=="string" || trackingNumber.trim() === "" ||
            !currentLocation || typeof currentLocation !== "string" || currentLocation.trim() === ""){
            throw new Error("Dati tracking-number "+trackingNumber+" i trenutna lokacija "+currentLocation+" nisu pronadjeni");
        }
        const response = await api.get(url+`/shipment/tracking-number-and-current-location`,{
            params:{
                trackingNumber:trackingNumber,
                currentLocation:currentLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tracking-number "+trackingNumber+" i trenutnu lokaciju "+currentLocation);
    }
}

export async function existsByTrackingNumber(trackingNumber){
    try{
        if(!trackingNumber || typeof trackingNumber !=="string" || trackingNumber.trim() === ""){
            throw new Error("Dati tracking-number "+trackingNumber+" nije pronadjen");
        }
        const response = await api.get(url+`/search/exists-by-tracking-number`,{
            params:{trackingNumber:trackingNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo tracking-number "+trackingNumber);
    }
}

export async function findByShipment_Provider_NameContainingIgnoreCase(providerName){
    try{
        if(!providerName || typeof providerName !== "string" || providerName.trim() === ""){
            throw new Error("Dati naziv "+providerName+" logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/shipment/by-provider-name`,{
            params:{providerName:providerName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo naziv "+providerName+" logistickog provajdera za posiljku");
    }
}

export async function findByShipment_Provider_ContactPhoneLikeIgnoreCase(contactPhone){
    try{
        if(!contactPhone || typeof contactPhone !== "string" || contactPhone.trim() === ""){
            throw new Error("Dati broj-telefona "+contactPhone+" za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/shipment/by-contact-phone`,{
            params:{contactPhone:contactPhone},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo broj-telefona "+contactPhone+" logistickog provajdera za posiljku");
    }
}

export async function findByShipment_Provider_EmailLikeIgnoreCase(providerEmail){
    try{
        if(!providerEmail || typeof providerEmail !== "string" || providerEmail.trim() === ""){
            throw new Error("Dati email "+providerEmail+" za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/shipment/by-provider-email`,{
            params:{providerEmail:providerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo email "+providerEmail+" logistickog provajdera za posiljku");
    }
}

export async function findByShipment_Provider_Website(providerWebsite){
    try{
        if(!providerWebsite || typeof providerWebsite !== "string" || providerWebsite.trim() === ""){
            throw new Error("Dati website "+providerWebsite+" za logistickog provajdera nije pronadjen");
        } 
        const response = await api.get(url+`/shipment/by-provider-website`,{
            params:{providerWebsite:providerWebsite},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo website "+providerWebsite+" logistickog provajdera za posiljku");
    }
}

export async function findByShipment_OriginStorage_NameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" orignalnog skladista nije pronadjen");
        }
        const response = await api.get(url+`/shipment/by-storage-name`,{
            params:{storageName:storageName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo naziv "+storageName+" orignalnog skladista za posiljku");
    }
}

export async function findByShipment_OriginStorage_LocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" orignalnog skladista nije pronadjena");
        }
        const response = await api.get(url+`/shipment/by-storage-location`,{
            params:{storageLocation:storageLocation},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo lokaciju "+storageLocation+" orignalnog skladista za posiljku");
    }
}

export async function findByShipment_OriginStorage_Capacity(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(isNaN(parseStorageCapacity) || parseStorageCapacity <= 0){
            throw new Error("Dati kapacitet "+parseStorageCapacity+" za originalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/shipment/origin-storage-capacity`,{
            params:{storageCapacity:parseStorageCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo kapacitet "+storageCapacity+" originalnog skladista za posiljku");
    }
}

export async function findByShipment_OriginStorage_CapacityGreaterThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(isNaN(parseStorageCapacity) || parseStorageCapacity <= 0){
            throw new Error("Dati kapacitet veci od "+parseStorageCapacity+" za originalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/shipment/origin-storage-capacity-greater-than`,{
            params:{storageCapacity:parseStorageCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo kapacitet originalnog skladista veceg od "+storageCapacity+" za posiljku");
    }
}

export async function findByShipment_OriginStorage_CapacityLessThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(isNaN(parseStorageCapacity) || parseStorageCapacity <= 0){
            throw new Error("Dati kapacitet manji od "+parseStorageCapacity+" za originalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/shipment/origin-storage-capacity-less-than`,{
            params:{storageCapacity:parseStorageCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo kapacitet originalnog skladista manjeg od "+storageCapacity+" za posiljku");
    }
}

export async function findByShipment_OriginStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" originalnog skladista nije pronadjen");
        }
        const response = await api.get(url+`/shipment/origin-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo tip "+type+" originalnog skladista za posiljku");
    }
}

export async function findByShipment_OriginStorage_Status(status){
    try{
        if(validateStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za originalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/shipment/origin-storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo status "+status+" originalnog skladista za posiljku");
    }
}

export async function findByStorageTypeAndStatus({type, status}){
    try{
        if(!validateStatus.includes(status?.toUpperCase()) || 
            !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" i status "+status+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/storage-type-and-status`,{
            params:{
                status:(status || "").toUpperCase(),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo tip "+type+" i status "+status+" skladista za posiljku");
    }
}

export async function findByTypeAndStatus({type, status}){
    try{
        if(!validateStatus.includes(status?.toUpperCase()) || 
            !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" i status "+status+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search-by-type-and-status`,{
            params:{
                status:(status || "").toUpperCase(),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo uspeli da pronadjemo tip "+type+" i status "+status+" skladista za posiljku");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}