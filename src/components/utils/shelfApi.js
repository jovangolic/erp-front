import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isStorageStatusValid = ["ACTIVE","UNDER_MAINTENANCE","DECOMMISSIONED","RESERVED","TEMPORARY","FULL"];

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/shelves`;

export async function createShelf({rowCount, cols, storageId, goods}){
    try{
        const parseRowCount = parseInt(rowCount, 10);
        const parseCols = parseInt(cols, 10);
        if(
            Number.sNaN(Number(parseRowCount)) || parseRowCount <= 0 ||
            Number.isNaN(Number(parseCols)) || parseCols <= 0 || storageId == null || Number.isNaN(Number(storageId)) ||
            !Array.isArray(goods) || goods.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody={rowCount, cols, storageId,goods};
        const response = await api.post(url+`/create/new-shelf`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom kreiranja polica: " + error.message);
        }
    }
}

export async function updateShelf({id, rowCount, cols, storageId, goods}){
    try{
        const parseRowCount = parseInt(rowCount, 10);
        const parseCols = parseInt(cols, 10);
        if(
            id == null || Number.isNaN(Number(id)) ||
            Number.sNaN(Number(parseRowCount)) || parseRowCount <= 0 ||
            Number.isNaN(Number(parseCols)) || parseCols <= 0 || storageId == null || Number.isNaN(Number(storageId)) ||
            !Array.isArray(goods) || goods.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {rowCount, cols, storageId,goods};
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
            throw new Error("Greska prilikom azuriranju polica: " + error.message);
        }
    }
}

export async function deleteShelf(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Data polica po id "+id+" nije pronadjena");
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jedne police po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih polica");
    }
}

export async function existsByRowCountAndStorageId({storageId, rowCount}){
    try{
        const parseRowCount = parseInt(rowCount, 10);
        if(Number.isNaN(Number(parseRowCount)) || parseRowCount <= 0 || storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Greska, nepostojeci red "+parseRowCount+" polica i id "+storageId+" skladista");
        }
        const response = await api.get(url+`/storage/${storageId}/rowCount/${rowCount}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom proveravanja postojanja reda "+rowCount+" i storageId "+storageId);
    }
}

