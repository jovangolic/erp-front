import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createRawMaterial(name, unitMeasure, supplierType, storageType, goodsType, storageId, supplyId, currentQuantity, productId, barCodes){
    try{
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId, currentQuantity,barCodes};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/create/new-rawMaterial`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja sirovine: " + error.message);
        }
    }
}

export async function updateRawMaterial(id, name, unitMeasure, supplierType, storageType, goodsType, storageId, supplyId, currentQuantity, productId, barCodes){
    try{
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId, currentQuantity,barCodes};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranja sirovine: " + error.message);
        }
    }
}

export async function deleteRawMaterial(id){
    try{
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOneRawMaterial(id){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog");
    }
}

export async function findAllRawMaterials(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/get-all-raw-materials`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih sirovina");
    }
}

export async function findByName(name){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/find-by-material-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po nazivu");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}