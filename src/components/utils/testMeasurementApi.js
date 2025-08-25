import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/testMeasurements`;
const isQualityCheckStatusValid = ["PASSED","FILED","CONDITIONAL","PENDING"];
const isInspectionResultValid = ["PASS","FAIL","REWORK","PENDING","ACCEPTED_WITH_DEVIATION","SCRAP","ON_HOLD"];
const iseStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const isInspectionTypeValid = ["INCOMING", "IN_PROCESS", "FINAL", "PRE_SHIPMENT", "POST_DELIVERY", "AUDIT", "SAMPLING"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isGoodsTypeValid = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];

export async function createTestMeasurement({inspectionId,qualityStandardId,measuredValue,withinSpec}){
    try{
        const parseMeasuredValue = parseFloat(measuredValue);
        if(isNaN(inspectionId) || inspectionId == null || isNaN(qualityStandardId) || qualityStandardId == null ||
           isNaN(parseMeasuredValue) || parseMeasuredValue <= 0 || typeof withinSpec !== "boolean"){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {inspectionId,qualityStandardId,measuredValue,withinSpec};
        const response = await api.post(url+`/create/new-test-measurement`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja test-measurementa");
    }
}

export async function updateTestMeasurement({id,inspectionId,qualityStandardId,measuredValue,withinSpec}){
    try{
        const parseMeasuredValue = parseFloat(measuredValue);
        if( isNaN(id) || id == null ||
            isNaN(inspectionId) || inspectionId == null || isNaN(qualityStandardId) || qualityStandardId == null ||
            isNaN(parseMeasuredValue) || parseMeasuredValue <= 0 || typeof withinSpec !== "boolean"){
                throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {inspectionId,qualityStandardId,measuredValue,withinSpec};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja test-measurementa");
    }
}

export async function deleteTestMeasurement(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za test-measurement, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja test-measurementa po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za test-measurement, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog test-measurementa po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih test-measurementa");
    }
}

export async function existsByWithinSpec(withinSpec){
    try{
        if(typeof withinSpec !== "boolean"){
            throw new Error("Postojanje primerka "+withinSpec+" za test-measurement, nije pronadjeno");
        }
        const response = await api.get(url+`/exists-by-within-spec`,{
            params:{
                withinSpec:withinSpec
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje primerka "+withinSpec+" za test-measurement");
    }
}

export async function search({inspectionId, productName, status, minMeasuredValue, startDate, endDate}){
    try{
        const parseMinMeasuredValue = parseFloat(minMeasuredValue);
        if(isNaN(inspectionId) || inspectionId == null || !productName || typeof productName !== "string" || productName.trim() === "" ||
           !isQualityCheckStatusValid.includes(status?.toUpperCase() || isNaN(parseMinMeasuredValue) || parseMinMeasuredValue <= 0 ||
           !moment(startDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endDate,"YYYY-MM-DDTHH:mm:ss",true).isValid())){
                throw new Error("Pretraga po datim parametrima: "+inspectionId+" ,"+productName+" ,"+status+" ,"+parseMinMeasuredValue+" ,"+startDate+" ,"+endDate+" ne daje ocekivani rezultat");
        }
        const response = await api.get(url+`/search`,{
            params:{
                inspectionId:inspectionId,
                productName:productName,
                status:(status || "").toUpperCase(),
                minMeasuredValue:parseMinMeasuredValue,
                startDate:moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate:moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Pretraga po datim parametrima: "+inspectionId+" ,"+productName+" ,"+status+" ,"+minMeasuredValue+" ,"+startDate+" ,"+endDate+" ne daje ocekivani rezultat");
    }
}

export async function deepSearch({productName, supplyUpdatedAfter, result}){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === "" ||
           !moment(supplyUpdatedAfter,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !isInspectionResultValid.includes(result?.toUpperCase())){
                throw new Error("Dati parametri: "+productName+" ,"+supplyUpdatedAfter+" ,"+result+" ne daju ocekivani rezultat");
        }
        const response = await api.get(url+`/deep-search`,{
            params:{
                productName:productName,
                supplyUpdatedAfter:moment(supplyUpdatedAfter).format("YYYY-MM-DDTHH:mm:ss"),
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Pretraga po ovakvim parametrima : "+productName+" ,"+supplyUpdatedAfter+" ,"+result+" nije dala ocekivani rezultat");
    }
}

export async function searchTestMeasurements(
	                storageName,
	                storageLocation,
	                storageCapacityMin,
	                storageCapacityMax,
	                storageType,
	                storageStatus,
	                supplyQuantityMin,
	                supplyQuantityMax,
	                supplyUpdatesAfter,supplyUpdatesBefore){
    try{
        const parseStorageCapacityMin = parseFloat(storageCapacityMin);
        const parseStorageCapacityMax = parseFloat(storageCapacityMax);
        const parseSupplyQuantityMin = parseFloat(supplyQuantityMin);
        const parseSupplyQuantityMax = parseFloat(supplyQuantityMax);
        if(!storageName || typeof storageName !== "string" ||storageName.trim() === "" || 
           !storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === "" ||
           isNaN(parseStorageCapacityMin) || parseStorageCapacityMin <= 0 || isNaN(parseStorageCapacityMax) || parseStorageCapacityMax <= 0 ||
           isNaN(parseSupplyQuantityMin) || parseSupplyQuantityMin <= 0 || isNaN(parseSupplyQuantityMax) || parseSupplyQuantityMax <= 0 ||
           !iseStorageTypeValid.includes(storageType?.toUpperCase()) || !isStorageStatusValid.includes(storageStatus?.toUpperCase()) || 
           !moment(supplyUpdatesAfter,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(supplyUpdatesBefore,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
                throw new Error("Parametri za test-measurement: "+storageLocation+" ,"+storageLocation+" ,"+parseStorageCapacityMin+" ,"+
                    parseStorageCapacityMax+" ,"+storageType+" ,"+storageStatus+" ,"+parseSupplyQuantityMin+" ,"+parseSupplyQuantityMax+" ,"+
                    supplyUpdatesAfter+" ,"+supplyUpdatesBefore+" ne daju ocekivani rezultat"
                );
        }
        const response = await api.get(url+`/search-standard`,{
            params:{
                storageName:storageName,
                storageLocation:storageLocation,
                storageCapacityMin:parseStorageCapacityMin,
                storageCapacityMax:parseStorageCapacityMax,
                storageType:(storageType || "").toUpperCase(),
                storageStatus:(storageStatus || "").toUpperCase(),
                supplyQuantityMin:parseSupplyQuantityMin,
                supplyQuantityMax:parseSupplyQuantityMax,
                supplyUpdatesAfter:moment(supplyUpdatesAfter).format("YYYY-MM-DDTHH:mm:ss"),
                supplyUpdatesBefore:moment(supplyUpdatesBefore).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Dati parametri: "+storageName+" ,"+storageLocation+" ,"+storageCapacityMin+" ,"+storageCapacityMax+" ,"+
            storageType+" ,"+storageStatus+" ,"+supplyQuantityMin+" ,"+supplyQuantityMax+" ,"+supplyUpdatesAfter+" ,"+supplyUpdatesBefore+" ,ne daje ocekivani rezultat"
        );
    }                 
                    }

export async function findByMeasuredValue(measuredValue){
    try{
        const parseMeasuredValue = parseFloat(measuredValue);
        if(isNaN(parseMeasuredValue) || parseMeasuredValue <= 0){
            throw new Error("Data vrednost "+parseMeasuredValue+" za test-measurement, nije pronadjena");
        }
        const response = await api.get(url+`/measured-value`,{
            params:{
                measuredValue:parseMeasuredValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vrednost "+measuredValue+" za dati test-measurement");
    }
}

export async function findByMeasuredValueGreaterThan(measuredValue){
    try{
        const parseMeasuredValue = parseFloat(measuredValue);
        if(isNaN(parseMeasuredValue) || parseMeasuredValue <= 0){
            throw new Error("Data merna vrednost veca od "+parseMeasuredValue+" za test-measurement, nije pronadjena");
        }
        const response = await api.get(url+`/measured-value-greater-than`,{
            params:{
                measuredValue:parseMeasuredValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli mernu vrednost vecu od "+measuredValue+" za test-measurement");
    }
}

export async function findByMeasuredValueLessThan(measuredValue){
    try{
        const parseMeasuredValue = parseFloat(measuredValue);
        if(isNaN(parseMeasuredValue) || parseMeasuredValue <= 0){
            throw new Error("Data merna vrednost manja od "+parseMeasuredValue+" za test-measurement, nije pronadjena");
        }
        const response = await api.get(url+`/measured-value-less-than`,{
            params:{
                measuredValue:parseMeasuredValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli mernu vrednost manju od "+measuredValue+" za test-measurement");
    }
}

export async function findByMeasuredValueBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg merne vrednost "+parseMin+" - "+parseMax+" za test-measurement, nije pronadjen");
        }
        const response = await api.get(url+`/measured-value-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg merne vrednost "+min+" - "+max+" za test-measurement");
    }
}

