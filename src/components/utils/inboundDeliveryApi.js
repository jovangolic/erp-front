import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/inboundDeliveries`;

const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const validateStatus = ["PENDING","IN_TRANSIT","DELIVERED","CANCELLED"];
const isInboundDeliveryStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export function isValidInboundDelivery({
  deliveryDate,
  supplyId,
  status,
  itemRequest
}) {
  // Osnovne provere
  if (
    (!moment(deliveryDate, "YYYY-MM-DD", true).isValid() &&
    !moment(deliveryDate).isValid()) || 
    !supplyId ||
    !status ||
    !validDeliveryStatus.includes(status?.toUpperCase()) ||
    !Array.isArray(itemRequest) ||
    itemRequest.length === 0
  ) {
    return false;
  }

  // Validacija svake stavke u itemRequest
  for (const item of itemRequest) {
    if (
      !item.productId ||
      item.quantity == null || item.quantity <= 0 ||
      !item.inboundDeliveryId
    ) {
      return false;
    }
  }

  return true;
}

export async function create(date){
    try{
        if(!isValidInboundDelivery(...date, validateStatus)){
            throw new Error("Sva polja moraju biti popunjena i validna.");    
        }
        const response = await api.post(url+`/create/new-inboundDelivery`,date,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update({id, date}){
    try{
        if(id == null || isNaN(id) ||!isValidInboundDelivery(...date, validateStatus)){
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

export async function deleteInboundDelivery(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za inboundDelivery nije pronadjen");
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
            throw new Error("Dati ID "+id+" za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog inboundDelivery-ja po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom dobavljanja svih inboundDelivery-ja");
    }
}

export async function findByStatus(status){
    try{
        if(!validDeliveryStatus.includes(status?.toUpperCase())){
            return false;
        }
        const response = await api.get(url+`/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu "+status);
    }
}

export async function findByDeliveryDateBetween({from, to}) {
  try {
    const isFromValid = moment(from, "YYYY-MM-DD", true).isValid();
    const isToValid = moment(to, "YYYY-MM-DD", true).isValid();

    if (!isFromValid || !isToValid) {
      return false;
    }

    const response = await api.get(url + `/date-range`, {
      params: {
        from: moment(from).format("YYYY-MM-DD"),
        to: moment(to).format("YYYY-MM-DD")
      },
      headers: getHeader()
    });

    return response.data;
  } catch (error) {
    handleApiError(error, "Greska prilikom trazenja prema dostavi datuma opsega "+from+" - "+to);
  }
}

