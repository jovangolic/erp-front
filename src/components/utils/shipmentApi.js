import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/shipments`

const validateStatus = ["PENDING","SHIPPED","IN_TRANSIT","DELIVERED","DELAYED","CANCELLED"];
const isDeliveryStatusValid = ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

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

export async function update({id,date}){
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

export async function findByShipmentDateBetween({from, to}) {
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

export async function findByOriginStorageIdAndStatus({storageId, status}){
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

export async function findByTrackingInfo_TrackingNumber(trackingNumber){
    try{
        if(!trackingNumber || typeof trackingNumber !== "string" || trackingNumber.trim() === ""){
            throw new Error("Dati broj za pracenje nije pronadjen");
        }
        const response = await api.get(url+`/search/tracking-number`,{
            params:{trackingNumber:trackingNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju za pracenje");
    }
}

export async function findByTrackingInfo_EstimatedDelivery(estimatedDelivery){
    try{
        if(
            !moment(estimatedDelivery,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati procenjeni datum dostave nije pronadjen");
        }
        const response = await api.get(url+`/search/estimated-delivery`,{
            params:{estimatedDelivery:moment(estimatedDelivery).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Nismo pronasli ni jedan procenjeni datum dostave");
    }
}

export async function findByTrackingInfo_EstimatedDeliveryBetween(estimatedDeliveryStart, estimatedDeliveryEnd){
    try{
        if(
            !moment(estimatedDeliveryStart,"YYYY-MM-DD",true).isValid() ||
            !moment(estimatedDeliveryEnd,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati opseg datuma za dostavu nije pronadjen");
        }
        const response = await api.get(ur+`/search/estimated-delivery-between`,{
            params:{
                estimatedDeliveryStart:moment(estimatedDeliveryStart).format("YYYY-MM-DD"),
                estimatedDeliveryEnd:moment(estimatedDeliveryEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjeno informacije za procenjenu dostavu za dati opseg datuma");
    }
}

export async function findByProvider_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/search/provider-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno ne postoji email za odredjenog logistickog-provajdera");
    }
}

export async function findByProvider_WebsiteContainingIgnoreCase(website){
    try{
        if(!website || typeof website !== "string" || website.trim() === ""){
            throw new Error("Dati vebsajt za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/search/provider-website`,{
            params:{website:website},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno ne postoji vebsajt za odredjenog logistickog-provajdera");
    }
}

export async function findByProvider_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/seach/provider-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno ne postoji broj-telefona za odredjenog logistickog-provajdera");
    }
}

