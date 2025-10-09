import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/batches`;
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const isGoodsTypeValid = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isBatchStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createBatch({code,productId,quantityProduced,productionDate,expiryDate}){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(!code || typeof code !== "string" || code.trim() === "" ||
           isNaN(productId) || productId == null || isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 ||
           !moment(productionDate,"YYYY-MM-DD",true).isValid() || !moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {code,productId,quantityProduced,productionDate,expiryDate};
        const response = await api.post(url+`/create/new-batch`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja batch-a");
    }
}

export async function updateBatch({id,productId,quantityProduced,productionDate,expiryDate}){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if( isNaN(id) || id == null ||
            !code || typeof code !== "string" || code.trim() === "" ||
            isNaN(productId) || productId == null || isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 ||
            !moment(productionDate,"YYYY-MM-DD",true).isValid() || !moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {code,productId,quantityProduced,productionDate,expiryDate};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja batch-a");
    }
}

export async function deleteBatch(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za batch, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greskka prilikom brisanja batchj-a po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog batach-a po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih batch-ova");
    }
}

export async function getExpiredBatches(){
    try{
        const response = await api.get(url+`/expired`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve batch-ove po datumu isteka");
    }
}

export async function getActiveBatches(){
    try{
        const response = await api.get(url+`/active`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve aktivne batch-eve");
    }
}

export async function getUpcomingBatches(daysAhead){
    try{
        const parseDaysAhead = parseInt(daysAhead,10);
        if(isNaN(parseDaysAhead) || parseDaysAhead <= 0){
            throw new Error("Dati datum "+parseDaysAhead+" za nadolazece batch-eve, nije pronadjen");
        }
        const response = await api.get(url+`/upcoming/${daysAhead}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve nadolazece batch-eve za dati datum "+daysAhead);
    }
}

export async function getBatchesProducedBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati vremenski opseg "+start+" - "+end+" za proizvedene batche-eve, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj proizvodnje batch-eva ne sme biti ispred datuma za pocetak proizvodnje batch-eva");
        }
        const response = await api.get(url+`/produced-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve batche-eve proizvedene za dati vremenski opseg "+start+" - "+end);
    }
}

export async function getBatchesExpiringBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati vremenski opseg "+start+" - "+end+" za batche-eve koji isticu, nije pronadjeni");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj isticanja batch-eva ne sme biti ispred datuma za pocetak isticanje batch-eva");
        }
        const response = await api.get(url+`/expiring-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve batche-eve koji isticu za dati vremenski opseg "+start+" - "+end);
    }
}

export async function existsByCode(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Postojanje batcha po datom kodu "+code+" ,nije pronadjeno");
        }
        const response = await api.get(url+`/exists-by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje batch-a po datom kodu "+code);
    }
}

export async function findByCodeContainingIgnoreCase(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Postojanje batcha po datom kodu "+code+" ,nije pronadjeno");
        }
        const response = await api.get(url+`/by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch po datom kodu "+code);
    }
}

export async function findByQuantityProduced(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data proizvedena kolicina "+parseQuantityProduced+" za batch, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli batch po proizvedenoj kolicini "+quantityProduced);
    }
}

export async function findByQuantityProducedGreaterThan(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data proizvedena kolicina veca od "+parseQuantityProduced+" za batch, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-produced-greater-than`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch po proizvedenoj kolicini vecoj od "+quantityProduced);
    }
}

export async function findByQuantityProducedLessThan(quantityProduced){
    try{
        const parseQuantityProduced = parseInt(quantityProduced,10);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data proizvedena kolicina manja od "+parseQuantityProduced+" za batch, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity-produced-less-than`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch po proizvedenoj kolicini manjoj od "+quantityProduced);
    }
}

