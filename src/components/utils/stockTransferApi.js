import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/stockTransfers`;

export async function create(transferDate, fromStorageId,toStorageId,status, itemRequest){
    try{
        // 1. Provera datuma
    if (!transferDate || !moment(transferDate, "YYYY-MM-DD", true).isValid()) {
        alert("Molimo unesite ispravan datum transfera.");
        return;
    }
    // 2. Provera skladišta
    if (!fromStorageId || !toStorageId || fromStorageId === toStorageId) {
        alert("Skladišta moraju biti različita i validna.");
        return;
    }
    // 3. Provera statusa
    if (!status || typeof status !== "string") {
        alert("Status transfera nije validan.");
        return;
    }
    // 4. Provera itemRequest niza
    if (!Array.isArray(itemRequest) || itemRequest.length === 0) {
        alert("Morate dodati bar jedan artikal za transfer.");
        return;
    }
    // 5. Provera svakog artikla
    for (const item of itemRequest) {
        if (!item.productId || typeof item.productId !== "number") {
            alert("Svaki artikal mora imati validan proizvod.");
            return;
        }
        if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
            alert("Količina mora biti broj veći od nule.");
            return;
        }
    }
        const requestBody = {transferDate:moment(transferDate).format("YYYY-MM-DD"),
            fromStorageId, toStorageId,status:(status || "").toUpperCase(),itemRequest
        };
        const response = await api.post(url+`/create/new-stockTransfer`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function update(id,transferDate, fromStorageId,toStorageId,status, itemRequest ){
    try{
        if(!validateStockTransferInput(transferDate,fromStorageId,toStorageId,status,itemRequest)){
            return;
        }
        const requestBody = {transferDate:moment(transferDate).format("YYYY-MM-DD"),
            fromStorageId, toStorageId,status:(status || "").toUpperCase(),itemRequest
        };
        const response = await api.put(url+`/update/${id}`,requestBody, {
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteStockTransfer (id) {
    try{
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
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog");
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
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function findByStatus(status){
    try{
        const response = await api.get(url+`/by-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu");
    }
}

export async function findByTransferDate(date){
    try{
        const response = await api.get(url+`/transfer-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema transfer datumu");
    }
}

export async function findByTransferDateBetween(start, end){
    try{
        const response = await api.get(url+`/transfer-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska izmedju transfer datuma");
    }
}

export async function findByFromStorageId(fromStorageId){
    try{
        const response = await api.get(url+`/storage/${fromStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dobavljanju iz skladista ka");
    }
}

export async function findByToStorageId(toStorageId){
    try{
        const response = await api.get(url+`/storage/${toStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju u skladiste");
    }
}

export async function findByFromStorage_Name(fromStorageName){
    try{
        const response = await api.get(url+`/fromStorageName`,{
            params:{
                fromStorageName:fromStorageName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prema pretrazi od naziva skladista");
    }
}

export async function findByFromStorage_Location(fromLocation){
    try{
        const response = await api.get(url+`/fromLocation`,{
            params:{
                fromLocation:fromLocation
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prema dobavlajnju od lokacije skladista");
    }
}

export async function findByToStorage_Name(toStorageName){
    try{    
        const response = await api.get(url+`/toStorageName`,{
            params:{
                toStorageName:toStorageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju do naziv askladista");
    }
}

export async function findByToStorage_Location(toLocation){
    try{
        const response = await api.get(url+`/toLocation`,{
            params:{
                toLocation:toLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju do lokacije");
    }
}

export async function findByFromStorage_Type(fromStorageType){
    try{
        const response = await api.get(url+`/fromStorageType`,{
            params:{
                fromStorageType:fromStorageType
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju od tipa skladista");
    }
}

export async function findByToStorage_Type(toStorageType){
    try{
        const response = await api.get(url+`/toStorageType`,{
            params:{
                toStorageType:toStorageType
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju ka tipu skladista");
    }
}

export async function findByStatusAndDateRange(status, start, end){
    try{    
        const response = await api.get(url+`/status-and-date-range`,{
            params:{
                status:(status || "").toUpperCase(),
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema pretrazi po statusu i opsegu datuma");
    }
}

export async function findByFromAndToStorageType(fromType, toType){
    try{
        const response = await api.get(url+`/fromType-toType`,{
            params:{
                fromType:fromType,
                toType:toType
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju od do tipa skladista");
    }
}

export async function searchFromStorageByNameAndLocation(name, location){
    try{
        const response = await api.get(url+`/name-and-location`,{
            params:{
                name:name,
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pre pretrazi po nazivu i lokaciji skladista");
    }
}


function validateStockTransferInput(transferDate, fromStorageId, toStorageId, status, itemRequest) {
    if (!transferDate || !moment(transferDate, "YYYY-MM-DD", true).isValid()) {
        alert("Molimo unesite ispravan datum transfera.");
        return false;
    }

    if (!fromStorageId || !toStorageId || fromStorageId === toStorageId) {
        alert("Skladišta moraju biti različita i validna.");
        return false;
    }

    if (!status || typeof status !== "string") {
        alert("Status transfera nije validan.");
        return false;
    }

    if (!Array.isArray(itemRequest) || itemRequest.length === 0) {
        alert("Morate dodati bar jedan artikal za transfer.");
        return false;
    }

    for (const item of itemRequest) {
        if (!item.productId || typeof item.productId !== "number") {
            alert("Svaki artikal mora imati validan proizvod.");
            return false;
        }
        if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
            alert("Količina mora biti broj veći od nule.");
            return false;
        }
    }

    return true;
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}