import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/delivery-items`;
const validateUnitMeasure = ["KOM", "KG", "LITAR", "METAR", "M2"];
const validateSupplierType = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const validateGoodsType = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const validateStorageStatus = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const validateDeliveryStatus = ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
const isDeliveryItemStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createinboundDeliveryId({productId,quantity,inboundDeliveryId,outboundDeliveryId}){
    if(!productId || !inboundDeliveryId || !outboundDeliveryId || quantity == null || quantity <= 0){
        throw new Error("Sva polja moraju biti popunjena");
    }
    try{
        const requestBody = {productId, quantity,inboundDeliveryId, outboundDeliveryId};
        const response = await api.post(url+`/create/new-delivery-item`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja stavke za dostavu");
    }
}

export async function update({id,productId,quantity,inboundDeliveryId,outboundDeliveryId}){
    try{    
        if(id == null || isNaN(id) || !productId || !inboundDeliveryId || !outboundDeliveryId || quantity == null || quantity <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {productId, quantity,inboundDeliveryId, outboundDeliveryId};
        const response = await api.put(utl+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteDeliveryItem(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati Id "+id+" za inboundDelivery nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findById(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati Id "+id+" za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska priliko dobavljanja jednog delivery-item-a po "+id+" id-iju");
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
        handleApiError(error, "Greska prilikom trazenja svih deliveryItem-a");
    }
}

export async function findByQuantity(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Kolicina "+quantity+" mora biti pozitivan broj");
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
        handleApiError(error, "Greska prilikom dobavljanja po kolicini "+quantity);
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Kolicina mora biti veca "+quantity+" od nula");
        }
        const response = await api.get(url+`/quantity-greater-than`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kolicini vecoj od: "+quantity);
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) < 0){
            throw new Error("Data kolicina manja od "+quantity+" nije pronadjena");
        }
        const response = await api.get(url+`quantity-less-than`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kolicini manjoj od: "+quantity);
    }
}

export async function findByInboundDelivery_DeliveryDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg inboundDelivery datuma "+start+" - "+end+" nije pronadjen");
        }
        const response = await api.get(url+`/inbound-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" za inbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween({start,end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg outboundDelivery datuma "+start+" - "+end+" nije pronadjen");
        }
        const response = await api.get(url+`/outbound-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Trenutno nismo pronasli opseg datuma "+start+" - "+end+" za outbound-delivery");
    }
}

export async function findByProduct(productId){
    try{
        if(productId == null || isNaN(productId)){
            throw new Error("Dati id "+productId+" za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dobavljanju po "+productId+" id-ju proizvoda");
    }
}

export async function findByInboundDeliveryId(inboundId){
    try{
        if(inboundId == null || isNaN(inboundId)){
            throw new Error("Dati id"+inboundId+" za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/inbound/${inboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po inbound(dolazu) "+inboundId+" id-ju");
    }
}

export async function findByOutboundDeliveryId(outboundId){
    try{
        if(outboundId == null || isNaN(outboundId)){
            throw new Error("Dati id "+outboundId+" za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound/${outboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po outbound(odlazeci) "+outboundId+" id-iju");
    }
}

export async function findByProduct_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" proizvoda nije pronadjen");
        }
        const response = await api.get(url+`/name/${name}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po nazivu "+name+" deliveryItem-a");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(parseCurrentQuantity <= 0 || isNaN(parseCurrentQuantity)){
            throw new Error("Data trenutna kolicina "+parseCurrentQuantity+" za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicnu "+currentQuantity+" za dati proizvod");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(parseCurrentQuantity <= 0 || isNaN(parseCurrentQuantity)){
            throw new Error("Data trenutna kolicina veca od "+parseCurrentQuantity+" za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicnu vecu od "+currentQuantity+" za dati proizvod");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(parseCurrentQuantity <= 0 || isNaN(parseCurrentQuantity)){
            throw new Error("Data trenutna kolicina manja od "+parseCurrentQuantity+" za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicnu manju od "+currentQuantity+" za dati proizvod");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!validateUnitMeasure.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/search/product-by-unit-measure`,{
            params :{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" za dati proizvod");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!validateSupplierType.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" dobavljaca za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-by-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+supplierType+" dobavljaca za dati proizvod");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-by-storage-type`,{
            params:{
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+storageType+" skladista za dati proizvod");
    }
}

export async function findByProduct_GoodsType(goodsType){
    try{
        if(!validateGoodsType.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-by-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+goodsType+" robe za dati proizvod");
    }
}

export async function findByProduct_Storage_Id(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati id "+storageId+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_NameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-by-storage-name`,{
            params:{
                storageName:storageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_LocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-by-storage-location`,{
            params:{
                storageLocation:storageLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_Capacity(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(parseStorageCapacity <= 0 || isNaN(parseStorageCapacity)){
            throw new Error("Dati kapacitet "+parseStorageCapacity+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-capacity`,{
            params:{
                storageCapacity:parseStorageCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+storageCapacity+" skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_CapacityGreaterThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(parseStorageCapacity <= 0 || isNaN(parseStorageCapacity)){
            throw new Error("Dati kapacitet skladista veci od "+parseStorageCapacity+", za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-capacity-greater-than`,{
            params:{
                storageCapacity:parseStorageCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista veci od "+storageCapacity+", za dati proizvod");
    }
}

export async function findByProduct_Storage_CapacityLessThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(parseStorageCapacity <= 0 || isNaN(parseStorageCapacity)){
            throw new Error("Dati kapacitet skladista manji od "+parseStorageCapacity+", za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-capacity-less-than`,{
            params:{
                storageCapacity:parseStorageCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista manji od "+storageCapacity+", za dati proizvod");
    }
}

export async function findByProduct_Storage_StorageType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista za proizvod");
    }
}

export async function findByProduct_Storage_StorageStatus(status){
    try{
        if(!validateStorageStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" skladista za dati proizvod");
    }
}

export async function calculateUsedCapacityByStorageId(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati ID "+storageId+" za skladiste nije pronadjen");
        }
        const response = await api.get(url+`/calculate-used-capacity/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu iskorscenost datog sladista po "+storageId+" id-iju");
    }
}

export async function sumInboundQuantityByStorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati zbir kolicine inbound skladista po id-iju "+storageId+" nije pronadjen");
        }
        const response = await api.get(url+`/sum-inbound-quantity/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir kolicine inbound skladista po "+storageId+" id-iju");
    }
}

export async function sumOutboundQuantityByStorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati zbir kolicine outbound skladista po id-iju "+storageId+" nije pronadjen");
        }
        const response = await api.get(url+`/sum-outbound-quantity/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir kolicine outbound skladista po "+storageId+" id-iju");
    }
}

export async function findByProductSupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati ID "+supplyId+" za dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za dati proizvod");
    }
}

export async function findByProductShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id "+shelfId+" police nije pronadjen");
        }
        const response = await api.get(url+`/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+"police za dati proizvoid");
    }
}

export async function findByProductShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Dati red  "+parseRowCount+ "police za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/product-shelf-row-count`,{
            params:{
                rowCount:parseRowCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red "+rowCount+" police za dati proizvod");
    }
}

export async function findByProductShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Data kolona "+parseCols+" police za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/product-shelf-cols`,{
            params:{
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolonu "+cols+" police za dati proizvod");
    }
}

export async function findProductsWithoutShelf(){
    try{
        const response = await api.get(url+`/product-without-shelf`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod bez police");
    }
}

export async function findByInboundDelivery_DeliveryDate(start){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum "+date+" dostave za inbound nije pronadjen");
        }
        const response = await api.get(url+`/inbound-delivery-date`,{
            params:{
                start:moment(start).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" dostave za inbound");
    }
}

export async function findByInboundDelivery_Supply_Id(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id "+supplyId+" dobavljaca za inbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/inbound/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za inbound-delivery");
    }
}

export async function findByInboundDelivery_Status(status){
    try{
        if(!validateDeliveryStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" dostave za inbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/inbound-delivery-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" dostave za inbound-delivery");
    }
}

export async function findByInboundDelivery_Status_Pending(){
    try{
        const response = await api.get(url+`/inbound-delivery-status-pending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'PENDING' za inbound-delivery");
    }
}

export async function findByInboundDelivery_Status_InTransit(){
    try{
        const response = await api.get(url+`/inbound-delivery-status-in-transit`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'IN_TRANSIT' za inbound-delivery");
    }
}

export async function findByInboundDelivery_Status_Delivered(){
    try{
        const response = await api.get(url+`/inbound-delivery-status-delivered`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'DELIVERED' za inbound-delivery");
    }
}

export async function findByInboundDelivery_Status_Cancelled(){
    try{
        const response = await api.get(url+`/inbound-delivery-status-cancelled`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'CANCELLED' za inbound-delivery");
    }
}

export async function findByOutboundDelivery_DeliveryDate(deliveryDate){
    try{
        if(!moment(deliveryDate, "YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum dostave "+deliveryDate+" za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery-date`,{
            params:{
                deliveryDate:moment(deliveryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum dostave "+deliveryDate+" za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{
        if(!validateDeliveryStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" dostave za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound-delivery-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status_Pending(){
    try{
        const response = await api.get(url+`/outbound-delivery-status-pending`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'PENDING' za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status_InTransit(){
    try{
        const response = await api.get(url+`/outbound-delivery-status-in-transit`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'IN_TRANSIT' za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status_Delivered(){
    try{
        const response = await api.get(url+`/outbound-delivery-status-delivered`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'DELIVERED' za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status_Cancelled(){
    try{
        const response = await api.get(url+`/outbound-delivery-status-cancelled`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status dostave = 'CANCELLED' za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerId(buyerId){
    try{
        if(isNaN(buyerId) || buyerId == null){
            throw new Error("Dati id "+buyerId+" kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+buyerId+" kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerNameContainingIgnoreCase(companyName){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === ""){
            throw new Error("Dati naziv "+companyName+" kompanije kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-company-name`,{
            params:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+companyName+" kompanije kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerAddress(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa "+address+" kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-address`,{
            params:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu "+address+" kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerEmailLikeIgnoreCase(buyerEmail){
    try{
        if(!buyerEmail || typeof buyerEmail !== "string" || buyerEmail.trim() === ""){
            throw new Error("Dati email "+buyerEmail+" kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-email`,{
            params:{buyerEmail:buyerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+buyerEmail+"kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerPhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phoneNumber+" kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerContactPersonContainingIgnoreCase(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Data kontakt-osoba "+contactPerson+" kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-contact-person`,{
            params:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli konakt-osobu "+contactPerson+" kupca za outbound-delivery");
    }
}

export async function trackDeliveryItem(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" delivery-item za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track-delivery-item/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" delivery-item za pracenje");
    }
}

export async function trackByProduct(productId){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" proizvoda od delivery-item za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track-product/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" proizvoda od delivery-itema za pracenje");
    }
}

export async function trackByInboundDelivery(deliveryId){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" nadolazece stavke od delivery-item za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track-inbound-delivery/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" nadolazece stavke od delivery-itema za pracenje");
    }
}

export async function trackByOutboundDelivery(deliveryId){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" odlazece stavke od delivery-item za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track-outbound-delivery/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" odlazece stavke od delivery-itema za pracenje");
    }
}

export async function confirmDeliveryItem(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu delivery-itema, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(err){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu delivery-itema");
    }
}

export async function closeDeliveryItem(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje delivery-itema, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje delivery-itema");
    }
}

export async function cancelDelvieryItem(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje delivery-itema, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje delivery-itema");
    }
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isDeliveryItemStatusValid.includes(status?.toUpperCase())){
                throw new Error("ID "+id+" i status delivery-item "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status delivery-item "+status);
    }
}

export async function saveDeliveryItem({productId,inboundDeliveryId,outboundDeliveryId,quantity,status,confirmed = false}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(productId) || productId == null || isNaN(inboundDeliveryId) || inboundDeliveryId == null || isNaN(outboundDeliveryId) || outboundDeliveryId <= 0 ||
           isNaN(parseQuantity) || parseQuantity <= 0 || !isDeliveryItemStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {productId,inboundDeliveryId,outboundDeliveryId,quantity,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,productId,inboundDeliveryId,outboundDeliveryId,quantity,status,confirmed}){
    try{
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0 ){
            throw new Error("Kolicina "+parseQuantity+" mora biti broj");
        }
        if(isNaN(productId) || productId == null){
            throw new Error("Product-Id "+productId+" mora biti ceo broj");
        }
        if(isNaN(inboundDeliveryId) || inboundDeliveryId == null){
            throw new Error("Inbound-delivery Id "+inboundDeliveryId+" mora biti ceo broj");
        }
        if(isNaN(outboundDeliveryId) || outboundDeliveryId == null){
            throw new Error("Outbound-delivery Id "+outboundDeliveryId+" mora biti ceo broj");
        }
        if(!isDeliveryItemStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" treba izabrati");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrdu "+confirmed+" treba izabrata");
        }
        const requestBody = {productId,inboundDeliveryId,outboundDeliveryId,quantity,status,confirmed};
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        requests.forEach((index, req) => {
            if (req.id == null || isNaN(req.id)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            const parseQuantity = parseFloat(req.quantity);
            if(isNaN(parseQuantity) || parseQuantity <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'kolicina' mora biti broj`);
            }
            if (req.productId == null || isNaN(req.productId)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'product-id' je obavezan i mora biti broj`);
            }
            if (req.inboundDeliveryId == null || isNaN(req.inboundDeliveryId)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'inboundDelivery-id' je obavezan i mora biti broj`);
            }
            if (req.outboundDeliveryId == null || isNaN(req.outboundDeliveryId)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'outboundDelivery-Id' je obavezan i mora biti broj`);
            }
            if(!isDeliveryItemStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' je obavezan `);
            }
            if(typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' je obavezan `);
            }
        });
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
}

export async function generalSearch(filters = {}){
    try{
        const cleanedFilters = cleanFilters(filters);
        const response = await api.post(url+`/general-search`,cleanedFilters,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom generalne pretrage");
    }
}