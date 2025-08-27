import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/qualityStandards`;
const isUnitValid = ["KG", "L", "M", "CM", "MM", "PCS", "PERCENT"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const iseStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const isInspectionTypeValid = ["INCOMING", "IN_PROCESS", "FINAL", "PRE_SHIPMENT", "POST_DELIVERY", "AUDIT", "SAMPLING"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isGoodsTypeValid = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];

export async function createQualityStandard({productId,description,minValue,maxValue,unit}){
    try{
        const parseMinValue = parseFloat(minValue);
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(productId) || productId == null || !description || typeof description !== "string" || description.trim() === "" || 
           isNaN(parseMinValue) || parseMaxValue <= 0 || isNaN(parseMaxValue) || parseMaxValue <= 0 || !isUnitValid.includes(unit?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {productId,description,minValue,maxValue,unit};
        const response = await api.post(url+`/create/new-quality-standard`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja quality-standarda");
    }
}

export async function updateQualityStandard({id,productId,description,minValue,maxValue,unit}){
    try{
        const parseMinValue = parseFloat(minValue);
        const parseMaxValue = parseFloat(maxValue);
        if( isNaN(id) || id == null ||
            isNaN(productId) || productId == null || !description || typeof description !== "string" || description.trim() === "" || 
            isNaN(parseMinValue) || parseMaxValue <= 0 || isNaN(parseMaxValue) || parseMaxValue <= 0 || !isUnitValid.includes(unit?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {productId,description,minValue,maxValue,unit};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja quality-standarda");
    }
}

export async function deleteQualityStandard(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za quality-standard, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greksa prilikom brisanja quality-standarda po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za quality-standard, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog quality-standarda po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih quality-standarda");
    }
}

export async function searchQualityStandards({supplyId, productStorageMin, productStorageMax, supplyMin, supplyMax, shelfRow, shelfCol}){
    try{
        const parseProductStorageMin = parseFloat(productStorageMin);
        const parseProductStorageMax = parseFloat(productStorageMax);
        const parseSupplyMin = parseFloat(supplyMin);
        const parseSupplyMax = parseFloat(supplyMax);
        const parseShelfRow = parseInt(shelfRow,10);
        const parseShelfCol = parseInt(shelfCol,10);
        if(isNaN(supplyId) || supplyId == null || isNaN(parseProductStorageMin) || parseProductStorageMin <= 0 || isNaN(parseProductStorageMax) || parseProductStorageMax <=0 ||
           isNaN(parseSupplyMin) || parseSupplyMin <= 0 || isNaN(parseSupplyMax) || parseSupplyMax <= 0 || isNaN(parseShelfRow) || parseShelfRow <= 0 ||
           isNaN(parseShelfCol) || parseShelfCol <= 0){
            throw new Error("Dati parametri za pretragu: "+supplyId+" ,"+parseProductStorageMin+" ,"+parseProductStorageMax+" ,"+parseSupplyMin+" ,"+parseSupplyMax+" ,"+parseShelfRow+" ,"+parseShelfCol+" ne daju ocekivani rezultat");
        }
        const response = await api.get(url+`/search-standards`,{
            params:{
                supplyId:supplyId,
                productStorageMin:parseProductStorageMin,
                productStorageMax:parseProductStorageMax,
                supplyMin:parseSupplyMin,
                supplyMax:parseSupplyMax,
                shelfRow:parseShelfRow,
                shelfCol:parseShelfCol
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Parametri za pretragu: "+supplyId+" ,"+productStorageMin+" ,"+productStorageMax+" ,"+supplyMin+" ,"+supplyMax+" ,"+shelfRow+" ,"+shelfCol+" ne daju ocekivani rezultat");
    }
}

export async function findByUnit(unit){
    try{
        if(!isUnitValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere "+unit+" za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/by-unit`,{
            params:{
                uniy:(unit || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvalitet-standarda po jedinici mere "+unit);
    }
}

export async function findByDescriptionContainingIgnoreCase(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Dati opis "+description+" za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kvalitet-standarda po datom opisu "+description);
    }
}

export async function findByMinValue(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Data minimalna vrednost "+parseMinValue+" za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/min-value`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu-vrednost "+minValue+" za kvalitet-standarda");
    }
}

export async function findByMinValueLessThan(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Data minimalna vrednost veca od "+parseMinValue+" za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/min-value-greater-than`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu-vrednost vecu od "+minValue+" za kvalitet-standarda");
    }
}

