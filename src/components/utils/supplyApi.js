import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

export async function createSupply({storageId, goodsIds, quantity, updates}) {
    try {
        // Validacija pre slanja
        if (
            !storageId ||
            !Array.isArray(goodsIds) || goodsIds.length === 0 ||
            isNaN(quantity) || parseFloat(quantity) <= 0 ||
            !moment(updates, moment.ISO_8601, true).isValid()
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const requestBody = {
            storageId,
            goodsIds,
            quantity: parseFloat(quantity),
            updates: moment(updates).toISOString()
        };
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/supplies/create/new-supply`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom kreiranja zaliha: " + error.message);
        }
    }
}

export async function updateSupply({id, storageId, goodsIds, quantity, updates}) {
    try {
        if (
            !id ||
            !storageId ||
            !Array.isArray(goodsIds) || goodsIds.length === 0 ||
            isNaN(quantity) || parseInt(quantity) <= 0 ||
            !moment(updates, moment.ISO_8601, true).isValid()
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const requestBody = {
            id,
            storageId,
            goodsIds,
            quantity: parseInt(quantity),
            updates: moment(updates).toISOString()
        };
        const response = await api.put(
            `${import.meta.env.VITE_API_BASE_URL}/supplies/update/${id}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom ažuriranja zaliha: " + error.message);
        }
    }
}

