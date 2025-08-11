import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/itemSales`;
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isGoodsTypeValid = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isOrderStatusValid = ["CREATED", "PAID", "SHIPPED", "CANCELLED", "PENDING"];

export async function createItemSales({goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice}){
    try{
        if(
            !goodsId || !salesId || !procurementId || !salesOrderId ||
            isNaN(quantity) || parseInt(quantity) <= 0 ||
            isNaN(unitPrice) || parseFloat(unitPrice) <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {goodsId, salesId, procurementId, salesOrderId, quantity:parseInt(quantity), unitPrice:parseFloat(unitPrice)};
        const response = await api.post(url+`/create/new-item-sales`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja stavke-placanja: ${error.message}`);
        }
    }
}

export async function updateItemSales({id, goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice}){
    try{
        if(
            !id ||
            !goodsId || !salesId || !procurementId || !salesOrderId ||
            isNaN(quantity) || parseInt(quantity) <= 0 ||
            isNaN(unitPrice) || parseFloat(unitPrice) <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {goodsId, salesId, procurementId, salesOrderId, quantity:parseInt(quantity), unitPrice:parseFloat(unitPrice)};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja stavke-placanja: ${error.message}`);
        }
    }
}

export async function deleteItemSales(id){
    try{
        if(!id){
            throw new Error("Dati ID za itemSales ne postoji");
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

export async function getOneItemSales(id){
    try{
        if(!id){
            throw new Error("Dati ID za itemSales ne postoji");
        }
        const response = await api.get(url+`/item/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne stavke-nabavke");
    }
}

export async function getAllItemSales(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih stavki-nabavke ");
    }
}

