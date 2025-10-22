import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const validateStatus = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const url = `${import.meta.env.VITE_API_BASE_URL}/workCenters`;

export async function createWorkCenter({name,location,capacity, localStorageId}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(
            !name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0 || isNaN(localStorageId) || localStorageId == null
        ){
            throw new Error("Sva polja moraju biti validirana i popunjena");
        }
        const requestBody = {name,location, capacity, localStorageId};
        const response = await api.post(url+`/create/new-workCenter`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateWorkCenter({id,name,location,capacity, localStorageId}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(
            id == null || isNaN(id) ||
            !name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0 || isNaN(localStorageId) || localStorageId == null
        ){
            throw new Error("Sva polja moraju biti validirana i popunjena");
        }
        const requestBody = {name,location, capacity, localStorageId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteWorkCenter(id){
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
        handleApiError(error,"Trenutno nismo pronasli trazeni work-centar po "+id+" id-iju");
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
        handleApiError(error,"Trenutno nismo pronasli sve trazene work-centers");
    }
}

export async function findByName(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za work-center nije pronadjen");
        }
        const response = await api.get(url+`/by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centers po nazivu "+name);
    }
}

export async function findByCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacite "+parseCapacity+" za work-center nije pronadjen");
        }
        const response = await api.get(url+`/by-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centar po kapacitetu "+capacity);
    }
}

export async function findByLocation(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" za work-center nije pronadjen");
        }
        const response = await api.get(url+`/location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centers po datoj lokaciji "+location);
    }
}

export async function findByNameAndLocation({name, location}){
    try{
        if(!location || typeof location !== "string" || location.trim() === "" ||
            !name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Data lokacija "+location+" i naziv "+name+" za work-center nije pronadjen");
        }
        const response = await api.get(url+`/by-name-location`,{
            params:{name:name, location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centers po datoj lokaciji "+location+" i nazivu "+name);
    }
}

export async function findByCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" za work-center nije pronadjen");
        }
        const response = await api.get(url+`/capacityGreaterThan`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centar po kapacitetu vecem od "+capacity);
    }
}

export async function findByCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" za work-center nije pronadjen");
        }
        const response = await api.get(url+`/capacityLessThan`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centar po kapacitetu manjem od "+capacity);
    }
}

export async function findByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za pretragu work-center nije pronadjen");
        }
        const response = await api.get(url+`/search-by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centers prema datom nazivu "+name+" za pretragu");
    }
}

export async function findByLocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" za pretragu work-center nije pronadjen");
        }
        const response = await api.get(url+`/search-by-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centers prema datoj "+location+" lokaciji za pretragu");
    }
}

export async function findByCapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <=0 || sNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg "+parseMin+" - "+parseMax+" kapacitet za work-center nije pronadjen");
        }
        if (parseMin >= parseMax) {
            throw new Error("Neispravan opseg "+parseMin+" - "+parseMax+" kapaciteta: minimalna i maksimalna vrednost moraju biti pozitivni brojevi");
        }
        const response = await api.get(url+`/capacity-between`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg "+min+" - "+max+" kapaciteta za work-center");
    }
}

export async function findByLocationOrderByCapacityDesc(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" za work-center nije pronadjena");
        }
        const response = await api.get(url+`/by-locationOrder-desc`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" za work-center poredjanu po opadajucem kapacitetu");
    }
}

export async function findByLocalStorage_Id(localStorageId){
    try{
        if(isNaN(localStorageId) || localStorageId == null){
            throw new Error("Dati ID "+localStorageId+" za lokalno skladiste, nije pronadjen");
        }
        const response = await api.get(url+`/localStorage/${localStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-center koji ima ID za lokalno-skladiste");
    }
}

export async function findByLocalStorage_NameContainingIgnoreCase(localStorageName){
    try{
        if(!localStorageName || typeof localStorageName !== "string" || localStorageName.trim() === ""){
            throw new Error("Dati naziv lokalnog-skladista, za work-center, nije pronadjen");
        }
        const response = await api.get(url+`/by-localStorageName`,{
            params:{localStorageName:localStorageName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+localStorageName+" lokalnog skladista za work-center");
    }
}

export async function findByLocalStorage_LocationContainingIgnoreCase(localStorageLocation){
    try{
        if(!localStorageLocation || typeof localStorageLocation !== "string" || localStorageLocation.trim() === ""){
            throw new Error("Data lokacija "+localStorageLocation+" lokalnog-skladista, za work-center, nije pronadjena");
        }
        const response = await api.get(url+`/by-localStorageLocation`,{
            params:{localStorageLocation:localStorageLocation},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+localStorageLocation+" lokalnog skladista za work-center");
    }
}

export async function findByLocalStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" za lokalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/localStorage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" lokalnog skladista, za work-center");
    }
}

export async function findByLocalStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" za lokalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/localStorage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet lokalnog skladista manjeg od "+capacity+", za work-center");
    }
}

