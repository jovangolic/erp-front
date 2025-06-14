import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/logistics-providers`;

export async function create(name, contactPhone, eamil,website){
    try{
        const requestBody = {name, contactPhone, eamil, website};
        const response = await api.post(url+`/create/new/logistics-provider`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update(id, name, contactPhone, eamil,website){
    try{
        const requestBody = {name, contactPhone, eamil, website};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteLogistric(id){
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
        handleApiError(error, "Greska prilikom dobavljanja jednog");
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
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function findyName(name){
    try{
        const response = await api.get(url+`/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po nazivu");
    }
}

export async function findByNameContainingIgnoreCase(fragment){
    try{
        const response = await api.get(url+`/by-fragment`,{
            params:{
                fragment:fragment
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Gresksa prilikom trazenja po fragmentu");
    }
}

export async function searchByNameOrWebsite(query){
    try{
        const response = await api.get(url+`/search`,{
            params:{
                query:query
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po upitu");
    }
}

export async function findByContactPhone(contactPhone){
    try{
        const response = await api.get(url+`/by-contactPhone`,{
            params:{
                contactPhone:contactPhone
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po broju telefona");
    }
}

export async function findByEmail(email){
    try{
        const response = await api.get(url+`/by-email`,{
            params:{
                eamil:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska pilikom pretrage po email-u");
    }
}

export async function findByWebsite(){
    try{
        const response = await api.get(url+`/by-website`,{
            params:{
                website:website
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po website-u");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}