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
const isInspectionTypeValid = ["INCOMING", "IN_PROCESS", "FINAL_INSPECTION", "PRE_SHIPMENT", "POST_DELIVERY", "AUDIT", "SAMPLING"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isGoodsTypeValid = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isReferenceTypeValid = ["GOODS_RECEIPT","PRODUCTION_ORDER","STORAGE_ITEM","BATCH","MATERIAL"];
const isQualityCheckTypeValid = ["VISUAL","DIMENSIONAL","CHEMICAL","FUNCTIONAL","TEMPERATURE","HUMIDITY","OTHER"];
const isUnitValid = ["KG", "L", "M", "CM", "MM", "PCS", "PERCENT"];

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

export async function findByInspection_InspectorId(inspectorId){
    try{
        if(isNaN(inspectorId) || inspectorId == null){
            throw new Error("Dati id "+inspectorId+" inspektora za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/inspector/${inspectorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+inspectorId+" inspektora za inspekciju");
    }
}

export async function findByInspection_Product_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista proizvoda za inspekciju");
    }
}

export async function findByInspection_Product_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id "+supplyId+" dobavljaca proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca proizvoda za inspekciju");
    }
}

export async function findByInspection_Product_ShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id "+shelfId+" police proizvoda za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police proizvoda za inspekciju");
    }
}

export async function findByInspection_QuantityInspected(quantityInspected){
    try{
        const parseQuantityInspected = parseFloat(quantityInspected);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Proverena kolicina "+parseQuantityInspected+" za isnpekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proverenu kolicinu "+quantityInspected+" za inspekciju");
    }
}

export async function findByInspection_QuantityInspectedGreaterThan(quantityInspected){
    try{
        const parseQuantityInspected = parseFloat(quantityInspected);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Proverena kolicina veca od "+parseQuantityInspected+" za isnpekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected-greater-than`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proverenu kolicinu vecu od "+quantityInspected+" za inspekciju");
    }
}

export async function findByInspection_QuantityInspectedLessThan(quantityInspected){
    try{
        const parseQuantityInspected = parseFloat(quantityInspected);
        if(isNaN(parseQuantityInspected) || parseQuantityInspected <= 0){
            throw new Error("Proverena kolicina manja od "+parseQuantityInspected+" za isnpekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected-less-than`,{
            params:{
                quantityInspected:parseQuantityInspected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proverenu kolicinu manju od "+quantityInspected+" za inspekciju");
    }
}

export async function findByInspection_QuantityInspectedBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg proverene kolicine "+parseMin+" - "+parseMax+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quantity-inspected-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg proverene kolicine "+min+" - "+max+" za inspekciju");
    }
}

export async function findByInspection_QuantityAccepted(quantityAccepted){
    try{
        const parseQuantityAccepted = parseFloat(quantityAccepted);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina "+parseQuantityAccepted+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihvacenu kolicinu "+quantityAccepted+" za inspekciju");
    }
}

export async function findByInspection_QuantityAcceptedGreaterThan(quantityAccepted){
    try{
        const parseQuantityAccepted = parseFloat(quantityAccepted);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina veca od "+parseQuantityAccepted+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted-greater-than`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihvacenu kolicinu vecu od "+quantityAccepted+" za inspekciju");
    }
}

