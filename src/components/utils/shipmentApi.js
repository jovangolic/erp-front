import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/shipments`

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

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
        const response = await api.post(url+`/create`, data, {
        headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom kreiranja pošiljke");
    }
}

export async function update({id,date}){
    try{
        if (id == null || isNaN(id) || !isValidShipmentData({ ...data, validateStatus })) {
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
        if(id == null || isNaN(id)){
            throw new Error("ID "+id+" nije pronadjen");
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska [rilikom trazenja jednog shipment-a po "+id+ " id-iju");
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
        if(outboundId == null || isNaN(outboundId)){
            throw new Error("Dati outboundId "+outboundId+" nije pronadjen");
        }
        const response = await api.get(url+`/outboundDelivery/${outboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja outboundDelivery "+outboundId+" id-iju");
    }
}

export async function findByStatus(status){
    try{
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" nije pronadjen");
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
        handleApiError(error, "Greska prilikom trazenja prema statusu "+status);
    }
}

export async function findByShipmentDateBetween({from, to}) {
    try{
        const isFromValid = moment.isMoment(from) ||  moment(from, "YYYY-MM-DD", true).isValid();
        const isToValid = moment.isMoment(to) ||  moment(to, "YYYY-MM-DD", true).isValid();
        if (!isFromValid || !isToValid) {
            return false;
        }
        if(moment(to).isBefore(moment(from))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error, "Greska prilikom dobavljanja prema datumu opsega "+from+" - "+to);
    } 
}

