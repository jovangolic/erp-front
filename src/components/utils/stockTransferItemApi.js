import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isGoodsTypeValid = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isTransferStatusValid = ["INITIATED", "IN_TRANSIT", "COMPLETED", "CANCELLED"];

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/stockTransferItems`;

export async function create({productId, quantity}){
    try{
        if(quantity == null || quantity <= 0 || !productId){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {productId, quantity};
        const response = await api.options(url+`/create/new-stockTransferItem`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update({id, productId, quantity}){
    try{
        if( id == null || isNaN(id) ||quantity == null || quantity <= 0 || !productId){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {productId, quantity};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteStockTransferItem(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pronadjen");
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
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog predmeta po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom dobavljanja svih stockTransferItem-a")
    }
}

export async function findByProductId(productId){
    try{
        if(productId == null || isNaN(productId)){
            throw new Error("ID "+productId+" prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po "+productId+" id-iju proizvoda");
    }
}

export async function findByProduct_Name(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Naziv "+name+" proizvoda nije pronadjen");
        }
        const response = await api.get(url+`/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po nazivu "+name+" proizvoda");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    if (currentQuantity == null || currentQuantity <= 0) {
        throw new Error("Data kolicina "+currentQuantity+" nije pronadjena");
    }
    try {
        const response = await api.get(url + `/by-currentQuantity`, {
            params: {
                currentQuantity: currentQuantity
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom pretrage proizvoda po trenutnoj kolicini "+ currentQuantity);
    }
}

export async function findByQuantity(quantity){
    try{
        if (quantity == null || quantity <= 0) {
            throw new Error("Data kolicina "+quantity+" nije pronadjena");
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
        handleApiError(error,"Greska prema pretrazi po kolicini "+quantity);
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        if (quantity == null || quantity <= 0) {
            throw new Error("Data kolicina manja od "+quantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-less-quantity`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po kolicini manjoj od "+quantity);
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        if (quantity == null || quantity <= 0) {
            throw new Error("Data kolicina veca od "+quantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-greater-quantity`,{
            params:{
                quantity:quantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema tazenju po kolicini vecoj od "+quantity);
    }
}

export async function findByStockTransferId(stockTransferId){
    try{
        if (stockTransferId == null || isNaN(stockTransferId)) {
            throw new Error("ID "+stockTransferId+" prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/stockTransfer/${stockTransferId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju po stockTransfer "+stockTransferId+" id-iju");
    }
}

export async function findByStockTransfer_FromStorageId(fromStorageId){
    try{
        if(fromStorageId == null || isNaN(fromStorageId)){
            throw new Error("ID prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/storage/${fromStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju stockTransfer-a od "+fromStorageId+" fromStorageId");
    }
}

export async function findByStockTransfer_ToStorageId(toStorageId){
    try{
        if(toStorageId == null || isNaN(toStorageId)){
            throw new Error("ID "+toStorageId+" prenosa mora biti prosleđen.");
        }
        const response = await api.get(url+`/storage/${toStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema trazenju stockTransfera do "+toStorageId+" toStorageId");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" nije pronadjena");
        }
        const response = await api.get(url+`/search-unit-measure`,{
            params:{unitMeasure:(unitMeasure || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod za datu jedinicu mere "+unitMeasure);
    }
}

export async function  findByProduct_UnitMeasureAndProduct_StorageType({unitMeasure, storageType}){
    try{
        if(
            !isUnitMeasureValid.includes(unitMeasure?.toUpperCase()) ||
            !isStorageTypeValid.includes(storageType?.toUpperCase())
        ){
            throw new Error("Data jedinica mere "+unitMeasure+" i tip "+storageType+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase(),
                storageType:(storageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo prnasli proizvod za datu jedinicu mere "+unitMeasure+" i tip "+storageType+" skladista");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" nabavljaca nije pronadjen");
        }
        const response = await api.get(url+`/search-supplier-type`,{
            params:{supplierType:(supplierType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod za tip "+supplierType+" nabavljaca");
    }
}

export async function findByProduct_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe nije pronadjen");
        }
        const response = await api.get(url+`/search-goods-type`,{
            params:{goodsType:(goodsType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod za tip "+goodsType+" robe");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!isStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/search-storage-type`,{
            params:{storageType:(storageType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod za tip "+storageType+" skladista");
    }
}

export async function findByProduct_Shelf_Id(shelfId){
    try{
        if(shelfId == null || isNaN(shelfId)){
            throw new Error("Dati ID "+shelfId+" policene nije pronadjen");
        }
        const response = await api.get(url+`/search/product/shelf/${shelfId}`,{
            headers:getHeader()
        }
        );
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada datom "+shelfId+" ID-iju za policu");
    }
}

export async function findByProduct_Shelf_RowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(parseRowCount <= 0 || isNaN(parseRowCount)){
            throw new Error("Dati red "+parseRowCount+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/row-count`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada odredjenom redu "+rowCount+" za datu policu");
    }
}

export async function findByProduct_Shelf_Cols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(parseCols <= 0 || isNaN(parseCols)){
            throw new Error("Dati raf "+parseCols+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/cols`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada odredjenom rafu "+cols+" za datu policu");
    }
}

export async function findByProduct_Shelf_RowCountGreaterThanEqual(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(parseRowCount <= 0 || isNaN(parseRowCount)){
            throw new Error("Dati red "+parseRowCount+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/row-count-greater-than`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada polici za red veci od "+rowCount);
    }
}

export async function findByProduct_Shelf_ColsGreaterThanEqual(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(parseCols <= 0 || isNaN(parseCols)){
            throw new Error("Dati raf "+parseCols+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/cols-greater-than`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada polici za raf veci od "+cols);
    }
}

export async function findByProduct_Shelf_RowCountLessThanEqual(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(parseRowCount <= 0 || isNaN(parseRowCount)){
            throw new Error("Dati red "+parseRowCount+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/row-count-less-than`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada polici za red manji od "+rowCount);
    }
}

export async function findByProduct_Shelf_ColsLessThanEqual(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(parseCols <= 0 || isNaN(parseCols)){
            throw new Error("Dati raf "+parseCols+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/cols-less-than`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada polici za raf manji od "+cols);
    }
}

export async function findByProduct_Shelf_RowCountBetween({minRowCount, maxRowCount}){
    try{
        const parseMinRowCount = parseInt(minRowCount,10);
        const parseMaxRowCount = parseInt(maxRowCount,10);
        if(parseMaxRowCount <= 0 || isNaN(parseMaxRowCount) || parseMinRowCount <= 0|| isNaN(parseMinRowCount)){
            throw new Error("Dati opseg "+parseMinRowCount+" - "+parseMaxRowCount+" redova za policu nije pronadjen");
        }
        const response = await api.get(url+`/seach/product/row-count-range`,{
            params:{
                minRowCount:parseMinRowCount,
                maxRowCount:parseMaxRowCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji pripada polici za dati opseg "+minRowCount+" - "+maxRowCount+" redova");
    }
}

export async function findByProduct_Shelf_ColsBetween({minCols, maxCols}){
    try{
        const parseMinCols = parseInt(minCols,10);
        const parseMaxCols = parseInt(maxCols,10);
        if(
            parseMinCols <= 0 || isNaN(parseMinCols) || parseMaxCols <= 0 || isNaN(parseMaxCols0)
        ){
            throw new Error("Dati opseg "+parseMinCols+" - "+parseMaxCols+" rafova za policu nije pronadjen");
        }
        const response = await api.get(url+`/search/product/cols-range`,{
            params:{
                minCols:parseMinCols,
                maxCols: parseMaxCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo prnasli proizvod koji pripada polici za dati opseg "+minCols+" - "+maxCols+" rafova");
    }
}

export async function findByProduct_Supply_Id(supplyId){
    try{    
        if(supplyId == null || isNaN(supplyId)){
            throw new Error("Dati ID "+supplyId+" za dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji ima dati ID  "+supplyId+" za dobavljaca");
    }
}

export async function findByStockTransfer_Status(status){
    try{
        if(!isTransferStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stock-transfer za dati transfer status "+status);
    }
} 

export async function findByStockTransfer_TransferDate(transferDate){
    try{
        if(!moment(transferDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum "+transferDate+" za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer-date`,{
            params:{transferDate:moment(transferDate).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+transferDate+" za dati stock-transfer");
    }
}

export async function findByStockTransfer_TransferDateBetween({transferDateStart, transferDateEnd}){
    try{
        if(!moment(transferDateStart,"YYYY-MM-DD",true).isValid() ||
            !moment(transferDateEnd,"YYYY-MM-DD",true).isValid() ){
            throw new Error("Dati opseg "+transferDateStart+" - "+transferDateEnd+" datuma za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer-date-range`,{
            params:{
                transferDateStart:moment(transferDateStart).format("YYYY-MM-DD"),
                transferDateEnd:moment(transferDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg "+transferDateStart+" - "+transferDateEnd+" datuma za stock-transfer");
    }
}

export async function findByStockTransfer_StatusIn(statuses) {
  try {
    // Validacija svakog pojedinačnog statusa
    const upperStatuses = statuses.map(s => s.toUpperCase());
    if (!upperStatuses.every(s => isTransferStatusValid.includes(s))) {
        throw new Error("Dati statusi "+statuses+" za stock-transfer nisu validni");
    }
    const response = await api.get(url + `/search/stock-transfer-statuses`, {
        params: { statuses: upperStatuses },
        headers: getHeader()
    });
    return response.data;
  } 
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli sve statuse "+statuses+" za stock-transfer");
  }
}

export async function findByStockTransfer_StatusNot(status){
    try{
        if(!isTransferStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer-status-not`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stock-transfer objekte gde nema statusa "+status);
    }
}

export async function findByStockTransfer_TransferDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum posle "+date+" za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer-date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stock-tansfer za datum posl "+date);
    }
}

export async function findByStockTransfer_TransferDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum pre "+date+" za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer-date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stock-tansfer za datum posle "+date);
    }
}

export async function findByStockTransfer_StatusAndQuantityGreaterThan({status, quantity}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(!isTransferStatusValid.includes(status?.toUpperCase()) ||
            isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati status "+status+" i kolicina veca od "+parseQuantity+" za stock-transfer nisu pronadjeni");
        }
        const response = await api.get(url+`/search/stock-transfer-quantity-greater-than`,{
            params:{
                status:(status || "").toUpperCase(),
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" i kolicinu vecu od "+quantity+" za stock-transfer");
    }
}

export async function findByStockTransfer_StatusAndStockTransfer_TransferDateBetween({status, start, end}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(!isTransferStatusValid.includes(status?.toUpperCase()) ||
            !moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati status "+start+" i opseg "+start+" - "+end+" datuma za stock-transfer nisu pronadjeni");
        }
        const response = await api.get(url+`/search/stock-transfer/status-and-date-range`,{
            params:{
                status:(status || "").toUpperCase(),
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+start+" i opseg "+start+" - "+end+" datuma za stock-transfer");
    }
}

export async function findByStockTransfer_FromStorage_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" from-storage za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/from-storage-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" skladista(from-storage) za stock-transfer ");
    }
}

export async function findByStockTransfer_FromStorage_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !=="string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" from-storage za stock-transfer nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/from-storage-location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" skladista(from-storage) za stock-transfer ");
    }
}

export async function findByStockTransfer_FromStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet "+parseCapacity+" from-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/from-storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" za stock-transfer koji dolazi from-storage");
    }
}

export async function findByStockTransfer_FromStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" from-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/from-storage-capcaty-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od "+capacity+" za stock-transfer koji dolazi from-storage");
    }
}

export async function findByStockTransfer_FromStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet mani od "+parseCapacity+" from-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/from-storage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od "+capacity+" za stock-transfer koji dolazi from-storage");
    }
}

export async function findByStockTransfer_FromStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" from-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/from-storage-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" from-storage za stock-transfer");
    }
}

export async function findByStockTransfer_ToStorage_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/to-storage-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" to-storage za stock-transfer");
    }
}

export async function findByStockTransfer_ToStorage_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" za to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/to-storage-location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" to-storage za stock-transfer");
    }
}

export async function findByStockTransfer_ToStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet "+parseCapacity+" to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/to-storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" za stock-transfer koji dolazi to-storage");
    }
}

export async function findByStockTransfer_ToStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/to-storage-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od "+capacity+" za stock-transfer koji dolazi to-storage");
    }
}

export async function findByStockTransfer_ToStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/to-storage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od "+capacity+" za stock-transfer koji dolazi to-storage");
    }
}

export async function findByStockTransfer_ToStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" za to-storage nije pronadjen");
        }
        const response = await api.get(url+`/search/stock-transfer/to-storage-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" to-storage za stock-transfer");
    }
}