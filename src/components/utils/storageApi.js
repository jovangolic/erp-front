import { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE"];

export async function createStorage({name, location, capacity, shelves, type, goods}) {
    try {
        if(!name || typeof name !=="string" || name.trim()==="" || !location || typeof location !=="string" || location.trim()===""
            ||isNaN(capacity) || capacity <= 0 || !Array.isArray(shelves) || shelves.length === 0 ||
            !validateStorageType.includes(type?.toUpperCase())){
        throw new Error("Sva polja moraju biti popunjena");
    }
        const requestBody = {
            name,
            location,
            capacity: parseFloat(capacity),
            shelves,
            goods, // dodato!
            type: type.toUpperCase()
        };

        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/storages/create/new-storage`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function updateStorage({storageId, name,location, capacity, type, goods,shelves}){
    try{
        if(id == null || isNaN(id) || !name || typeof name !=="string" || name.trim()==="" || !location || typeof location !=="string" || location.trim()===""
            ||isNaN(capacity) || capacity <= 0 || !Array.isArray(shelves) || shelves.length === 0 ||
            !validateStorageType.includes(type?.toUpperCase())){
        throw new Error("Sva polja moraju biti popunjena");
    }
        const requestBody = {
            name,
            location,
            capacity: parseFloat(capacity),
            shelves,
            goods, // dodato!
            type: type.toUpperCase()
        };
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/storages/update/${storageId}`,requestBody,
            {
                headers:getHeader()
            }
        );
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greska prilikom azuriranja skladista: ${error.message}`);
        }
    }
}

export async function deleteStorage(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/storages/delete/${storageId}`,{
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function getByStorageId(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati storageId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja skladista");
    }
}

export async function getByStorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip skladista ne postoji");
        }
        const response = await api.get(
            `${import.meta.env.VITE_API_BASE_URL}/storages/get-by-storage-type`,
            {
                params: {
                    storageType: storageType 
                },
                headers: getHeader() // ako ruta zahteva autorizaciju
            }
        );
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greška prilikom traženja po tipu");
    }
}

export async function getByStorageName(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Dati naziv skladista ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po nazivu");
    }
}