export async function findBySupplyId(supplyId){
    try{
        if(supplyId == null || isNaN(supplyId)){
            throw new Error("ID "+supplyId+" prenosa mora biti prosledjen");
        }
        const response = await api.get(url+`/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po "+supplyId+" supplyId-ju");
    }
}

export async function createAll(inboundDeliveryList) {
    try {
        // Validacija može da se doda po potrebi
        if (!Array.isArray(inboundDeliveryList) || inboundDeliveryList.length === 0) {
            throw new Error("Lista unosa ne sme biti prazna.");
        }

        const response = await api.post(url + `/bulk`, inboundDeliveryList, {
        headers: getHeader(),
        });

        return response.data; // Lista InboundDeliveryResponse objekata
    } catch (error) {
        handleApiError(error, "Greška prilikom kreiranja više dostava");
    }
}

export async function deleteAllByIds(ids) {
    try {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("Lista ID-jeva za brisanje je prazna.");
        }
        const response = await api.delete(url + `/bulk`, {
        data: ids, // Ovde se koristi 'data' jer axios ne podržava body direktno u DELETE kao treći parametar
        headers: getHeader(),
        });
        return response.status === 204;
    } 
    catch (error) {
        handleApiError(error, "Greška prilikom brisanja više unosa");
    }
}

export async function findBySupply_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista dobavljaca, nije pronadjen");
        }
        const response = await api.get(url+`/supply/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista za dobavljaca");
    }
}

export async function findBySupply_Storage_NameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" skladista dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-name`,{
            params:{
                storageName:storageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_Storage_LocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" skladista dobavljaca za inbound-delivery, nije pronadjena");
        }
        const response = await api.get(url+`/search/supply/storage-location`,{
            params:{
                storageLocation:storageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageCapacity(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(isNaN(parseStorageCapacity) || parseStorageCapacity <= 0){
            throw new Error("Dati kapacitet "+parseStorageCapacity+" stkladista dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-capacity`,{
            params:{
                storageCapacity:parseStorageCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+storageCapacity+" skladista dobavljaca, za inbound-delivery");
    }
}

export async function findBySupply_StorageCapacityGreaterThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(isNaN(parseStorageCapacity) || parseStorageCapacity <= 0){
            throw new Error("Dati kapacitet skaldista dobavljaca veci od "+parseStorageCapacity+" za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-capacity-greater-than`,{
            params:{
                storageCapacity:parseStorageCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista dobavljaca veceg od "+storageCapacity+" za inbound-delivery");
    }
}

export async function findBySupply_StorageCapacityLessThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(isNaN(parseStorageCapacity) || parseStorageCapacity <= 0){
            throw new Error("Dati kapacitet skaldista dobavljaca manji od "+parseStorageCapacity+" za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-capacity-less-than`,{
            params:{
                storageCapacity:parseStorageCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista dobavljaca manjeg od "+storageCapacity+" za inbound-delivery");
    }
}

export async function findBySupply_StorageType(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista dobavljaca, za inbound-delivery");
    }
}

export async function findBySupply_StorageStatus(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" skladista dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageNameContainingIgnoreCaseAndType({storageName, type}){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase()) || !storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" i tip "+type+" skladista dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-name-and-type`,{
            params:{
                storageName:storageName,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" i tip "+type+" skaldista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageNameContainingIgnoreCaseAndStatus({storageName, status}){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase()) || !storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" i status "+status+" skladista dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply/storage-name-and-status`,{
            params:{
                storageName:storageName,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" i status "+status+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageLocationContainingIgnoreCaseAndType({storageLocation, type}){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase()) || !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" i tip "+type+" skladista dibavljaca za inbound-de;ivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-location-type`,{
            params:{
                storageLocation:storageLocation,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" i tip "+type+" skladista dobavljaca, za inbound-delivery");
    }
}

export async function findBySupply_StorageLocationContainingIgnoreCaseAndStatus({storagLocation, status}){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase()) || !storagLocation || typeof storagLocation !== "string" || storagLocation.trim() === ""){
            throw new Error("Data lokacija "+storagLocation+" i status "+status+" skladista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-location-status`,{
            params:{
                storagLocation:storagLocation,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storagLocation+" i status "+status+" skaldista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageNameContainingIgnoreCaseAndCapacity({storageName, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" i kapacitet "+parseCapacity+" skladista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-name-capacity"`,{
            params:{
                storageName:storageName,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" i kapacitet "+capacity+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageNameContainingIgnoreCaseAndCapacityGreaterThan({storageName, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" i kapacitet veci od "+parseCapacity+" skladista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-name-capacity-greater-than`,{
            params:{
                storageName:storageName,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" i kapacitet veci od "+capacity+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageNameContainingIgnoreCaseAndCapacityLessThan({storageName, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" i kapacitet manji od "+parseCapacity+" skladista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-name-capacity-less-than`,{
            params:{
                storageName:storageName,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" i kapacitet manji od "+capacity+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageNameContainingIgnoreCaseAndLocationContainingIgnoreCase({storageName, storageLocation}){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === "" ||
            !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
                throw new Error("Dati naziv "+storageName+" i lokacija "+storageLocation+" skadista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-name-and-location`,{
            params:{
                storageName:storageName,
                storageLocation:storageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" i lokaciju "+storageLocation+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageLocationContainingIgnoreCaseAndCapacity({storageLocation, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" i kapacitet "+parseCapacity+" skladista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-location-capacity`,{
            params:{
                storageLocation:storageLocation,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pornasli lokaciju "+storageLocation+" i kapacitet "+capacity+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageLocationContainingIgnoreCaseAndCapacityGreaterThan({storageLocation, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" i kapacitet veci od "+parseCapacity+" skaldista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-location-capacity-greater-than`,{
            params:{
                storageLocation:storageLocation,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" i kapacitet veci od "+capacity+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_StorageLocationContainingIgnoreCaseAndCapacityLessThan({storageLocation, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" i kapacitet manji od "+parseCapacity+" skaldista dobavljaca za inbound-delivery, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supply/storage-location-capacity-less-than`,{
            params:{
                storageLocation:storageLocation,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" i kapacitet manji od "+capacity+" skladista dobavljaca za inbound-delivery");
    }
}

export async function findByStorageWithoutShelvesOrUnknown(){
    try{
        const response = await api.get(url+`/search/supply/storage-without-shelves"`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste dobavljaca bez polica za inbound-delivery");
    }
}

export async function findBySupply_Quantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+" dobavljaca za inbound-delivery, nije pronadjena");
        } 
        const response = await api.get(url+`/search/supply-quantity`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+quantity+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_QuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseQuantity+" dobavljaca za inbound-delivery, nije pronadjena");
        } 
        const response = await api.get(url+`/search/supply-quantity-greater-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od "+quantity+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_QuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseQuantity+" dobavljaca za inbound-delivery, nije pronadjena");
        } 
        const response = await api.get(url+`/search/supply-quantity-less-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od "+quantity+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_QuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(nax);
        if(isNaN(parseMin) || parseMax <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg kolicine "+parseMin+" - "+parseMax+" dobavljaca za inbound-delivery, nije pronadjena");
        }
        const response = await api.get(url+`/search/supply-quantity-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kolicine "+min+" - "+max+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_Updates(updates){
    try{
        if(!moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum "+updates+" dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply-updates`,{
            params:{
                updates:moment(updates).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+updates+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_UpdatesAfter(updates){
    try{
        if(!moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum posle "+updates+" dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply-updates-after`,{
            params:{
                updates:moment(updates).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+updates+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_UpdatesBefore(updates){
    try{
        if(!moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum pre "+updates+" dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply-updates-before`,{
            params:{
                updates:moment(updates).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+updates+" dobavljaca za inbound-delivery");
    }
}

export async function findBySupply_UpdatesBetween({updatesFrom, updatesTo}){
    try{    
        if(!moment(updatesFrom,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(updatesTo,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum opsega "+updatesFrom+" - "+updatesTo+" dobavljaca za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/search/supply-updates-between`,{
            params : {
                updatesFrom:moment(updatesFrom).format("YYYY-MM-DDTHH:mm:ss"),
                updatesTo:moment(updatesTo).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum opsega "+updatesFrom+" - "+updatesTo+" dobavljaca za inbound-delivery");
    }
}

export async function trackInboundDelivery(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" nadolazece-dostave za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" nadolazece-dostave za pracenje");
    }
}

export async function confirmInboundDelivery(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu nadolazece-dostave, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu nadolazece-dostave");
    }
}

export async function cancelInboundDelivery(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje nadolazece-dostave, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje nadolazece-dostave");
    }
}

export async function closeInboundDelivery(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje nadolazece-dostave, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje nadolazece-dostave");
    }                  
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isInboundDeliveryStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status nadolazece-dostave "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status nadolazece-dostave "+status);
    }
}

export async function saveInboundDelivery({deliveryDate,supplyId,status,itemRequest}){
    try{
        //Validacija datuma
        const validDate = moment.isMoment(deliveryDate) || moment(deliveryDate, "YYYY-MM-DD", true).isValid();
        if (!validDate) throw new Error("Datum isporuke nije ispravan");
        //Validacija ID-a dobavljaca
        if (supplyId === null || supplyId === undefined || Number.isNaN(Number(supplyId))) {
            throw new Error("Neispravan ID dobavljača");
        }
        //Validacija statusa
        if (!status || !validateStatus.includes(status.toUpperCase())) {
            throw new Error("Neispravan status isporuke");
        }
        //Validacija stavki
        if (!Array.isArray(itemRequest) || itemRequest.length === 0) {
            throw new Error("Lista stavki ne sme biti prazna");
        }
        for (const item of itemRequest) {
            if (!item.productId || item.quantity == null || item.quantity <= 0) {
                throw new Error("Neispravna stavka u listi itemRequest");
            }
        }
        const requestBody = {deliveryDate,supplyId,status,itemRequest};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,supplyId,status,inboundStatus,confirmed = false}){
    try{
        if(sourceId === undefined || sourceId == null || Number.isNaN(Number(sourceId))){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(supplyId === undefined || supplyId == null || Number.isNaN(Number(supplyId))){
            throw new Error("Supply-Id "+supplyId+" mora biti ceo broj");
        }
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Neispravan status isporuke");
        }
        if(!isInboundDeliveryStatusValid.includes(inboundStatus?.toUpperCase())){
            throw new Error("Neispravan inbound-status isporuke");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrdu "+confirmed+" treba izabrata");
        }
        const requestBody = {supplyId,status,inboundStatus,confirmed};
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if (!Array.isArray(requests) || requests.length === 0) {
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
            }
            for (let i = 0; i < requests.length; i++) {
            const req = requests[i];
            if (req.id == null || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'id' je obavezan i mora biti broj`);
            }
            if (req.supplyId == null || Number.isNaN(Number(req.supplyId))) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'supplyId' je obavezan i mora biti broj`);
            }
            if (!req.status || !validateStatus.includes(req.status.toUpperCase())) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'status' nije ispravan`);
            }
            const validDate =
                moment.isMoment(req.deliveryDate) ||
                moment(req.deliveryDate, "YYYY-MM-DD", true).isValid();
            if (!validDate) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: 'deliveryDate' mora biti validan datum`);
            }
            if (!Array.isArray(req.itemRequest) || req.itemRequest.length === 0) {
                throw new Error(`Nevalidan zahtev na indeksu ${i}: lista 'itemRequest' ne sme biti prazna`);
            }
            for (const item of req.itemRequest) {
                if (!item.productId || item.quantity == null || item.quantity <= 0) {
                throw new Error(`Neispravna stavka u itemRequest za zahtev ${i}`);
                }
            }
        }
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"greska prilikom sveobuvatnog memorisanja/save-all");
    }
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
}

export async function generalSearch(filters = {}){
    try{
        const cleanedFilters = cleanFilters(filters);
        const response = await api.post(url+`/general-search`,cleanedFilters,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom generalne pretrage");
    }
}