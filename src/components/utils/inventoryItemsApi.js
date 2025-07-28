import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = '${import.meta.env.VITE_API_BASE_URL}/inventoryItems';
const isInventoryStatusValid = ["PENDING","IN_PROGRESS","COMPLETED","CANCELLED","RECONCILED","PARTIALLY_COMPLETED"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["CABAGE_SUPPLIER","CARROT_SUPPLIER","TOMATO_SUPPLIER","ONION_SUPPLIER","BLUEBERRY_SUPPLIER","POTATO_SUPPLIER"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE"];
const isGoodsTypeValid = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createInventoryItems({inventoryId,productId, quantity, condition}){
    try{
        if(
            inventoryId  == null || isNaN(inventoryId) ||
            productId == null || isNaN(productId) || isNaN(quantity) || parseFloat(quantity) < 0 ||
            isNaN(condition) || parseInt(condition) < 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {inventoryId, productId, quantity:parseFloat(quantity),condition:parseInt(condition)};
        const response = await api.post(url+`/create/new-inventory-items`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja stavke-inventara: ${error.message}`);
        }
    }
}

export async function updateInventoryItems({id,inventoryId,productId, quantity, condition }) {
    try{
        if(
            id == null || isNaN(id) ||
            inventoryId == null || isNaN(inventoryId) ||
            productId == null || isNaN(productId) || isNaN(quantity) || parseFloat(quantity) < 0 ||
            isNaN(condition) || parseInt(condition) < 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {inventoryId, productId, quantity:parseFloat(quantity),condition:parseInt(condition)};
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
            throw new Error(`Greška prilikom kreiranja stavke-inventara: ${error.message}`);
        }
    }
}

export async function deleteInventoryItems(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id za inventoryItems nije pronadjen");
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

export async function findOneById(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id za inventoryItems nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jedne stavke inventara");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja svih stavki inventara");
    }
}

export async function getByQuantity(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) < 0){
            throw new Error("Quantity must be at least 0");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{
                quantity:parseFloat(quantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po kolicini");
        }
}

export async function getByCondition(itemCondition){
    try{
        if(isNaN(itemCondition) || parseInt(itemCondition) < 0){
            throw new Error("ItemCondition mora biti pozitivan broj");
        }
        const response = await api.get(url+`/by-condition`,{
            params:{
                itemCondition:parseInt(itemCondition)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po stanju ");
    }
}

export async function getByInventoryId(inventoryId){
    try{
        if(inventoryId == null || isNaN(inventoryId)){
            throw new Error("Dati ID za Inventory nije pronadjen");
        }
        const response = await api.get(url+`/by-inventory/${inventoryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po id inventara");
    }
}

export async function getByProductId(productId){
    try{
        if(productId == null || isNaN(productId)){
            throw new Error("Dati ID za Product nije pronadjen");
        }
        const response = await api.get(url+`/by-product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po id proizvoda");
    }
}

export async function getByProductName(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv proizvoda nije pronadjen");
        }
        const response = await api.get(url+`/by-product-name`,{
            params:{
                productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po nazivu proizvoda");
    }
}

export async function findItemsWithDifference(threshold) {
    try {
        const parsedThreshold = parseFloat(parseFloat(threshold).toFixed(2));
        if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
            throw new Error("Threshold mora biti broj veći od 0");
        }
        const response = await api.get(url+`/find-by-threshold`, {
            params: {
                threshold: parsedThreshold
            },
            headers: getHeader()
        });
        return response.data;
    } 
    catch (error) {
        handleApiError(error, "Greška prilikom traženja stavki inventara prema razlici");
    }
}

export async function findByDifference(difference){
    try{
        const parseDifference = parseFloat(difference)
        if(isNaN(parseDifference) || parseDifference <= 0){
            throw new Error("Data razlika za inventar-stavki nije pornadjena");
        }
        const response = await api.get(url+`/by-difference`,{
            params:{
                difference:parseDifference
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara po razlici");
    }
}

export async function findByDifferenceLessThan(difference){
    try{
        const parseDifference = parseFloat(difference)
        if(isNaN(parseDifference) || parseDifference <= 0){
            throw new Error("Data razlika manja od za inventar-stavki nije pornadjena");
        }
        const response = await api.get(url+`/by-difference-less-than`,{
            params:{
                difference:parseDifference
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara po razlici manjoj od");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od, za stavku inventara nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-greater-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara za kolicinu vecu od");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od, za stavku inventara nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-less-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara za kolicinu manju od");
    }
}

export async function findByItemConditionGreaterThan(itemCondition){
    try{
        const parseItemCondition = parseFloat(itemCondition);
        if(isNaN(parseItemCondition) || parseItemCondition <= 0){
            throw new Error("Dato stanje proizvoda na lageru vece od, nije pronadjeno");
        }
        const response = await api.get(url+`/by-item-condition-greater-than`,{
            params:{
                itemCondition:parseItemCondition
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stanje proizvoda na lageru veceg od");
    }
}

export async function findByItemConditionLessThan(itemCondition){
    try{
        const parseItemCondition = parseFloat(itemCondition);
        if(isNaN(parseItemCondition) || parseItemCondition <= 0){
            throw new Error("Dato stanje proizvoda na lageru manje od, nije pronadjeno");
        }
        const response = await api.get(url+`/by-item-condition-less-than`,{
            params:{
                itemCondition:parseItemCondition
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stanje proizvoda na lageru manjeg od");
    }
}

export async function findByItemConditionAndQuantity({itemCondition, quantity}){
    try{
        const parseItemCondition = parseFloat(itemCondition);
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseItemCondition) || parseItemCondition <= 0 || isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dato stanje proizvoda i njegova kolicina nisu pronadjeni");
        }
        const response = await api.get(url+`/item-condition-and-quantity`,{
            params:{
                itemCondition:parseItemCondition,
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stanje proizvoda i njegovu kolicinu");
    }
}

export async function findInventoryItemsForCalculation(inventoryId){
    try{
        if(isNaN(inventoryId) || inventoryId == null){
            throw new Error("Dati id za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search-calculation/inventory/${inventoryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli izracunatu stavku inventara");
    }
}

export async function findItemsForShortageAllowed(inventoryId){
    try{
        if(isNaN(inventoryId) || inventoryId == null){
            throw new Error("Dati id za inventar nije pronadjen");
        }
        const response = await api.get(url+`/items-for-storage-allowed/${inventoryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stakve gde je dozvoljen manjak");
    }
}

export async function findByInventory_StorageEmployee_Id(storageEmployeeId){
    try{
        if(isNaN(storageEmployeeId) || storageEmployeeId == null){
            throw new Error("Dati id za magacionera nije pronadjen");
        }
        const response = await api.get(url+`/inventory/storage-employee/${storageEmployeeId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar koji pripada id-iju magacionera");
    }
}

export async function findByInventory_StorageForeman_Id(storageForemanId){
    try{
        if(isNaN(storageForemanId) || storageForemanId == null){
            throw new Error("Dati id za smenovodju nije pronadjen");
        }
        const response = await api.get(url+`/inventory/storage-foreman/${storageForemanId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar koji pripada id-iju smenovodje");
    }
}

export async function findByInventoryDate(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum za inventar");
    }
}

export async function findByInventoryDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati opseg datuma za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma za inventar");
    }
}

export async function findByInventoryDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum posle, za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar za datum posle");
    }
}

export async function findByInventoryDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum pre, za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar za datum pre");
    }
}

export async function findByInventory_Status(status){
    try{
        if(!isInventoryStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za inventar");
    }
}

export async function existsByInventory_Aligned(){
    try{
        const response = await api.get(url+`/exists-by-inventory-aligned`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli uskladjenost inventara");
    }
}

export async function findByInventoryAlignedFalse(){
    try{
        const response = await api.get(url+`/search/inventory-aligned-false`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar gde je uskladjenost netacna");
    }
}

export async function findByInventoryStatusAndInventoryStorageEmployeeId({status, storageEmployeeId}){
    try{
        if(!isInventoryStatusValid.includes(status?.toUpperCase()) || isNaN(storageEmployeeId) || storageEmployeeId == null){
            throw new Error("Dati status inventara i id magacionera nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-status-storage-employee/${storageEmployeeId}`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status inventara i id datog magacionera");
    }
}

export async function findByInventoryStatusAndInventoryStorageForemanId({status, storageForemanId}){
    try{
        if(!isInventoryStatusValid.includes(status?.toUpperCase()) || isNaN(storageForemanId) || storageForemanId == null){
            throw new Error("Dati status inventara i id smenovodje nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-status-storage-foreman/${storageForemanId}`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status inventara i id datog smenovodje");
    }
}

export async function existsByInventoryAlignedFalseAndInventoryStorageEmployeeId(employeeId){
    try{
        if(employeeId == null || isNaN(employeeId)){
            throw new Error("Dati id magacionera nije pronadjen");
        }
        const response = await api.get(url+`/exists-inventory-aligned-false/${employeeId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli uskladjenost inventara da je netacno i id magacionera");
    }
}

export async function findItemsWithNonZeroDifference(){
    try{
        const response = await api.get(url+`/search/items-with-non-zero-difference`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stavke sa izracunatom razlikom");
    }
}

export async function findByInventoryStatusAndInventoryAlignedFalse(status){
    try{
        if(!isInventoryStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status inventara nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-status-and-aligned-false`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status inventara i uskladjenos = netacno");
    }
}

export async function findByInventoryDateAndInventoryStorageForemanId({date, foremanId}){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid() || isNaN(foremanId) || foremanId == null){
            throw new Error("Dati datum inventara i id smenovodje nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-and-storage-foreman/${storageForemanId}`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum inventara i id smenovodje");
    }
}

export async function fetchInventorySummaries(){
    try{
        const response = await api.get(url+`/search/fetch-inventory-summaries`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli zbir kolicine za inventar");
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina proizvoda nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pornasli trenutnu kolicinu datog proizvoda");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina proizvoda veca od nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pornasli trenutnu kolicinu veceg od, za dati proizvod");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina proizvoda manja od nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pornasli trenutnu kolicinu manju od, za dati proizvod");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere za dati proizvod");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca za dati proizvod");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!isStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip skladista za dati proizvod");
    }
}

export async function findByProduct_GoodsType(type){
    try{
        if(!isGoodsTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip robe za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-goods-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe za dati proizvod");
    }
}

export async function findByProduct_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati ID skladista za proizvod nije pronadjen");
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

export async function findByProduct_StorageNameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv skladista za dati proizvod");
    }
}

export async function findByProduct_StorageLocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija skladista za proizvod nije pronadjena");
        }
        const response = await api.get(url+`/findByProduct_StorageLocationContainingIgnoreCase`,{
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

export async function findByProduct_StorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista za dati proizvod");
    }
}

export async function findByProduct_StorageCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista veci od, za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista veci od, za dati proizvod");
    }
}

export async function findByProduct_StorageCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista manji od, za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista manji od, za dati proizvod");
    }
}

