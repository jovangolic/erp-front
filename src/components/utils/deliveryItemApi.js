import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/delivery-items`;
const validateUnitMeasure = ["KOM", "KG", "LITAR", "METAR", "M2"];
const validateSupplierType = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const validateGoodsType = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const validateStorageStatus = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const validateDeliveryStatus = ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

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
        if(!id || !productId || !inboundDeliveryId || !outboundDeliveryId || quantity == null || quantity <= 0){
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
        if(!id){
            throw new Error("Dati Id za inboundDelivery nije pronadjen");
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
        if(!id){
            throw new Error("Dati Id za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska priliko dobavljanja jednog delivery-item-a");
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
            throw new Error("Kolicina mora biti pozitivan broj");
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
        handleApiError(error, "Greska prilikom dobavljanja po kolicini");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Kolicina mora biti veca od nula");
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
        handleApiError(error, "Greska prilikom dobavljanja po kolicini vecoj od: ");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) < 0){
            throw new Error("Kolicina ne sme biti negativan broj");
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
        handleApiError(error, "Greska prilikom dobavljanja po kolicini manjoj od:");
    }
}

export async function findByInboundDelivery_DeliveryDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg inboundDelivery datuma nije dobar");
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
        handleApiError(error,"Greska prema dobavljanju po ulaznoj dostavi");
    }
}

export async function findByOutboundDelivery_DeliveryDateBetween({start,end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg outboundDelivery datuma nije dobar");
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
        handleApiError(error, "Greska prema dobavljanu po izlazoj dostavi");
    }
}

export async function findByProduct(productId){
    try{
        if(!productId){
            throw new Error("Dati id za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dobavljanju po id-ju proizvoda");
    }
}

export async function findByInboundDeliveryId(inboundId){
    try{
        if(!inboundId){
            throw new Error("Dati id za inboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/inbound/${inboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po inbound(dolazu) id-ju");
    }
}

export async function findByOutboundDeliveryId(outboundId){
    try{
        if(!outboundId){
            throw new Error("Dati id za outboundDelivery nije pronadjen");
        }
        const response = await api.get(url+`/outbound/${outboundId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po outbound(odlazeci) id-iju");
    }
}

export async function findByProduct_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv proizvoda nije pronadjen");
        }
        const response = await api.get(url+`/name/${name}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema trazenju po nazivu deliveryItem-a");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(parseCurrentQuantity <= 0 || isNaN(parseCurrentQuantity)){
            throw new Error("Data trenutna kolicina za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicnu za dati proizvod");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(parseCurrentQuantity <= 0 || isNaN(parseCurrentQuantity)){
            throw new Error("Data trenutna kolicina veca od za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicnu vecu od za dati proizvod");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(parseCurrentQuantity <= 0 || isNaN(parseCurrentQuantity)){
            throw new Error("Data trenutna kolicina manja od za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/product-current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicnu manju od za dati proizvod");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!validateUnitMeasure.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere za dati proizvod");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!validateSupplierType.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca za dati proizvod");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip skladista za dati proizvod");
    }
}

export async function findByProduct_GoodsType(goodsType){
    try{
        if(!validateGoodsType.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip robe za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip robe za dati proizvod");
    }
}

export async function findByProduct_Storage_Id(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati id skladista za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_NameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_LocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_Capacity(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(parseStorageCapacity <= 0 || isNaN(parseStorageCapacity)){
            throw new Error("Dati kapacitet skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista za dati proizvod");
    }
}

export async function findByProduct_Storage_CapacityGreaterThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(parseStorageCapacity <= 0 || isNaN(parseStorageCapacity)){
            throw new Error("Dati kapacitet skladista veci od, za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista veci od, za dati proizvod");
    }
}

export async function findByProduct_Storage_CapacityLessThan(storageCapacity){
    try{
        const parseStorageCapacity = parseFloat(storageCapacity);
        if(parseStorageCapacity <= 0 || isNaN(parseStorageCapacity)){
            throw new Error("Dati kapacitet skladista manji od, za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista manji od, za dati proizvod");
    }
}

export async function findByProduct_Storage_StorageType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip skladista za proizvod");
    }
}

export async function findByProduct_Storage_StorageStatus(status){
    try{
        if(!validateStorageStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status skladista za dati proizvod");
    }
}

export async function calculateUsedCapacityByStorageId(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati ID za skladiste nije pronadjen");
        }
        const response = await api.get(url+`/calculate-used-capacity/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu iskorscenost datog sladista");
    }
}

export async function sumInboundQuantityByStorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati zbir kolicine inbound skladista nije pronadjen");
        }
        const response = await api.get(url+`/sum-inbound-quantity/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir kolicine inbound skladista");
    }
}

export async function sumOutboundQuantityByStorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati zbir kolicine outbound skladista nije pronadjen");
        }
        const response = await api.get(url+`/sum-outbound-quantity/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir kolicine outbound skladista");
    }
}

export async function findByProductSupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati ID za dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca za dati proizvod");
    }
}

export async function findByProductShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id police nije pronadjen");
        }
        const response = await api.get(url+`/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id police za dati proizvoid");
    }
}

export async function findByProductShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Dati red police za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli red police za dati proizvod");
    }
}

export async function findByProductShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Data kolona police za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kolonu police za dati proizvod");
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
            throw new Error("Dati datum dostave za inbound nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum dostave za inbound");
    }
}

export async function findByInboundDelivery_Supply_Id(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id dobavljaca za inbound-delivery nije pronadjen");
        }
        const response = await api.get(url+`/inbound/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca za inbound-delivery");
    }
}

export async function findByInboundDelivery_Status(status){
    try{
        if(!validateDeliveryStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status dostave za inbound-delivery, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status dostave za inbound-delivery");
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
            throw new Error("Dati datum dostave za outbound-delivery, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum dostave za outbound-delivery");
    }
}

export async function findByOutboundDelivery_Status(status){
    try{
        if(!validateDeliveryStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status dostave za outbound-delivery, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status dostave za outbound-delivery");
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
            throw new Error("Dati id kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerNameContainingIgnoreCase(companyName){
    try{
        if(!companyName || typeof companyName !== "string" || companyName.trim() === ""){
            throw new Error("Dati naziv kompanije kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-company-name`,{
            params:{companyName:companyName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv kompanije kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerAddress(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-address`,{
            params:{address:address},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerEmailLikeIgnoreCase(buyerEmail){
    try{
        if(!buyerEmail || typeof buyerEmail !== "string" || buyerEmail.trim() === ""){
            throw new Error("Dati email kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-email`,{
            params:{buyerEmail:buyerEmail},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerPhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona kupca za outbound-delivery");
    }
}

export async function findByOutboundDelivery_BuyerContactPersonContainingIgnoreCase(contactPerson){
    try{
        if(!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === ""){
            throw new Error("Data kontakt-osoba kupca za outbound-delivery, nije pronadjen");
        }
        const response = await api.get(url+`/outbound/buyer-contact-person`,{
            params:{contactPerson:contactPerson},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli konakt-osobu kupca za outbound-delivery");
    }
}




function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}