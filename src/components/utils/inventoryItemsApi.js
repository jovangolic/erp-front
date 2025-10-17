import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/inventoryItems`;
const isInventoryStatusValid = ["PENDING","IN_PROGRESS","COMPLETED","CANCELLED","RECONCILED","PARTIALLY_COMPLETED","PENDING_APPROVAL","APPROVED"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isGoodsTypeValid = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createInventoryItems({inventoryId,productId, quantity, condition}){
    try{
        const parseQuantity = parseFloat(quantity);
        const parseCondition = parseInt(condition, 10);
        if(
            inventoryId  == null || Number.isNaN(Number(inventoryId)) ||
            productId == null || Number.isNaN(Number(productId)) || Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0 ||
            Number.isNaN(Number(parseCondition)) || parseCondition <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {inventoryId, productId, quantity:parseQuantity,condition:parseCondition};
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
        const parseQuantity = parseFloat(quantity);
        const parseCondition = parseInt(condition, 10);
        if(
            id == null || Number.isNaN(Number(id)) ||
            inventoryId  == null || Number.isNaN(Number(inventoryId)) ||
            productId == null || Number.isNaN(Number(productId)) || Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0 ||
            Number.isNaN(Number(parseCondition)) || parseCondition <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {inventoryId, productId, quantity:parseQuantity,condition:parseCondition};
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati id "+id+" za inventoryItems nije pronadjen");
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati id "+id+" za inventoryItems nije pronadjen");
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
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po kolicini "+quantity);
        }
}

export async function getByCondition(itemCondition){
    try{
        const parseCondition = parseInt(itemCondition, 10);
        if(Number.isNaN(Number(parseCondition)) || parseCondition <= 0){
            throw new Error("ItemCondition "+parseCondition+" mora biti pozitivan broj");
        }
        const response = await api.get(url+`/by-condition`,{
            params:{
                itemCondition:parseCondition
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po stanju "+itemCondition);
    }
}

export async function getByInventoryId(inventoryId){
    try{
        if(inventoryId == null || Number.isNaN(Number(inventoryId))){
            throw new Error("Dati ID "+inventoryId+" za Inventory nije pronadjen");
        }
        const response = await api.get(url+`/by-inventory/${inventoryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po id "+inventoryId+" inventara");
    }
}