export async function findByInspection_QuantityAcceptedLessThan(quantityAccepted){
try{
        const parseQuantityAccepted = parseFloat(quantityAccepted);
        if(isNaN(parseQuantityAccepted) || parseQuantityAccepted <= 0){
            throw new Error("Prihvacena kolicina manja od "+parseQuantityAccepted+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted-less-than`,{
            params:{
                quantityAccepted:parseQuantityAccepted
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prihvacenu kolicinu manju od "+quantityAccepted+" za inspekciju");
    }
}

export async function findByInspection_QuantityAcceptedBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 ||isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg prihvacene kolicine "+parseMin+" - "+parseMax+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quantity-accepted-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pornasli opseg prihvacene kolicine "+min+" - "+max+" za inspekciju");
    }
}

export async function findByInspection_QuantityRejected(quantityRejected){
    try{
        const parseQuantityRejected = parseFloat(quantityRejected);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina "+parseQuantityRejected+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu "+quantityRejected+" za inspekciju");
    }
}

export async function findByInspection_QuantityRejectedGreaterThan(quantityRejected){
    try{
        const parseQuantityRejected = parseFloat(quantityRejected);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina veca od "+parseQuantityRejected+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected-greater-than`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu vecu od "+quantityRejected+" za inspekciju");
    }
}

export async function findByInspection_QuantityRejectedLessThan(quantityRejected){
    try{
        const parseQuantityRejected = parseFloat(quantityRejected);
        if(isNaN(parseQuantityRejected) || parseQuantityRejected <= 0){
            throw new Error("Odbacena kolicina manja od "+parseQuantityRejected+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected-less-than`,{
            params:{
                quantityRejected:parseQuantityRejected
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odbacenu kolicinu manju od "+quantityRejected+" za inspekciju");
    }
}

export async function findByInspection_QuantityRejectedBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg odbacene kolicine "+parseMin+" - "+parseMax+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quantity-rejected-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg odbacene kolicine "+min+" - "+max+" za inspekciju");
    }
}

export async function findByInspection_Notes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Data beleska "+notes+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection-notes`,{
            params:{
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" za inspekciju");
    }
}

export async function findByInspection_Result(result){
    try{
        if(!isInspectionResultValid.includes(result?.toUpperCase())){
            throw new Error("Data vrsta rezultata "+result+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection-result`,{
            params:{
                result:(result || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vrstu rezultata "+result+" za datu inspekciju");
    }
}

export async function findByInspection_ResultAndType({result, type}){
    try{
        if(!isInspectionResultValid.includes(result?.toUpperCase()) || !isInspectionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Data vrsta rezultata "+result+" i tip rezultata "+type+" za inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection-result-and-type`,{
            params:{
                result:(result || "").toUpperCase(),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vrstu rezultata "+result+" i tip "+type+" rezultata, za datu inspekciju");
    }
}

export async function findByInspection_QualityCheckId(qualityCheckId){
    try{
        if(isNaN(qualityCheckId) || qualityCheckId == null){
            throw new Error("Dati id "+qualityCheckId+" provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check/${qualityCheckId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+qualityCheckId+" provere-kvaliteta, za inspekciju");
    }
}

export async function findByInspection_QualityCheck_LocDate(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum "+date+" provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" provere-kvaliteta za inspekciju");
    }
}

export async function findByInspection_QualityCheck_LocDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum posle "+date+" provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum posle "+date+" provere-kvaliteta za inspekciju");
    }
}

export async function findByInspection_QualityCheck_LocDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum pre "+date+" provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pre "+date+" provere-kvaliteta za inspekciju");
    }
}

export async function findByInspection_QualityCheck_LocDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Opseg datuma "+start+" - "+end+" provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" kvaliteta-provere, za inspekciju");
    }
}

export async function findByInspection_QualityCheck_Notes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Data beleska "+notes+" provere-kvaliteta zA inspekciju, nije pronadjena");
        }
        const response = await api.get(url+`/search/inspection/quality-check-notes`,{
            params:{notes:notes},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" provere-kvaliteta za isnpekciju");
    }
}