export async function findByInspectionId(inspectionId){
    try{
        if(isNaN(inspectionId) || inspectionId == null){
            throw new Error("Dati id "+inspectionId+" inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/inspection/${inspectionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectionId+" za inspekciju");
    }
}

export async function findByInspection_CodeContainingIgnoreCase(code){
    try{
        if(!code ||typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod "+code+" date inspekcije");
    }
}

export async function findByInspection_Type(type){
    try{
        if(!isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" inspekcije");
    }
}

export async function findByInspection_InspectionDate(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum "+date+" date inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo nasli datum "+date+" inspekcije");
    }
}

export async function findByInspection_InspectionDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum posle "+date+" date inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo nasli datum posle "+date+" inspekcije");
    }
}

export async function findByInspection_InspectionDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum pre "+date+" date inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo nasli datum pre "+date+" inspekcije");
    }
}

export async function findByInspection_InspectionDateBetween({start, end}){
    try{    
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum opsega "+start+" - "+end+" date inspekcije, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg "+start+" - "+end+" datuma za inspekciju");
    }
}

export async function findByInspection_BatchId(batchId){
    try{
        if(isNaN(batchId) || batchId == null){
            throw new Error("Dati id "+batchId+" batch-a za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/batch/${batchId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+batchId+" batch-a za datu inspekciju");
    }
}

export async function findByInspection_ProductId(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id "+productId+" proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda za inspekciju");
    }
}

export async function findByInspection_ProductCurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina "+parseCurrentQuantity+" proizvoda za ispekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" proizvoda za inspekciju");
    }
}

export async function findByInspection_ProductCurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina veca od "+parseCurrentQuantity+" proizvoda za ispekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity-greater-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu vecu od "+currentQuantity+" proizvoda za inspekciju");
    }
}

export async function findByInspection_ProductCurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina manja od "+parseCurrentQuantity+" proizvoda za ispekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-current-quantity-less-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu manju od "+currentQuantity+" proizvoda za inspekciju");
    }
}
export async function findByInspection_ProductNameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Dati naziv proizvoda "+productName+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenuto nismo pronasli naziv proizvoda "+productName+" za inspekciju");
    }
}

export async function findByInspection_ProductUnitMeasure(unitMeasure){
    try{    
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" proizvoda za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/product-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" proizvoda za inspekciju");
    }
}

export async function findByInspection_ProductSupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca "+supplierType+" proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+supplierType+" dobavljaca proizvoda za datu inspekciju");
    }
}

export async function findByInspection_ProductStorageType(storageType){
    try{
        if(!isSupplierTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista "+storageType+" proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista "+storageType+" proizvoda, za inspekciju");
    }
}

export async function findByInspection_ProductGoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip robe "+goodsType+" proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe "+goodsType+" proizvoda, za ispekciju");
    }
}

