import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/drivers`;

export async function createDriver({name, phone}){
    if (
        !name || typeof name !== "string" || name.trim() === "" ||
        !phone || typeof phone !== "string" || phone.trim() === ""
    ) {
        throw new Error("Sva polja moraju biti validna i popunjena");
    }
    try{
        const requestBody = {name, phone};
        const response = await api.post(url+`/create/new-driver`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska priliko kreiranja vozaca");
    }
}

export async function updateDriver({id, name, phone}){
    if (
        id == null || isNaN(id) ||
        !name || typeof name !== "string" || name.trim() === "" ||
        !phone || typeof phone !== "string" || phone.trim() === ""
    ) {
        throw new Error("Sva polja moraju biti validna i popunjena");
    }
    try{
        const requestBody = {name, phone};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteDriver(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID vozaca nije pronadjen");
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

export async function findOneById(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID vozaca nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greksa prilikom dobavljanja jednog vozaca");
    }
}

export async function findAllDrivers(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih vozaca");
    }
}

export async function findByName(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ){
            throw new Error("Dato ime vozaca nije pronadjeno");
        }
        const response = await api.get(url+`/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja vozaca po imenu");
    }
}

export async function findByPhone(phone){
    try{
        if(!phone || typeof phone !== "string" || phone.trim() === ""){
            throw new Error("Dati broj-telefona vozaca nije pronadjen");
        }
        const response = await api.get(url+`/by-phone`,{
            params:{
                phone:phone
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po broju telefona vozaca");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}