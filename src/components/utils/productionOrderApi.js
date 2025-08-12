import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/productionOrders`;
const isProductionOrderStatusValid = ["PLANNED","IN_PROGRESS","COMPLETED","CANCELED"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const validateStorageStatus = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createProductionOrder({orderNumber,productId,quantityPlanned,quantityProduced,startDate,endDate,status,workCenterId}){
    try{
        const parseQuantityPlanned = parseInt(quantityPlanned,10);
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(!orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === "" ||
            isNaN(productId) || productId == null || isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0 ||
            isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid() ||
            !isProductionOrderStatusValid.includes(status?.toUpperCase() || isNaN(workCenterId) || workCenterId == null)){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {orderNumber,productId,quantityPlanned,quantityProduced,startDate,endDate,status,workCenterId};
        const response = await api.post(url+`/create/new-productionOrder`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko kreiranja production-order");
    }
}

export async function updateProductionOrder({id,orderNumber,productId,quantityPlanned,quantityProduced,startDate,endDate,status,workCenterId}){
    try{
        const parseQuantityPlanned = parseInt(quantityPlanned,10);
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if( id == null || isNaN(id) ||
            !orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === "" ||
            isNaN(productId) || productId == null || isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0 ||
            isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid() ||
            !isProductionOrderStatusValid.includes(status?.toUpperCase() || isNaN(workCenterId) || workCenterId == null)){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {orderNumber,productId,quantityPlanned,quantityProduced,startDate,endDate,status,workCenterId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko azuriranja production-order");
    }
}

export async function deleteProductionOrder(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id nije pronadjen");
        }
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
        if(id == null || isNaN(id)){
            throw new Error("Dati id nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog productionOrder-a");
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
        handleApiError(error,"Greska prilikom trazenja svih productionOrder-a");
    }
}

export async function findByOrderNumber(orderNumber){
    try{
        if(!orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === ""){
            throw new Error("Dati broj naloga za proizvdnju, nije pronadjen");
        }
        const response = await api.get(url+`/find-by-order-number`,{
            params:{orderNumber:orderNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj naloga za proizvodni-nalog");
    }
}

export async function findByProduct_Id(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id proizvoda nije pronadjen");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id proizvoda za proizvdni malog");
    }
}

export async function findByProduct_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv proizvoda za proizvodni-nalog, nije pronadjen");
        }
        const response = await api.get(url+`/by-product-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv proizvoda za proizvodni-nalog");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina proizvoda za proizvodni-nalog, nije pronadjena");
        }
        const response = await api.get(url+`/by-product-quantity`,{
            params:{
                currentQuantity:parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu proizvida za proizvodni-nalog");
    }
}

export async function findByStatus(status){
    try{
        if(!isProductionOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status proizvodnog-naloga, nije pronadjen");
        }
        const response = await api.get(url+`/by-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status proizvodnog-naloga");
    }
}

export async function findByWorkCenter_Id(workCenterId){
    try{
        if(isNaN(workCenterId) || workCenterId == null){
            throw new Error("Dati id radnog centra, nije pronadjen");
        }
        const response = await api.get(url+`/workCenter/${workCenterId}`,{
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id radnog-centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv radnog centra, nije pronadjen");
        }
        const response = await api.get(url+`/by-work-cente-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv radnog centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija radnog centra, nije pronadjena");
        }
        const response = await api.get(url+`/by-work-center-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju radnog centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_Capacity(capacity){
    try{
        const parseCapacity = parseInt(capacity,10);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra, nije pronadjen");
        }
        const response = await api.get(url+`/by-work-center-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseInt(capacity,10);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra veci od, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra veci od, za proizvodni nalog");
    }
}

export async function findByWorkCenter_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseInt(capacity,10);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra manji od, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra manji od, za proizvodni nalog");
    }
}