export async function findByLocalStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" za lokalno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/localStorage-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet lokalnog skladista veceg od "+capacity+", za work-center");
    }
}

export async function findByLocalStorage_Type(localStorageType){
    try{
        if(!validateStorageType.includes(localStorageType?.toUpperCase())){
            throw new Error("Dati tip "+localStorageType+" lokalnog sladista za work-center, nije pronadjen");
        }
        const response = await api.get(url+`/localStorage-type`,{
            params:{
                localStorageType:(localStorageType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+localStorageType+" lokalnog skladista za work-center");
    }
}

export async function filterWorkCenters({name, location, capacityMin, capacityMax, type, status}){
    try{
        const parseCapacityMin = parseFloat(capacityMin);
        const parseCapacityMax = parseFloat(capacityMax);
        if(
            !name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacityMin) || parseCapacityMin <= 0 || isNaN(parseCapacityMax) || parseCapacityMin <= 0 ||
            parseCapacityMin >= parseCapacityMax || !validateStatus.includes(status?.toUpperCase()) ||
            !validateStorageType.includes(type?.toUpperCase())
        ){
            throw new Error("Dati parametri za pretragu work-center: "+name+" ,"+location+" ,"+parseCapacityMin+" ,"+parseCapacityMax+" ,"+type+" ,"+status+" su ne-validni");
        }
        const response = await api.get(url+`/filter`,{
            params:{
                name:name,
                location:location,
                capacityMin:parseCapacityMin,
                capacityMax:parseCapacityMax,
                type:(type || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-centers: "+name+" ,"+location+" ,"+parseCapacityMin+" ,"+parseCapacityMax+" ,"+type+" ,"+status+" po datim parametrima za pretragu");
    }
}

export async function findByTypeProduction(){
    try{
        const response = await api.get(url+`/search/storage-type-production`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista = 'PRODUCTION' za work-center");
    }
}

export async function findByTypeDistribution(){
    try{
        const response = await api.get(url+`/search/storage-type-distribution`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista = 'DISTRIBUTIOM' za work-center");
    }
}

export async function findByTypeOpen(){
    try{
        const response = await api.get(url+`/search/storage-type-open`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista = 'OPEN' za work-center");
    }
}

export async function findByTypeClosed(){
    try{
        const response = await api.get(url+`/search/storage-type-closed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista = 'CLOSED' za work-center");
    }
}

export async function findByTypeInterim(){
    try{
        const response = await api.get(url+`/search/storage-type-interim`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista = 'INTERIM' za work-center");
    }
}

export async function findByTypeAvailable(){
    try{
        const response = await api.get(url+`/search/storage-type-available`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista = 'AVAILABLE' za work-center");
    }
}

export async function findByLocalStorage_Status(status){
    try{
        if(!validateStatus.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" lokalnog skladista za work-center nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+" lokalnog skladista za work-center");
    }
}

export async function findByStatusActive(){
    try{
        const response = await api.get(url+`/search/storage-status-active`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista = 'ACTIVE' za work-center");
    }
}

export async function findByStatusUnder_Maintenance(){
    try{
        const response = await api.get(url+`/search/storage-status-under-maintenance`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista = 'UNDER_MAINTENANCE' za work-center");
    }
}

export async function findByStatusDecommissioned(){
    try{
        const response = await api.get(url+`/search/storage-status-decommissioned`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista = 'DECOMMISSIONED' za work-center");
    }
}

export async function findByStatusReserved(){
    try{
        const response = await api.get(url+`/search/storage-status-reserved`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista = 'RESERVED' za work-center");
    }
}

export async function findByStatusTemporary(){
    try{
        const response = await api.get(url+`/search/storage-status-temporary`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista = 'TEMPORARY' za work-center");
    }
}

export async function findByStatusFull(){
    try{
        const response = await api.get(url+`/search/storage-status-full`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status skladista = 'FULL' za work-center");
    }
}

export async function findByLocationAndCapacityGreaterThan({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Data lokacija "+location+" i kapacitet veci od "+parseCapacity+" lokalnog skladista za work-center nisu pronadjeni");
        }
        const response = await api.get(url+`/search/location-and-capacity-greater-than`,{
            params:{
                location:location,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i kapacitet veci od "+capacity+" lokalnog skaldista za work-center");
    }
}

export async function findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase({name, location}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati naziv "+name+" i lokacija "+location+" lokalnog skladista za work-center nije pronadjena");
        }
        const response = await api.get(url+`/search/name-and-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i lokaciju "+location+" lokalnog skladista za work-center");
    }
}

export async function findByLocalStorage_TypeAndLocalStorage_Status({type, status}){
    try{
        if(!validateStorageType.includes(type?.toUpperCase()) || !validateStatus.includes(status?.toUpperCase())){
            throw new Error("Dati tip "+type+" i status "+status+" lokalnog skladista za work-center nisu pronadjeni");
        }
        const response = await api.get(url+`/search/type-and-status`,{
            params:{
                type:(type || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" i status "+status+" lokalnog skladista za work-center");
    }
}

export async function findByIdBetween({startId, endId}){
    try{
        if(isNaN(startId) || startId == null || isNaN(endId) || endId == null){
            throw new Error("Dati opseg "+startId+" - "+endId+" id-ijeva, nije pronadjen");
        }
        const response = await api.get(url+`/search/ids-between`,{
            params:{
                startId:startId,
                endId:endId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg "+startId+" - "+endId+" id-ijeva za work-center");
    }
}

export async function findByLocalStorageIsNull(){
    try{
        const response = await api.get(url+`/search/local-storage-is-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokalno skladiste za work-center koje je null");
    }
}

export async function findByLocalStorageIsNotNull(){
    try{
        const response = await api.get(url+`/search/local-storage-is-not-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokalno skladiste za work-center koje nije null");
    }
}

export async function findAllByOrderByCapacityAsc(){
    try{
        const response = await api.get(url+`/search/order-by-capacity-asc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-center za kapacitet sortiran po rastucem poretku");
    }
}

export async function findAllByOrderByCapacityDesc(){
    try{
        const response = await api.get(url+`/search/order-by-capacity-desc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli work-center za kapacitet sortiran po opadajucem poretku");
    }
}

export async function findByLocationIn(locations){
    try{
        if(!locations || typeof locations !== "string" || locations.trim() === ""){
            throw new Error("Data lista lokacija za work-center nije pronadjena");
        }
        const response = await api.get(url+`/search/location-in`,{
            params:{
                locations:arrayLoc
            },
            paramsSerializer : params => {
                return params.arrayLoc.map(s => `arrayLoc=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli listu svih lokacija za work-center");
    }
}

export async function findByNameContainingIgnoreCaseAndLocalStorage_Status({name, status}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !validateStatus.includes(status?.toUpperCase())){
            throw new Error("Dati naziv "+name+" i status "+status+" lokalnog skladista za work-center, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/name-and-storage-status`,{
            params:{
                name:name,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i status "+status+" lokalnog skladista za work-center");
    }
}

export async function findByLocationContainingIgnoreCaseAndLocalStorage_Type({location, type}){
    try{
        if(!location || typeof location !== "string" ||  location.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Data lokacija "+location+" i tip "+type+" lokalnog skladista za work-center, nisu pronadjeni");
        }
        const response = await api.get(url+`/search/location-and-storage-type`,{
            params:{
                location:location,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i tip "+type+" lokalnog skladista za work-center");
    }
}

export async function countWorkCentersByCapacity(){
    try{
        const response = await api.get(url+`/search/count-work-centers-by-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj za work-centers po kapacitetu");
    }
}

export async function countWorkCentersByCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" za broj work-centers nije pronadjen");
        }
        const response = await api.get(url+`/search/count-work-centers-by-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj work-centers za kapacitet manji od "+capacity);
    }
}

export async function countWorkCentersByCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" za broj work-centers nije pronadjen");
        }
        const response = await api.get(url+`/search/count-work-centers-by-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj work-centers za kapacitet veci od "+capacity);
    }
}

export async function countWorkCentersByLocation(){
    try{
        const response = await api.get(url+`/search/count-by-work-centers-location`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj za work-centers za datu lokaciju");
    }
}

export async function countWorkCentersByStorageStatus(){
    try{
        const response = await api.get(url+`/search/count-by-work-centers-storage-status`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli borj za wokr-centers po statusu skaldista");
    }
}

export async function countWorkCentersByStorageType(){
    try{
        const response = await api.get(url+`/search/count-by-work-centers-storage-type`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli borj za wokr-centers po tipu skaldista");
    }
}