export async function getByProductId(productId){
    try{
        if(productId == null || Number.isNaN(Number(productId))){
            throw new Error("Dati ID "+productId+" za Product nije pronadjen");
        }
        const response = await api.get(url+`/by-product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po id "+productId+" proizvoda");
    }
}

export async function getByProductName(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Naziv "+productName+" proizvoda nije pronadjen");
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
        handleApiError(error, "Greska prilikom trazenja po nazivu "+productName+" proizvoda");
    }
}

export async function findItemsWithDifference(threshold) {
    try {
        const parsedThreshold = parseFloat(parseFloat(threshold).toFixed(2));
        if (Number.isNaN(Number(parsedThreshold)) || parsedThreshold <= 0) {
            throw new Error("Threshold "+threshold+" mora biti broj veći od 0");
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
        if(Number.isNaN(Number(parseDifference)) || parseDifference <= 0){
            throw new Error("Data razlika "+parseDifference+" za inventar-stavki nije pornadjena");
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
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara po razlici "+difference);
    }
}

export async function findByDifferenceLessThan(difference){
    try{
        const parseDifference = parseFloat(difference)
        if(Number.isNaN(Number(parseDifference)) || parseDifference <= 0){
            throw new Error("Data razlika manja od "+parseDifference+"za inventar-stavki nije pornadjena");
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
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara po razlici manjoj od "+difference);
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseQuantity+", za stavku inventara nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara za kolicinu vecu od "+quantity);
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseQuantity+", za stavku inventara nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli stavku-inventara za kolicinu manju od "+quantity);
    }
}

export async function findByItemConditionGreaterThan(itemCondition){
    try{
        const parseItemCondition = parseFloat(itemCondition);
        if(isNaN(parseItemCondition) || parseItemCondition <= 0){
            throw new Error("Dato stanje proizvoda na lageru vece od "+itemCondition+", nije pronadjeno");
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
        handleApiError(error,"Trenutno nismo pronasli stanje proizvoda na lageru veceg od "+itemCondition);
    }
}

export async function findByItemConditionLessThan(itemCondition){
    try{
        const parseItemCondition = parseInt(itemCondition,10);
        if(Number.isNaN(Number(parseItemCondition)) || parseItemCondition <= 0){
            throw new Error("Dato stanje proizvoda na lageru manje od "+parseItemCondition+", nije pronadjeno");
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
        handleApiError(error,"Trenutno nismo pronasli stanje proizvoda na lageru manjeg od "+itemCondition);
    }
}

export async function findByItemConditionAndQuantity({itemCondition, quantity}){
    try{
        const parseItemCondition = parseint(itemCondition, 10);
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseItemCondition)) || parseItemCondition <= 0 || Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Dato stanje "+parseItemCondition+" proizvoda i njegova kolicina "+parseQuantity+" nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli stanje "+itemCondition+" proizvoda i njegovu kolicinu "+quantity);
    }
}

export async function findInventoryItemsForCalculation(inventoryId){
    try{
        if(Number.isNaN(Number(inventoryId)) || inventoryId == null){
            throw new Error("Dati id "+inventoryId+" za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search-calculation/inventory/${inventoryId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli izracunatu stavku inventara po "+inventoryId+" id-iju");
    }
}

export async function findItemsForShortageAllowed(inventoryId){
    try{
        if(Number.isNaN(Number(inventoryId)) || inventoryId == null){
            throw new Error("Dati id "+inventoryId+" za inventar nije pronadjen");
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
        if(Number.isNaN(Number(storageEmployeeId)) || storageEmployeeId == null){
            throw new Error("Dati id "+storageEmployeeId+" za magacionera nije pronadjen");
        }
        const response = await api.get(url+`/inventory/storage-employee/${storageEmployeeId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar koji pripada "+storageEmployeeId+" id-iju magacionera");
    }
}

export async function findByInventory_StorageForeman_Id(storageForemanId){
    try{
        if(Number.isNaN(Number(storageForemanId)) || storageForemanId == null){
            throw new Error("Dati i "+storageForemanId+" za smenovodju nije pronadjen");
        }
        const response = await api.get(url+`/inventory/storage-foreman/${storageForemanId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar koji pripada "+storageForemanId+" id-iju smenovodje");
    }
}

export async function findByInventoryDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+validateDate+" za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date`,{
            params:{
                date:moment(validateDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" za inventar");
    }
}

export async function findByInventoryDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg datuma "+validateDateStart+" - "+validateDateEnd+" za inventar nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/inventory-date-range`,{
            params:{
                start:moment(validateDateStart).format("YYYY-MM-DD"),
                end:moment(validateDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" za inventar");
    }
}

export async function findByInventoryDateAfter(date){
    try{
        const validateDateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart){
            throw new Error("Dati datum posle "+validateDateStart+", za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-after`,{
            params:{
                date:moment(validateDateStart).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar za datum posle "+date);
    }
}

export async function findByInventoryDateBefore(date){
    try{
        const validateDateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum pre "+validateDateStart+", za inventar nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-before`,{
            params:{
                date:moment(validateDateStart).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar za datum pre "+date);
    }
}

export async function findByInventory_Status(status){
    try{
        if(!isInventoryStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za inventar nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" za inventar");
    }
}

export async function existsByInventory_Aligned(bool){
    try{
        if(typeof bool !== "boolean"){
            throw new Error("Uskladjeni inventar ne postoji");
        }
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
        if(!isInventoryStatusValid.includes(status?.toUpperCase()) || Number.isNaN(Number(storageEmployeeId)) || storageEmployeeId == null){
            throw new Error("Dati status "+status+" inventara i id "+storageEmployeeId+" magacionera nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" inventara i id "+storageEmployeeId+" datog magacionera");
    }
}

export async function findByInventoryStatusAndInventoryStorageForemanId({status, storageForemanId}){
    try{
        if(!isInventoryStatusValid.includes(status?.toUpperCase()) || Number.isNaN(Number(storageForemanId)) || storageForemanId == null){
            throw new Error("Dati status "+status+" inventara i id "+storageForemanId+" smenovodje nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" inventara i id "+storageForemanId+" datog smenovodje");
    }
}

export async function existsByInventoryAlignedFalseAndInventoryStorageEmployeeId(employeeId){
    try{
        if(employeeId == null || Number.isNaN(Number(employeeId))){
            throw new Error("Dati id "+employeeId+" magacionera nije pronadjen");
        }
        const response = await api.get(url+`/exists-inventory-aligned-false/${employeeId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli uskladjenost inventara da je netacno i id "+employeeId+" magacionera");
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
            throw new Error("Dati status "+status+" inventara nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" inventara i uskladjenos = netacno");
    }
}

export async function findByInventoryDateAndInventoryStorageForemanId({date, foremanId}){
    try{
        const validateDateStart = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || Number.isNaN(Number(foremanId)) || foremanId == null){
            throw new Error("Dati datum "+validateDateStart+" inventara i id "+foremanId+" smenovodje nije pronadjen");
        }
        const response = await api.get(url+`/search/inventory-date-and-storage-foreman/${foremanId}`,{
            params:{
                date:moment(validateDateStart).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" inventara i id "+foremanId+" smenovodje");
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
        if(Number.isNaN(Number(parseCurrentQuantity)) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina "+parseCurrentQuantity+" proizvoda nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pornasli trenutnu kolicinu "+currentQuantity+" datog proizvoda");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(Number.isNaN(Number(parseCurrentQuantity)) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina proizvoda veca od "+parseCurrentQuantity+" nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pornasli trenutnu kolicinu veceg od "+currentQuantity+", za dati proizvod");
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(Number.isNaN(Number(parseCurrentQuantity)) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina proizvoda manja od "+parseCurrentQuantity+" nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pornasli trenutnu kolicinu manju od "+currentQuantity+", za dati proizvod");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" za dati proizvod");
    }
}

export async function findByProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" dobavljaca za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+supplierType+" dobavljaca za dati proizvod");
    }
}

export async function findByProduct_StorageType(storageType){
    try{
        if(!isStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+storageType+" skladista za dati proizvod");
    }
}

export async function findByProduct_GoodsType(type){
    try{
        if(!isGoodsTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" robe za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" robe za dati proizvod");
    }
}

export async function findByProduct_StorageId(storageId){
    try{
        if(Number.isNaN(Number(storageId)) || storageId == null){
            throw new Error("Dati ID "+storageId+" skladista za proizvod nije pronadjen");
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

export async function findByProduct_StorageNameContainingIgnoreCase(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+storageName+" skladista za dati proizvod");
    }
}

export async function findByProduct_StorageLocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija "+storageLocation+" skladista za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+storageLocation+" skladista za dati proizvod");
    }
}

export async function findByProduct_StorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" skladista za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" skaldista za dati proizvod");
    }
}

export async function findByProduct_StorageCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista veci od "+parseCapacity+", za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista veci od "+capacity+", za dati proizvod");
    }
}

export async function findByProduct_StorageCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista manji od "+parseCapacity+", za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skaldista manji od "+capacity+", za dati proizvod");
    }
}