export async function findByQuantityPlanned(quantityPlanned){
    try{
        const parseQuantityPlanned = parseInt(quantityPlanned,10);
        if(isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0){
            throw new Error("Data planirana kolicina za proizvodni nalog, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-planned`,{
            params:{
                quantityPlanned:parseQuantityPlanned
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli planiranu kolicinu ,za proizvodni nalog");
    }
}

export async function findByQuantityProduced(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data proizvedena kolicina za proizvodni nalog, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-produced`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu za proizvodni nalog");
    }
}

export async function findByStartDateBetween(start, end){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetak datumskog opsega, nije pronadjen");
        }
        const response = await api.get(url+`/start-date-range"`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pocetak datumskog opsega za proizvodni nalog");
    }
}

export async function findByStartDate(startDate){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetak datuma za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/by-startDate`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli pocetak datuma za proizvodni nalog");
    }
}

export async function findByEndDate(endDate){
    try{
        if(!moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum kraja za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/by-endDate`,{
            params:{
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kraj datuma za proizvodni nalog");
    }
}

export async function searchOrders({productName, workCenterName,startDateFrom, startDateTo, status}){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === "" ||
            isNaN(workCenterName) || workCenterName == null || !moment(startDateFrom,"YYYY-MM-DD",true).isValid() ||
            !moment(startDateTo,"YYYY-MM-DD",true).isValid() || !isProductionOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati parametri, nisu pronasli trazeni rezultat");
        }
        const response = await api.get(url+`/search-orders`,{
            params:{
                productName:productName,
                workCenterName:workCenterName,
                startDateFrom:moment(startDateFrom).format("YYYY-MM-DD"),
                startDateTo:moment(startDateTo).format("YYYY-MM-DD"),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat za date parametre pretrage");
    }
}

export async function findByStartDateGreaterThanEqual(start){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum pocetka veci ili jednak za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/date-greater-than-equal`,{
            params:{
                start:moment(start).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pocetka veci ili jednak");
    }
}

export async function findOrdersWithStartDateAfterOrEqual(startDate){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum pocetka za proizvodne naloge posle, nije pornadjen");
        }
        const response = await api.get(url+`/search/orders-with-date-after-equal`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naloge sa datumom posle datog datuma");
    }
}

export async function countAvailableCapacity(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id skladista nije pronadjen");
        }
        const response = await api.get(url+`/${id}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj dosupnog kapaciteta skladista");
    }
}

export async function allocateCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati id skladista i kolicina za alociranje, nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/allocate`,{
            params:{
                amount:parseAmount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli alocirani kapacitet za id skladista");
    }
}

export async function releaseCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati id skladista i kolicina za oslobadjanje, nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/release`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista i kolicinu za oslobadjanje");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Kolicina proizvoda veca od za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu proizvoda vecu od za proizvodni nalog");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Kolicina proizvoda manja od za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu proizvoda manju od za proizvodni nalog");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere proizvoda za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Tip dobavljaca proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Tip skladista proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip skladista proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_StorageStatus(storageStatus){
    try{
        if(!validateStorageStatus.includes(storageStatus?.toUpperCase())){
            throw new Error("Status skladista daqtog proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-status`,{
            params:{
                storageStatus:(storageStatus || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("ID skaldista za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista za proizvod");
    }
}

export async function findByProduct_StorageNameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Naziv skladista proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv skaldista proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageLocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Lokacija skladista proizvoda za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju skaldista proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Kapacitet skladista datog proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-capacity`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista datog proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Kapacitet skladista datog proizvoda veceg od, za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista datog proizvoda veceg od, za proizvodni nalog");
    }
}

export async function findByProduct_StorageCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Kapacitet skladista datog proizvoda manjeg od, za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista datog proizvoda manjeg od, za proizvodni nalog");
    }
}

export async function findByProduct_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("ID dobavljaca proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_SupplyQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina koju dobavljac dobavlja za proizvod, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-supply-quantity`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu koja pripada dobavljacu za proizvod");
    }
}

export async function findByProduct_SupplyQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina koju dobavljac dobavlja za proizvod veci od, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-supply-quantity-greater-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od koja pripada dobavljacu za proizvod");
    }
}

export async function findByProduct_SupplyQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina koju dobavljac dobavlja za proizvod manja od, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-supply-quantity-less-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od koja pripada dobavljacu za proizvod");
    }
}

export async function findByProduct_SupplyUpdates(updates){
    try{
        if(!moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum nabavke proizvoda od strane dobavljaca, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-supply-updates`,{
            params:{
                updates:moment(updates).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum nabavljenog proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_SupplyUpdatesBetween({updatesStart, updatesEnd}){
    try{
        if(!moment(updatesStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(updatesEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum opsega nabavke proizvoda od strane dobavljaca, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-supply-updates-between`,{
            params:{
                updatesStart:moment(updatesStart).format("YYYY-MM-DDTHH:mm:ss"),
                updatesEnd:moment(updatesEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma nabavljenog proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_ShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("ID police proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id police proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_ShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Red police proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-shelf-row-count`,{
            params:{
                rowCount:parseRowCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red police proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_ShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Kolona police proizvoda za proizvodni nalog, nije pornadjena");
        }
        const response = await api.get(url+`/search/product-shelf-cols"`,{
            params:{
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolonu police proizvida za proizvodni nalog");
    }
}

export async function findByProduct_ShelfIsNull(){
    try{
        const response = await api.get(url+`/search/product-shelf-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji se ne nalazi na polici");
    }
}