export async function findByMinValueLessThan(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Data minimalna vrednost manja od "+parseMinValue+" za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/min-value-less-than`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu-vrednost manju od "+minValue+" za kvalitet-standarda");
    }
}

export async function findByMinValueBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0 || parseMin > parseMax){
            throw new Error("Opseg minimalne vrednosti "+parseMin+" - "+parseMax+" za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/min-value-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg minimalne vrednost "+min+" - "+max+" za kvalitet-standarda");
    }
}

export async function findByMaxValue(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Data maksimalna vrednost "+parseMaxValue+" za kvalitet-standard, nije pronadjena");
        }
        const response = await api.get(url+`/max-value`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli maksimalnu vrednost "+maxValue+" za kvalitet-standarda");
    }
}

export async function findByMaxValueGreaterThan(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Data maksimalna vrednost veca od "+parseMaxValue+" za kvalitet-standard, nije pronadjena");
        }
        const response = await api.get(url+`/max-value-greater-than`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli maksimalnu vrednost vecu od "+maxValue+" za kvalitet-standarda");
    }
}

export async function findByMaxValueLessThan(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Data maksimalna vrednost manja od "+parseMaxValue+" za kvalitet-standard, nije pronadjena");
        }
        const response = await api.get(url+`/max-value-less-than`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli maksimalnu vrednost manju od "+maxValue+" za kvalitet-standarda");
    }
}

export async function findByMaxValueBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <=0 || parseMin > parseMax){
            throw new Error("Opseg maksimalne vrednosti "+parseMin+" - "+parseMax+" za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/max-value-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg maksimalne vrednosti "+min+" - "+max+" za kvalitet-standarda");
    }
}

export async function countByMinValueIsNotNull(){
    try{
        const response = await api.get(url+`/count/by-min-value-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj minimalne-vrednost, koja ne postoji");
    }
}

export async function countByMaxValueIsNotNull(){
    try{
        const response = await api.get(url+`/count/by-max-value-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj maksimalne-vrednost, koja ne postoji");
    }
}

export async function countByMinValue(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Ukupan broj minimalne vrednosti "+parseMinValue+" za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/count-min-value`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj minimalne vrednosti "+minValue+" za kvalitet-standarda");
    }
}

export async function countByMaxValue(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Ukupan broj maksimalne vrednosti "+parseMaxValue+" za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/count-max-value`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj maksimalne vrednosti "+maxValue+" za kvalitet-standarda");
    }
}

export async function findByProduct_Id(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id "+productId+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina "+parseCurrentQuantity+" proizvoda za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-current-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina veca od "+parseCurrentQuantity+" proizvoda za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-current-quantity-greater-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu vecu od "+currentQuantity+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina manja od "+parseCurrentQuantity+" proizvoda za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-current-quantity-less-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu manju od "+currentQuantity+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_CurrentQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0 || parseMin > parseMax){
            throw new Error("Opseg trenutne kolicine "+parseMin+" - "+parseMax+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-current-quantity-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg trenutne kolicine "+min+" - "+max+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_NameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Dati naziv "+productName+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv proizvoda "+productName+" za kvalitet-standarda");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" proizvoda za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca "+supplierType+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca "+supplierType+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!iseStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista "+storageType+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista "+storageType+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip robe "+goodsType+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe "+goodsType+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Id skladista "+storageId+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageNameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv skladista "+storageName+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-name`,{
            params:{
                storageName:storageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv skladista "+storageName+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageLocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija skladista "+storageLocation+" proizvoda za kvalitet-standarda, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-storage-location`,{
            params:{
                storageLocation:storageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju skladista "+storageLocation+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skaldista "+parseCapacity+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/storage-capacity`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" skladista proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skaldista veci od "+parseCapacity+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/storage-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista veci od "+capacity+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skaldista manji od "+parseCapacity+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/storage-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista manji od "+capacity+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProduct_StorageCapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg kapaciteta skladista "+parseMin+" - "+parseMax+" proizvoda za kvalitet-standarda, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalni kapacitet skladista ne sme da bude veci od maksimalnog kapaciteta skladista");
        }
        const response = await api.get(url+`/search/product/storage-capacity-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kapaciteta skladista "+min+" - "+max+" proizvoda za kvalitet-standarda");
    }
}

export async function findByProductStorageCapacityBetweenAndStatus({min, max, status}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0 || !isStorageStatusValid.includes(status?.toUpperCase())) {
            throw new Error("Opseg kapaciteta skladista "+parseMin+" - "+parseMax+" proizvoda i status skladista "+status+" za kvalitet-standarda, nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalni kapacitet skladista ne sme da bude veci od maksimalnog kapaciteta skladista");
        }
        const response = await api.get(url+`/search/product/storage-capacity-between-status`,{
            params:{
                status:(status || "").toUpperCase(),
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kapaciteta skladista "+min+" - "+max+" proizvda i status skladista "+status+" za kvalitet-standarda");
    }
}

