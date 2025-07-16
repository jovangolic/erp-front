import { api, getHeader, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createSupplyItem({procurementId, vendorId, cost}){
    try{
        if(!procurementId || vendorId || cost == null || cost <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            procurementId:procurementId, vendorId:vendorId, cost:cost
        };
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/create/new-supply-item`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja supply-item: " + error.message);
        }
        
    }
}

export async function updateSupplyItem({id, procurementId, vendorId, cost}){
    try{
        if( !id ||!procurementId || vendorId || cost == null || cost <= 0){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            id:id, procurementId:procurementId, vendorId:vendorId, cost:cost
        };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom azuriranja supply-item: " + error.message);
        }
    }
}

export async function deleteSupplyItem(id){
    try{
        if(!id){
            throw new Error("Dati ID nije pornadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOneSupplyItem(id){
    try{
        if(!id){
            throw new Error("Dati ID nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/supplyItem/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
    }
}

export async function getAllSuppliesItems(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/get-all-supplies-items`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
       handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getByProcurementId(procurementId){
    try{
        if(!procurementId){
            throw new Error("Dati procurementId nije pornadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/procurement/${procurementId}`,{
            params:{
                procurementId:procurementId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id:");
    }
}

export async function getBySupplierId(supplierId){
    try {
        if(!supplierId){
            throw new Error("Datu supplierId noje pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/supplier/${supplierId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch(error) {
        handleApiError(error, "Greška prilikom dobavljanja po supplierId");
    }
}

export async function getByCostBetween({min, max}){
    try{
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if(isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0){
                throw new Error("Polja moraju biti popunjena i validna");
            }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/cost-between`,{
            params:{
                min:min, max:max
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska izmedju cena");
    }
}

export async function getByProcurementDateBetween({startDate, endDate}){
    try {
        if (
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid()
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/procurement-date-between`, {
            params: {
                startDate: moment(startDate).toISOString(), // ISO format: 2024-08-01T10:00:00Z
                endDate: moment(endDate).toISOString()
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri dohvatanju po datumu");
    }
}

export async function getByProcurementDateAndCostBetween({startDate,endDate, min, max}){
    try{
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if (
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid() ||
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/date-cost-between`,{
            params:{
                min:min, max:max,
                startDate: moment(startDate).toISOString(),
                endDate: moment(endDate).toISOString()
            }
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greška pri dohvatanju cena po datumu");
    }
}

export async function getByProcurementAndVendor({procurementId, vendorId}){
    try{
        if(!procurementId || vendorId){
            throw new Error("ProcurementId i vendorId nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/by-procurement-vendor/${procurementId}/${vendorId}`,{
            params:{
                procurementId: procurementId,
                vendorId: vendorId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greška pri nabavci i prodavcu:");
    }
}

export async function getByVendorAndProcurementAndCost({supplierId, procurementId, minCost}){
    try {
        if(!procurementId || vendorId || isNaN(minCost) || minCost < 0){
            throw new Error("procurementId, vendorId i minCost nisu pronadjeni");
        }
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/suppliesItems/by-supplier-procurement-cost/${supplierId}/${procurementId}`,
            {
                params: {
                    minCost: parseFloat(minCost) // OBAVEZNO koristi "minCost", ne "cost"
                },
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri dohvatanju po dobavljaču, nabavci i minimalnoj ceni");
    }
}

export async function getByDateAndCost({startDate, endDate, min, max}) {
    try {
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if (
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid() ||
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/date-cost`, {
            params: {
                min: parsedMin,
                max: parsedMax,
                startDate: moment(startDate).toISOString(),
                endDate: moment(endDate).toISOString()
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri dohvatanju po datumu i ceni");
    }
}

export async function getBySupplierNameAndProcurementDateAndMaxCost({supplierName, startDate, endDate, max}){
    try {
        if (
            !supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            !moment(startDate, moment.ISO_8601, true).isValid() ||
            !moment(endDate, moment.ISO_8601, true).isValid() ||
            isNaN(max) || parseFloat(max) <= 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena.");
        }
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/suppliesItems/filter-by-supplier-date-cost`,
            {
                params: {
                    supplierName: supplierName.trim(),
                    startDate: moment(startDate).toISOString(), 
                    endDate: moment(endDate).toISOString(),
                    max: parseFloat(max) 
                },
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška pri imenu dobavljača, datumu i maksimalnoj ceni");
    }
}

export async function findBySupplier_NameContainingIgnoreCase(supplierName){
    try{
        if(!supplierName || typeof supplierName !== "string" || supplierName.trim() === ""){
            throw new Error("Dati naziv dobavljaca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-name`,{
            params:{
                supplierName:supplierName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv dobavljaca");
    }
}

export async function findBySupplier_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona dobavljaca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona za dobavljaca");
    }
}

export async function findBySupplier_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email dobavljaca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-email`,{
            params:{
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email za dobavljaca");
    }
}

export async function findBySupplier_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa dobavljaca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-address`,{
            params:{
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu za dobavljaca");
    }
}

export async function findBySupplierNameContainingAndCostBetween({supplierName, minCost, maxCost}){
    try{
        const parseMinCost = parseFloat(minCost);
        const parseMaxCost = parseFloat(maxCost);
        if(!supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            parseMaxCost <= 0 || isNaN(parseMaxCost) || parseMinCost <= 0 || isNaN(parseMinCost)){
            throw new Error("Dati naziv dobavljaca i opseg cena nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-name-cost-range`,{
            params:{
                supplierName:supplierName,
                minCost:parseMinCost,
                maxCost:parseMaxCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv dobavljaca i opseg cena");
    }
}

export async function findBySupplierNameAndProcurementDateBetween({supplierName, start, end}){
    try{
        if(!supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati naziv za dobavljaca i opseg datuma za nabavku, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-name-procurement-date-range`,{
            params:{
                supplierName:supplierName,
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv dobavljaca i opseg datuma za nabavku");
    }
}

export async function findByAddressAndMinCost({address, minCost}){
    try{
        const parseMinCost = parseFloat(minCost);
        if(!address || typeof address !== "string" || address.trim() === "" ||
            parseMinCost <= 0 || isNaN(parseMinCost)){
            throw new Error("Data adresa dobavljaca i minimalna cena nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/address-min-cost`,{
            params:{
                address:address,
                minCost:parseMinCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu dobavljaca i minimalnu cenu");
    }
}

export async function findByPhoneNumberAndCost({phoneNumber, cost}){
    try{
        const parseCost = parseFloat(cost);
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            isNaN(parseCost) || parseCost <= 0){
            throw new Error("Dati broj-telefona dobavljaca i cena nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/phone-number-cost`,{
            params:{
                phoneNumber:phoneNumber,
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona dobavljaca i cenu");
    }
}

export async function findByProcurementSupplyItemCount(count){
    try{
        const parseCount = parseInt(count,10);
        if(isNaN(parseCount) || parseCount <= 0){
            throw new Error("Dati broj nabavki za supply-item nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/procurement-supply-item-count`,{
            params:{
                count:parseCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj nabavki za supply-item");
    }
}

export async function findByCost(cost){
    try{
        const parseCost = parseFloat(cost);
        if(parseCost <= 0 || isNaN(parseCost)){
            throw new Error("Data cena za supply-item nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/by-cost`,{
            params:{
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu za supply-item");
    }
}

export async function findByCostGreaterThan(cost){
    try{
        const parseCost = parseFloat(cost);
        if(parseCost <= 0 || isNaN(parseCost)){
            throw new Error("Data cena veca od za supply-item nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/cost-greater-than`,{
            params:{
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu vecu od za supply-item");
    }
}

export async function findByCostLessThan(cost){
    try{
        const parseCost = parseFloat(cost);
        if(parseCost <= 0 || isNaN(parseCost)){
            throw new Error("Data cena manja od za supply-item nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/cost-less-than`,{
            params:{
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu manju od za supply-item");
    }
}

export async function findByProcurementTotalCostGreaterThan(minCost){
    try{
        const parseMinCost = parseFloat(minCost);
        if(isNaN(parseMinCost) || parseMinCost <= 0){
            throw new Error("Data cena veca od za nabavku nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/procurement/total-cost-greater-than`,{
            params:{
                minCost:parseMinCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu vecu od za nabavku");
    }
}

export async function findByProcurementDate(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum nabavke nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/procurement-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum nabavke");
    }
}

export async function findBySupplyAndSalesCountMismatch(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supply-sales-count-mismatch`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dobavljaca i prodaju koji se ne podudaraju");
    }
}

export async function findByProcurementWithSupplyCostOver(minTotal){
    try{
        const parseMinTotal = parseFloat(minTotal);
        if(isNaN(parseMinTotal) || parseMinTotal <= 0){
            throw new Error("Data cena koja prelazi cenu nabavke nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/procurement-with-supply-cost-over`,{
            params:{
                minTotal:parseMinTotal
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavku koja prelazi datu cenu nabavke");
    }
}

export async function findBySupplierWithMoreThanNItems(minCount){
    try{
        const parseMinCount = parseFloat(minCount);
        if(parseMinCount <= 0 || isNaN(parseMinCount)){
            throw new Error("Dati broj stavki za nabavljaca nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/supplier-wuth-more-than-n-times`,{
            params:{
                minCount:parseMinCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavljaca koji ima vise od n stavki");
    }
}

export async function sumCostGroupedByProcurement(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/sum-cost-group-by-procurement"`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupno grupisanu cenu za nabavku");
    }
}

export async function countBySupplier(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/count-by-supplier`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj dobavljaca");
    }
}

export async function avgCostByProcurement(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/avg-cost-by-procurement`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prosecnu cenu nabavke");
    }
}

export async function procurementPerEntityStats(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/procurement-per-entity-stats`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavku po statistici unosa");
    }
}

export async function findCostSumGroupedByProcurement(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/cost-sum-grouped-by-procurement`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu cenu grupisanu po nabavci");
    }
}

export async function findCostSumGroupedByProcurementWithMinTotal(minTotal){
    try{
        const parseMinTotal = parseFloat(minTotal);
        if(isNaN(parseMinTotal) || parseMinTotal <= 0){
            throw new Error("Dati unos za ukupnu cenu grupisanu po nabavci nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/cost-sum-by-procurement-with-min-total`,{
            params:{
                minTotal:parseMinTotal
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu cenu grupisanu po nabavci sa manjom od");
    }
}

export async function procurementStats(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/procurement-stats`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli statistiku za nabavku");
    }
}

export async function countAllSupplyItems(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/count-all-supply-items`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj supply-items");
    }
}

export async function countByProcurementId(procurementId){
    try{
        if(procurementId == null || isNaN(procurementId)){
            throw new Error("Dati ID za nabavku nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/count-by-procurement/${procurementId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj nabavki po ID-iju");
    }
}

export async function sumAllCosts(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/sum-all-costs`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan zbir cena");
    }
}

export async function averageCost(){
   try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/average-cost`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prosecnu cenu");
    } 
}

export async function minCost(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/min-cost`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli najmanju cenu");
    }
}

export async function maxCost(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/suppliesItems/search/max-cost`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli najvecu cenu");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}