export async function findByOutboundDelivery_DeliveryDate(deliveryDate){
    try{
        if(
            !moment(deliveryDate,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati datum dostave za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/search/outboundDelivery-delivery-date`,{
            params:{deliveryDate:moment(deliveryDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum dostave za outbounde-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween(deliveryDateStart, deliveryDateEnd){
    try{
        if(
            !moment(deliveryDateStart,"YYYY-MM-DD",true).isValid() ||
            !moment(deliveryDateEnd,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati opseg datuma dostave za outbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/search/outboundDelivery-delivery-date-range`,{
            params:{
                deliveryDateStart:moment(deliveryDateStart).format("YYYY-MM-DD"),
                deliveryDateEnd:moment(deliveryDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg tauma dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{

    }
    catch(error){
        handleApiError(error,"");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{
        if(!isDeliveryStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za dostavu nije pronadjen");
        }
        const response = await api.get(url+`/search/outboundDelivery-delivery-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status da dostavu");
    }
}

export async function findByOutboundDelivery_Buyer_Id(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(ur+`/search/outboundDelivery/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ID za kupca");
    }
}

export async function findLateShipments(){
    try{
        const response = await api.get(url+`/search/late-shipments`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostavu koja kasni");
    }
}

export async function findShipmentsDueSoon(futureDate){
    try{
        if(
            !moment(futureDate,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati datum za dostavu koja treb astici nije pronadjen");
        }
        const response = await api.get(url+`/search/shipments-due-soon`,{
            params:{futureDate:moment(futureDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostavu koja treba da dodje uskoro");
    }
}

export async function findByTrackingInfoIsNull(){
    try{
        const response = await api.get(url+`/search/tracking-info-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tracking-info da je null");
    }
}

export async function findByOutboundDelivery_StatusAndOutboundDelivery_DeliveryDateBetween({status, from, to}){
    try{
        if(!isDeliveryStatusValid.includes(status?.toUpperCase()) ||
            !moment(from,"YYYY-MM-DD",true).isValid() || 
            !moment(to,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati status dostave i opseg datuma dostave nisu pronadjeni");
        }
        const response = await api.get(url+`/search/outboundDelivery/status-delivery-date-range`,{
            params:{
                status:(status || "").toUpperCase(),
                from:moment(from).format("YYYY-MM-DD"),
                to:moment(to).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo prnasli status dostave i opseg datuma za dostavu");
    }
}

export async function findByOriginStorageIdAndTrackingInfo_EstimatedDeliveryBetween({storageId, from, to}){
    try{
        if(storageId == null || isNaN(storageId) ||
            !moment(from,"YYYY-MM-DD",true).isValid() || 
            !moment(to,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati ID za skladiste i procenjeni opseg datuma dostave nije pronadjen");
        }
        const response = await api.get(url+`/search/storage/${storageId}/trackingInfo-estimated-delivery-date-range`,{
            params:{
                from:moment(from).format("YYYY-MM-DD"),
                to:moment(to).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ID za originalno skladiste i procenjeni opseg datuma dostave");
    }
}

export async function findByTrackingInfo_CurrentStatusAndTrackingInfo_CurrentLocationContainingIgnoreCase({status, location}){
    try{
        if(validateStatus.includes(status?.toUpperCase()) ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati status dostave i trenutna lokacija nisu pronadjeni");
        }
        const response = await api.get(url+`/search/trackingInfo-status-location`,{
            params:{
                status:(status || "").toUpperCase(),
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave i njenu trenutnu lokaciju");
    }
}

export async function findByBuyerNameContainingIgnoreCase(buyerName){
    try{
        if(
            !buyerName || typeof buyerName !== "string" || buyerName.trim() === ""
        ){
            throw new Error("Dato ime kupca nije pronadjeno");
        }
        const response = await api.get(url+`/search/buyer-name`,{
            params:{buyerName:buyerName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv kupca");
    }
}

export async function findRecentlyDeliveredShipments(fromDate){
    try{
        if(
            !moment(fromDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati datum za nedavnu dostavu nije pronadjen");
        }
        const response = await api.get(url+`/search/recently-delivered-shipments`,{
            params:{fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nedavnu dostavljenu isporuku");
    }
}

export async function findCancelledShipments(){
    try{
        const response = await api.get(url+`/search/cancelled-shipments`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli otkazane dostave");
    }
}

export async function findCancelledShipmentsBetweenDates({from, to}){
    try{
        if(
            !moment(from,"YYYY-MM-DD",true).isValid() || 
            !moment(to,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati opseg datuma otkazivanja posiljke nije pronadjen");
        }
        const response = await api.get(url+`/search/cancelled-shipments-date-range`,{
            params:{
                from:moment(from).format("YYYY-MM-DD"),
                to:moment(to).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli otkazane dostave izmedju datih datuma");
    }
}

export async function findDelayedShipments(){
    try{
        const response = await api.get(url+`/search/delayed-shipments`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odlozene posiljke");
    }
}

export async function findInTransitShipments(){
    try{
        const response = await api.get(url+`/search/in-transit-shipments`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostavu koja je u tranzitu");
    }
}

export async function findDeliveredShipments(){
    try{
        const response = await api.get(url+`/search/delivered-shipments`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostavljene posiljke");
    }
}

export async function findShipmentsByFixedStatus(status){
    try{
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status dostave nije pronadjen");
        }
        const response = await api.et(url+`/search/shipments-by-fixed-status`,{
            handleApiError:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fiksirani status dostave");
    }
}

export async function findPendingDeliveries(){
    try{
        const response = await api.get(url+`/search/pending-deliveries`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostave koje su u-toku");
    }
}

export async function findInTransitDeliveries(){
    try{
        const response = await api.get(url+`/search/in-transit-deliveries`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostave koje su u tranzitu");
    }
}

export async function findDeliveredDeliveries(){
    try{
        const response = await api.get(url+`/search/delivered-deliveries`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostavljene dostave");
    }
}

export async function findCancelledDeliveries(){
    try{
        const response = await api.get(url+`/search/cancelled-deliveries`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli otkazane dostave");
    }
}

export async function findInTransitShipmentsWithInTransitDelivery(){
    try{
        const response = await api.get(url+`/search/transit-shipments-with-transit-delivery`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli posiljku za dostavu koja je u tranzitu");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}