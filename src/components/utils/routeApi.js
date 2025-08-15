import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/routes`;

export async function createRoute({origin,destination,distanceKm}){
    if(
        !origin || typeof origin !== "string" || origin.trim()==="" ||
        !destination || typeof destination !== "string" || destination.trim() === "" ||
        isNaN(distanceKm) || parseFloat(distanceKm) <= 0
    ){
        throw new Error("Sva polja moraju biti ispravno popunjena.");
    }
    try{
        const requestBody = {origin,destination, distanceKm};
        const response = await api.post(url+`/create/new-route`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja rute");
    }
}

export async function updateRoute({id, origin,destination,distanceKm}){
    try{
        if(
        id == null || isNaN(id) ||
        !origin || typeof origin !== "string" || origin.trim()==="" ||
        !destination || typeof destination !== "string" || destination.trim() === "" ||
        isNaN(distanceKm) || parseFloat(distanceKm) <= 0
    ){
        throw new Error("Sva polja moraju biti ispravno popunjena.");
    }
        const requestBody = {origin,destination, distanceKm};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja rute");
    }
}

export async function deleteRoute(id){
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
        handleApiError(error, "Greska prilikom brisanja");
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
        handleApiError(error, "Greska prilikom trazenja jedne rute po "+id+" id-iju");
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
        handleApiError(error, "Greska prilikom dobavljanja svih ruta");
    }
}

export async function findByOrigin(origin){
    try{
        if(!origin || typeof origin !== "string" || origin.trim()===""){
            throw new Error("Dati origin "+origin+" nije pronadjen");
        }
        const response = await api.get(url+`/origin`,{
            params:{
                origin:origin
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po poreklu "+origin);
    }
}

export async function findByDestination(destination){
    try{
        if(!destination || typeof destination !== "string" || destination.trim()===""){
            throw new Error("Data destinacija "+destination+" nije pronadjena");
        }
        const response = await api.get(url+`/destination`,{
            params:{
                destination:destination
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po destinaciji "+destination);
    }
}

export async function findByOriginAndDestination({origin, destination}){
    try{
        if(!origin || typeof origin !== "string" || origin.trim()==="" ||
        !destination || typeof destination !== "string" || destination.trim() === ""){
            throw new Error("Origin "+origin+" i destinacija "+destination+" nisu pronadjeni");
        }
        const response = await api.get(url+`/origin-destination`,{
            params:{
                origin:origin,
                destination:destination
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko pretrage po poreklu "+origin+" i destinaciji "+destination);
    }
}

export async function findByDistanceKmGreaterThan(distance) {
    try{
        if(isNaN(distance) || parseFloat(distance) <= 0){
            throw new Error("Distanca veca od "+distance+" nije proinadjena");
        }
        const response = await api.get(url+`/distance-greater`,{
            params:{
                distance:distance
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Gredska prilikom pretrage prema distanci vecoj od "+distance);
    }
}

export async function findByDistanceKmLessThan(distance){
    try{
        if(isNaN(distance) || parseFloat(distance) < 0){
            throw new Error("Distanca manja od "+distance+" nije pronadjena");
        }
        const response = await api.get(url+`/distance-less`,{
            params:{
                distance:distance
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage prema distanci manjoj od "+distance);
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}