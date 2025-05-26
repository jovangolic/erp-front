import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createStorage(name,location,capacity, storageType){
    try{
        const requestBody = {
            name:name, location:location, capacity:parseFloat(capacity),
            type: storageType // Mora biti "PRODUCTION" ili "DISTRIBUTION"
        };
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/storages/create/new-storage`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function updateStorage(storageId, name,location, capacity, storageType){
    try{
        const requestBody = {
            id:storageId, name:name, location:location, capacity:parseFloat(capacity),
            type: storageType.toUpperCase()};
        
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja skladista");
    }
}

export async function getByStorageType(storageType){
    try{
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

export async function getStorageByNameAndLocation(name, location){
    try{
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

export async function getByTypeAndCapacityGreaterThan(type, capacity){
    try{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-minCount`,{
            params:{
                minCost: parseFloat(minCost)
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/ignore-case`,{
            params:{
                name: name
            },
            headers:getHeader()       
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška nazin nije dobro napisan");
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