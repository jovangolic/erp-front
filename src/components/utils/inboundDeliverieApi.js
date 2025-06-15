import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/inboundDeliveries`;

const validateStatus = ["PENDING","IN_TRANSIT","DELIVERED","CANCELLED"];

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
    !validDeliveryStatus.includes(status.toUpperCase()) ||
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

export async function update(id, date){
    try{
        if(!isValidInboundDelivery(...date, validateStatus)){
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
        handleApiError(error,"Greska prilikom trtazenja jednog inboundDelivery-ja");
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
        if(!validDeliveryStatus.includes(status.toUpperCase())){
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
        handleApiError(error,"Greska prilikom trqazenja po statusu");
    }
}

export async function findByDeliveryDateBetween(from, to) {
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
    handleApiError(error, "Greska prilikom trazenja prema dostavi datuma opsega");
  }
}

export async function findBySupplyId(supplyId){
    try{
        if(!supplyId){
            throw new Error("ID prenosa mora biti prosledjen");
        }
        const response = await api.get(url+`/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po supplyId-ju");
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