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
        const parseQuantity = parseInt(quantity, 10);
        const parseUnitPrice = parseFloat(unitPrice);
        if(
            goodsId == null || Number.isNaN(Number(goodsId)) || 
            salesId == null || Number.isNaN(Number(salesId)) || 
            procurementId == null || Number.isNaN(Number(procurementId)) || 
            salesOrderId == null || Number.isNaN(Number(salesOrderId)) ||
            Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0 ||
            Number.isNaN(Number(parseUnitPrice)) || parseUnitPrice <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice};
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
            throw new Error(`Greska prilikom kreiranja stavke-placanja: ${error.message}`);
        }
    }
}

export async function updateItemSales({id, goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice}){
    try{
        const parseQuantity = parseInt(quantity, 10);
        const parseUnitPrice = parseFloat(unitPrice);
        if(
            id == null || Number.isNaN(Number(id))  || 
            goodsId == null || Number.isNaN(Number(goodsId)) || 
            salesId == null || Number.isNaN(Number(salesId)) || 
            procurementId == null || Number.isNaN(Number(procurementId)) || 
            salesOrderId == null || Number.isNaN(Number(salesOrderId)) ||
            Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0 ||
            Number.isNaN(Number(parseUnitPrice)) || parseUnitPrice <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice};
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
            throw new Error(`Greska prilikom azuriranja stavke-placanja: ${error.message}`);
        }
    }
}

export async function deleteItemSales(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za itemSales ne postoji");
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za itemSales ne postoji");
        }
        const response = await api.get(url+`/item/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne stavke-nabavke po "+id+" id-iju");
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
        if(goodsId == null || Number.isNaN(Number(goodsId))){
            throw new Error("Dati ID "+goodsId+" za robu nije pronadjen");
        }
        const response = await api.get(utl+`/itemSale/by-goods/${goodsId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+goodsId+" ID-iju robe");
    }
}

