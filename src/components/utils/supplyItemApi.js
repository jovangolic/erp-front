import { version } from "react";
import { api, getHeader, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const url = `${import.meta.env.VITE_API_BASE_URL}/suppliesItems`;

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createSupplyItem({procurementId, vendorId, cost}){
    try{
        const parseCost = parseFloat(cost);
        if(
            procurementId == null || isNaN(procurementId) || 
            vendorId == null || sNaN(vendorId) || isNaN(parseCost) || parseCost <= 0){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            procurementId, vendorId, cost
        };
        const response = await api.post(`/create/new-supply-item`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom kreiranja supply-item: " + error.message);
        }
        
    }
}

export async function updateSupplyItem({id, procurementId, vendorId, cost}){
    try{
        const parseCost = parseFloat(cost);
        if(
            id == null || isNaN(id) ||
            procurementId == null || isNaN(procurementId) || 
            vendorId == null || sNaN(vendorId) || isNaN(parseCost) || parseCost <= 0){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            procurementId, vendorId, cost
        };
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
            throw new Error("Greska prilikom azuriranja supply-item: " + error.message);
        }
    }
}

export async function deleteSupplyItem(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije pornadjen");
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

export async function getOneSupplyItem(id){
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
        handleApiError(error, "Greska prilikom dobavljanja jedne stavke dobavljaca po "+id+" id-iju");
    }
}

