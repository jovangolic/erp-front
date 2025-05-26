import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createInventoryItems(inventoryId,productId, quantity, condition){
    try{
        const requestBody = {inventoryId, productId, quantity:parseFloat(quantity),condition:parseInt(condition)};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/create/new-inventory-items`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja stavke-inventara: ${error.message}`);
        }
    }
}

export async function updateInventoryItems(id,inventoryId,productId, quantity, condition ) {
    try{
        const requestBody = {inventoryId, productId, quantity:parseFloat(quantity),condition:parseInt(condition)};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja stavke-inventara: ${error.message}`);
        }
    }
}

export async function deleteInventoryItems(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/delete/${id}`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jedne stavke inventara");
    }
}

export async function findAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja svih stavki inventara");
    }
}

export async function getByQuantity(quantity){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/by-quantity`,{
            params:{
                quantity:parseFloat(quantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po kolicini");
        }
}

export async function getByCondition(itemCondition){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/by-condition`,{
            params:{
                itemCondition:parseInt(itemCondition)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po stanju ");
    }
}

export async function getByInventoryId(inventoryId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/by-inventory/${inventoryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po id inventara");
    }
}

export async function getByProductId(productId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/by-product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po id proizvoda");
    }
}

export async function getByProductName(productName){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/by-product-name`,{
            params:{
                productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po nazivu proizvoda");
    }
}

export async function findItemsWithDifference(threshold){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/find-by-threshold`,{
            params:{
                threshold:parseFloat(threshold)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja stavki inventara prema razlici");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}