export async function deleteSupply(id){
    try{
        if(!id){
            throw new Error("Dati ID nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/supplies/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getBySupplyId(supplyId){
    try{
        if(!supplyId){
            throw new Error("Dati supplyId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/${supplyId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dohvacanja jedne zalihe");
    }
}

export async function getAllSupplies(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/get-all-supplies`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih zaliha");;
    }
}

export async function getBySuppliesByGoodsName(name){
    try{
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Naziv robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/by-goods-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha i robe po nazivu");
    }
}

export async function getBySuppliesWithMinQuantity(minQuantity){
    try{
        if(isNaN(minQuantity) || minQuantity < 0){
            throw new Error("minQuantity ne sme biti manje od nula");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/by-minQuantity`,{
            params:{
                quantity:parseInt(minQuantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha sa najmanjom kolicinom");
    }
}

export async function getBySuppliesByStorageId(storageId){
    try{
        if(!storageId){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/supply/storageId/${storageId}`,{
            params:{
                storageId:storageId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha koje pripadaju za odredjeno skladiste");
    }
}

export async function findByUpdatesBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opseg datuma za supply nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/updates-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma za supply");
    }
}

export async function findByStorage_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv datog skadista");
    }
}

export async function findByStorage_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija za skladista nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju datog skadista");
    }
}

export async function findByStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skaldista, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista");
    }
}

export async function findByStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od za skaldiste, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od za skladista");
    }
}

export async function findByStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od za skaldiste, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od za skladista");
    }
}

export async function findByStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati tip skladista");
    }
}

export async function findByStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati status skladista");
    }
}

export async function findByStorage_Type_AndCapacity({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i njegov kapacitet nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-type-and-capacity`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista i njegov kapacitet");
    }
}

export async function findByStorage_Type_AndCapacityGreaterThan({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i njegov kapacitet veci od nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-type-and-capacuty-greater-than`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista i njegov kapacitet veci od");
    }
}

export async function findByStorage_Type_AndCapacityLessThan({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i njegov kapacitet manji od nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-type-and-capacity-less-than`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista i njegov kapacitet manji od");
    }
}

export async function findByStorage_Type_AndStatus({type, status}){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase()) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip i status skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/type-and-status`,{
            params:{
                type:(type || "").toUpperCase(),
                status: (status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati tip i status skladista");
    }
}

export async function findByStorage_Type_AndLocation({type, location}){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase()) ||
        !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati tip skladista i njegova lokacija nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-type-location`,{
            params:{
                location:location,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista i njegovu lokaciju");
    }
}

export async function findByStorage_Location_AndCapacity({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija i kapacitet skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-location-capacity`,{
            params:{location:location, capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju i kapacitet datog skladista");
    }
}

export async function findByStorage_Location_AndCapacityGreaterThan({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija i kapacitet veci od za skladiste nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-location-capacity-greater-than`,{
            params:{location:location, capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju i kapacitet veci od za dato skladiste");
    }
}

export async function findByStorage_Location_AndCapacityLessThan({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija i kapacitet manji od za skladiste nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-location-capacity-less-than`,{
            params:{location:location, capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju i kapacitet manji od za dato skladiste");
    }
}

export async function findByStorage_CapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg kapaciteta za dato skladiste nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-capacity-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kapaciteta za dato skladite");
    }
}

export async function findByStorageWithMinGoodsCount(minGoodsCount){
    try{
        const parseMinGoodsCount = parseInt(minGoodsCount,10);
        if(parseMinGoodsCount <= 0 || isNaN(parseMinGoodsCount)){
            throw new Error("Data minimalna kolicina robe za dato skladiste nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-with-min-goods-count`,{
            params:{minGoodsCount:parseMinGoodsCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje sadrzi minimalnu kolicinu date robe");
    }
}

export async function findByStorageWithMaxGoodsCount(maxGoodsCount){
    try{
        const parseMaxGoodsCount = parseInt(maxGoodsCount,10);
        if(parseMaxGoodsCount <= 0 || isNaN(parseMaxGoodsCount)){
            throw new Error("Data maksimalna kolicina robe za dato skladiste nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-with-max-goods-count`,{
            params:{maxGoodsCount:parseMaxGoodsCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje sadrzi maksimalnu kolicinu date robe");
    }
}

export async function findByStorageContainingMaterial(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv za materijal nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-contain-material-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje sadrzi dati naziv odredjenog materijala");
    }
}

export async function findByShelfCapacityInStorage(minShelfCapacity){
    try{
        const parseMinShelfCapacity = parseFloat(minShelfCapacity);
        if(isNaN(parseMinShelfCapacity) || parseMinShelfCapacity <= 0){
            throw new Error("Dati minimalan broj polica za dato skladiste, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage/shlef-capacity-in`,{
            params:{minShelfCapacity:parseMinShelfCapacity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste sa odredjenim kapaciteto polica");
    }
}

export async function findByStorageUsedAsTransferOrigin(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-used-as-transfer-origin`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste korisceno za transfer");
    }
}

export async function findSuppliesWithWorkCenters(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/supplies-with-workCenter`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli nabavke povezana sa radnim-centrom");
    }
}

export async function findByStorage_UsedCapacityGreaterThan(usedCapacity){
    try{
        const parseUsesdCapacity = parseFloat(usedCapacity);
        if(isNaN(parseUsesdCapacity) || parseUsesdCapacity <= 0){
            throw new Error("Dati kapacite izkoriscenog skladista veceg od, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-used-capacity-greater-than`,{
            params:{usedCapacity:parseUsesdCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima iskorisceni kapacitet veci od");
    }
}

export async function findByStorage_UsedCapacityLessThan(usedCapacity){
    try{
        const parseUsesdCapacity = parseFloat(usedCapacity);
        if(isNaN(parseUsesdCapacity) || parseUsesdCapacity <= 0){
            throw new Error("Dati kapacite izkoriscenog skladista manjeg od, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-used-capacity-less-than`,{
            params:{usedCapacity:parseUsesdCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima iskorisceni kapacitet manji od");
    }
}

export async function findByStorageWithEmptyShelves(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-with-empty-shelves`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste sa praznim policama");
    }
}

export async function findByStorageUsedAsTransferDestination(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/storage-used-as-transfer-destination"`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste korisceno za transfer do odredjene destinacije");
    }
}

export async function findProductionStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/production-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje je tipa proizvodnja");
    }
}

export async function findDistributionStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/distribution-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje je tipa distribucija");
    }
}

export async function findOpenStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/open-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje je tipa otvoreno");
    }
}

export async function findClosedStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/closed-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje je tipa zatvoreno");
    }
}

export async function findInterimStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/interim-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje je tipa privremeno");
    }
}

export async function findAvailableStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/available-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje je tipa dostupno");
    }
}

export async function findActiveStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/active-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima status aktivno");
    }
}

export async function findUnderMaintenanceStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/under-maintenance-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima status pod-odrzavanjem");
    }
}

export async function findDecommissionedStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/decommissioned-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima status ugaseno");
    }
}

export async function findReservedStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/reserved-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima status rezervisano");
    }
}

export async function findTemporaryStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/temporary-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima status trenutno");
    }
}

export async function findFullStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/full-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima status puno");
    }
}

export async function countGoodsPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-goods-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupnu kolicinu robe po skladistu");
    }
}

export async function countShelvesPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-shelves-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj polica po skladistu");
    }
}

export async function countOutgoingShipmentsPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-outgoing-shipments-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj odlazecih posiljki po skladistu");
    }
}

export async function countOutgoingTransfersPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-outgoing-transfers-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj odlazecih transfera po skladistu");
    }
}

export async function countIncomingTransfersPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-incoming-transfers-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj dolazecih transfera po skladistu");
    }
}

export async function countMaterialsPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-materials-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj materijala  po skladistu");
    }
}

export async function countOutgoingMaterialMovementsPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-outgoing-material-movements-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj odlazecih materijala po skladistu");
    }
}

export async function countIncomingMaterialMovementsPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-incoming-material-movements-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj dolazecih materijala po skladistu");
    }
}

export async function countWorkCentersPerStorage(){
    try{
        const reserved = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supplies/search/count-workCenters-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj radnih centara po skladistu");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}