import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/routes`;

export async function create(origin,destination,distanceKm){
    if (!origin || !destination || distanceKm == null || distanceKm <= 0) {
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

export async function update(id, origin,destination,distanceKm){
    try{
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
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jedne rute");
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
        const response = await api.get(url+`/origin`,{
            params:{
                origin:origin
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po poreklu");
    }
}

export async function findByDestination(destination){
    try{
        const response = await api.get(url+`/destination`,{
            params:{
                destination:destination
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po destinaciji");
    }
}

export async function findByOriginAndDestination(origin, destination){
    try{
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
        handleApiError(error,"Greska priliko pretrage po poreklu i destinaciji");
    }
}

export async function findByDistanceKmGreaterThan(distance) {
    try{
        const response = await api.get(url+`/distance-greater`,{
            params:{
                distance:distance
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Gredska prilikom pretrage prema distanci vecoj od");
    }
}

export async function findByDistanceKmLessThan(distance){
    try{
        const response = await api.get(url+`/distance-less`,{
            params:{
                distance:distance
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage prema distanci manjoj od");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}