export async function getAllSuppliesItems(){
    try{
        const response = await api.get(url+`/find-all`,{
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
        if(procurementId == null || isNaN(procurementId)){
            throw new Error("Dati id "+procurementId+" nabavke nije pronadjen");
        }
        const response = await api.get(url+`/procurement/${procurementId}`,{
            params:{
                procurementId:procurementId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id: "+id+" nabavke");
    }
}

export async function getBySupplierId(supplierId){
    try {
        if(supplierId == null || isNaN(supplierId)){
            throw new Error("Dati id "+supplierId+"  dobavljaca, nije pronadjen");
        }
        const response = await api.get(url+`/supplier/${supplierId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch(error) {
        handleApiError(error, "Greška prilikom dobavljanja po id-iju "+supplierId+" dobavljaca");
    }
}

export async function getByCostBetween({min, max}){
    try{
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if(
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0){
                throw new Error("Dati opseg cena "+parsedMin+" - "+parsedMax+" nije pronadjen");
            }
        const response = await api.get(url+`/cost-between`,{
            params:{
                min:min, max:max
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Trenutno nismo pronasli opseg "+min+" - "+max+" dati cena");
    }
}

export async function getByProcurementDateBetween({startDate, endDate}){
    try {
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if (!validateStart || !validateEnd) {
            throw new Error("Dati opseg "+startDate+" - "+endDate+" datuma, nije pronadje");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/procurement-date-between`, {
            params: {
                startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Trenutno nismo pronasli opseg "+startDate+" - "+endDate+" datuma za nabavku");
    }
}

export async function getByProcurementDateAndCostBetween({startDate,endDate, min, max}){
    try{
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if (
            !validateStart || !validateEnd ||
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0
        ) {
            throw new Error("Dati opseg "+startDate+" - "+endDate+" datuma i opseg "+parsedMin+" - "+parsedMax+" cena za nabavku, nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/date-cost-between`,{
            params:{
                min:min, max:max,
                startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            }
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli opseg "+startDate+" - "+endDate+" datuma i opseg "+min+" - "+max+" cena za nabavku");
    }
}

export async function getByProcurementAndVendor({procurementId, vendorId}){
    try{
        if(procurementId == null || isNaN(procurementId) || vendorId == null || isNaN(vendorId)){
            throw new Error("Dati id "+procurementId+" za nabavku i id "+vendorId+" za prodavca, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-procurement-vendor/${procurementId}/${vendorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli id "+procurementId+" za nabavku i id "+vendorId+" za prodavca");
    }
}

export async function getByVendorAndProcurementAndCost({supplierId, procurementId, minCost}){
    try {
        const parseMinCost = parseFloat(minCost);
        if(
            procurementId == null || isNaN(procurementId) || vendorId == null || isNaN(vendorId) ||
            isNaN(parseMinCost) || parseMinCost <= 0){
                throw new Error("Dati id "+procurementId+" za nabavku, id "+vendorId+" za prodavca i cena "+parseMinCost+" nisu pronadjeni");
        }
        const response = await api.get(
            url+`/by-supplier-procurement-cost/${supplierId}/${procurementId}`,
            {
                params: {
                    minCost: parseMinCost // OBAVEZNO koristi "minCost", ne "cost"
                },
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Trenutno nismo pronasli id "+procurementId+" za nabavku, id "+vendorId+" za prodavca i cenu "+minCost);
    }
}

export async function getByDateAndCost({startDate, endDate, min, max}) {
    try {
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        if (
            !validateStart || !validateEnd ||
            isNaN(parsedMin) || parsedMin < 0 ||
            isNaN(parsedMax) || parsedMax <= 0
        ) {
            throw new Error("Dati opseg "+startDate+" - "+endDate+" datuma i opseg "+parsedMin+" - "+parsedMax+" cena, nije pronadjen");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/date-cost`, {
            params: {
                min: parsedMin,
                max: parsedMax,
                startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Trenutno nismo pronasli opseg "+startDate+" - "+endDate+" i opseg "+min+" - "+max+" cena");
    }
}

export async function getBySupplierNameAndProcurementDateAndMaxCost({supplierName, startDate, endDate, max}){
    try {
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DDTHH:mm:ss").isValid();
        const parseMax = parseFloat(max);
        if (
            !supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            !validateStart || !validateEnd || 
            isNaN(parseMax) || parseMax <= 0
        ) {
            throw new Error("Dati naziv "+supplierName+" dobavljaca, opseg "+startDate+" - "+endDate+" datuma i maksimalna cena "+parseMax+" ,nisu");
        }
        if(moment(endDate).isBefore(moment(startDate))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(
            url+`/filter-by-supplier-date-cost`,
            {
                params: {
                    supplierName: supplierName.trim(),
                    startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"), 
                    endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss"),
                    max: parseMax 
                },
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Trenutno nismo pronasli naziv "+supplierName+" dobavljaca, opseg "+startDate+" - "+endDate+" datuma, i maksimalnu cenu "+max);
    }
}

export async function findBySupplier_NameContainingIgnoreCase(supplierName){
    try{
        if(!supplierName || typeof supplierName !== "string" || supplierName.trim() === ""){
            throw new Error("Dati naziv "+supplierName+" dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/search/supplier-name`,{
            params:{
                supplierName:supplierName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+supplierName+" dobavljaca");
    }
}

export async function findBySupplier_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/search/supplier-phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phoneNumber+" za dobavljaca");
    }
}

export async function findBySupplier_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/search/supplier-email`,{
            params:{
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+email+" za dobavljaca");
    }
}

export async function findBySupplier_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa "+address+" dobavljaca nije pronadjen");
        }
        const response = await api.get(url+`/search/supplier-address`,{
            params:{
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu "+address+" za dobavljaca");
    }
}

export async function findBySupplierNameContainingAndCostBetween({supplierName, minCost, maxCost}){
    try{
        const parseMinCost = parseFloat(minCost);
        const parseMaxCost = parseFloat(maxCost);
        if(
            !supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            parseMaxCost <= 0 || isNaN(parseMaxCost) || parseMinCost <= 0 || isNaN(parseMinCost)){
            throw new Error("Dati naziv "+supplierName+" dobavljaca i opseg cena "+parseMinCost+" - "+parseMaxCost+" nije pronadjen");
        }
        if(parseMinCost > parseMaxCost){
            throw new Error("Min cena ne sme btii veca od max cene");
        }
        const response = await api.get(url+`/search/supplier-name-cost-range`,{
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+supplierName+" dobavljaca i opseg "+minCost+" - "+maxCost+" cena");
    }
}

export async function findBySupplierNameAndProcurementDateBetween({supplierName, start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            !supplierName || typeof supplierName !== "string" || supplierName.trim() === "" ||
            !validateStart ||
            !validateEnd){
                throw new Error("Dati naziv "+supplierName+" za dobavljaca i opseg "+start+" - "+end+" datuma za nabavku, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/supplier-name-procurement-date-range`,{
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+supplierName+" dobavljaca i opseg "+start+" - "+end+" datuma za nabavku");
    }
}

export async function findByAddressAndMinCost({address, minCost}){
    try{
        const parseMinCost = parseFloat(minCost);
        if(!address || typeof address !== "string" || address.trim() === "" ||
            parseMinCost <= 0 || isNaN(parseMinCost)){
            throw new Error("Data adresa "+address+" dobavljaca i minimalna "+parseMinCost+" cena nisu pronadjeni");
        }
        const response = await api.get(url+`/search/address-min-cost`,{
            params:{
                address:address,
                minCost:parseMinCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu "+address+" dobavljaca i minimalnu cenu "+minCost);
    }
}

export async function findByPhoneNumberAndCost({phoneNumber, cost}){
    try{
        const parseCost = parseFloat(cost);
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            isNaN(parseCost) || parseCost <= 0){
            throw new Error("Dati broj-telefona "+phoneNumber+" dobavljaca i cena "+parseCost+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/phone-number-cost`,{
            params:{
                phoneNumber:phoneNumber,
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phoneNumber+" dobavljaca i cenu "+cost);
    }
}

export async function findByProcurementSupplyItemCount(count){
    try{
        const parseCount = parseInt(count,10);
        if(isNaN(parseCount) || parseCount <= 0){
            throw new Error("Dati broj "+parseCount+" nabavki za supply-item nije pronadjen");
        }
        const response = await api.get(url+`/search/procurement-supply-item-count`,{
            params:{
                count:parseCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj "+count+" nabavki za supply-item");
    }
}

export async function findByCost(cost){
    try{
        const parseCost = parseFloat(cost);
        if(parseCost <= 0 || isNaN(parseCost)){
            throw new Error("Data cena "+parseCost+" za stavku-dobavljaca nije pronadjena");
        }
        const response = await api.get(url+`/search/by-cost`,{
            params:{
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu "+cost+" za stavku-dobavljaca");
    }
}

export async function findByCostGreaterThan(cost){
    try{
        const parseCost = parseFloat(cost);
        if(parseCost <= 0 || isNaN(parseCost)){
            throw new Error("Data cena veca od "+parseCost+" za stavku-dobavljaca nije pronadjena");
        }
        const response = await api.get(url+`/search/cost-greater-than`,{
            params:{
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu vecu od "+cost+" za stavku dobavljaca");
    }
}

export async function findByCostLessThan(cost){
    try{
        const parseCost = parseFloat(cost);
        if(parseCost <= 0 || isNaN(parseCost)){
            throw new Error("Data cena manja od "+parseCost+" za stavku-dobavljaca nije pronadjena");
        }
        const response = await api.get(url+`/search/cost-less-than`,{
            params:{
                cost:parseCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu manju od "+cost+" za stavku-dobavljaca");
    }
}

export async function findByProcurementTotalCostGreaterThan(minCost){
    try{
        const parseMinCost = parseFloat(minCost);
        if(isNaN(parseMinCost) || parseMinCost <= 0){
            throw new Error("Data cena veca od "+parseMinCost+" za nabavku nije pronadjena");
        }
        const response = await api.get(url+`/search/procurement/total-cost-greater-than`,{
            params:{
                minCost:parseMinCost
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli cenu vecu od "+minCost+" za nabavku");
    }
}

export async function findByProcurementDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDate){
            throw new Error("Dati datum "+date+" nabavke nije pronadjen");
        }
        const response = await api.get(url+`/search/procurement-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" nabavke");
    }
}

export async function findBySupplyAndSalesCountMismatch(){
    try{
        const response = await api.get(url+`/search/supply-sales-count-mismatch`,{
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
            throw new Error("Data cena "+parseMinTotal+" koja prelazi cenu nabavke nije pronadjena");
        }
        const response = await api.get(url+`/search/procurement-with-supply-cost-over`,{
            params:{
                minTotal:parseMinTotal
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavku koja prelazi datu "+minTotal+" cenu nabavke");
    }
}

export async function findBySupplierWithMoreThanNItems(minCount){
    try{
        const parseMinCount = parseFloat(minCount);
        if(parseMinCount <= 0 || isNaN(parseMinCount)){
            throw new Error("Dati broj "+parseMinCount+" stavki za nabavljaca nisu pronadjeni");
        }
        const response = await api.get(url+`/search/supplier-wuth-more-than-n-times`,{
            params:{
                minCount:parseMinCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavljaca koji ima "+minCount+" vise od n stavki");
    }
}

export async function sumCostGroupedByProcurement(){
    try{
        const response = await api.get(url+`/search/sum-cost-group-by-procurement"`,{
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
        const response = await api.get(url+`/search/count-by-supplier`,{
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
        const response = await api.get(url+`/search/avg-cost-by-procurement`,{
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
        const response = await api.get(url+`/search/procurement-per-entity-stats`,{
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
        const response = await api.get(url+`/search/cost-sum-grouped-by-procurement`,{
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
            throw new Error("Dati unos "+parseMinTotal+" za ukupnu cenu grupisanu po nabavci nije pronadjena");
        }
        const response = await api.get(url+`/search/cost-sum-by-procurement-with-min-total`,{
            params:{
                minTotal:parseMinTotal
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu cenu "+minTotal+" grupisanu po nabavci sa manjom od");
    }
}

export async function procurementStats(){
    try{
        const response = await api.get(url+`/search/procurement-stats`,{
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
        const response = await api.get(url+`/search/count-all-supply-items`,{
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
            throw new Error("Dati ID "+procurementId+" za nabavku nije pronadjen");
        }
        const response = await api.get(url+`/search/count-by-procurement/${procurementId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj nabavki po "+procurementId+" ID-iju");
    }
}

export async function sumAllCosts(){
    try{
        const response = await api.get(url+`/search/sum-all-costs`,{
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
        const response = await api.get(url+`/search/average-cost`,{
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
        const response = await api.get(url+`/search/min-cost`,{
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
        const response = await api.get(url+`/search/max-cost`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli najvecu cenu");
    }
}