export async function getByStorageLocation(location){
    try{
        if(!location || typeof location!=="string" || location.trim()===""){
            throw new Error("Lokacija skladista ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po lokaciji");
    }
}

export async function getByStorageCapacity(capacity){
    try{
        if(isNaN(capacity) || parseFloat(capacity) <= 0){
            throw new Error("Capacity ne sme biti negativan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-capacity`,{
            params:{
                capacity: parseFloat(capacity)
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greška prilikom traženja po kapacitetu");
    }
}

export async function getStorageByNameAndLocation({name, location}){
    try{
        if(!location || typeof location!=="string" || location.trim()==="" ||
           !name || typeof name!=="string" || name.trim()==="" ){
            throw new Error("Lokacija i naziv skladista ne postoje");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-name-and-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po nazizu i lokaciji");
    }
}

export async function getByTypeAndCapacityGreaterThan({type, capacity}){
    try{
        if(isNaN(capacity) || parseFloat(capacity) <= 0 || validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Tip skladista ne postoji i kapacitet mora biti pozitivan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-type-and-capacity`,{
            params:{
                type:type,
                capacity: parseFloat(capacity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po tipu i kapacitetu >=");
    }
}

export async function getStoragesWithMinGoods(minCount){
    try{
        const parseMinCount = parseInt(minCount,10);
        if(isNaN(parseMinCount) || parseMinCount < 0){
            throw new Error("Skladiste mora da ima minimalnu kolicinu robe");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/by-minCount`,{
            params:{
                minCount: parseMinCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom traženja po minimalnoj robi");
    }
}

export async function getByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Ne postojeci naziv");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/storage/ignore-case`,{
            params:{
                name: name
            },
            headers:getHeader()       
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška naziv nije dobro napisan");
    }
}

export async function getAllStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/get-all-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavjanja svih skladista");
    }
}

export async function findByTypeAndCapacityLessThan({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i kapacitet manji od nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-type-and-capacity-less-than`,{
            params:{
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista gde je kapacitet manji od");
    }
}

export async function findByCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet veci od nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste gde je kapacitet veci od");
    }
}

export async function findByCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || isNaN(parseCapacity)){
            throw new Error("Dati kapacitet manji od nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste gde je kapacitet manji od");
    }
}

export async function findByNameAndLocationAndCapacity({name, location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 ||
            !name || typeof name !=="string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === "") {
            throw new Error("Dati naziv,lokacija i kapacitet dato skaldista nisu pornadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-name-location-capacity`,{
            params:{
                capacity:parseCapacity,
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv, lokaciju i kapacitet datog skladista");
    }
}

export async function findByTypeAndLocation({type, location}){
    try{
        if(!location || typeof location !== "string" || location.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i njegova lokacija nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-type-and-location`,{
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

export async function findByTypeAndName({type, name}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i njegov naziv nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-type-and-name`,{
            params:{
                name:name,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista i njegov naziv");
    }
}

export async function findByLocationAndCapacity({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !=="string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0){
            throw new Error("Data lokacija i kapacitet skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-location-and-capacity`,{
            params:{
                location:location,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju i kapacitet skladista");
    }
}

export async function findByTypeAndCapacity({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(isNaN(parseCapacity) || parseCapacity <= 0 || !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista i njegov kapacitet nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-type-and-capacity`,{
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

export async function findByTypeAndLocationAndCapacity({type, location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            isNaN(parseCapacity) || parseCapacity <= 0 || !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip,lokacija i kapacitet skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-type-location-capacity`,{
            params:{
                location:location,
                type:(type || "").toUpperCase(),
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip, lokaciju i kapacitet datog skladista");
    }
}

export async function findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase({name, location}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati naziv i lokacija skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-name-and-storage-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv i lokaciju datog skladista");
    }
}

export async function findByCapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(parseMax <= 0 || isNaN(parseMax) || parseMin <= 0 || isNaN(parseMin)){
            throw new Error("Dati opseg kapaciteta skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-capacity-range`,{
            params:{
                min:parseMin,
                max:parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg kapaciteta skladista");
    }
}

export async function findByTypeOrderByCapacityDesc(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista po opadajucem kapacitetu nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-type-capacity-desc`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista po opadajucem kapacitetu");
    }
}

export async function findByLocationOrderByNameAsc(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija skladista nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/location-order-name-asc`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju skladista grupisanu po nazivu");
    }
}

export async function findStoragesWithoutGoods(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage-without-goods`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista bez robe");
    }
}

export async function findByExactShelfCount(shelfCount){
    try{
        const parseShelfCount = parseInt(shelfCount,10);
        if(isNaN(parseShelfCount) || parseShelfCount <= 0){
            throw new Error("Dati tacan broj polica nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/exact-shelf-count`,{
            params:{shelfCount:parseShelfCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste sa tacnim brojem polica");
    }
}

export async function findByLocationContainingIgnoreCaseAndType({location, type}){
    try{
        if(
            !location || typeof location !== "string" || location.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())
        ){
            throw new Error("Data lokacija i tip skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/location-and-type`,{
            params:{
                type:(type || "").toUpperCase(),
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju i tip datog skladista");
    }
}

export async function findStoragesWithMaterials(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storages-with-materials`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista sa materijalima");
    }
}

export async function findStoragesWithWorkCenters(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storages-with-work-centers`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista povezanim sa radnim centrima");
    }
}

export async function findStoragesWithoutShelves(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storages-without-shelves`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista bez polica");
    }
}

export async function findAvailableStorages(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/available-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupna skladista");
    }
}

export async function findSuitableStoragesForShipment(minCapacity){
    try{
        const parseMinCapacity = parseFloat(minCapacity);
        if(isNaN(parseMinCapacity) || parseMinCapacity <= 0){
            throw new Error("Dati minimalni kapacitet za odgovarajuca skladista za dostava nisu pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/suitable-storages-for-shipment`,{
            params:{
                minCapacity:parseMinCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odgovarajuca skladista za dostavu");
    }
}

export async function findEmptyStorages(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/empty-storages`,{
            headers:getHeader()
        }
        );
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli prazna skladista");
    }
}

export async function findStorageWithoutGoodsAndMaterialsByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista bez robe i materijala nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage/without-goods-and-materials-by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tipove skladista bez robe i materijala");
    }
}

export async function findStorageWithGoodsAndMaterialsByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista sa robom i materijalima nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage/with-goods-and-materials-by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tipove skladista sa robom i materijalima");
    }
}

export async function findStorageWithGoodsOrMaterialsByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista sa robom ili materijalima nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/with-goods-or-materials-by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tipove skladista sa robom ili materijalima");
    }
}

export async function findAllByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tipovi skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/storage/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve tipove skladista");
    }
}

export async function findEmptyStorageByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip za prazno skladiste nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/empty-storages/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip za prazno skladistr");
    }
}

export async function findProductionStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/production-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista gde je tip Proizvodnja");
    }
}

export async function findDistributionStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/distribution-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista gde je tip Distribucija");
    }
}

export async function findOpenStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/open-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista gde je tip Otvoreno-skladiste");
    }
}

export async function findClosedStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/closed-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista gde je tip Zatvoreno-skladiste");
    }
}

export async function findInterimStorage(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/storages/search/interim-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista gde je tip Privremeno-skladiste");
    }
}



if (typeof data === 'object') {
  const messages = Object.entries(data)
    .map(([field, msg]) => `${field}: ${msg}`)
    .join(', ');
  setMessage(messages);
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}