export async function existsByColsAndStorageId({storageId, cols}){
    try{
        const parseCols = parseInt(cols, 10);
        if(Number.isNaN(Number(parseCols)) || parseCols <= 0 || storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Greska, nepostojeca kolona "+parseCols+" polica i id "+storageId+" skladista");
        }
        const response = await api.get(url+`/storage/${storageId}/cols/${cols}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom proveravanja postojanja kolone "+cols+" i storageId "+storageId);
    }
}

export async function existsByRowCountAndColumnAndStorageId({storageId, rowCount, cols}){
    try{
        const parseCols = parseInt(cols, 10);
        const parseRowCount = parseInt(rowCount, 10);
        if(Number.isNaN(Number(parseRowCount)) || parseRowCount <= 0 ||
            Number.isNaN(Number(parseCols)) || parseCols <= 0 || storageId == null || Number.isNaN(Number(storageId))){
                throw new Error("Greska, nepostojeci red "+parseRowCount+" i kolona "+parseCols+" polica kao i ID "+storageId+" skladista");
        }
        const response = await api.get(url+`/storage/${storageId}/rowCount/${rowCount}/cols/${cols}/exists`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error , "Greska prilikom proveravanja postojanja reda "+rowCount+", kolone "+cols+" i storageId "+storageId);
    }
}

export async function findByStorageId(storageId){
    try{
        if(storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Dati ID "+storageId+" skladista je nepostojeci");
        }
        const response = await api.get(url+`/by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po "+storageId+" storageId");
    }
}   

export async function findByRowCountAndStorageId({storageId, rowCount}){
    try{
        const parseRowCount = parseInt(rowCount, 10);
        if(Number.isNaN(Number(parseRowCount)) || parseRowCount <= 0 || storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Greks prilikom trazenja reda "+parseRowCount+" polica i ID "+storageId+" skladista");
        }
        const response = await api.get(url+`/storage/${storageId}/rowCount/${rowCount}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po redu "+rowCount+" i storageId "+storageId);
    }
}

export async function findByColumnAndStorageId({storageId, cols}){
    try{
        const parseCols = parseInt(cols, 10);
        if(Number.isNaN(Number(parseCols)) || parseCols <= 0 || storageId == null || Number.isNaN(Number(storageId))){
            throw new Error("Greks prilikom trazenja kolone "+parseCols+" polica i ID "+storageId+" skladista");
        }
        const response = await api.get(url+`/storage/${storageId}/cols/${cols}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po koloni "+cols+" i storageId "+storageId);
    }
}

export async function findByRowCountAndColsAndStorageId({storageId, rowCount, cols}){
    try{
        const parseCols = parseInt(cols, 10);
        const parseRowCount = parseInt(rowCount, 10);
        if(
            Number.isNaN(Number(parseRowCount)) || parseRowCount <= 0 ||
            Number.isNaN(Number(parseCols)) || parseCols <= 0 || storageId == null || Number.isNaN(Number(storageId))){
                throw new Error("Greska, prilikom trazenja reda "+parseRowCount+" i kolone "+parseCols+" polica kao i ID "+storageId+" skladista");
        }
        const response = await api.get(url+`/storage/${storageId}/rowCount/${rowCount}/cols/${cols}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po redu "+rowCount+", koloni "+cols+" i storageId "+storageId);
    }
}

export async function getShelfWithGoods(shelfId){
    try{
        if(shelfId == null || Number.isNaN(Number(shelfId))){
            throw new Error("Dati id "+shelfId+" police, nije pronadjen");
        }
        const response = await api.get(url+`/${shelfId}/with-goods`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" police, bez robe");
    }
}

export const getShelvesByStorageId = async (storageId) => {
    try{
        if(storageId == null || inum.sNaN(Number(storageId))){
            throw new Error("Dati id skladista "+storageId+" za policu nije pronadjen");
        }
        const response = await api.get(url+`/by-storage/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska ID "+storageId+" skladista ne odgovara policama");
    }
};

export async function findByStorage_Name(name){
    try{
        if(!name || typeof name !== "string" || name.trim()===""){
            throw new Error("Dati naziv "+name+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/storage-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu "+name+" skladista za police");
    }
}

export async function findByStorage_Location(location){
    try{
        if(!location || typeof location !== "string" || location.trim()===""){
            throw new Error("Data lokacija "+location+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/storage-location`,{
            params:{location:location},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po lokaciji "+location+" skladista za police");
    }
}

export async function findByStorage_Type(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/storage-type`,{
            params:{type:(type || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu "+type+" skladista");
    }
}

export async function findByStorage_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista veceg od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/storage-capacity-greater-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kapacitetu skladista veceg od "+capacity);
    }
}

export async function findByStorage_NameAndStorage_Type({name, type}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati naziv "+name+" i tip "+type+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/storage-name-and-type`,{
            params:{
                name:name,
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po naziv "+name+" i tipu "+type+" skladista za police");
    }
}

export async function countAvailableCapacity(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/${id}/available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj dostupnosti kapaciteta za dati id "+id+" skaldista");
    }
}

export async function allocateCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(Number.isNaN(Number(id)) || id == null || Number.isNaN(Number(parseAmount)) || parseAmount <= 0){
            throw new Error("Dati ID "+id+" skladista i njegova kolicina "+parseAmount+" za alociranje nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/allocate`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" skladista i njegovu kolicinu "+amount+" za alociranje");
    }
}

export async function releaseCapacity({id, amount}){
    try{
        const parseAmount = parseFloat(amount);
        if(Number.isNaN(Number(id)) || id == null || Number.isNaN(Number(parseAmount)) || parseAmount <= 0){
            throw new Error("Dati ID "+id+" skladista i njegova kolicina "+parseAmount+" za premestanje nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/release`,{
            params:{amount:parseAmount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" skladista i njegovu kolicinu "+amount+" za premestanje");
    }
}

export async function findByStorage_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet skladista manji od "+parseCapacity+", nie pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity-less-than`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet skladista manji od "+capacity);
    }
}

export async function findByStorage_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" skladista, nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-capacity`,{
            params:{capacity:parseCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet "+capacity+" skladista");
    }
}

export async function findByStorage_Status(status){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" skladista nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati status "+status+" skladista");
    }
}

export async function findByStorageTypeAndStatus({type, status}){
    try{
        if(!isStorageStatusValid.includes(status?.toUpperCase()) ||
            !isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" i status "+status+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-type-and-status`,{
            params:{
                type:(type || "").toUpperCase(),
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" i status "+status+" datog skladista");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndLocationContainingIgnoreCase({name, location}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Dati naziv "+name+" i lokacija "+location+" skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-name-and-location`,{
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

export async function findByStorageNameContainingIgnoreCaseAndCapacity({name, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!name || typeof name !== "string" || name.trim() === "" || Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati naziv "+name+" i kapacitet "+parseCapacity+" skladista nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-name-and-capacity`,{
            params:{
                name:name,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i kapacitet "+capacity+" skaldista");
    }
}

export async function findByStorageNameContainingIgnoreCaseAndCapacityGreaterThan({name, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!name || typeof name !== "string" || name.trim() === "" || Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati naziv"+name+" i kapacitet skladista veci od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-name-and-capacity-greater-than`,{
            params:{
                name:name,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i kapacitet skaldista veceg od "+capacity);
    }
}

export async function findByStorageNameContainingIgnoreCaseAndCapacityLessThan({name, capacity}){
    try{
        const parseCapacity = parseFloat(capacity);
        if(!name || typeof name !== "string" || name.trim() === "" || Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati naziv "+name+" i kapacitet skladista manji od "+parseCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/search/storage-name-and-capacity-less-than`,{
            params:{
                name:name,
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i kapacitet skaldista manji od "+capacity);
    }
}

export async function findByStorageNameContainingIgnoreCaseAndStatus({name, status}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" ||
            !isStorageStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati naziv "+name+" i status "+status+"+skladista nisu pronadjeni");
        }
        const response = await api.get(url+`/search/storage-name-and-status`,{
            params:{
                name:name,
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" i status "+status+" datog skladista");
    }
}

export async function findByStorageCapacityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(Number.isNaN(Number(parseMin)) || parseMin <= 0 || Number.isNaN(Number(parseMax)) || parseMax <= 0){
            throw new Error("Dati opseg "+parseMin+" - "+parseMax+" kapaciteta skladista nije pronadjen");
        }
        if(parseMin > parseMax){
            throw new Error("Min ne sme biti veci od max");
        }
        const response = await api.get(url+`/search/storage-capacity-between`,{
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



