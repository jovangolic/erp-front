import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const validateStorageType = ["PRODUCTION","DISTRIBUTION"];

export async function createStorage({name, location, capacity, shelves, type, goods}) {
    try {
        if(!name || typeof name !=="string" || name.trim()==="" || !location || typeof location !=="string" || location.trim()===""
            ||isNaN(capacity) || capacity <= 0 || !Array.isArray(shelves) || shelves.length === 0 ||
            !validateStorageType.includes(type?.toUpperCase())){
        throw new Error("Sva polja moraju biti popunjena");
    }
        const requestBody = {
            name,
            location,
            capacity: parseFloat(capacity),
            shelves,
            goods, // dodato!
            type: type.toUpperCase()
        };

        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/storages/create/new-storage`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function updateStorage({storageId, name,location, capacity, type, goods,shelves}){
    try{
        if(!id || !name || typeof name !=="string" || name.trim()==="" || !location || typeof location !=="string" || location.trim()===""
            ||isNaN(capacity) || capacity <= 0 || !Array.isArray(shelves) || shelves.length === 0 ||
            !validateStorageType.includes(type?.toUpperCase())){
        throw new Error("Sva polja moraju biti popunjena");
    }
        const requestBody = {
            name,
            location,
            capacity: parseFloat(capacity),
            shelves,
            goods, // dodato!
            type: type.toUpperCase()
        };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/storages/update/${storageId}`,requestBody,
            {
                headers:getHeader()
            }
        );
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greska prilikom azuriranja skladista: ${error.message}`);
        }
    }
}

export async function deleteStorage(storageId){
    try{
        if(!storageId){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/storages/delete/${storageId}`,{
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function getByStorageId(storageId){
    try{
        if(!storageId){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja skladista");
    }
}

export async function getByStorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista ne postoji");
        }
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/storages/get-by-storage-type`,
            {
                params: {
                    storageType: storageType  // ✅ ključ se mora poklapati sa @RequestParam
                },
                headers: getHeader() // ako ruta zahteva autorizaciju
            }
        );
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greška prilikom traženja po tipu");
    }
}

export async function getByStorageName(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Dati naziv skladista ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po nazivu");
    }
}

export async function getByStorageLocation(location){
    try{
        if(!location || typeof location!=="string" || location.trim()===""){
            throw new Error("Lokacija skladista ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po lokaciji");
    }
}

export async function getByStorageCapacity(capacity){
    try{
        if(isNaN(capacity) || parseFloat(capacity) <= 0){
            throw new Error("Capacity ne sme biti negativan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-capacity`,{
            params:{
                capacity: parseFloat(capacity)
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greška prilikom traženja po kapacitetu");
    }
}

export async function getStorageByNameAndLocation({name, location}){
    try{
        if(!location || typeof location!=="string" || location.trim()==="" ||
           !name || typeof name!=="string" || name.trim()==="" ){
            throw new Error("Lokacija i naziv skladista ne postoje");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-name-and-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po nazizu i lokaciji");
    }
}

export async function getByTypeAndCapacityGreaterThan({type, capacity}){
    try{
        if(isNaN(capacity) || parseFloat(capacity) <= 0 || validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Tip skladista ne postoji i kapacitet mora biti pozitivan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-type-and-capacity`,{
            params:{
                type:type,
                capacity: parseFloat(capacity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po tipu i kapacitetu >=");
    }
}

export async function getStoragesWithMinGoods(minCount){
    try{
        if(isNaN(minCount) || parseInt(minCount) < 0){
            throw new Error("Skladiste mora da ima minimalnu kolicinu robe");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-minCount`,{
            params:{
                minCount: parseInt(minCount)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po minimalnoj robi");
    }
}

export async function getByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Ne postojeci naziv");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/ignore-case`,{
            params:{
                name: name
            },
            headers:getHeader()       
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška naziv nije dobro napisan");
    }
}

export async function getAllStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/get-all-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavjanja svih skladista");
    }
}


if (typeof data === 'object') {
  const messages = Object.entries(data)
    .map(([field, msg]) => `${field}: ${msg}`)
    .join(', ');
  setMessage(messages);
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}