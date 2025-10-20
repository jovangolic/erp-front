import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/vehicle-locations`;

export async function createVehicleLocation({vehicleId,latitude,longitude}){
    try{
        const parseLatitude = parseFloat(latitude);
        const parseLongitude = parseFloat(longitude);
        if(
            Number.isNaN(Number(vehicleId)) || vehicleId == null || 
            Number.isNaN(Number(parseLatitude)) || parseLatitude <= 0 || Number.isNaN(Number(parseLongitude)) || parseLongitude <= 0){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {vehicleId,latitude,longitude};
        const response = await api.post(url+`/create/new-vehicle-location`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja lokacije-vozila");
    }
}

export async function updateVehicleLocation({id, vehicleId,latitude,longitude}){
    try{
        if(
            Number.isNaN(Number(id)) || id == null ||
            Number.isNaN(Number(vehicleId)) || vehicleId == null || 
            Number.isNaN(Number(parseLatitude)) || parseLatitude <= 0 || Number.isNaN(Number(parseLongitude)) || parseLongitude <= 0){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {vehicleId,latitude,longitude};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja lokacije-vozila");
    }
}

export async function deleteVehicleLocation(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati id "+id+" za lokaciju-vozila, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom brisanja jedne lokacije-vozila po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati id "+id+" za lokaciju-vozila, nije pronadjen");
        }
        const response = await api.get(irl+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jedne lokacije-vozila po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih lokacija-vozila");
    }
}

export async function findLocationsByTimeRange({from, to}){
    try{
        const validateStart = moment.isMoment(from) || moment(from,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(to) || moment(to,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Vremenski opseg "+validateStart+" - "+validateEnd+" lokacije-vozila, nije pronadjen");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/by-time`,{
            params:{
                from : moment(validateStart).format("YYYY-MM-DDTHH:mm:ss"),
                to : moment(validateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vremenski opseg "+from+" - "+to+" lokacije-vozila");
    }
}

export async function findVehiclesByLocationTimeRange({from, to}){
    try{
        const validateStart = moment.isMoment(from) || moment(from,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(to) || moment(to,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Vremenski opseg "+validateStart+" - "+validateEnd+" datih vozila, nije pronadjen");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/vehicles-by-time`,{
            params:{
                from : moment(validateStart).format("YYYY-MM-DDTHH:mm:ss"),
                to : moment(validateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vozila za dati vremenski opseg "+from+" - "+to);
    }
}

export async function findLocationsByRequest({id, vehicleId,vehicleIdFrom,vehicleIdTo,latitude,longitude,recordedAtFrom,recordedAtTo}){
    try{
        const parseLatitude = parseFloat(latitude);
        const parseLongitude = parseFloat(longitude);
        const validateStart = moment.isMoment(recordedAtFrom) || moment(recordedAtFrom,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(recordedAtTo) || moment(recordedAtTo,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            Number.isNaN(Number(id)) || id == null || Number.isNaN(Number(vehicleId)) || vehicleId == null || Number.isNaN(Number(vehicleIdFrom)) || vehicleIdFrom == null ||
            Number.isNaN(Number(vehicleIdTo)) || vehicleIdTo == null || Number.isNaN(Number(parseLatitude)) || parseLatitude <= 0 || Number.isNaN(Number(parseLongitude)) || parseLongitude <= 0||
            !validateStart || !validateEnd ){
            throw new Error("Dati parametri ne daju ocekivani rezultat: "+id+"-"+vehicleId+"-"+vehicleIdFrom+"-"+
            vehicleIdTo+"-"+parseLatitude+"-"+parseLongitude+"-"+validateStart+"-"+validateEnd);
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.post(url+`/search`,{
            params:{
                id:id,
                vehicleId:vehicleId,
                vehicleIdFrom:vehicleIdFrom,
                vehicleIdTo:vehicleIdTo,
                latitude:parseLatitude,
                longitude:parseLongitude,
                recordedAtFrom:moment(validateStart).format("YYYY-MM-DDTHH:mm:ss"),
                recordedAtTo:moment(validateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju vozila za dati zahtev: "+id+"-"+vehicleId+"-"+vehicleIdFrom+"-"+
            vehicleIdTo+"-"+latitude+"-"+longitude+"-"+recordedAtFrom+"-"+recordedAtTo
        );
    }
}

export async function generalSearch({id, vehicleId,vehicleIdFrom,vehicleIdTo,latitude,longitude,recordedAtFrom,recordedAtTo}){
    try{
        const parseLatitude = parseFloat(latitude);
        const parseLongitude = parseFloat(longitude);
        const validateStart = moment.isMoment(recordedAtFrom) || moment(recordedAtFrom,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(recordedAtTo) || moment(recordedAtTo,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            Number.isNaN(Number(id)) || id == null || Number.isNaN(Number(vehicleId)) || vehicleId == null || Number.isNaN(Number(vehicleIdFrom)) || vehicleIdFrom == null ||
            Number.isNaN(Number(vehicleIdTo)) || vehicleIdTo == null || Number.isNaN(Number(parseLatitude)) || parseLatitude <= 0 || Number.isNaN(Number(parseLongitude)) || parseLongitude <= 0||
            !validateStart || !validateEnd){
            throw new Error("Dati parametri ne daju ocekivani rezultat: "+id+"-"+vehicleId+"-"+vehicleIdFrom+"-"+
            vehicleIdTo+"-"+parseLatitude+"-"+parseLongitude+"-"+validateStart+"-"+validateEnd);
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.post(url+`/general-search`,{
            params:{
                id:id,
                vehicleId:vehicleId,
                vehicleIdFrom:vehicleIdFrom,
                vehicleIdTo:vehicleIdTo,
                latitude:parseLatitude,
                longitude:parseLongitude,
                recordedAtFrom:moment(validateStart).format("YYYY-MM-DDTHH:mm:ss"),
                recordedAtTo:moment(validateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ocekivani rezultat za unete parametre: "+id+"-"+vehicleId+"-"+vehicleIdFrom+"-"+
            vehicleIdTo+"-"+latitude+"-"+longitude+"-"+recordedAtFrom+"-"+recordedAtTo);
    }
}

export async function saveVehicleLocation({vehicleId,latitude,longitude}){
    try{
        const parseLatitude = parseFloat(latitude);
        const parseLongitude = parseFloat(longitude);
        if(Number.isNaN(Number(vehicleId)) || vehicleId == null || Number.isNaN(Number(parseLatitude)) || parseLatitude <= 0 || Number.isNaN(Number(parseLongitude)) || parseLongitude <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {vehicleId,latitude,longitude};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,vehicleId,latitude,longitude}){
    try{
        if(Number.isNaN(Number(sourceId)) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        const parseLatitude = parseFloat(latitude);
        const parseLongitude = parseFloat(longitude);
        if(Number.isNaN(Number(parseLatitude)) || parseLatitude <= 0 || Number.isNaN(Number(parseLongitude)) || parseLongitude <= 0 || Number.isNaN(Number(vehicleId)) || vehicleId == null){
            throw new Error("Longitude "+parseLongitude+", latitude "+parseLatitude+" id vozila "+vehicleId+" moraju biti celi brojevi");
        }
        const requestBody = {vehicleId,latitude,longitude};
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
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        for(let i = 0; i < requests.length; i++){
            const req = requests[i];
            const lat = parseFloat(req.latitude);
            const lon = parseFloat(req.longitude);
            if (req.id == null || isNaN(req.id)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if (req.vehicleId == null || Number.isNaN(Number(req.vehicleId))) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'vehicleId' je obavezan i mora biti broj`);
            }
            if (Number.isNaN(Number(lat)) || lat < -90 || lat > 90) {
                throw new Error(`Nevalidna latitude vrednost na indexu ${index}: mora biti broj izmedju -90 i 90`);
            }
            if (Number.isNaN(Number(lon)) || lon < -180 || lon > 180) {
                throw new Error(`Nevalidna longitude vrednost na indexu ${index}: mora biti broj izmedju -180 i 180`);
            }
        }
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
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