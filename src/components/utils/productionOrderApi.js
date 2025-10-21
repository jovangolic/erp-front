import moment from "moment";
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
        const validateStartDate = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEndDate = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if(
            !orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === "" ||
            isNaN(productId) || productId == null || isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0 ||
            isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 ||
            !validateStartDate || !validateEndDate ||
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
        const validateStartDate = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        const validateEndDate = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if(
            id == null || isNaN(id) ||
            !orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === "" ||
            isNaN(productId) || productId == null || isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0 ||
            isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 ||
            !validateStartDate || !validateEndDate ||
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
            throw new Error("Dati id "+id+" nije pronadjen");
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
            throw new Error("Dati id "+id+" nije pronadjen");
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
            throw new Error("Dati broj naloga za proizvdnju "+orderNumber+", nije pronadjen");
        }
        const response = await api.get(url+`/find-by-order-number`,{
            params:{orderNumber:orderNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj naloga "+orderNumber+" za proizvodni-nalog");
    }
}

export async function findByProduct_Id(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id "+productId+" proizvoda, nije pronadjen");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id proizvoda "+productId+" za proizvdni malog");
    }
}

export async function findByProduct_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv proizvoda "+name+" za proizvodni-nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" proizvoda za proizvodni-nalog");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina proizvoda "+parseCurrentQuantity+" za proizvodni-nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu proizvoda "+currentQuantity+" za proizvodni-nalog");
    }
}

export async function findByStatus(status){
    try{
        if(!isProductionOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" proizvodnog-naloga, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" proizvodnog-naloga");
    }
}

export async function findByWorkCenter_Id(workCenterId){
    try{
        if(isNaN(workCenterId) || workCenterId == null){
            throw new Error("Dati id radnog centra "+workCenterId+", nije pronadjen");
        }
        const response = await api.get(url+`/workCenter/${workCenterId}`,{
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+workCenterId+" radnog-centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" radnog centra, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" radnog centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" radnog centra, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" radnog centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_Capacity(capacity){
    try{
        const parseCapacity = parseInt(capacity,10);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" radnog centra, nije pronadjen");
        }
        const response = await api.get(url+`/by-work-center-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" radnog centra, za proizvodni nalog");
    }
}

export async function findByWorkCenter_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseInt(capacity,10);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra veci od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra veci od "+capacity+", za proizvodni nalog");
    }
}

export async function findByWorkCenter_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseInt(capacity,10);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra manji od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra manji od "+capacity+", za proizvodni nalog");
    }
}

export async function findByQuantityPlanned(quantityPlanned){
    try{
        const parseQuantityPlanned = parseInt(quantityPlanned,10);
        if(isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0){
            throw new Error("Data planirana kolicina "+parseQuantityPlanned+" za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli planiranu kolicinu "+quantityPlanned+" ,za proizvodni nalog");
    }
}

export async function findByQuantityProduced(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data proizvedena kolicina "+parseQuantityProduced+" za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu "+quantityProduced+" za proizvodni nalog");
    }
}

export async function findByStartDateBetween(start, end){
    try{
        const validateStartDate = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateEndDate = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateStartDate || !validateEndDate){
            throw new Error("Dati pocetak datumskog opsega "+start+" "+end+", nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Trenutno nismo pronasli pocetak datumskog opsega "+start+" "+end+" za proizvodni nalog");
    }
}

export async function findByStartDate(startDate){
    try{
        const validateStartDate = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        if(!validateStartDate){
            throw new Error("Dati pocetak datuma "+startDate+" za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli pocetak datuma "+startDate+" za proizvodni nalog");
    }
}

export async function findByEndDate(endDate){
    try{
        const validateEndDate = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD",true).isValid();
        if(!validateEndDate){
            throw new Error("Datum kraja "+endDate+" za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kraj "+endDate+" datuma za proizvodni nalog");
    }
}

export async function searchOrders({productName, workCenterName,startDateFrom, startDateTo, status}){
    try{
        const validateStartDate = moment.isMoment(startDateFrom) || moment(startDateFrom,"YYYY-MM-DD",true).isValid();
        const validateEndDate = moment.isMoment(startDateTo) || moment(startDateTo,"YYYY-MM-DD",true).isValid();
        if(
            !productName || typeof productName !== "string" || productName.trim() === "" ||
            !workCenterName || typeof workCenterName !== "string" || workCenterName.trim() === "" || 
            !validateStartDate||
            !validateEndDate || 
            !isProductionOrderStatusValid.includes(status?.toUpperCase())){
                throw new Error("Dati parametri: "+productName+" , "+workCenterName+" , "+startDateFrom+" , "+startDateTo+" , "+status+" , nisu pronasli trazeni rezultat");
        }
        if(moment(startDateTo).isBefore(moment(startDateFrom))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Trenutno nismo pronasli rezultat za date parametre pretrage: "+productName+" , "+workCenterName+" , "+startDateFrom+" , "+startDateTo+" , "+status);
    }
}

export async function findByStartDateGreaterThanEqual(start){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Datum pocetka veci ili jednak "+start+" za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum pocetka veci ili jednak "+start);
    }
}

export async function findOrdersWithStartDateAfterOrEqual(startDate){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Datum pocetka "+startDate+" za proizvodne naloge posle, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naloge sa datumom posle datog "+startDate+" datuma");
    }
}

export async function countAvailableCapacity(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/${id}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" dosupnog kapaciteta skladista");
    }
}

export async function allocateCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati id "+id+" skladista i kolicina za alociranje "+parseAmount+", nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli alocirani kapacitet "+amount+" za id "+id+" skladista");
    }
}

export async function releaseCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(isNaN(id) || id == null || isNaN(parseAmount) || parseAmount <= 0){
            throw new Error("Dati id "+id+" skladista i kolicina za oslobadjanje "+parseAmount+", nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/release`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" skladista i kolicinu "+amount+" za oslobadjanje");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Kolicina proizvoda veca od "+parseCurrentQuantity+" za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu proizvoda vecu od "+currentQuantity+" za proizvodni nalog");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Kolicina proizvoda manja od "+parseCurrentQuantity+" za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu proizvoda manju od "+currentQuantity+" za proizvodni nalog");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" proizvoda za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Tip dobavljaca "+supplierType+" proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca "+supplierType+" proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Tip skladista "+storageType+" proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+storageType+" skladista proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_StorageStatus(storageStatus){
    try{
        if(!validateStorageStatus.includes(storageStatus?.toUpperCase())){
            throw new Error("Status "+storageStatus+" skladista daqtog proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+storageStatus+" skladista proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("ID "+storageId+" skaldista za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista za proizvod");
    }
}

export async function findByProduct_StorageNameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Naziv "+storageName+" skladista proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" skaldista proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageLocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Lokacija "+storageLocation+" skladista proizvoda za proizvodni nalog, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" skaldista proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Kapacitet "+parseCapacity+" skladista datog proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" skaldista datog proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_StorageCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Kapacitet skladista datog proizvoda veceg od "+parseCapacity+", za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista datog proizvoda veceg od "+capacity+", za proizvodni nalog");
    }
}

export async function findByProduct_StorageCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Kapacitet skladista datog proizvoda manjeg od "+parseCapacity+", za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista datog proizvoda manjeg od "+capacity+", za proizvodni nalog");
    }
}

