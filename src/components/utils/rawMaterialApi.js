import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isSupplierTypeValidated = ["CABAGE_SUPPLIER","CARROT_SUPPLIER","TOMATO_SUPPLIER","ONION_SUPPLIER","BLUEBERRY_SUPPLIER"];
const isStorageTypeValidated = ["PRODUCTION","DISTRIBUTION"];
const isGoodsTypeValidated = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS"];  
	
export async function createRawMaterial(name, unitMeasure, supplierType, storageType, goodsType, storageId, supplyId, currentQuantity, productId, barCodes){
    try{
        if(
            !nama || typeof name !=="string" || name.trim()==="" ||
            !isSupplierTypeValidated.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType?.toUpperCase()) ||
            !storageId || !supplyId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !productId || !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId,supplyId, currentQuantity,productId, barCodes};
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
        if(
            !id ||
            !nama || typeof name !=="string" || name.trim()==="" ||
            !isSupplierTypeValidated.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType?.toUpperCase()) ||
            !storageId || !supplyId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !productId || !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId,supplyId, currentQuantity,productId, barCodes};
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
        if(!id){
            throw new Error("Dati rawMaterial ID nije pronadjen");
        }
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
        if(!id){
            throw new Error("Dati rawMaterial ID nije pronadjen");
        }
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
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Naziv sirovene nije pronadjena");
        }
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