export async function findByGoods_NameContainingIgnoreCase(goodsName){
    try{
        if(!goodsName || typeof goodsName !== "string" || goodsName.trim() === ""){
            throw new Error("Dati naziv "+goodsName+" robe nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-goods-name`,{
            params:{goodsName:goodsName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu "+goodsName+" robe");
    }
}

export async function findByGoods_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" nije pronadjena");
        }
        const response = await api.get(url+`/itemSale/by-unit-measure`,{
            params:{unitMeasure:(unitMeasure || "").toUpperCase(),
                headers:getHeader()
            }
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema jedinici mere "+unitMeasure);
    }
}

export async function findByGoods_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" dobavljaca za robu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-supplier-type`,{
            params:{supplierType:(supplierType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe prema tipu "+supplierType+" dobavljaca");
    }
}

export async function findByGoods_StorageType(storageType){
    try{
        if(!isStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista za robu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-storage-type`,{
            params:{storageType:(storageType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe prema tipu "+storageType+" skladista");
    }
}

export async function findByGoods_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-goods-type`,{
            params:{goodsType:(goodsType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu "+goodsType+" robe");
    }
}

export async function findByGoods_Storage_Id(storageId){
    try{
        if(storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Dati ID "+storageId+" za skladiste robe nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe po "+storageId+" ID-iju skladista");
    }
}

export async function findByGoods_Supply_Id(supplyId){
    try{
        if(supplyId == null || Number.isNaN(Number(supplyId))){
            throw new Error("Dati ID "+supplyId+" za dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+supplyId+" ID-ju dobavljaca");
    }
}

export async function findByGoods_Shelf_Id(shelfId){
    try{
        if(shelfId == null || Number.isNaN(Number(shelfId))){
            throw new Error("Dati ID "+shelfId+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+shelfId+" ID-ju police");
    }
}

export async function findByGoods_Shelf_RowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount);
        if(Number.isNaN(Number(parseRowCount)) || parseRowCount <= 0){
            throw new Error("Dati red "+parseRowCount+" police nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-shelf-row`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po redu "+rowCount+" police");
    }
}

export async function findByGoods_Shelf_Cols(cols){
    try{
        const parseCols = parseInt(cols);
        if(Number.isNaN(Number(cols)) || parseCols <= 0){
            throw new Error("Data kolona "+parseCols+" za policu nije pronadjena");
        }
        const response = await api.get(url+`/itemSale/by-shelf-cols`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja robe po rafu "+cols);
    }
}

export async function findBySales_Id(salesId){
    try{
        if(Number.isNaN(Number(salesId)) || salesId == null){
            throw new Error("Dati ID "+salesId+" za prodaju nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-sales/id/${salesId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+salesId+" ID-ju prodaje");
    }
}

export async function findBySales_Buyer_Id(buyerId){
    try{
        if(buyerId == null || Number.isNaN(Number(buyerId))){
            throw new Error("Dati ID "+buyerId+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-sales/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+buyerId+" ID-ju kupca");
    }
}

export async function findBySales_CreatedAt(createdAt){
    try{
        const validateDate = moment.isMoment(createdAt) || moment(createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+validateDate+" kreiranja nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-by-createdAt`,{
            params:{createdAt:moment(validateDate).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu kreiranja "+createdAt);
    }
}

export async function findBySales_CreatedAtBetween({createdAtStart, createdAtEnd}){
    try{
        const validateDateStart = moment.isMoment(createdAtStart) || moment(createdAtStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(createdAtEnd) || moment(createdAtEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            !validateDateStart || !validateDateEnd
        ){
            throw new Error("Dati opseg datuma "+validateDateStart+" - "+validateDateEnd+" nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/itemSale-created-range`,{
            params:{
                createdAtStart:moment(validateDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                createdAtEnd:moment(validateDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma "+createdAtStart+" - "+createdAtEnd+" kreiranja");
    }
}

export async function findBySales_TotalPrice(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(Number.isNaN(Number(parseTotalPrice)) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-price`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj "+totalPrice+" ceni za Prodaju");
    }
}

export async function findBySales_TotalPriceGreaterThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(Number.isNaN(Number(parseTotalPrice)) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena veca od "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-price-greate-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za Prodaju vece od "+totalPrice);
    }
}

export async function findBySales_TotalPriceLessThan(totalPrice){
    try{
        const parseTotalPrice = parseFloat(totalPrice);
        if(Number.isNaN(Number(parseTotalPrice)) || parseTotalPrice <= 0){
            throw new Error("Data ukupna cena manja od "+parseTotalPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-price-less-than`,{
            params:{totalPrice:parseTotalPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni za Prodaju manjoj od "+totalPrice);
    }
}

export async function findBySales_SalesDescription(salesDescription){
    try{
        if(!salesDescription || typeof salesDescription !== "string" || salesDescription.trim() === ""){
            throw new Error("Dati opis "+salesDescription+" prodaje nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-sales-description`,{
            params:{salesDescription:salesDescription},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko trazenja po opisu "+salesDescription+" prodaje");
    }
}

export async function findByProcurement_Id(procurementId){
    try{
        if(procurementId == null || Number.isNaN(Number(procurementId))){
            throw new Error("Dati ID "+procurementId+" za procurement nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-procurement/${procurementId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+procurementId+" ID-iju za procurement");
    }
}

export async function findByProcurement_Date(date){
    try{
        const validateDateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart){
            throw new Error("Dati datum "+validateDateStart+" za procurement nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-date`,{
            params:{date:moment(validateDateStart).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja datuma "+date+" za procurement");
    }
}

export async function findByProcurement_DateBetween({dateStart, dateEnd}){
    try{
        const validateDateStart = moment.isMoment(dateStart) || moment(dateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(dateEnd) || moment(dateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            !validateDateStart || !validateDateEnd
        ){
            throw new Error("Dati opseg datuma "+validateDateStart+" - "+validateDateEnd+" za procurement nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/itemSale-date-range`,{
            params:{
                dateStart:moment(validateDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                dateEnd:moment(validateDateEnd).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma "+dateStart+" - "+dateEnd+" za procurement");
    }
}

export async function findByProcurement_TotalCost(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(Number.isNaN(Number(parseTotalCost)) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena "+parseTotalCost+" za procurement nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-cost`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni "+totalCost+" za procurement");
    }
}

export async function findByProcurement_TotalCostGreaterThan(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(Number.isNaN(Number(parseTotalCost)) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena veca od "+parseTotalCost+" za procurement nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-cost-greater-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni vecoj od "+totalCost+" za procurement");
    }
}

export async function findByProcurement_TotalCostLessThan(totalCost){
    try{
        const parseTotalCost = parseFloat(totalCost);
        if(Number.isNaN(Number(parseTotalCost)) || parseTotalCost <= 0){
            throw new Error("Data ukupna cena manaj od "+parseTotalCost+" za procurement nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-cost-less-than`,{
            params:{totalCost:parseTotalCost},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ukupnoj ceni manjoj od "+totalCost+"za procurement");
    }
}

export async function findBySalesOrder_Id(salesOrderId){
    try{
        if(salesOrderId == null || Number.isNaN(Number(salesOrderId))){
            throw new Error("Dati ID "+salesOrderId+" za salesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-salesOrder/id/${salesOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+salesOrderId+" Id-iju sa salesOrder");
    }
}

export async function findBySalesOrder_OrderNumber(orderNumber){
    try{
        if(!orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === ""){
            throw new Error("Dati broj-naloga "+orderNumber+" za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-order-number`,{
            params:{orderNumber:orderNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema broju-naloga "+orderNumber);
    }
}

export async function findBySalesOrder_OrderDate(orderDate){
    try{
        const validateDateStart = moment.isMoment(orderDate) || moment(orderDate,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart){
            throw new Error("Dati datum-naloga "+validateDateStart+" za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-order-date`,{
            params:{orderDate:moment(validateDateStart).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja datum-naloga "+date+" za SalesOrder");
    }
}

export async function findBySalesOrder_OrderDateBetween({orderDateStart, orderDateEnd}){
    try{
        const validateDateStart = moment.isMoment(orderDateStart) || moment(orderDateStart,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(orderDateEnd) || moment(orderDateEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg "+validateDateStart+" - "+validateDateEnd+" datuma za SalesOrder nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/itemSale-order-date`,{
            params:{
                orderDateStart:moment(validateDateStart).format("YYYY-MM-DDTHH:mm:ss"),
                orderDateEnd:moment(validateDateEnd).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega "+orderDateStart+" - "+orderDateEnd+" datuma za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmount(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(Number.isNaN(Number(parseTotalAmount)) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina "+parseTotalAmount+" za SalesOrder nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-amount`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupne kolicine "+totalAmount+" za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountGreaterThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(Number.isNaN(Number(parseTotalAmount)) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina veca od "+parseTotalAmount+" za SalesOrder nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-amount-greater-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupne kolicine vece od "+totalAmount+" za SalesOrder");
    }
}

export async function findBySalesOrder_TotalAmountLessThan(totalAmount){
    try{
        const parseTotalAmount = parseFloat(totalAmount);
        if(Number.isNaN(Number(parseTotalAmount)) || parseTotalAmount <= 0){
            throw new Error("Data ukupna kolicina manja od "+parseTotalAmount+" za SalesOrder nije pronadjena");
        }
        const response = await api.get(url+`/itemSale-total-amount-less-than`,{
            params:{totalAmount:parseTotalAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ukupne kolicine manje od "+totalAmount+" za SalesOrder");
    }
}

export async function findBySalesOrder_Buyer_Id(buyerId){
    try{
        if(buyerId == null || Number.isNaN(Number(buyerId))){
            throw new Error("Dati ID "+buyerId+" za kupca nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-salesOrder/buyer/${buyerId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+buyerId+" ID-iju za kupca");
    }
}

export async function findBySalesOrder_OrderStatus(status){
    try{
        if(!isOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za SalesOrder nije pronadjen");
        }
        const response = await api.get(url+`/itemSale-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema statusu "+status+" za SalesOrder");
    }
}

export async function findBySalesOrder_Invoice_Id(invoiceId){
    try{
        if(invoiceId == null || Number.isNaN(Number(invoiceId))){
            throw new Error("Dati ID "+invoiceId+" za fakturu nije pronadjen");
        }
        const response = await api.get(url+`/itemSale/by-salesOrder/invoice/${invoiceId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+invoiceId+" Id-iju za fakturu");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini "+quantity);
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseQuantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-less-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini manjoj od "+quantity);
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseQuantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-greater-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kolicini vecoj od "+quantity);
    }
}

export async function findByUnitPrice(unitPrice){
    try{
        const parseUnitPrice = parseFloat(unitPrice);
        if(Number.isNaN(Number(parseUnitPrice)) || parseUnitPrice <= 0){
            throw new Error("Data jedinicna "+parseUnitPrice+" cena nije pronadjena");
        }
        const response = await api.get(url+`/by-unit-price`,{
            params:{unitPrice:parseUnitPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinicnoj ceni "+unitPrice);
    }
}

export async function findByUnitPriceGreaterThan(unitPrice){
    try{
        const parseUnitPrice = parseFloat(unitPrice);
        if(Number.isNaN(Number(parseUnitPrice)) || parseUnitPrice <= 0){
            throw new Error("Data jedinicna cena veca od  "+parseUnitPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/by-unit-price-greater-than`,{
            params:{unitPrice:parseUnitPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinicnoj ceni vecoj od "+unitPrice);
    }
}

export async function findByUnitPriceLessThan(unitPrice){
    try{
        const parseUnitPrice = parseFloat(unitPrice);
        if(Number.isNaN(Number(parseUnitPrice)) || parseUnitPrice <= 0){
            throw new Error("Data jedinicna cena manja od "+parseUnitPrice+" nije pronadjena");
        }
        const response = await api.get(url+`/by-unit-price-less-than`,{
            params:{unitPrice:parseUnitPrice},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinicnoj ceni manjoj od "+unitPrice);
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