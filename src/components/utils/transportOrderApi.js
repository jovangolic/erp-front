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
        if(!moment(scheduledDate, "YYYY-MM-DD", true).isValid() || !vehicleId || !driversId || !t_status.includes(status?.toUpperCase())
        || !outboundDeliveryId){
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
        if( !id ||!moment(scheduledDate, "YYYY-MM-DD", true).isValid() || !vehicleId || !driversId || !t_status.includes(status?.toUpperCase())
        || !outboundDeliveryId){
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
        if(!id){
            throw new Error("Dati ID za transportOrder nije pronadjen");
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
        if(!id){
            throw new Error("Dati ID za transportOrder nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog");
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
            throw new Error("Dati model vozila nije pronadjen");
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
        handleApiError(error,"Greska prema pretrazi po modelu vozila");
    }
}

export async function findByDriver_Name(name){
    try{
        if(!name || typeof name !=="string" || name.trim() ===""){
            throw new Error("Dato ima vozaca nije pronadjen");
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
        handleApiError(error,"Greska prilikom pretrage prema imenu vozaca");
    }
}

export async function findByVehicleId(vehicleId){
    try{
        if(!vehicleId){
            throw new Error("Dati ID za vozilo nije pronadjeno");
        }
        const response = await api.get(url+`/vehicle/${vehicleId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po id-iju vozila");
    }
}

export async function findByDriverId(driverId){
    try{
        if(!driverId){
            throw new Error("Dati ID za vozaca nije pronadjeno");
        }
        const response = await api.get(url+`/driver/${driverId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po id-iju vozila");
    }
}

export async function findByStatus(status){
    try{
        if(t_status.includes(status?.toUpperCase())){
            throw new Error("Dati status za transferOrder nije pronadjen ili ne postoji");
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
        handleApiError(error,"Greska prema pretrazi po statusu");
    }
}

export async function findByOutboundDelivery_Id(outboundDeliveryId){
    try{
        if(!outboundDeliveryId){
            throw new Error("Dati ID za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/outboundDelivery/${outboundDeliveryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po odlazecem id-iju");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{
        if(deliveryStatus.includes(status?.toUpperCase())){
            throw new Error("Dati delivery status za outboundDelivery nije pronadjen ili ne postoji");
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
        handleApiError(error,"Greska prema pretrazi po odlazecem statusu");
    }
}

export async function findByScheduledDateBetween({from, to}){
    try{
        if (!from || !to || !moment(from, "YYYY-MM-DD", true).isValid() || !moment(to, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Opseg datuma nije ispravan");
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
        handleApiError(error,"Greska prema trazenju po opsegu rasporeda");
    }
}

export async function findByScheduledDate(scheduleDate){
    try{
        if(!moment(scheduleDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum rasporeda nije pronadjen");
        }
        const response = await api.get(url+`/by-schedule-date`,{
            params:{scheduleDate:moment(scheduleDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum rasporeda za transport-order nalog");
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
            throw new Error("Dati status za vozilo nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli statuse za Vozilo");
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
            throw new Error("Dati model vozila i vozacevo ime nije pronadjeno");
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
        handleApiError(error,"Trenutno nismo nasli model vozila i vozacevo ime za dato vozilo");
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
        if(!moment(deliveryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum dostave za outbound delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween({deliveryDateStart, deliveryDateEnd}){
    try{
        if(
            !moment(deliveryDateStart,"YYYY-MM-DD",true).isValid() ||
            !moment(deliveryDateEnd,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati opseg datuma dostave za outbound-delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli opseg datuma dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Buyer_Id(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ID kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Buyer_CompanyNameContainingIgnoreCase(buyerCompanyName){
    try{
        if(!buyerCompanyName || typeof buyerCompanyName !== "string" || buyerCompanyName.trim() === ""){
            throw new Error("Dati naziv kompanije kupca za outbound-delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv kompanije kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj telefona kupca za outbound-delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli broj telefona kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email kupca za outbound-delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli email kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_Address(buyerAddrres){
    try{
        if(!buyerAddrres || typeof buyerAddrres !== "string" || buyerAddrres.trim() === ""){
            throw new Error("Data adresa kupca za outbound-delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli adresu kupca za outbound-delivey");
    }
}

export async function findByOutboundDelivery_Buyer_PibLikeIgnoreCase(buyerPib){
    try{
        if(!buyerPib || typeof buyerPib !== "string" || buyerPib.trim() === ""){
            throw new Error("Dati pib kupca za outbound-delivery nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli pib kupca za outbound-delivey");
    }
}

export async function findDeliveryItemsByTransportOrderId(transportOrderId){
    try{
        if(transportOrderId == null || isNaN(transportOrderId)){
            throw new Error("Dati transport-order ID nije pronadjen");
        }
        const response = await api.get(url+`/search/delivery-items/${transportOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve stavke dostave za transport-order ID");
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
        if(
            !moment(deliveryAfter,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati datum dostave posle, za outbound-delivery, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum dostave posle za outbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBefore(deliveryBefore){
    try{
        if(
            !moment(deliveryBefore,"YYYY-MM-DD",true).isValid()
        ){
            throw new Error("Dati datum dostave pre, za outbound-delivery, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum dostave pre za outbound-delivery");
    }
}

export async function findByVehicle_RegistrationNumber(registrationNumber){
    try{
        if(!registrationNumber || typeof registrationNumber !== "string" || registrationNumber.trim() === ""){
            throw new Error("Dati registracioni broj za vozilo, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli registracioni broj za odredjeno vozilo");
    }
}

export async function existsByVehice_RegistrationNumber(registrationNumber){
    try{
        if(!registrationNumber || typeof registrationNumber !== "string" || registrationNumber.trim() === ""){
            throw new Error("Dati registracioni broj za vozilo, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli postojanje registracionog broja za odredjeno vozilo");
    }
}

export async function findByStatus_AndVehicle_Status({transportStatus, vehicleStatus}){
    try{
        if(!t_status.includes(transportStatus?.toUpperCase()) || v_status.includes(vehicleStatus?.toUpperCase())){
            throw new Error("Dati status za transport i vozilo nije pronadjeno");
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
        handleApiError(error,"Trenutno nismo pronasli statuse za transport i vozilo");
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
            throw new Error("Dati ID za vozilo kao i lista statusa za TransportStatus, nisu pronadjeni");
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
        if(!moment(scheduledDateAfter,"YYYY-MM-DD",true).isValid()){
            throw new Error("Redosled datuma posle za transport-order, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli redosled datuma posle, za transport-order");
    }
}

export async function findByScheduledDateBefore(scheduledDateBefore){
    try{
        if(!moment(scheduledDateBefore,"YYYY-MM-DD",true).isValid()){
            throw new Error("Redosled datuma pre za transport-order, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli redosled datuma pre, za transport-order");
    }
}