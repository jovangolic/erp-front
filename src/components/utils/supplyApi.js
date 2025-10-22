import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const url = `${import.meta.env.VITE_API_BASE_URL}/supplies`;

const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createSupply({storageId, goodsIds, quantity, updates}) {
    try {
        // Validacija pre slanja
        const parseQuantity = parseFloat(quantity);
        const validateDate = moment.isMoment(updates) || moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if (
            storageId == null || isNaN(storageId) ||
            !Array.isArray(goodsIds) || goodsIds.length === 0 ||
            isNaN(parseQuantity) || parseQuantity <= 0 ||
            !validateDate
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const requestBody = {
            storageId,
            goodsIds,
            quantity,
            updates
        };
        const response = await api.post(
            url+`/create/new-supply`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greska prilikom kreiranja zaliha: " + error.message);
        }
    }
}

export async function updateSupply({id, storageId, goodsIds, quantity, updates}) {
    try {
        const parseQuantity = parseFloat(quantity);
        const validateDate = moment.isMoment(updates) || moment(updates,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if (
            id == null || isNaN(id) ||
            storageId == null || isNaN(storageId) ||
            !Array.isArray(goodsIds) || goodsIds.length === 0 ||
            isNaN(parseQuantity) || parseQuantity <= 0 ||
            !validateDate
        ) {
            throw new Error("Sva polja moraju biti popunjena i validna.");
        }
        const requestBody = {
            storageId,
            goodsIds,
            quantity,
            updates
        };
        const response = await api.put(
            url+`/update/${id}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greska prilikom azuriranja zaliha: " + error.message);
        }
    }
}

export async function deleteSupply(id){
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
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati supplyId nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dohvacanja jedne zalihe po "+id+" id-iju");
    }
}

export async function getAllSupplies(){
    try{
        const response = await api.get(url+`/find-all`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih zaliha");;
    }
}

export async function getBySuppliesByGoodsName(name){
    try{
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Naziv "+name+"robe nije pronadjen");
        }
        const response = await api.get(url+`/by-goods-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha i robe po nazivu "+name);
    }
}

export async function getBySuppliesWithMinQuantity(minQuantity){
    try{
        const parseMinQuantity = parseFloat(minQuantity);
        if(isNaN(parseMinQuantity) || parseMinQuantity <= 0){
            throw new Error("Data minimalna kolicina "+parseMinQuantity+" nije pronadjena");
        }
        const response = await api.get(url+`/by-minQuantity`,{
            params:{
                quantity : parseMinQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha sa najmanjom kolicinom "+minQuantity);
    }
}

export async function getBySuppliesByStorageId(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati id "+storageId+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/storageId/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja zaliha koje pripadaju za odredjeno skladiste po "+storageId+" id-iju");
    }
}

export async function findByUpdatesBetween({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati opseg "+start+" - "+end+" datuma za dobavljaca nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/updates-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" za dobavljaca");
    }
}

export async function findByStorage_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" datog skadista");
    }
}

export async function findByStorage_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" za skladista nije pronadjena");
        }
        const response = await api.get(url+`/search/storage-location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" datog skadista");
    }
}

export async function findByStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" skaldista, nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" skladista");
    }
}

export async function findByStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" za skaldiste, nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od "+capacity+" za skladista");
    }
}

export async function findByStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" za skaldiste, nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od "+capacity+" za skladista");
    }
}

export async function findByStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati tip "+type+" skladista");
    }
}

export async function findByStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-status`,{
            params:{status:(status || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati status "+status+"++skladista");
    }
}

export async function findByStorage_Type_AndCapacity({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista i njegov kapacitet "+parseCapacity+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-capacity`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista i njegov kapacitet "+capacity);
    }
}

export async function findByStorage_Type_AndCapacityGreaterThan({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista i njegov kapacitet veci od "+parseCapacity+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-capacuty-greater-than`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista i njegov kapacitet veci od "+capacity);
    }
}

export async function findByStorage_Type_AndCapacityLessThan({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista i njegov kapacitet manji od "+parseCapacity+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-capacity-less-than`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista i njegov kapacitet manji od "+capacity);
    }
}

export async function findByStorage_Type_AndStatus({type, status}){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase()) || !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" i status "+status+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/type-and-status`,{
            params:{
                type:(type || "").toUpperCase(),
                status: (status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati tip "+type+" i status "+status+" skladista");
    }
}

export async function findByStorage_Type_AndLocation({type, location}){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase()) ||
        !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati tip "+type+" skladista i njegova lokacija "+location+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-location`,{
            params:{
                location:location,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista i njegovu lokaciju "+location);
    }
}