export async function findByProduct_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("ID "+supplyId+" dobavljaca proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_SupplyQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina "+parseQuantity+" koju dobavljac dobavlja za proizvod, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+quantity+" koja pripada dobavljacu za proizvod");
    }
}

export async function findByProduct_SupplyQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina koju dobavljac dobavlja za proizvod veci od "+parseQuantity+", nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od "+quantity+" koja pripada dobavljacu za proizvod");
    }
}

export async function findByProduct_SupplyQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina koju dobavljac dobavlja za proizvod manja od "+parseQuantity+", nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od "+quantity+" koja pripada dobavljacu za proizvod");
    }
}

export async function findByProduct_SupplyUpdates(updates){
    try{
        const validateUpdated = moment.isMoment(updates) || moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateUpdated){
            throw new Error("Datum nabavke "+updates+" proizvoda od strane dobavljaca, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum "+updates+" nabavljenog proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_SupplyUpdatesBetween({updatesStart, updatesEnd}){
    try{
        const validateUpdatedStart = moment.isMoment(updatesStart) || moment(updatesStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateUpdatedEnd = moment.isMoment(updatesEnd) || moment(updatesEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateUpdatedStart || !validateUpdatedEnd){
            throw new Error("Datum opsega "+updatesStart+ " - "+updatesEnd+" nabavke proizvoda od strane dobavljaca, nije pronadjen");
        }
        if(moment(updatesEnd).isBefore(moment(updatesStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
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
        handleApiError(error,"Trenutno nismo pronasli opseg "+updatesStart+" - "+updatesEnd+" datuma nabavljenog proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_ShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("ID "+shelfId+" police proizvoda za proizvodni nalog, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police proizvoda za proizvodni nalog");
    }
}

export async function findByProduct_ShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Red "+parseRowCount+" police proizvoda za proizvodni nalog, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli red "+rowCount+" police proizvoda, za proizvodni nalog");
    }
}

export async function findByProduct_ShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Kolona "+parseCols+" police proizvoda za proizvodni nalog, nije pornadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolonu "+cols+" police proizvida za proizvodni nalog");
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