export async function findByProduct_Storage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
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

export async function fetchUsedCapacitiesForItems(){
    try{
        const response = await api.get(url+`/search/used-capacity-for-items`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli iskoriscenost kapaciteta za stavke");
    }
}

export async function fetchAllStorageCapacities(){
    try{
        const response = await api.get(url+`/search/fetch-all-storage-capacities`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitete za sva skladista");
    }
}

export async function fetchItemQuantitiesPerStorage(){
    try{
        const response = await api.get(url+`/search/fetch-item-quantities-per-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu stavki po skladistu");
    }
}

export async function fetchStorageCapacityAndInventorySummary(){
    try{
        const response = await api.get(url+`/search/fetch-storage-capacity-summary`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista i zbir inventara");
    }
}

export async function fetchDetailedStorageStats(){
    try{
        const response = await api.get(url+`/search/fetch-detailed-storage-stats`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli detaljnu statistiku o skladistu");
    }
}

export async function findByProduct_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id dobavljaca za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina od dobavljaca za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu od dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od dobavljaca za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od, dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od dobavljaca za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od, dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyUpdates(updates){
    try{
        if(!moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum dostave dobavljaca za proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum dostave dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyUpdatesBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD:THH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datuma dobavljaca za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product-supply-update-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD:THH:mm:ss"),
                end:moment(end).format("YYYY-MM-DD:THH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma za dobavljaca, za dati proizvod");
    }
}

export async function findByProduct_SupplyStorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id skladista dobavljaca za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista dobavljaca za dati proizvod");
    }
}

export async function findByProduct_ShelfId(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati ID police za proizvod, nije pronadjena");
        }
        const response = await api.get(url+`/search/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id police za dati proizvod");
    }
}

export async function findByProduct_ShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Dati broj redova police za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli broj redova police za dati proizvod");
    }
}

export async function findByProduct_ShelfCols(cols){
    try{
        const parseCols = parseInt(cols ,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Data kolona police za proizvod, nije pronadjena");
        }
        const response = await api.get(url+`/search/product-shelf-cols`,{
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

export async function findInventoryItemsWithoutShelf(){
    try{
        const response = await api.get(url+`/search/inventory-items-without-shelf`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stavke inventara koje se ne nalaze na policama");
    }
}

export async function findByProduct_ShelfIsNotNull(){
    try{
        const response = await api.get(url+`/search/product-shelf-is-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvod koji je na policima");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}