export async function findByGoods_Id(goodsId){
    try{
        if(goodsId == null || isNaN(goodsId)){
            throw new Error("Dati ID za robu nije pronadjen");
        }
        const response = await api.get(utl+`/itemSale/by-goods/${goodsId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju robe");
    }
}

export async function findByGoods_NameContainingIgnoreCase(goodsName){
    try{
        if(!goodsName || typeof goodsName !== "string" || goodsName.trim() === ""){
            throw new Error("Dati naziv robe nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-goods-name`,{
            params:{goodsName:goodsName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu robe");
    }
}

export async function findByGoods_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere nije pronadjena");
        }
        const response = await api.get(url+`/itemSale/by-unit-measure`,{
            params:{unitMeasure:(unitMeasure || "").toUpperCase(),
                headers:getHeader()
            }
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema jedinici mere");
    }
}

export async function findByGoods_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca za robu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-supplier-type`,{
            params:{supplierType:(supplierType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe prema tipu dobavljaca");
    }
}

export async function findByGoods_StorageType(storageType){
    try{
        if(!isStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista za robu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-storage-type`,{
            params:{storageType:(storageType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe prema tipu skladista");
    }
}

export async function findByGoods_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip robe nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-goods-type`,{
            params:{goodsType:(goodsType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu robe");
    }
}

export async function findByGoods_Storage_Id(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati ID za skladiste robe nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe po ID-iju skladista");
    }
}

export async function findByGoods_Supply_Id(supplyId){
    try{
        if(supplyId == null || isNaN(supplyId)){
            throw new Error("Dati ID za dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju dobavljaca");
    }
}

export async function findByGoods_Shelf_Id(shelfId){
    try{
        if(shelfId == null || isNaN(shelfId)){
            throw new Error("Dati ID za policu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju police");
    }
}

export async function findByGoods_Shelf_RowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Dati red police nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-shelf-row`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po redu police");
    }
}

export async function findByGoods_Shelf_Cols(cols){
    try{
        const parseCols = parseInt(cols);
        if(isNaN(cols) || parseCols <= 0){
            throw new Error("Data kolona za policu nije pornadjena");
        }
        const response = await api.get(url+`/itemSale/by-shelf-cols`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe po rafu");
    }
}

export async function findBySales_Id(salesId){
    try{
        if(isNaN(salesId) || salesId == null){
            throw new Error("Dati ID za prodaju nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-sales/id/${salesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju prodaje");
    }
}

export async function findBySales_Buyer_Id(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-sales/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-ju kupca");
    }
}

export async function findBySales_CreatedAt(createdAt){
    try{
        if(!moment(createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datu kreiranja nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-by-createdAt`,{
            params:{createdAt:moment(createdAt).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu kreiranja");
    }
}

export async function findBySales_CreatedAtBetween({createdAtStart, createdAtEnd}){
    try{
        if(
            !moment(createdAtStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(createdAtEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati opseg datuma nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-created-range`,{
            params:{
                createdAtStart:moment(createdAtStart).format("YYYY-MM-DDTHH:mm:ss"),
                createdAtEnd:moment(createdAtEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma kreiranja");
    }
}

export async function findBySales_TotalPrice(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-price`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za Prodaju");
    }
}

export async function findBySales_TotalPriceGreaterThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-price-greate-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za Prodaju vece od");
    }
}

export async function findBySales_TotalPriceLessThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(isNaN(parseTotalPrice) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-price-less-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za Prodaju manjoj od");
    }
}

export async function findBySales_SalesDescription(salesDescription){
    try{
        if(!salesDescription || typeof salesDescription !== "string" || salesDescription.trim() === ""){
            throw new Error("Dati opis prodaje nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-sales-description`,{
            params:{salesDescription:salesDescription},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko trazenja po opisu prodaje");
    }
}

export async function findByProcurement_Id(procurementId){
    try{
        if(procurementId == null || isNaN(procurementId)){
            throw new Error("Dati ID za procurement nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-procurement/${procurementId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju za procurement");
    }
}

export async function findByProcurement_Date(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum za procurement nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-date`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja datuma za procurement");
    }
}

export async function findByProcurement_DateBetween({dateStart, dateEnd}){
    try{
        if(
            !moment(dateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(dateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati opseg datuma za procurement nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-date-range`,{
            params:{
                dateStart:moment(dateStart).format("YYYY-MM-DDTHH:mm:ss"),
                dateEnd:moment(dateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma za procurement");
    }
}

export async function findByProcurement_TotalCost(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena za procurement nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-cost`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za procurement");
    }
}

export async function findByProcurement_TotalCostGreaterThan(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena za procurement nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-cost-greater-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od za procurement");
    }
}

export async function findByProcurement_TotalCostLessThan(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(isNaN(parseTotalCost) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena za procurement nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-cost-less-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od za procurement");
    }
}

export async function findBySalesOrder_Id(salesOrderId){
    try{
        if(salesOrderId == null || isNaN(salesOrderId)){
            throw new Error("Dati ID za salesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-salesOrder/id/${salesOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po Id-iju sa salesOrder");
    }
}

export async function findBySalesOrder_OrderNumber(orderNumber){
    try{
        if(!orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === ""){
            throw new Error("Dati orderNumber za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-order-number`,{
            params:{orderNumber:orderNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema orderNumber-u");
    }
}

export async function findBySalesOrder_OrderDate(orderDate){
    try{
        if(
            !moment(orderDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati orderDate za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-order-date`,{
            params:{orderDate:moment(orderDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja orderDate za SalesOrder");
    }
}

export async function findBySalesOrder_OrderDateBetween({orderDateStart, orderDateEnd}){
    try{
        if(
            !moment(orderDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(orderDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati opseg datuma za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-order-date`,{
            params:{
                orderDateStart:moment(orderDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                orderDateEnd:moment(orderDateEnd).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmount(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina za SalesOrder nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-amount`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupne kolicine za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountGreaterThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina za SalesOrder nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-amount-greater-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupne kolicine vece od za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountLessThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(isNaN(parseTotalAmount) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina za SalesOrder nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-amount-less-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupne kolicine manje od za SalesOrder");
    }
}

export async function findBySalesOrder_Buyer_Id(buyerId){
    try{
        if(buyerId == null || isNaN(buyerId)){
            throw new Error("Dati ID za kupca nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-salesOrder/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID-iju za kupca");
    }
}

export async function findBySalesOrder_OrderStatus(status){
    try{
        if(!isOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema statusu za SalesOrder");
    }
}

export async function findBySalesOrder_Invoice_Id(invoiceId){
    try{
        if(invoiceId == null || isNaN(invoiceId)){
            throw new Error("Dati ID za fakturu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-salesOrder/invoice/${invoiceId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po Id-iju za fakturu");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-less-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini manjoj od");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-greater-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini vecoj od");
    }
}

export async function findByUnitPrice(unitPrice){
    try{
        const parseUnitPrice = parseFloat(unitPrice);
        if(isNaN(parseUnitPrice) || parseUnitPrice <= 0){
            throw new Error("Data jedinicna cena nije pronadjena");
        }
        const response = await api.get(url+`/by-unit-price`,{
            params:{unitPrice:parseUnitPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinicnoj ceni");
    }
}

export async function findByUnitPriceGreaterThan(unitPrice){
    try{
        const parseUnitPrice = parseFloat(unitPrice);
        if(isNaN(parseUnitPrice) || parseUnitPrice <= 0){
            throw new Error("Data jedinicna cena nije pronadjena");
        }
        const response = await api.get(url+`/by-unit-price-greater-than`,{
            params:{unitPrice:parseUnitPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinicnoj ceni vecoj od");
    }
}

export async function findByUnitPriceLessThan(unitPrice){
    try{
        const parseUnitPrice = parseFloat(unitPrice);
        if(isNaN(parseUnitPrice) || parseUnitPrice <= 0){
            throw new Error("Data jedinicna cena nije pronadjena");
        }
        const response = await api.get(url+`/by-unit-price-less-than`,{
            params:{unitPrice:parseUnitPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinicnoj ceni manjoj od");
    }
}

export async function filter({goodsId,
    goodsName,
    unitMeasure,
    supplierType,
    storageType,
    goodsType,
    buyerId,
    createdAtStart,
    createdAtEnd,
    minTotalPrice,
    maxTotalPrice,
    minUnitPrice,
    maxUnitPrice,
    orderStatus}){
    try{
        const parseMinTotalPrice = parseFloat(minTotalPrice);
        const parseMaxTotalPrice = parseFloat(maxTotalPrice);
        const parseMinUnitPrice = parseFloat(minUnitPrice);
        const parseMaxUnitPrice = parseFloat(maxUnitPrice);
        if(
            goodsId != null && !isNaN(goodsId)||
            !goodsName || typeof goodsName !== "string" || goodsName.trim() === "" ||
            !isUnitMeasureValid.includes(unitMeasure?.toUpperCase()) ||
            !isSupplierTypeValid.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValid.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValid.includes(goodsType?.toUpperCase()) ||
            buyerId == null || isNaN(buyerId) ||
            !moment(createdAtStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() || 
            !moment(createdAtEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            isNaN(parseMinTotalPrice) || parseMinTotalPrice < 0 ||
            isNaN(parseMaxTotalPrice) || parseMaxTotalPrice < 0 ||
            isNaN(parseMinUnitPrice) || parseMinUnitPrice < 0 ||
            isNaN(parseMaxUnitPrice) || parseMaxUnitPrice < 0 ||
            !isOrderStatusValid.includes(orderStatus?.toUpperCase())
        ){
            throw new Error("Dati parametri nisu validni");
        }
        const response = await api.get(url+`/search`,{
            params:{
                goodsId:goodsId,
                goodsName:goodsName,
                unitMeasure:(unitMeasure || "").toUpperCase(),
                supplierType:(supplierType || "").toUpperCase(),
                storageType:(storageType || "").toUpperCase(),
                goodsType:(goodsType || "").toUpperCase(),
                buyerId:buyerId,
                createdAtStart:moment(createdAtStart).format("YYYY-MM-DDTHH:mm:ss"),
                createdAtEnd:moment(createdAtEnd).format("YYYY-MM-DDTHH:mm:ss"),
                minTotalPrice:parseMinTotalPrice,
                maxTotalPrice:parseMaxTotalPrice,
                minUnitPrice:parseMinUnitPrice,
                maxUnitPrice:parseMaxUnitPrice,
                orderStatus:(orderStatus || "").toUpperCase()
            }
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom filtriranja");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}