export async function findByProductionDate(productionDate){
    try{
        if(!moment(productionDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum proizvodnje "+productionDate+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/by-production-date`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch po datom datumu proizvodnje "+productionDate);
    }
}

export async function findByProductionDateBefore(productionDate){
    try{
        if(!moment(productionDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum proizvodnje pre "+productionDate+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/by-production-date-before`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch po datom datumu pre, proizvodnje "+productionDate);
    }
}

export async function findByProductionDateAfter(productionDate){
    try{
        if(!moment(productionDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum proizvodnje posle "+productionDate+" za batch, nije pronadjen");
        }
        const response = await api.get(url+`/by-production-date-after`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli batch po datom datumu posle, proizvodnje "+productionDate);
    }
}

export async function findByProductionDateBetween({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum opsega "+startDate+" - "+endDate+" proizvodnje, za dati batch, nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj prozivodnje batch-eva ne sme biti ispred datuma za pocetak proizvodnje batch-eva");
        }
        const response = await api.get(url+`/by-production-date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronsli datum opsega "+startDate+" - "+endDate+" proizvodnje, za batch");
    }
}

export async function findByExpiryDate(expiryDate){
    try{
        if(!moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka "+expiryDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/by-expiry-date`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isteka "+expiryDate+" za dati batch");
    }
}

export async function findByExpiryDateBefore(expiryDate){
    try{
        if(!moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka pre "+expiryDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/by-expiry-date-before`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isteka pre, "+expiryDate+" za dati batch");
    }
}

export async function findByExpiryDateAfter(expiryDate){
    try{
        if(!moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka posle "+expiryDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/by-expiry-date-after`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isteka posle, "+expiryDate+" za dati batch");
    }
}

export async function findByExpiryDateBetween({expiryDateStart, expiryDateEnd}){
    try{    
        if(!moment(expiryDateStart,"YYYY-MM-DD",true).isValid() || 
           !moment(expiryDateEnd,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum opsega "+expiryDateStart+" - "+expiryDateEnd+" isteka, za dati batch, nije pronadjen");
        }
        if(moment(expiryDateEnd).isBefore(moment(expiryDateStart))){
            throw new Error("Datum za kraj isticanja batch-eva ne sme biti ispred datuma za pocetak isticanja batch-eva");
        }
        const response = await api.get(url+`/by-expiry-date-between`,{
            params:{
                expiryDateStart:moment(expiryDateStart).format("YYYY-MM-DD"),
                expiryDateEnd:moment(expiryDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum opsega "+expiryDateStart+" - "+expiryDateEnd+" isteka, za dati batch");
    }
}

export async function findByProductionDateEquals(today){
    try{
        if(!moment(today,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum proizvodnje jedank danasnjem "+today+" datumu za batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/production-date-equal`,{
            params:{
                today:moment(today).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje jednak danasnjem "+today+" datumu");
    }
}

export async function findByExpiryDateLessThanEqual(today){
    try{
        if(!moment(today,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka do danasnjeg datuma "+today+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/expiry-date-less-than-equal`,{
            params:{
                today:moment(today).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isteka do danasnjeg "+today+" datuma, za dati batch");
    }
}

export async function findByProductionDateGreaterThanEqual(today){
    try{
        if(!moment(today,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum proizvodnje od danasnjeg datuma "+today+" pa na dalje, za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/production-date-greater-than-equal`,{
            params:{
                today:moment(today).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje od danasnjeg datuma "+today+" pa na dalje, za dati batch");
    }
}

export async function findByExpiryDateGreaterThanEqual(expiryDate){
    try{
        if(!moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka od danasnjeg datuma "+expiryDate+" pa na dalje, za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/expiry-date-greater-than-equal`,{
            params:{
                expiryDate:moment(expiryDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum isteka batch-a od danasnjeg datuma "+expiryDate+" pa na dalje");
    }
}

export async function findByProductionDateLessThanEqual(productionDate){
    try{
        if(!moment(productionDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum proizvodnje do danasnjeg datuma "+productionDate+" za dati batch, nije pronadjen");
        }
        const response = await api.get(url+`/search/production-date-less-than-equal`,{
            params:{
                productionDate:moment(productionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum proizvodnje do danasnjeg datuma "+productionDate+" za dati batch");
    }
}

export async function findByExpiryDateGreaterThan(today){
    try{
        if(!moment(today,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka batcha do danasnjeg "+today+" datuma, nije pronadjen");
        }
        const response = await api.get(url+`/search/expiry-date-greater-than`,{
            params:{
                today:moment(today).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum iteka batcha do danasnjeg "+today+" datuma");
    }
}

export async function findByExpiryDateIsNotNull(){
    try{
        const response = await api.get(url+`/search/expiry-date-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli poastojanje datuma isteka batch-a");
    }
}

export async function findByProductionDateIsNull(){
    try{
        const response = await api.get(url+`/search/production-date-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nepostojanje datuma proizvodnje batch-a");
    }
}

export async function findByProductionDateIsNotNull(){
    try{
        const response = await api.get(url+`/search/production-date-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje datuma proizodnje batch-a");
    }
}

export async function findByExpiryDateIsNull(){
    try{
        const response = await api.get(url+`/search/expiry-date-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje datuma isteka za batch");
    }
}

export async function findByExpiryDateAfterAndProductId({date, productId}){
    try{
        if(isNaN(productId) || productId == null || !moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum isteka posle "+date+" za batch i id "+productId+" proizvoda, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/expiry-date-after/product/${productId}`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum iteka posle "+date+" za dati batch i id "+productId+" proizvoda");
    }
}

export async function findByProductId(productId){
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
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda");
    }
}

export async function findByProductCurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina "+parseCurrentQuantity+" datog proizvoda, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" za dati proizvod");
    }
}

export async function findByProductCurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina veca od "+parseCurrentQuantity+" za dati proizvod, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu vecu od "+currentQuantity+" za dati proizvod");
    }
}

export async function findByProductCurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Trenutna kolicina manja od "+parseCurrentQuantity+" za dati proizvod, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu manju od "+currentQuantity+" za dati proizvod");
    }
}

export async function findByProductCurrentQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Opseg "+parseMin+" - "+parseMax+" trenutne kolicine, za dati proizvod, nije pornadjena");
        }
        const response = await api.get(url+`/search/product-current-quantity-between`,{
            params:{
                min:parseMin,
                maz:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kolicine "+min+" - "+max+" za dati proizvod");
    }
}

export async function findByProductIdAndExpiryDateLessThanEqual({productId, today}){
    try{
        if(isNaN(productId) || productId == null || !moment(today,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati id "+productId+" proizvoda i datum isteka do danasnjeg "+today+" datuma, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/${productId}/expiry-date-less-than-equal`,{
            params:{
                today:moment(today).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda i datum isteka do danasnjeg "+today+" dana");
    }
}

export async function findByProductIdAndProductionDateAfter({productId, date}){
    try{
        if(isNaN(productId) || productId == null || !moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati id "+productId+" proizvoda i datum proizvodnje posle datog "+date+" datuma, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/${productId}/product-date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda i datum proizvodinje posle datog "+date+" datuma");
    }
}

export async function findByProductIdAndExpiryDateBetween({productId, startDate, endDate}){
    try{
        if(isNaN(productId) || productId == null ||
           !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid()){
                throw new Error("Dati id "+productId+" proizvoda i opseg isticanja "+startDate+" - "+endDate+" datuma, nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj isticanja batch-eva ne sme biti ispred datuma za pocetak isticanja batch-eva");
        }
        const response = await api.get(url+`/search/product/${productId}/expiry-date-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+productId+" proizvoda i opseg isticanja "+startDate+" - "+endDate+" datuma");
    }
}

export async function findByProduct_NameContainingIgnoreCase(productName){
    try{
        if(!productName || typeof productName !== "string" || productName.trim() === ""){
            throw new Error("Dati naziv "+productName+" proizvoda, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-name`,{
            params:{
                productName:productName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+productName+" datog proizvoda");
    }
}

export async function findByProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" za proizvod, nije pronadjena");
        }
        const response = await api.get(url+`/UnitMeasure`,{
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
            throw new Error("Dati tip dobavljaca "+supplierType+" za dati proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca "+supplierType+" za dati proizvod");
    }
}

export async function findByProduct_StorageType(storageType){
    try{    
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista "+storageType+" za dati proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip skladista "+storageType+" za dati proizvod");
    }
}

export async function findByProduct_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip robe "+goodsType+" za dati proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe "+goodsType+" za dati proizvod");
    }
}

export async function findByProduct_StorageId(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista za dati proizvoda, nije pronadjen");
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
            throw new Error("Dati naziv skladista "+storageName+" za proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv skladista "+storageName+" za dati proizvod");
    }
}

export async function findByProduct_StorageLocationContainingIgnoreCase(storageLocation){
    try{
        if(!storageLocation || typeof storageLocation !== "string" || storageLocation.trim() === ""){
            throw new Error("Data lokacija skladista "+storageLocation+" za proizvod, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju skladista "+storageLocation+" za dati proizvod");
    }
}

export async function findByProduct_StorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skaldista "+parseCapacity+" za proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacite skaldista "+capacity+" za dati proizvod");
    }
}

export async function findByProduct_StorageCapacityGreaterThan(capacity){
    try{    
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista veci od "+parseCapacity+" za dati proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista veci od "+capacity+" za dati proizvod");
    }
}

export async function findByProduct_StorageCapacityLessThan(capacity){
    try{    
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista manji od "+parseCapacity+" za dati proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista manji od "+capacity+" za dati proizvod");
    }
}

export async function findByProduct_StorageStatus(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status skladista "+status+" za proizvod, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status skladista "+status+" za dati proizvod");
    }
}

export async function findByProduct_StoragehasShelvesForIsNull(){
    try{
        const response = await api.get(url+`/search/product/storage-shelves-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste bez polica za proizvod");
    }
}

export async function findByProduct_SupplyId(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id "+supplyId+" dobavljaca za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/supply${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za dati proizvod");
    }
}

export async function findByProduct_ShelfId(shelfId){
    try{
        if(shelfId == null || isNaN(shelfId)){
            throw new Error("Dati id "+shelfId+" police za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police za proizvod");
    }
}

export async function findByProduct_ShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Dati red "+parseRowCount+" police za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/shelf-row-count`,{
            params:{
                rowCount:parseRowCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red "+rowCount+" police za proizvod");
    }
}

export async function findByProduct_ShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Dati raf "+parseCols+" police za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/search/product/shelf-cols`,{
            params:{
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli raf "+cols+" police za dati proizvod");
    }
}

export async function existsByRowCountAndStorageId({rows, storageId}){
    try{
        const parseRows = parseInt(rows,10);
        if(isNaN(parseRows) || parseRows <= 0 || isNaN(storageId) || storageId == null){
            throw new Error("Postojanje reda "+parseRows+" police i id "+storageId+" skladista, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists/shelf/rows/storage/${storageId}`,{
            params:{
                rows:parseRows
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje id "+storageId+" skladista i red "+rows+" polica");
    }
}

export async function existsByColsAndStorageId({cols, storageId}){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0 || isNaN(storageId) || storageId == null){
            throw new Error("Postojanje datog rafa "+parseCols+" i id "+storageId+" skladista, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists/shelf/cols/storage/${storageId}`,{
            params:{
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postonaje rafa "+cols+" i id "+storageId+" skladista");
    }
}

export async function existsByRowCountAndColsAndStorageId({rows, cols, storageId}){
    try{
        const parseCols = parseInt(cols,10);
        const parseRows = parseInt(rows,10);
        if(isNaN(parseCols) || parseCols <= 0 || isNaN(parseRows) || parseRows <= 0 || isNaN(storageId) || storageId == null){
            throw new Error("Postojanje datog reda "+parseRows+" rafa "+parseCols+" i id "+storageId+" skladista, nije pronadjeno");
        }
        const response = await api.get(url+`/exists/shelf/rows-cols/storage/${storageId}`,{
            params:{
                rows:parseRows,
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje datog reda "+rows+" , rafa "+cols+" i id "+storageId+" skladista");
    }
}

export async function findByRowCountAndColsAndStorageId({rows, cols, storageId}){
    try{
        const parseCols = parseInt(cols,10);
        const parseRows = parseInt(rows,10);
        if(isNaN(parseCols) || parseCols <= 0 || isNaN(parseRows) || parseRows <= 0 || isNaN(storageId) || storageId == null){
            throw new Error("Dati red "+parseRows+" raf "+parseCols+" i id "+storageId+" skladista, nije pronadjeno");
        }
        const response = await api.get(url+`/search/row-and-cols/storage/${storageId}`,{
            params:{
                rows:parseRows,
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red "+rows+" , raf "+cols+" i id "+storageId+" skladista");
    }
}

export async function findByRowCountAndStorageId({rows, storageId}){
    try{
        const parseRows = parseInt(rows,10);
        if(isNaN(parseRows) || parseRows <= 0 || isNaN(storageId) || storageId == null){
            throw new Error("Dati red "+parseRows+" i id "+storageId+" skladista, nije pronadjeno");
        }
        const response = await api.get(url+`/search/shelf-row/storage/${storageId}`,{
            params:{
                rows:parseRows
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli red "+rows+" i id "+storageId+" skladista");
    }
}

export async function findByColsAndStorageId({cols, storageId}){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0 || isNaN(storageId) || storageId == null){
            throw new Error("Dati raf "+parseCols+" i id "+storageId+" skladista, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/shelf-cols/storage/${storageId}`,{
            params:{
                cols:parseCols
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli raf "+cols+" i id "+storageId+" skladista");
    }
}

export async function countBatchesByStatus(){
    try{
        const response = await api.get(url+`/count/batches-status`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj batch-eva po statusu");
    }
}

export async function countBatchesByConfirmed(){
    try{
        const response = await api.get(url+`/count/batches-confirmed`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj batch-va po 'Confirmed'");
    }
}

export async function countBatchesByYearAndMonth(){
    try{
        const response = await api.get(url+`/count/batches-year-and-month`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj batch-eva po godini i mesecu");
    }
}

export async function trackBatch(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" batch-a za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" batch-a za pracenje");
    }
}

export async function confirmBatch(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu batch-a, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu batch-a");
    }
}

export async function closeBatch(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje batch-a, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje batch-a");
    }
}

export async function cancelBatch(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje batch-a, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje batch-a");
    }
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isBatchStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status batch-a "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status batch-a "+status);
    }
}

export async function saveBatch({code,productId,quantityProduced,productionDate,expiryDate,status, confirmed = false}){
    try{
        const parseQuantityProduced = parseFloat(quantityProduced);
        if(!code?.trim() || isNaN(productId) || productId == null || isNaN(parseQuantityProduced) || parseQuantityProduced <= 0 || !moment(productionDate,"YYYY-MM-DD",true).isValid() ||
           !moment(expiryDate,"YYYY-MM-DD",true).isValid() || !isBatchStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {code,productId,quantityProduced,productionDate,expiryDate,status, confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,code,quantityProduced,productId,productionDate,expiryDate}){
    try{
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        const parseQuantityProduced = parseFloat(quantityProduced);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Proizvedena kolicina "+parseQuantityProduced+" mora biti ceo broj");
        }
        if(isNaN(productId) || productId == null){
            throw new Error("ID proizvoda "+productId+" mora biti ceo broj");
        }
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" mora biti string");
        }
        if(!moment(productionDate,"YYYY-MM-DD",true).isValid() || !moment(expiryDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum proizvodnje "+productionDate+" i datum isticanja "+expiryDate+" moraju biti uneti");
        }
        const requestBody = {code,quantityProduced,productId,productionDate,expiryDate};
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
            const parseQuantityProduced = parseFloat(req.quantityProduced);
            if (req.id == null || isNaN(req.id)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'proizvedena-kolicina' mora biti ceo broj`);
            }
            if(!req.code?.trim()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'kod' mora biti string`);
            }
            if(req.productId == null || isNaN(req.productId)){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'product-id' je obavezan i mora biti broj`);
            }
            if(!moment(req.productionDate,"YYYY-MM-DD",true).isValid()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'datum-proizvodnje' je obavezan`);
            }
            if(!moment(req.expiryDate,"YYYY-MM-DD",true).isValid()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'datum-isticanja' je obavezan`);
            }
            if(!isBatchStatusValid(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' je obavezan`);
            }
            if(typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' polje je obavezno`);
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