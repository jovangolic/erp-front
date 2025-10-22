import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/transportOrders`;

const t_status = ["PENDING","ON_THE_WAY","COMPLETED","FAILED"];
const v_status = ["AVAILABLE","IN_USE","UNDER_MAINTENANCE","OUT_OF_SERVICE","RESERVED"];
const deliveryStatus = ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

export async function create({scheduledDate,vehicleId,driversId,status,outboundDeliveryId}){
    try{
        const validateScheduleDate = moment.isMoment(scheduledDate) || moment(scheduledDate, "YYYY-MM-DD", true).isValid();
        if(
            !validateScheduleDate || vehicleId == null || isNaN(vehicleId) || 
            driversId == null || isNaN(driversId) || !t_status.includes(status?.toUpperCase()) ||
            outboundDeliveryId == null || isNaN(outboundDeliveryId)){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {scheduledDate,vehicleId,driversId,status,outboundDeliveryId};
        const response = await api.post(url+`/create/new-transportOrder`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update({id,scheduledDate,vehicleId,driversId,status,outboundDeliveryId}){
    try{
        const validateScheduleDate = moment.isMoment(scheduledDate) || moment(scheduledDate, "YYYY-MM-DD", true).isValid();
        if(
            id == null || isNaN(id) ||
            !validateScheduleDate || vehicleId == null || isNaN(vehicleId) || 
            driversId == null || isNaN(driversId) || !t_status.includes(status?.toUpperCase()) ||
            outboundDeliveryId == null || isNaN(outboundDeliveryId)){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {scheduledDate,vehicleId,driversId,status,outboundDeliveryId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteTransportOrder(id){
    try{   
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za transportOrder nije pronadjen");
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

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za transportOrder nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog transport-ordera po "+id+" id-iju");
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
        handleApiError(error,"Greska prema dobavljanju svih");
    }
}

export async function findByVehicle_Model(model){
    try{
        if(!model || typeof model !=="string" || model.trim() ===""){
            throw new Error("Dati model "+model+" vozila nije pronadjen");
        }
        const response = await api.get(url+`/vehicle-model`,{
            params:{
                model:model
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po modelu "+model+" vozila");
    }
}

export async function findByDriver_Name(name){
    try{
        if(!name || typeof name !=="string" || name.trim() ===""){
            throw new Error("Dato ime "+name+" vozaca nije pronadjen");
        }
        const response = await api.get(url+`/driver-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema imenu "+name+" vozaca");
    }
}