export async function findByProviderId(providerId){
    try{
        if(providerId == null || isNaN(providerId)){
            throw new Error("ProviderId "+providerId+" nije pornadjen");
        }
        const response = await api.get(url+`/provider/${providerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po provajder "+providerId+" id-iju");
    }
}

export async function findByProvider_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() ===""){
            throw new Error("Naziv "+name+" providera nije pronadjen");
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
        handleApiError(error,"Greska prema trazenju po "+name+" nazivu provajdera");
    }
}

export async function findByTrackingInfo_CurrentStatus(status){
    try{
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" nije pronadjen");
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
        handleApiError(error,"Greska prema trackingInfo-u i trenutnom statusu "+status);
    }
}

export async function findByTrackingInfoId(trackingInfoId){
    try{
        if(trackingInfoId == null || isNaN(trackingInfoId)){
            throw new Error("TrackingInfo ID "+trackingInfoId+" nije pronadjen");
        }
        const response = await api.get(url+`/trackingInfo/${trackingInfoId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po trackingInfo "+trackingInfoId+" id-iju");
    }
}

export async function findByOriginStorageId(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("StorageId "+storageId+" nije pornadjen");
        }
        const response = await api.get(url+`/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po "+storageId+" id-iju originalnog skladista");
    }
}

export async function findByOriginStorage_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim() ===""){
            throw new Error("Naziv "+name+" skladista nije pronadjen");
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
        handleApiError(error,"Greska prema trazenju po nazivu "+name+" originalnog skladista");
    }
}

export async function findByOriginStorage_Location(location){
    try{
        if(!location || typeof location !== "string" || location.trim() ===""){
            throw new Error("Originalna lokacija "+location+" skladista nije pronadjena");
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
        handleApiError(error, "Greska prema trazenju po lokaciji "+location+" skladista");
    }
}

export async function findByOriginStorage_Type(type){
    try{
        if(!validateStatus.includes(type?.toUpperCase())){
            throw new Error("Tip "+type+" za originalno skladiste, nije pronadjen");
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
        handleApiError(error,"Greska prema trazenju po tipu "+type+" skladista");
    }
}

export async function findByOriginStorageIdAndStatus({storageId, status}){
    try{
        if(storageId == null || isNaN(storageId) || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("StorageId "+storageId+" I status "+status+" nisu pronadjeni");
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
        handleApiError(error,"Greska prema trazenju po "+storageId+" id-iju skladista i njegovom "+status+" statusu");
    }
}

export async function searchByOriginStorageName(name){
    try{
        if(!name || typeof name !=="string" || name.trim() ===""){
            throw new Error("Pretraga po nazivu "+name+" skladista nije pronadjena");
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
        handleApiError(error,"Greska prema trazenju po "+name+" nazivu skladista");
    }
}

export async function findByTrackingInfo_CurrentLocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !=="string" || location.trim() ===""){
            throw new Error("Lokacija "+location+" trackingInfo-a nije pronadjena");
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
        handleApiError(error,"Greska prema trazenju po trackingInfo-u i trenutnoj "+location+" lokaciji");
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
        if(trackingNumber == null || typeof trackingNumber !== "string" || trackingNumber.trim() === ""){
            throw new Error("Dati broj "+trackingNumber+" za pracenje nije pronadjen");
        }
        const response = await api.get(url+`/search/tracking-number`,{
            params:{trackingNumber:trackingNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju "+trackingNumber+" za pracenje");
    }
}

export async function findByTrackingInfo_EstimatedDelivery(estimatedDelivery){
    try{
        const validateDate = moment.isMoment(estimatedDelivery) || moment(estimatedDelivery,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati procenjeni datum "+estimatedDelivery+" dostave nije pronadjen");
        }
        const response = await api.get(url+`/search/estimated-delivery`,{
            params:{estimatedDelivery:moment(estimatedDelivery).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Nismo pronasli ni jedan procenjeni datum "+estimatedDelivery+" dostave");
    }
}

export async function findByTrackingInfo_EstimatedDeliveryBetween(estimatedDeliveryStart, estimatedDeliveryEnd){
    try{
        const validateDateStart = moment.isMoment(estimatedDeliveryStart) || moment(estimatedDeliveryStart,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(estimatedDeliveryEnd) || moment(estimatedDeliveryEnd,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg datuma "+estimatedDeliveryStart+" - "+estimatedDeliveryEnd+" za dostavu nije pronadjen");
        }
        if(moment(estimatedDeliveryEnd).isBefore(moment(estimatedDeliveryStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Nismo uspeli da pronadjeno informacije za procenjenu dostavu za dati opseg "+estimatedDeliveryStart+" - "+estimatedDeliveryEnd+" datuma");
    }
}

export async function findByProvider_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/search/provider-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno ne postoji email "+email+" za odredjenog logistickog-provajdera");
    }
}

export async function findByProvider_WebsiteContainingIgnoreCase(website){
    try{
        if(!website || typeof website !== "string" || website.trim() === ""){
            throw new Error("Dati vebsajt "+website+" za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/search/provider-website`,{
            params:{website:website},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno ne postoji vebsajt "+website+" za odredjenog logistickog-provajdera");
    }
}

export async function findByProvider_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" za logistickog provajdera nije pronadjen");
        }
        const response = await api.get(url+`/seach/provider-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno ne postoji broj-telefona "+phoneNumber+" za odredjenog logistickog-provajdera");
    }
}

export async function findByOutboundDelivery_DeliveryDate(deliveryDate){
    try{
        const validateDate = moment.isMoment(deliveryDate) || moment(deliveryDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+deliveryDate+" dostave za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/search/outboundDelivery-delivery-date`,{
            params:{deliveryDate:moment(deliveryDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+deliveryDate+" dostave za outbounde-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween(deliveryDateStart, deliveryDateEnd){
    try{
        const validateDateStart = moment.isMoment(deliveryDateStart) || moment(deliveryDateStart,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(deliveryDateEnd) || moment(deliveryDateEnd,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg datuma "+deliveryDateStart+" - "+deliveryDateEnd+" dostave za outbound-delivery nije pronadjen");
        }
        if(moment(deliveryDateEnd).isBefore(moment(deliveryDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+deliveryDateStart+" - "+deliveryDateEnd+" dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{
        if(!isDeliveryStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/outboundDelivery-delivery-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" za outbound-delivery");
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
            throw new Error("Dati ID "+buyerId+" za kupca nije pronadjen");
        }
        const response = await api.get(ur+`/search/outboundDelivery/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ID "+buyerId+" za kupca");
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
        const validateDate = moment.isMoment(futureDate)  || moment(futureDate,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+futureDate+" za dostavu koja treba stici nije pronadjen");
        }
        const response = await api.get(url+`/search/shipments-due-soon`,{
            params:{futureDate:moment(futureDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostavu "+futureDate+" koja treba da dodje uskoro");
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
        const validateStart = moment.isMoment(from) || moment(from,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(to) || moment(to,"YYYY-MM-DD",true).isValid();
        if(!isDeliveryStatusValid.includes(status?.toUpperCase()) || !validateStart || !validateEnd){
            throw new Error("Dati status "+status+" dostave i opseg datuma "+from+" - "+to+" dostave nisu pronadjeni");
        }
        if(moment(to).isBefore(moment(from))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetka");
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
        handleApiError(error,"Trenutno nismo prnasli status dostave i opseg datuma "+from+" - "+to+" za dostavu");
    }
}

export async function findByOriginStorageIdAndTrackingInfo_EstimatedDeliveryBetween({storageId, from, to}){
    try{
        const validateStart = moment.isMoment(from) || moment(from,"YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(to) || moment(to,"YYYY-MM-DD",true).isValid();
        if(storageId == null || isNaN(storageId) ||
            !validateStart || !validateEnd){
            throw new Error("Dati ID "+storageId+" za skladiste i procenjeni opseg datuma "+from+" - "+to+" dostave nije pronadjen");
        }
        if(moment(to).isBefore(moment(from))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetka");
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
        handleApiError(error,"Trenutno nismo pronasli ID "+storageId+" za originalno skladiste i procenjeni opseg datuma "+from+" - "+to+" dostave");
    }
}

export async function findByTrackingInfo_CurrentStatusAndTrackingInfo_CurrentLocationContainingIgnoreCase({status, location}){
    try{
        if(validateStatus.includes(status?.toUpperCase()) ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati status "+status+" dostave i trenutna lokacija "+location+" nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" dostave i njenu trenutnu lokaciju "+location);
    }
}

export async function findByBuyerNameContainingIgnoreCase(buyerName){
    try{
        if(
            !buyerName || typeof buyerName !== "string" || buyerName.trim() === ""
        ){
            throw new Error("Dato ime kupca "+buyerName+" nije pronadjeno");
        }
        const response = await api.get(url+`/search/buyer-name`,{
            params:{buyerName:buyerName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+buyerName+" kupca");
    }
}

export async function findRecentlyDeliveredShipments(fromDate){
    try{
        const validateDate = moment.isMoment(fromDate) || moment(fromDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+fromDate+" za nedavnu dostavu nije pronadjen");
        }
        const response = await api.get(url+`/search/recently-delivered-shipments`,{
            params:{fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nedavnu "+fromDate+" dostavljenu isporuku");
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
        const validateDateStart = moment.isMoment(from) || moment(from,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(to) || moment(to,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg datuma "+from+" - "+to+" otkazivanja posiljke nije pronadjen");
        }
        if(moment(to).isBefore(moment(from))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Trenutno nismo pronasli otkazane dostave izmedju datih "+from+" - "+to+" datuma");
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
            throw new Error("Dati status "+status+" dostave nije pronadjen");
        }
        const response = await api.et(url+`/search/shipments-by-fixed-status`,{
            handleApiError:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli fiksirani "+status+" status dostave");
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