export async function findByInspection_QualityCheck_ReferenceType(referenceType){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase())){
            throw new Error("Dati tip reference "+referenceType+" provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-reference-type`,{
            params:{
                referenceType:(referenceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" provere-kvaliteta, za inspekciju");
    }
}

export async function findByInspection_QualityCheck_CheckType(checkType){
    try{
        if(!isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Dati tip provere-kvaliteta "+checkType+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-type`,{
            params:{
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip provere-kvaliteta "+checkType+" za inspekciju");
    }
}

export async function findByInspection_QualityCheck_Status(status){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status provere-kvaliteta "+status+" za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status provere-kvaliteta "+status+" za inspekciju");
    }
}

export async function findByInspection_QualityCheck_ReferenceId(referenceId){
    try{
        if(isNaN(referenceId) || referenceId == null){
            throw new Error("Dati id "+referenceId+" reference provere-kvaliteta za inspekciju, nije pronadjen");
        }
        const response = await api.get(url+`/search/inspection/quality-check-reference-id`,{
            params:{
                referenceId:referenceId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+referenceId+" reference, provere-kvaliteta za isnpekciju");
    }
}

export async function findByInspection_QualityCheck_StatusAndCheckType({status, checkType}){
    try{
        if(!isQualityCheckStatusValid.includes(status?.toUpperCase()) || !isQualityCheckTypeValid.includes(checkType?.toUpperCase())){
            throw new Error("Dati status "+status+" i tip "+checkType+" provere-kvaliteta za inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection/quality-check-status-and-check-type`,{
            params:{
                status:(status || "").toUpperCase(),
                checkType:(checkType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" i tip "+checkType+" provere-kvaliteta za inspekciju");
    }
}

export async function findByInspection_QualityCheck_ReferenceType_Notes({referenceType, notes}){
    try{
        if(!isReferenceTypeValid.includes(referenceType?.toUpperCase()) || !notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Dati tip refernce "+referenceType+" i beleska "+notes+" provere-kvaliteta za inspekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/inspection/quality-check-reference-type-notes`,{
            params:{
                referenceType:(referenceType || "").toUpperCase(),
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip reference "+referenceType+" i belesku "+notes+" procere-kvaliteta za inspekciju");
    }    
}

export async function findByStandard_Id(qualityStandardId){
    try{
        if(isNaN(qualityStandardId) || qualityStandardId == null){
            throw new Error("Dati id "+qualityStandardId+" kvaliteta standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/${qualityStandardId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+qualityStandardId+" za kvaliteta standarda");
    }
}

export async function findByStandard_Description(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Dati opis "+description+" standarda, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opis "+description+" standarda");
    }
}

export async function findByStandard_MinValue(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Data minimalna-vrednost "+parseMinValue+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/min-value`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu vrednost "+minValue+" za dati standard");
    }
}

export async function findByStandard_MinValueGreaterThan(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Data minimalna-vrednost veca od "+parseMinValue+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/min-value-greater-than`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu vrednost vecu od "+minValue+" za dati standard");
    }
}

export async function findByStandard_MinValueLessThan(minValue){
    try{
        const parseMinValue = parseFloat(minValue);
        if(isNaN(parseMinValue) || parseMinValue <= 0){
            throw new Error("Data minimalna-vrednost manja od "+parseMinValue+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/min-value-less-than`,{
            params:{
                minValue:parseMinValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu vrednost manju od "+minValue+" za dati standard");
    }
}

export async function findByStandard_MaxValue(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Data maksimalna-vrednost "+parseMaxValue+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/max-value`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli maksimalnu-vrednost "+maxValue+" za dati standard");
    }
}

export async function findByStandard_MaxValueGreaterThan(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Data maksimalna-vrednost veca od "+parseMaxValue+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/max-value-greater-than`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli maksimalnu-vrednost vecu od "+maxValue+" za dati standard");
    }
}

export async function findByStandard_MaxValueLessThan(maxValue){
    try{
        const parseMaxValue = parseFloat(maxValue);
        if(isNaN(parseMaxValue) || parseMaxValue <= 0){
            throw new Error("Data maksimalna-vrednost manja od "+parseMaxValue+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/max-value-less-than`,{
            params:{
                maxValue:parseMaxValue
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli maksimalnu-vrednost manju od "+maxValue+" za dati standard");
    }
}

export async function findByStandard_Unit(unit){
    try{
        if(!isUnitValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere "+unit+" za standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard-unit`,{
            params:{
                unit:(unit || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unit+" za dati standard");
    }
}

export async function findByStandard_Product_Id(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id "+productId+" proizvoda za dati standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina "+parseCurrentQuantity+" proizvoda za dati standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/product-current-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina veca od "+parseCurrentQuantity+" proizvoda za dati standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/product-current-quantity-greater-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu vecu od "+currentQuantity+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina manja od "+parseCurrentQuantity+" proizvoda za dati standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/product-current-quantity-less-than`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu manju od "+currentQuantity+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_NameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv "+productName+" proizvoda za dati standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+productName+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Jedinica mere "+unitMeasure+" proizvoda za dati standard, nije pronadjena");
        }
        const response = await api.get(url+`/search/standard/product-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Tip dobavljaca "+supplierType+" proizvoda za standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca "+supplierType+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_StorageType(storageType){
    try{
        if(!iseStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Tip skladista "+storageType+" proizvoda za dati standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista "+storageType+" za proizvoda, koji pripada datom standardu");
    }
}

export async function findByStandard_Product_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Tip robe "+goodsType+" proizvoda za dati standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe "+goodsType+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista proizvoda za standard, nije pronadjen");
        }
        const response =await api.get(url+`/search/standard/product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista "+storageId+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_StorageHasShelvesForIsNull(){
    try{
        const response = await api.get(url+`/search/standard/product/storage-shelves-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste bez polica za standard");
    }
}

export async function findByStandard_Product_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id dobavljaca "+supplyId+" proizvoda za standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca "+supplyId+" proizvoda za dati standard");
    }
}

export async function findByStandard_Product_ShelfId(shelfId){
    try{    
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id police "+shelfId+" proizvoda za dati standard, nije pronadjen");
        }
        const response = await api.get(url+`/search/standard/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id police "+shelfId+" proizvoda za dati standard");
    }
}