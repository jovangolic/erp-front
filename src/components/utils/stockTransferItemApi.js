import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/stockTransferItems`;

export async function create(productId, quantity){
    try{
        if(quantity == null || quantity <= 0 || !productId){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {productId, quantity};
        const response = await api.options(url+`/create/new-stockTransferItem`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update(id, productId, quantity){
    try{
        if(quantity == null || quantity <= 0 || !productId){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {productId, quantity};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteStockTransferItem(id){
    try{
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
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
        handleApiError(error,"Greska prilikom trazenja jednog");
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
        handleApiError(error,"Greska prilikom dobavljanja svih stockTransferItem-a")
    }
}

export async function findByProductId(productId){
    try{
        if(!productId){
            throw new Error("ID prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po id-iju proizvoda");
    }
}

export async function findByProduct_Name(name){
    try{
        if(!name){
            throw new Error("Naziv proizvoda mora biti prosledjen");
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
        handleApiError(error,"Greska prilikom pretrage po nazivu proizvoda");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    if (currentQuantity == null || currentQuantity <= 0) {
        throw new Error("Količina mora biti veća od nule");
    }
    try {
        const response = await api.get(url + `/by-currentQuantity`, {
            params: {
                currentQuantity: currentQuantity
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom pretrage proizvoda po trenutnoj količini");
    }
}

export async function findByQuantity(quantity){
    try{
        if (quantity == null || quantity <= 0) {
            throw new Error("Količina mora biti veća od nule");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po kolicini");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        if (quantity == null || quantity <= 0) {
            throw new Error("Količina mora biti veća od nule");
        }
        const response = await api.get(url+`/by-less-quantity`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po kolicini manjoj od");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        if (quantity == null || quantity <= 0) {
            throw new Error("Količina mora biti veća od nule");
        }
        const response = await api.get(url+`/by-greater-quantity`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema tazenju po kolicini vecoj od");
    }
}

export async function findByStockTransferId(stockTransferId){
    try{
        if (!stockTransferId) {
            throw new Error("ID prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/stockTransfer/${stockTransferId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po stockTransfer id-iju");
    }
}

export async function findByStockTransfer_FromStorageId(fromStorageId){
    try{
        if(!fromStorageId){
            throw new Error("ID prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/storage/${fromStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju stockTransfer-a od fromStorageId");
    }
}

export async function findByStockTransfer_ToStorageId(toStorageId){
    try{
        if(!toStorageId){
            throw new Error("ID prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/storage/${toStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju stockTransfera do toStorageId");
    }
}