import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isSupplierTypeValidated = ["CABAGE_SUPPLIER","CARROT_SUPPLIER","TOMATO_SUPPLIER","ONION_SUPPLIER","BLUEBERRY_SUPPLIER"];
const isStorageTypeValidated = ["PRODUCTION","DISTRIBUTION"];
const isGoodsTypeValidated = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS"]; 

export async function createProduct(name, unitMeasure,supplierType,storageType,goodsType,storageId, currentQuantity,barCodes){
    try{
        if(
            !nama || typeof name !=="string" || name.trim()==="" ||
            !unitMeasure || typeof unitMeasure !=="string" ||unitMeasure.trim() === ""||
            !isSupplierTypeValidated.includes(supplierType.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType.toUpperCase()) ||
            !storageId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti validirana i popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId, currentQuantity,barCodes};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/products/create/new-product`,requestBody,{
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja proizvoda: " + error.message);
        }
    }
}

export async function updateProduct(id,name, unitMeasure,supplierType,storageType,goodsType,storageId, currentQuantity,barCodes){
    try{
        if(
            !id ||
            !nama || typeof name !=="string" || name.trim()==="" ||
            !unitMeasure || typeof unitMeasure !=="string" ||unitMeasure.trim() === ""||
            !isSupplierTypeValidated.includes(supplierType.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType.toUpperCase()) ||
            !storageId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti validirana i popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId, currentQuantity,barCodes};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/products/update/${id}`,requestBody,{
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranja proizvoda: " + error.message);
        }
    }
}

export async function deleteProduct(id){
    try{
        if(!id){
            throw new Error("Proizvod sa datim ID-om nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/products/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOneProduct(id){
    try{
        if(!id){
            throw new Error("Proizvod sa datim ID-om nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja jednog proizvoda");
    }
}

export async function getAllProducts(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih proizvoda");
    }
}

export async function findByBarCode(barCode){
    try{
        if(!barCode || typeof barCode !== "string" || barCode.trim()=== ""){
            throw new Error("BarCode nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-barCode`,{
            params:{
                barCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja proizvoda po bar-kodu");
    }
}

export async function findByCurrentQuantityLessThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Quantity mora biti pozitivan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-quantity`,{
            params:{
                quantity:parseFloat(quantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja proizvoda po kolicini");
    }
}

export async function findByName(name){
    try{
        if(!nama || typeof name !=="string" || name.trim()===""){
            throw new Error("Naziv proizvoda nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-name`,{
            params:{
                name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja proizvoda po nazivu");
    }
}

export async function findByStorageId(storageId){
    try{
        if(!storageId){
            throw new Error("StorageId ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja proizvoda po id-ju skladista");
    }
}

export async function findBySupplierType(supplierType){
    try{
        if(!isSupplierTypeValidated.includes(supplierType.toUpperCase())){
            throw new Error("SupplierType nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-supplier-type`,{
            params:{
                supplierType:supplierType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja proizvoda po tipu nabavke");
    }
}

export async function findByStorageType(storageType){
    try{
        if(!isStorageTypeValidated.includes(storageType.toUpperCase())){
            throw new Error("Tip skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-storage-type`,{
            params:{
                storageType:storageType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error ,"Greska prilikom trazenja proizvoda po tipu skladista");
    }
}

export async function findByGoodsType(goodsType){
    try{
        if(!isGoodsTypeValidated.includes(goodsType.toUpperCase())){
            throw new Error("Tip robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-goods-type`,{
            params:{
                goodsType:goodsType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja proizvoda po tipu robe");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}