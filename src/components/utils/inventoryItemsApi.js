import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createInventoryItems({inventoryId,productId, quantity, condition}){
    try{
        if(
            !inventoryId || !productId || isNaN(quantity) || parseFloat(quantity) < 0 ||
            isNaN(condition) || parseInt(condition) < 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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

export async function updateInventoryItems({id,inventoryId,productId, quantity, condition }) {
    try{
        if(
            !id ||
            !inventoryId || !productId || isNaN(quantity) || parseFloat(quantity) < 0 ||
            isNaN(condition) || parseInt(condition) < 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
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
        if(!id){
            throw new Error("Dati id za inventoryItems nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati id za inventoryItems nije pronadjen");
        }
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
        if(isNaN(quantity) || parseFloat(quantity) < 0){
            throw new Error("Quantity must be at least 0");
        }
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
        if(isNaN(itemCondition) || parseInt(itemCondition) < 0){
            throw new Error("ItemCondition mora biti pozitivan broj");
        }
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
        if(!inventoryId){
            throw new Error("Dati ID za Inventory nije pronadjen");
        }
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
        if(!productId){
            throw new Error("Dati ID za Product nije pronadjen");
        }
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
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv proizvoda nije pronadjen");
        }
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

export async function findItemsWithDifference(threshold) {
    try {
        const parsedThreshold = parseFloat(parseFloat(threshold).toFixed(2));
        if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
            throw new Error("Threshold mora biti broj veći od 0");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/inventoryItems/find-by-threshold`, {
            params: {
                threshold: parsedThreshold
            },
            headers: getHeader()
        });
        return response.data;
    } 
    catch (error) {
        handleApiError(error, "Greška prilikom traženja stavki inventara prema razlici");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}