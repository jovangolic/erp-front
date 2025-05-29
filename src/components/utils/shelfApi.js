import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createShelf(rowCount, cols, storageId, goods){
    try{
        const requestBody={rowCount, cols, storageId,goods};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/shelves/create/new-shelf`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja polica: " + error.message);
        }
    }
}

export async function updateShelf(id, rowCount, cols, storageId, goods){
    try{
        const requestBody = {rowCount, cols, storageId,goods};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/shelves/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranju polica: " + error.message);
        }
    }
}

export async function deleteShelf(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/shelves/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function existsByRowCountAndStorageId(storageId, rowCount){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom proveravanja postojanja reda i storageId");
    }
}

export async function existsByColsAndStorageId(storageId, cols){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/cols/${cols}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom proveravanja postojanja kolone i storageId");
    }
}

export async function existsByRowCountAndColumnAndStorageId(storageId, rowCount, cols){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}/cols/${cols}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom proveravanja postojanjareda, kolone i storageId");
    }
}

export async function findByStorageId(storageId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po storageId");
    }
}   

export async function findByRowCountAndStorageId(storageId, rowCount){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po redu i storageId");
    }
}

export async function findByColumnAndStorageId(storageId, cols){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/cols/${cols}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po koloni i storageId");
    }
}

export async function findByRowCountAndColsAndStorageId(storageId, rowCount, cols){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/storage/${storageId}/rowCount/${rowCount}/cols/${cols}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po redu, koloni i storageId");
    }
}

export async function getShelfWithGoods(ishelfI){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shelves/${shelfId}/with-goods`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska, polica je prazna");
    }
}

export const getShelvesByStorageId = async (storageId) => {
  const response = await api.get(`/shelves/by-storage/${storageId}`);
  return response.data;
};

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}