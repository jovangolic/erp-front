import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];
const url = `${import.meta.env.VITE_API_BASE_URL}/storages`;

export async function createStorage({name, location, capacity, shelves, type}) {
    try {
        const parseCapacity = parseFloat(capacity);
        if(
            !name || typeof name !=="string" || name.trim()==="" || !location || typeof location !=="string" || location.trim()===""
            || Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 || !Array.isArray(shelves) || shelves.length === 0 ||
            !validateStorageType.includes(type?.toUpperCase())){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            name,
            location,
            capacity,
            shelves,
            type: type.toUpperCase()
        };

        const response = await api.post(
            url+`/create/new-storage`,
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

export async function updateStorage({storageId, name,location, capacity, type,status,shelves,hasShelvesFor}){
    try{
        if(
            id == null || Number.isNaN(Number(id)) ||
            !name || typeof name !=="string" || name.trim()==="" || !location || typeof location !=="string" || location.trim()===""
            || Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 || !Array.isArray(shelves) || shelves.length === 0 ||
            !validateStorageType.includes(type?.toUpperCase())){
                throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {
            name,
            location,
            capacity: parseFloat(capacity),
            shelves,
            type: type.toUpperCase(),
            status: status.toUpperCase(),
            hasShelvesFor
        };
        const response = await api.put(url+`/update/${storageId}`,requestBody,
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
        if(storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Dati storageId "+storageId+" nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${storageId}`,{
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
        if(storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Dati storageId "+storageId+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja skladista po "+storageId+" po id-iju");
    }
}

export async function getByStorageType(storageType){
    try{
        if(!validateStorageType.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista ne postoji");
        }
        const response = await api.get(
            url+`/get-by-storage-type`,
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
        handleApiError(error , "Greska prilikom trazenja po tipu "+storageType);
    }
}

export async function getByStorageName(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Dati naziv "+name+" skladista ne postoji");
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
        handleApiError(error, "Greska prilikom trazenja po nazivu "+name);
    }
}

export async function getByStorageLocation(location){
    try{
        if(!location || typeof location!=="string" || location.trim()===""){
            throw new Error("Lokacija "+location+" skladista ne postoji");
        }
        const response = await api.get(url+`/by-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po lokaciji "+location);
    }
}

export async function getByStorageCapacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Kapacitet "+parseCapacity+" ne sme biti negativan broj");
        }
        const response = await api.get(url+`/by-capacity`,{
            params:{
                capacity : parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po kapacitetu "+capacity);
    }
}

export async function getStorageByNameAndLocation({name, location}){
    try{
        if(!location || typeof location!=="string" || location.trim()==="" ||
           !name || typeof name!=="string" || name.trim()==="" ){
            throw new Error("Lokacija "+location+" i naziv "+name+"skladista ne postoje");
        }
        const response = await api.get(url+`/by-name-and-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po nazivu "+name+" i lokaciji "+location);
    }
}

export async function getByTypeAndCapacityGreaterThan({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 || validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Tip "+type+" skladista ne postoji i kapacitet "+parseCapacity+" mora biti pozitivan broj");
        }
        const response = await api.get(url+`/by-type-and-capacity`,{
            params:{
                type:type,
                capacity: parseFloat(capacity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po tipu "+type+" i kapacitetu vecem od "+capacity);
    }
}

export async function getStoragesWithMinGoods(minCount){
    try{
        const parseMinCount = parseInt(minCount,10);
        if(Number.isNaN(Number(parseMinCount)) || parseMinCount < 0){
            throw new Error("Skladiste mora da ima minimalnu kolicinu robe");
        }
        const response = await api.get(url+`by-minCount`,{
            params:{
                minCount: parseMinCount
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po "+minCount+" minimalnoj robi");
    }
}

export async function getByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name!=="string" || name.trim()===""){
            throw new Error("Ne postojeci naziv "+name);
        }
        const response = await api.get(url+`ignore-case`,{
            params:{
                name: name
            },
            headers:getHeader()       
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Trenutno nismo pronasli skladiste po "+name+" nazivu");
    }
}

export async function getAllStorage(){
    try{
        const response = await api.get(url+`/find-all`,{
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
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 || !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista i kapacitet manji od "+parseCapacity+" nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista gde je kapacitet manji od "+capacity);
    }
}

export async function findByCapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || Number.isNaN(Number(parseCapacity))){
            throw new Error("Dati kapacitet veci od "+parseCapacity+" nije pronadjen");
        }
        const response = await api.get(url+`/search/capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste gde je kapacitet veci od "+capacity);
    }
}

export async function findByCapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(parseCapacity <= 0 || Number.isNaN(Number(parseCapacity))){
            throw new Error("Dati kapacitet manji od "+parseCapacity+" nije pronadjen");
        }
        const response = await api.get(url+`/search/capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste gde je kapacitet manji od "+capacity);
    }
}

export async function findByNameAndLocationAndCapacity({name, location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 ||
            !name || typeof name !=="string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === "") {
            throw new Error("Dati naziv "+name+",lokacija "+location+" i kapacitet "+parseCapacity+" za dato skaldista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-name-location-capacity`,{
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+", lokaciju "+location+" i kapacitet "+capacity+" datog skladista");
    }
}

export async function findByTypeAndLocation({type, location}){
    try{
        if(!location || typeof location !== "string" || location.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista i njegova lokacija "+location+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-location`,{
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

export async function findByTypeAndName({type, name}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista i njegov naziv "+name+" nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-name`,{
            params:{
                name:name,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista i njegov naziv "+name);
    }
}

export async function findByLocationAndCapacity({location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !=="string" || location.trim() === "" ||
            Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Data lokacija "+location+" i kapacitet "+parseCapacity+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-location-and-capacity`,{
            params:{
                location:location,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i kapacitet "+capacity+" skladista");
    }
}

export async function findByTypeAndCapacity({type, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 || !validateStorageType.includes(type?.toUpperCase())){
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

export async function findByTypeAndLocationAndCapacity({type, location, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!location || typeof location !== "string" || location.trim() === "" ||
            Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0 || !validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+",lokacija "+location+" i kapacitet "+parseCapacity+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-location-capacity`,{
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+", lokaciju "+location+" i kapacitet "+capacity+" datog skladista");
    }
}

export async function findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase({name, location}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati naziv "+name+" i lokacija "+location+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-name-and-storage-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i lokaciju "+location+" datog skladista");
    }
}

export async function findByCapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(parseMax <= 0 || Number.isNaN(Number(parseMax)) || parseMin <= 0 || Number.isNaN(Number(parseMin))){
            throw new Error("Dati opseg "+parseMin+" - "+parseMax+" kapaciteta skladista nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli opseg "+min+" - "+max+" kapaciteta skladista");
    }
}

export async function findByTypeOrderByCapacityDesc(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista po opadajucem kapacitetu nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-capacity-desc`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista po opadajucem kapacitetu");
    }
}

export async function findByLocationOrderByNameAsc(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" skladista nije pronadjena");
        }
        const response = await api.get(url+`/search/location-order-name-asc`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" skladista grupisanu po nazivu");
    }
}

export async function findStoragesWithoutGoods(){
    try{
        const response = await api.get(url+`/search/storage-without-goods`,{
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
        if(Number.isNaN(Number(parseShelfCount)) || parseShelfCount <= 0){
            throw new Error("Dati tacan broj "+parseShelfCount+" polica nisu pronadjeni");
        }
        const response = await api.get(url+`/search/exact-shelf-count`,{
            params:{shelfCount:parseShelfCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste sa tacnim brojem "+shelfCount+" polica");
    }
}

export async function findByLocationContainingIgnoreCaseAndType({location, type}){
    try{
        if(
            !location || typeof location !== "string" || location.trim() === "" ||
            !validateStorageType.includes(type?.toUpperCase())
        ){
            throw new Error("Data lokacija "+location+" i tip "+type+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/location-and-type`,{
            params:{
                type:(type || "").toUpperCase(),
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" i tip "+type+" datog skladista");
    }
}

export async function findStoragesWithMaterials(){
    try{
        const response = await api.get(url+`/search/storages-with-materials`,{
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
        const response = await api.get(url+`/search/storages-with-work-centers`,{
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
        const response = await api.get(url+`/search/storages-without-shelves`,{
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
        const response = await api.get(url+`/search/available-storages`,{
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
        if(Number.isNaN(Number(parseMinCapacity)) || parseMinCapacity <= 0){
            throw new Error("Dati minimalni "+parseMinCapacity+" kapacitet za odgovarajuca skladista za dostava nisu pronadjena");
        }
        const response = await api.get(url+`/search/suitable-storages-for-shipment`,{
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
        const response = await api.get(url+`/search/empty-storages`,{
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
            throw new Error("Dati tip "+type+" skladista bez robe i materijala nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage/without-goods-and-materials-by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tipove "+type+" skladista bez robe i materijala");
    }
}

export async function findStorageWithGoodsAndMaterialsByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista sa robom i materijalima nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage/with-goods-and-materials-by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tipove "+type+" skladista sa robom i materijalima");
    }
}

export async function findStorageWithGoodsOrMaterialsByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista sa robom ili materijalima nisu pronadjeni");
        }
        const response = await api.get(url+`/search/with-goods-or-materials-by-type`,{
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
            throw new Error("Dati tipovi "+type+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve tipove "+type+" skladista");
    }
}

export async function findEmptyStorageByType(type){
    try{
        if(!validateStorageType.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" za prazno skladiste nije pronadjen");
        }
        const response = await api.get(url+`/search/empty-storages/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" za prazno skladistr");
    }
}

export async function findProductionStorage(){
    try{
        const response = await api.get(url+`/search/production-storages`,{
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
        const response = await api.get(url+`/search/distribution-storages`,{
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
        const response = await api.get(url+`/search/open-storages`,{
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
        const response = await api.get(url+`/search/closed-storages`,{
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
        const response = await api.get(url+`/search/interim-storages`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladista gde je tip Privremeno-skladiste");
    }
}

export async function getAvailableCapacity(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za skladiste nije pronadjen");
        }
        const response = await api.get(url+`/${id}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli slobodno skladiste sa datim "+id+" ID-ijem");
    }
}

export async function allocateCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(id == null || Number.isNaN(Number(id)) || Number.isNaN(Number(parseAmount)) || parseAmount <= 0){
            throw new Error("Dati ID "+id+" skladiste i njegova kolicina "+parseAmount+", nisu pornadjeni");
        }
        const requestBody = {amount};
        const response = await api.post(url+`/${id}/allocate`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste po "+id+" id-iju, za alociranje kapaciteta "+amount);
    }
}

export async function releaseCapacity(id, amount){
    try{
        const parseAmount = parseFloat(amount);
        if(id == null || Number.isNaN(Number(id)) || Number.isNaN(Number(parseAmount)) || parseAmount <= 0){
            throw new Error("Dati ID "+id+" skladiste i njegova kolicina "+parseAmount+", nisu pornadjeni");
        }
        const requestBody = {amount};
        const response = await api.put(url+`/storage/${id}/release-capacity`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli skladiste za oslobadjanje kapaciteta");
    }
}

export async function hasCapacity(storageId, amount){
    try{
        const parseAmount = parseFloat(amount);
        if(storageId == null || Number.isNaN(Number(storageId)) || Number.isNaN(Number(parseAmount)) || parseAmount <= 0){
            throw new Error("Dati ID "+storageId+" skladiste i njegova kolicina "+parseAmount+", nisu pornadjeni");
        }
        const response = await api.get(url+`$/storage/${storageId}/has-capacity`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli da li skladiste ima odredjeni kapacitet "+amount);
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