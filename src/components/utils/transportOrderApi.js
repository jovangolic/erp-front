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

export async function create(scheduledDate,vehicleId,driversId,status,outboundDeliveryId){
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

export async function update(id,scheduledDate,vehicleId,driversId,status,outboundDeliveryId){
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
        if(t_status.includes(status?.toUpperCase())){
            throw new Error("Dati status za outboundDelivery nije pronadjen ili ne postoji");
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

export async function findByScheduledDateBetween(from, to){
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