export async function findByVehicleId(vehicleId){
    try{
        if(vehicleId == null || isNaN(vehicleId)){
            throw new Error("Dati ID "+vehicleId+" za vozilo nije pronadjeno");
        }
        const response = await api.get(url+`/vehicle/${vehicleId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po "+vehicleId+" id-iju vozila");
    }
}

export async function findByDriverId(driverId){
    try{
        if(driverId == null || isNaN(driverId)){
            throw new Error("Dati ID "+driverId+" za vozaca nije pronadjeno");
        }
        const response = await api.get(url+`/driver/${driverId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po "+driverId+" id-iju vozila");
    }
}

export async function findByStatus(status){
    try{
        if(t_status.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za transferOrder nije pronadjen ili ne postoji");
        }
        const response = await api.get(url+`/transport-status`,{
            params:{
                status:(status || "".toLowerCase())
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po statusu "+status);
    }
}

export async function findByOutboundDelivery_Id(outboundDeliveryId){
    try{
        if(outboundDeliveryId == null  || isNaN(outboundDeliveryId)){
            throw new Error("Dati ID "+outboundDeliveryId+" za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/outboundDelivery/${outboundDeliveryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po odlazecem "+outboundDeliveryId+" id-iju");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{
        if(deliveryStatus.includes(status?.toUpperCase())){
            throw new Error("Dati delivery status "+status+" za outboundDelivery nije pronadjen ili ne postoji");
        }
        const response = await api.get(url+`/delivery-status`,{
            params:{
                status:(status || "".toLowerCase())
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po odlazecem statusu "+status);
    }
}

export async function findByScheduledDateBetween({from, to}){
    try{
        const validateStart = moment.isMoment(from) || moment(from, "YYYY-MM-DD", true).isValid();
        const validateEnd = moment.isMoment(to) || moment(to, "YYYY-MM-DD", true).isValid();
        if (!validateStart || !validateEnd) {
            throw new Error("Opseg  "+from+" - "+to+" datuma nije ispravan");
        }
        if(moment(to).isBefore(moment(from))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/date-range`,{
            params:{
                from:moment(from).format("YYYY-MM-DD"),
                to:moment(to).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po opsegu "+from+" - "+to+" rasporeda");
    }
}

export async function findByScheduledDate(scheduleDate){
    try{
        const validateScheduleDate = moment.isMoment(scheduleDate) || moment(scheduleDate,"YYYY-MM-DD",true).isValid();
        if(!validateScheduleDate){
            throw new Error("Dati datum rasporeda "+scheduleDate+" nije pronadjen");
        }
        const response = await api.get(url+`/by-schedule-date`,{
            params:{scheduleDate:moment(scheduleDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum rasporeda "+scheduleDate+" za transport-order nalog");
    }
}

export async function findByPending(){
    try{
        const response = await api.get(url+`/transport-status-pending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status 'PENIDING' za transport order status");
    }
}

export async function findByOn_The_Way(){
    try{
        const response = await api.get(url+`/transport-status-on-the-way`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status 'ON_THE_WAY' za transport order status");
    }
}

export async function findByCompleted(){
    try{
        const response = await api.get(url+`/transport-status-completed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status 'COMPLETED' za transport order status");
    }
}

export async function findByFailed(){
    try{
        const response = await api.get(url+`/transport-status-failed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status 'FAILED' za transport order status");
    }
}

export async function findByVehicle_Status(status){
    try{
        if(!v_status.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za vozilo nije pronadjen");
        }
        const response = await api.get(url+`/search/vehicle-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli statuse "+status+" za Vozilo");
    }
}

export async function findByVehicle_Available(){
    try{
        const response = await api.get(url+`/search/vehicle-status/by-available`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za vozilo koje je 'AVAILABLE'");
    }
}

export async function findByVehicle_In_Use(){
    try{
        const response = await api.get(url+`/search/vehicle-status/by-in-use`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za vozilo koje je 'IN_USE'");
    }
}

export async function findByVehicle_Under_Maintenance(){
    try{
        const response = await api.get(url+`/search/vehicle-status/by-under-maintenance`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za vozilo koje je 'UNDER_MAINTENANCE'");
    }
}

export async function findByVehicle_Out_Of_Service(){
    try{
        const response = await api.get(url+`/search/vehicle-status/by-out-of-service`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za vozilo koje je 'OUT_OF_SERVICE'");
    }
}

export async function findByVehicle_Reserved(){
    try{
        const response = await api.get(url+`/search/vehicle-status/bty-reserved`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za vozilo koje je 'RESERVED'");
    }
}

export async function findByVehicleAndDriver({vehicleModel, driverName}){
    try{
        if(
            !vehicleModel || typeof vehicleModel !== "string" || vehicleModel.trim() === "" ||
            !driverName || typeof driverName !== "string" || driverName.trim() === ""
        ){
            throw new Error("Dati model "+vehicleModel+" vozila i vozacevo ime "+driverName+" nije pronadjeno");
        }
        const reserved = await api.get(url+`/search/vehicle-model-and-driver-name`,{
            params:{
                vehicleModel:vehicleModel,
                driverName:driverName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo nasli model "+vehicleModel+" vozila i vozacevo ime "+driverName+" za dato vozilo");
    }
}

export async function findByOutboundDelivery_Pending(){
    try{
        const response = await api.get(url+`/outbound-delivery/delivery-status-pending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za dostavu 'PENDING' koji pripada outbound-delivery");
    }
}

export async function findByOutboundDelivery_In_Transit(){
    try{
        const response = await api.get(url+`/outbound-delivery/delivery-status-in-transit`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za dostavu 'IN_TRANSIT' koji pripada outbound-delivery");
    }
}

export async function findByOutboundDelivery_Delivered(){
    try{
        const response = await api.get(url+`/outbound-delivery/delivery-status-delivered`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za dostavu 'DELIVERED' koji pripada outbound-delivery");
    }
}

export async function findByOutboundDelivery_Cancelled(){
    try{
        const response = await api.get(url+`/outbound-delivery/delivery-status--cancelled`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za dostavu 'CANCELLED' koji pripada outbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDate(deliveryDate){
    try{
        const validateDeliveryDate = moment.isMoment(deliveryDate) || moment(deliveryDate,"YYYY-MM-DD",true).isValid();
        if(validateDeliveryDate){
            throw new Error("Dati datum "+deliveryDate+" dostave za outbound delivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/delivery-date`,{
            params:{
                deliveryDate:moment(deliveryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+deliveryDate+" dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween({deliveryDateStart, deliveryDateEnd}){
    try{
        const validateDeliveryDateStart = moment.isMoment(deliveryDateStart) || moment(deliveryDateStart,"YYYY-MM-DD",true).isValid();
        const validateDeliveryDateEnd = moment.isMoment(deliveryDateEnd) || moment(deliveryDateEnd,"YYYY-MM-DD",true).isValid();
        if(!validateDeliveryDateStart || !validateDeliveryDateEnd){
            throw new Error("Dati opseg "+deliveryDateStart+" - "+deliveryDateEnd+" datuma dostave za outbound-delivery nije pronadjen");
        }
        if(moment(deliveryDateEnd).isBefore(moment(deliveryDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/outbound-delivery/delivery-date-range`,{
            params:{
                deliveryDateStart:moment(deliveryDateStart).format("YYYY-MM-DD"),
                deliveryDateEnd:moment(deliveryDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg "+deliveryDateStart+" - "+deliveryDateEnd+" datuma dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Buyer_Id(buyerId){
    try{
        if(isNaN(uyerId) || buyerId == null){
            throw new Error("Dati ID "+buyerId+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ID "+buyerId+" kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Buyer_CompanyNameContainingIgnoreCase(buyerCompanyName){
    try{
        if(!buyerCompanyName || typeof buyerCompanyName !== "string" || buyerCompanyName.trim() === ""){
            throw new Error("Dati naziv "+buyerCompanyName+" kompanije kupca za outbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/buyer-company-name`,{
            params:{
                buyerCompanyName:buyerCompanyName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+buyerCompanyName+" kompanije kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona "+phoneNumber+" kupca za outbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj telefona "+phoneNumber+" kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" kupca za outbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/buyer-email`,{
            params:{
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+email+" kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_Address(buyerAddrres){
    try{
        if(!buyerAddrres || typeof buyerAddrres !== "string" || buyerAddrres.trim() === ""){
            throw new Error("Data adresa "+buyerAddrres+" kupca za outbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/buyer-address`,{
            params:{
                buyerAddrres:buyerAddrres
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu "+buyerAddrres+" kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_PibLikeIgnoreCase(buyerPib){
    try{
        if(!buyerPib || typeof buyerPib !== "string" || buyerPib.trim() === ""){
            throw new Error("Dati pib "+buyerPib+" kupca za outbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/buyer-pib`,{
            params:{
                buyerPib:buyerPib
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pib "+buyerPib+" kupca za outbound-delivey");
    }
}

export async function findDeliveryItemsByTransportOrderId(transportOrderId){
    try{
        if(transportOrderId == null || isNaN(transportOrderId)){
            throw new Error("Dati transport-order ID "+transportOrderId+" nije pronadjen");
        }
        const response = await api.get(url+`/search/delivery-items/${transportOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve stavke dostave za transport-order "+transportOrderId+" ID-iju");
    }
}

export async function findAllWithDeliveryItems(){
    try{
        const response = await api.get(url+`/search/all-delivery-items`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve stavke dostave");
    }
}

export async function findByOutboundDelivery_DeliveryDateAfter(deliveryAfter){
    try{
        const validateDeliveryDate = moment.isMoment(deliveryAfter) || moment(deliveryAfter,"YYYY-MM-DD",true).isValid();
        if(!validateDeliveryDate){
            throw new Error("Dati datum dostave posle "+deliveryAfter+", za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/delivery-after`,{
            params:{
                deliveryAfter:moment(deliveryAfter).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum dostave posle "+deliveryAfter+" za outbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBefore(deliveryBefore){
    try{
        const validateDeliveryDate = moment.isMoment(deliveryBefore) || moment(deliveryBefore,"YYYY-MM-DD",true).isValid();
        if(!validateDeliveryDate){
            throw new Error("Dati datum dostave pre "+deliveryBefore+", za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/delivery-before`,{
            params:{
                deliveryBefore:moment(deliveryBefore).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum dostave pre "+deliveryBefore+" za outbound-delivery");
    }
}

export async function findByVehicle_RegistrationNumber(registrationNumber){
    try{
        if(!registrationNumber || typeof registrationNumber !== "string" || registrationNumber.trim() === ""){
            throw new Error("Dati registracioni broj "+registrationNumber+" za vozilo, nije pronadjen");
        }
        const response = await api.get(url+`/search/vehicle-registration-number`,{
            params:{
                registrationNumber:registrationNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli registracioni broj "+registrationNumber+" za odredjeno vozilo");
    }
}

export async function existsByVehice_RegistrationNumber(registrationNumber){
    try{
        if(!registrationNumber || typeof registrationNumber !== "string" || registrationNumber.trim() === ""){
            throw new Error("Dati registracioni broj "+registrationNumber+" za vozilo, nije pronadjen");
        }
        const response = await api.get(url+`/search/exists-by-registration-number`,{
            params:{
                registrationNumber:registrationNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje registracionog broja "+registrationNumber+" za odredjeno vozilo");
    }
}

export async function findByStatus_AndVehicle_Status({transportStatus, vehicleStatus}){
    try{
        if(!t_status.includes(transportStatus?.toUpperCase()) || v_status.includes(vehicleStatus?.toUpperCase())){
            throw new Error("Dati status "+transportStatus+" za transport i status "+vehicleStatus+" za vozilo nije pronadjeno");
        }
        const response = await api.get(url+`/search/transport-status-and-vehicle-status`,{
            params:{
                transportStatus:(transportStatus || "").toUpperCase(),
                vehicleStatus:(vehicleStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli statuse za transport "+transportStatus+" i vozilo "+vehicleStatus);
    }
}

export async function findByStatusIn(statuses){
    try{
        if(!t_status.includes(statuses?.toUpperCase())){
            throw new Error("Data lista sa transport statusima nije pronadjena");
        }
        const response = await api.get(url+`/search/status-in-statuses`,{
            params:{
                statuses:arrayStatus
            },
            paramsSerializer: params =>{
                return params.arrayStatus.map(s => `arrayStaus=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli listu sa svim transport statusima");
    }
}

export async function findByVehicle_StatusIn(statuses){
    try{
        if(v_status.includes(statuses?.toUpperCase())){
            throw new Error("Data lista sa statusima za vozila nije pronadjena");
        }
        const response = await api.get(url+`/search/vehicle-status-in-statuses`,{
            params:{
                statuses:arrayStatus
            },
            paramsSerializer: params =>{
                return params.arrayStatus.map(s =>`arrayStatus=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli listu sa svim statusima za vozilo");
    }
}

export async function findByVehicleAndStatuses(vehicleId, statusesArray) {
    try {
        if(!t_status.includes(statusesArray?.toUpperCase()) || vehicleId == null || isNaN(vehicleId)){
            throw new Error("Dati ID "+vehicleId+" za vozilo kao i lista statusa za TransportStatus, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-vehicle-and-statuses`, {
            params: {
                vehicleId,
                statuses: statusesArray.map(s => s.toUpperCase())
            },
            paramsSerializer: params => {
                const query = [`vehicleId=${params.vehicleId}`];
                if (Array.isArray(params.statuses)) {
                    params.statuses.forEach(status => {
                        query.push(`statuses=${encodeURIComponent(status)}`);
                    });
                }
                return query.join("&");
            },
            headers: getHeader()
        });

        return response.data;
    } catch (error) {
        handleApiError(error, "Greska prilikom traženja transport naloga za zadato vozilo i statuse.");
    }
}

export async function findWithInactiveVehicles(){
    try{
        const response = await api.get(url+`/search/inactive-vehicles`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli neaktivna vozila");
    }
}

export async function findByScheduledDateAfter(scheduledDateAfter){
    try{
        const validateScheduleDate = moment.isMoment(scheduledDateAfter) || moment(scheduledDateAfter,"YYYY-MM-DD",true).isValid();
        if(!validateScheduleDate){
            throw new Error("Redosled datuma posle "+scheduledDateAfter+" za transport-order, nije pronadjen");
        }
        const response = await api.get(url+`/scheduled-date-after`,{
            params:{
                scheduledDateAfter:moment(scheduledDateAfter).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli redosled datuma posle "+scheduledDateAfter+", za transport-order");
    }
}

export async function findByScheduledDateBefore(scheduledDateBefore){
    try{
        const validateScheduleDate = moment.isMoment(scheduledDateBefore) || moment(scheduledDateBefore,"YYYY-MM-DD",true).isValid();
        if(!validateScheduleDate){
            throw new Error("Redosled datuma pre "+scheduledDateBefore+" za transport-order, nije pronadjen");
        }
        const response = await api.get(url+`/scheduled-date-before`,{
            params:{
                scheduledDateBefore:moment(scheduledDateBefore).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli redosled datuma pre "+scheduledDateBefore+", za transport-order");
    }
}