export async function findByProduct_Storage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
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
        if(Number.isNaN(Number(supplyId)) || supplyId == null){
            throw new Error("Dati id "+supplyId+" dobavljaca za proizvod nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+" od dobavljaca za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+quantity+" od dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseQuantity+"dobavljaca za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od "+quantity+", dobavljaca za dati proizvod");
    } 
}

export async function findByProduct_SupplyQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(Number.isNaN(Number(parseQuantity)) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseQuantity+" dobavljaca za proizvod nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od "+quantity+", dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyUpdates(updates){
    try{
        const validateDate = moment.isMoment(updates) || moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+validateDate+" dostave dobavljaca za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-supply-updates`,{
            params:{
                updates:moment(validateDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+updates+" dostave dobavljaca za dati proizvod");
    }
}

export async function findByProduct_SupplyUpdatesBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Dati opseg datuma "+validateDateStart+" - "+validateDateEnd+" dobavljaca za proizvod nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/product-supply-update-range`,{
            params:{
                start:moment(validateDateStart).format("YYYY-MM-DD:THH:mm:ss"),
                end:moment(validateDateEnd).format("YYYY-MM-DD:THH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" za dobavljaca, za dati proizvod");
    }
}

export async function findByProduct_SupplyStorageId(storageId){
    try{
        if(Number.isNaN(Number(storageId)) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista dobavljaca za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista dobavljaca za dati proizvod");
    }
}

export async function findByProduct_ShelfId(shelfId){
    try{
        if(Number.isNaN(Number(shelfId)) || shelfId == null){
            throw new Error("Dati ID "+shelfId+" police za proizvod, nije pronadjena");
        }
        const response = await api.get(url+`/search/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police za dati proizvod");
    }
}

export async function findByProduct_ShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(Number.isNaN(Number(parseRowCount)) || parseRowCount <= 0){
            throw new Error("Dati broj redova "+parseRowCount+" police za proizvod nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli broj "+rowCount+" redova police za dati proizvod");
    }
}

export async function findByProduct_ShelfCols(cols){
    try{
        const parseCols = parseInt(cols ,10);
        if(Number.isNaN(Number(parseCols)) || parseCols <= 0){
            throw new Error("Data kolona "+parseCols+" police za proizvod, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolonu "+cols+" police za dati proizvod");
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

