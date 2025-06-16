import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSupply(storageId, goodsIds, quantity, updates) {
    try {
        // Validacija pre slanja
        if (
            !storageId ||
            !Array.isArray(goodsIds) || goodsIds.length === 0 ||
            isNaN(quantity) || parseFloat(quantity) <= 0 ||
            !moment(updates, moment.ISO_8601, true).isValid()
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const requestBody = {
            storageId,
            goodsIds,
            quantity: parseFloat(quantity),
            updates: moment(updates).toISOString()
        };
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/supplies/create/new-supply`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom kreiranja zaliha: " + error.message);
        }
    }
}

export async function updateSupply(id, storageId, goodsIds, quantity, updates) {
    try {
        if (
            !id ||
            !storageId ||
            !Array.isArray(goodsIds) || goodsIds.length === 0 ||
            isNaN(quantity) || parseInt(quantity) <= 0 ||
            !moment(updates, moment.ISO_8601, true).isValid()
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const requestBody = {
            id,
            storageId,
            goodsIds,
            quantity: parseInt(quantity),
            updates: moment(updates).toISOString()
        };
        const response = await api.put(
            `${import.meta.env.VITE_API_BASE_URL}/supplies/update/${id}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom ažuriranja zaliha: " + error.message);
        }
    }
}

export async function deleteSupply(id){
    try{
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/supplies/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getBySupplyId(supplyId){
    try{
        if(!supplyId){
            throw new Error("Dati supplyId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/${supplyId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dohvacanja jedne zalihe");
    }
}

export async function getAllSupplies(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/get-all-supplies`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih zaliha");;
    }
}

export async function getByStorage(storageId){
    try{
        if(!storageId){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/by-storageId`,{
            params:{
                storageId:storageId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja skladista po id");
    }
}

export async function getBySuppliesByGoodsName(name){
    try{
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Naziv robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/by-goods-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha i robe po nazivu");
    }
}

export async function getBySuppliesWithMinQuantity(minQuantity){
    try{
        if(isNaN(minQuantity) || minQuantity < 0){
            throw new Error("minQuantity ne sme biti manje od nula");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/by-minQuantity`,{
            params:{
                quantity:parseInt(minQuantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha sa najmanjom kolicinom");
    }
}

export async function getBySuppliesByStorageId(storageId){
    try{
        if(!storageId){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/storageId/${storageId}`,{
            params:{
                storageId:storageId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha koje pripadaju za odredjeno skladiste");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}