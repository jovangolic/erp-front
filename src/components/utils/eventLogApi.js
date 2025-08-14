import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/eventLogs`;

export async function createEventLog({timestamp,description,shipmentId}){
    try{
        if(!moment(timestamp,"YYYY-MM-DDTHH:mm:ss",true).isValid() || 
            !description || typeof description !== "string" || description.trim() === "" || 
            isNaN(shipmentId) || shipmentId == null){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {timestamp,description,shipmentId};
        const response = await api.post(url+`/create-event-log`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateEventLog({id,timestamp,description,shipmentId}){
    try{
        if( isNaN(id) || id == null ||
            !moment(timestamp,"YYYY-MM-DDTHH:mm:ss",true).isValid() || 
            !description || typeof description !== "string" || description.trim() === "" || 
            isNaN(shipmentId) || shipmentId == null){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {timestamp,description,shipmentId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteEventLog(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za event-log, nije pronadjen");
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

export async function getEventsForShipment(shipmentId){
    try{
        if(isNaN(shipmentId) || shipmentId == null){
            throw new Error("Dati id "+shipmentId+"za dostavu, nije pronadjen");
        }
        const response = await api.get(url+`/shipment/${shipmentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli event-log po "+shipmentId+" id-iju za dostavu");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za event-log, nije pronadjen");
        }
        const response = await api.delete(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog event-log-a po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom pronalazenja svih event-log-ova");
    }
}

export async function findByShipmentId(shipmentId){
    try{
        if(isNaN(shipmentId) || shipmentId == null){
            throw new Error("Dati id "+shipmentId+" za dostavu nije pronadjen");
        }
        const response = await api.get(url+`/find-by-shipment/${shipmentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu dostavu po njenom "+shipmentId+" id-iju");
    }
}

export async function findLatestForShipment(shipmentId){
    try{    
        if(isNaN(shipmentId) || shipmentId == null){
            throw new Error("Dati id "+shipmentId+" za dostavu nije pronadjen");
        }
        const response = await api.get(url+`/search/latest-shipment/${shipmentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli poslednje dostave po "+shipmentId+" id-iju");
    }
}

export async function findByTimestampAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum posle "+date+" za event-log, nije pronadjen");
        }
        const response = await api.get(url+`/timestamp-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli event-log po datumu posle "+date);
    }
}

export async function findByTimestampBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datuma "+start+" - "+end+" za event-log nije pronadjen");
        }
        const response = await api.get(url+`/timestamp-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli event-log po opsegu "+start+" - "+end+" datuma");
    }
}

export async function findByDescriptionContaining(text){
    try{
        if(!text || typeof text !== "string" || text.trim() === ""){
            throw new Error("Dati opis "+text+" za event-log, nije pronadjen");
        }
        const response = await api.get(url+`/description`,{
            params:{
                text:text
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli event-log po opisu "+ text);
    }
}

export async function findByShipmentIdAndTimestampBetween({shipmentId, from, to}){
    try{
        if(isNaN(shipmentId) || shipmentId == null ||
            !moment(from,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(to,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati id "+shipmentId+" za dostavu i datumski opseg "+from+" - "+to+" za event-log, nije pronadjen");
        }
        const response = await api.get(url+`/search/${shipmentId}/timestamp-between`,{
            params:{
                from:moment(from).format("YYYY-MM-DDTHH:mm:ss"),
                to:moment(to).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli event-log po id "+shipmentId+" dostave i datumskom opsegu "+from+" - "+to+"");
    }
}

export async function findTopByShipmentIdOrderByTimestampDesc(shipmentId){
    try{
        if(isNaN(shipmentId) || shipmentId == null){
            throw new Error("Dati id "+shipmentId+" za dostavu, nije pronadjen");
        }
        const response = await api.get(url+`/search/shipment-order-by-timestamp-desc/${shipmentId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli event-log po id "+shipmentId+" dostave, po opadajucem poretku za vreme");
    }
}