export async function findByStorage_Location_AndCapacity({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija "+location+" i kapacitet "+parseCapacity+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-location-capacity`,{
            params:{
                location:location, 
                capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i kapacitet "+capacity+" datog skladista");
    }
}

export async function findByStorage_Location_AndCapacityGreaterThan({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija "+location+" i kapacitet veci od "+parseCapacity+" za skladiste nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-location-capacity-greater-than`,{
            params:{
                location:location, 
                capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i kapacitet veci od "+capacity+" za dato skladiste");
    }
}

export async function findByStorage_Location_AndCapacityLessThan({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija "+location+" i kapacitet manji od "+parseCapacity+" za skladiste nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-location-capacity-less-than`,{
            params:{
                location:location, 
                capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i kapacitet manji od "+capacity+" za dato skladiste");
    }
}

export async function findByStorage_CapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg "+parseMin+" - "+parseMax+" kapaciteta za dato skladiste nije pronadjeno");
        }
        if(parseMin > parseMax){
            throw new Error("Minimalni kapacitet ne sme biti veci od max kapaciteta");
        }
        const response = await api.get(url+`/search/storage-capacity-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg "+min+" - "+max+" kapaciteta za dato skladite");
    }
}

export async function findByStorageWithMinGoodsCount(minGoodsCount){
    try{
        const parseMinGoodsCount = parseInt(minGoodsCount,10);
        if(parseMinGoodsCount <= 0 || isNaN(parseMinGoodsCount)){
            throw new Error("Data minimalna kolicina "+parseMinGoodsCount+" robe za dato skladiste nije pronadjena");
        }
        const response = await api.get(url+`/search/storage-with-min-goods-count`,{
            params:{
                minGoodsCount:parseMinGoodsCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje sadrzi minimalnu "+minGoodsCount+" kolicinu date robe");
    }
}

export async function findByStorageWithMaxGoodsCount(maxGoodsCount){
    try{
        const parseMaxGoodsCount = parseInt(maxGoodsCount,10);
        if(parseMaxGoodsCount <= 0 || isNaN(parseMaxGoodsCount)){
            throw new Error("Data maksimalna "+parseMaxGoodsCount+" kolicina robe za dato skladiste nije pronadjena");
        }
        const response = await api.get(url+`/search/storage-with-max-goods-count`,{
            params:{maxGoodsCount:parseMaxGoodsCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje sadrzi maksimalnu "+maxGoodsCount+" kolicinu date robe");
    }
}

export async function findByStorageContainingMaterial(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za materijal nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-contain-material-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje sadrzi dati naziv "+name+" odredjenog materijala");
    }
}

export async function findByShelfCapacityInStorage(minShelfCapacity){
    try{
        const parseMinShelfCapacity = parseFloat(minShelfCapacity);
        if(isNaN(parseMinShelfCapacity) || parseMinShelfCapacity <= 0){
            throw new Error("Dati minimalan broj "+parseMinShelfCapacity+" polica za dato skladiste, nije pronadjeno");
        }
        const response = await api.get(url+`/search/storage/shlef-capacity-in`,{
            params:{minShelfCapacity:parseMinShelfCapacity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste sa odredjenim kapacitetom "+minShelfCapacity+" polica");
    }
}

export async function findByStorageUsedAsTransferOrigin(){
    try{
        const response = await api.get(url+`/search/storage-used-as-transfer-origin`,{
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
        const response = await api.get(url+`/search/supplies-with-workCenter`,{
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
            throw new Error("Dati kapacite izkoriscenog skladista veceg od "+parseUsesdCapacity+", nije pronadjeno");
        }
        const response = await api.get(url+`/search/storage-used-capacity-greater-than`,{
            params:{usedCapacity:parseUsesdCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima iskorisceni kapacitet veci od "+usedCapacity);
    }
}

export async function findByStorage_UsedCapacityLessThan(usedCapacity){
    try{
        const parseUsesdCapacity = parseFloat(usedCapacity);
        if(isNaN(parseUsesdCapacity) || parseUsesdCapacity <= 0){
            throw new Error("Dati kapacite izkoriscenog skladista manjeg od "+parseUsesdCapacity+", nije pronadjeno");
        }
        const response = await api.get(url+`/search/storage-used-capacity-less-than`,{
            params:{usedCapacity:parseUsesdCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste koje ima iskorisceni kapacitet manji od "+usedCapacity);
    }
}

export async function findByStorageWithEmptyShelves(){
    try{
        const response = await api.get(url+`/search/storage-with-empty-shelves`,{
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
        const response = await api.get(url+`/search/storage-used-as-transfer-destination"`,{
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
        const response = await api.get(url+`/search/production-storage`,{
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
        const response = await api.get(url+`/search/distribution-storage`,{
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
        const response = await api.get(url+`/search/open-storage`,{
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
        const response = await api.get(url+`/search/closed-storage`,{
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
        const response = await api.get(url+`/search/interim-storage`,{
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
        const response = await api.get(url+`/search/available-storage`,{
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
        const response = await api.get(url+`/search/active-storage`,{
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
        const response = await api.get(url+`/search/under-maintenance-storage`,{
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
        const response = await api.get(url+`/search/decommissioned-storage`,{
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
        const response = await api.get(url+`/search/reserved-storage`,{
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
        const response = await api.get(url+`/search/temporary-storage`,{
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
        const response = await api.get(url+`/search/full-storage`,{
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
        const reserved = await api.get(url+`/search/count-goods-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-shelves-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-outgoing-shipments-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-outgoing-transfers-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-incoming-transfers-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-materials-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-outgoing-material-movements-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-incoming-material-movements-per-storage`,{
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
        const reserved = await api.get(url+`/search/count-workCenters-per-storage`,{
            headers:getHeader()
        });
        return reserved.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj radnih centara po skladistu");
    }
}



