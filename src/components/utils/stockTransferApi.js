import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/stockTransfers`;

const validateStatus = ["INITIATED","IN_TRANSIT","COMPLETED","CANCELLED"];
const validateStorageType = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];

export async function create({transferDate, fromStorageId,toStorageId,status, itemRequest}){
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
    if (!status || typeof status !== "string" || !validateStatus.includes(status?.toUpperCase())) {
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

export async function update({id,transferDate, fromStorageId,toStorageId,status, itemRequest} ){
    try{
        if(id == null || isNaN(id) || !validateStockTransferInput(transferDate,fromStorageId,toStorageId,status,itemRequest)){
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
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog "+id+" po id-iju");
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
        if (!status || typeof status !== "string") {
            alert("Status transfera nije validan.");
            return false;
        }
        const response = await api.get(url+`/by-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po statusu "+status);
    }
}

export async function findByTransferDate(date){
    try{
        if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
            alert("Molimo unesite ispravan datum transfera.");
            return;
        }
        const response = await api.get(url+`/transfer-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema transfer datumu "+date);
    }
}

export async function findByTransferDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() ||
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg datuma "+start+" - "+end+" je nevalidan");
        }
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
        handleApiError(error, "Greska izmedju transfer "+start+" - "+end+" datuma");
    }
}

export async function findByFromStorageId(fromStorageId){
    try{
        if(fromStorageId == null || isNaN(fromStorageId)){
            throw new Error("Skaldiste "+fromStorageId+" odakle ide roba ne postoji");
        }
        const response = await api.get(url+`/storage/${fromStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prema dobavljanju iz "+fromStorageId+" skladista ka");
    }
}

export async function findByToStorageId(toStorageId){
    try{
        if(toStorageId == null || isNaN(toStorageId)){
            throw new Error("Skaldiste "+toStorageId+" gde dolazi roba ne postoji");
        }
        const response = await api.get(url+`/storage/${toStorageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju u "+toStorageId+" skladiste");
    }
}

export async function findByFromStorage_Name(fromStorageName){
    try{
        if(!fromStorageName || typeof fromStorageName !== "string" || fromStorageName.trim() ===""){
            throw new Error("Nepoznat naziv "+fromStorageName+" skladista odakle dolazi roba");
        }
        const response = await api.get(url+`/fromStorageName`,{
            params:{
                fromStorageName:fromStorageName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prema pretrazi od naziva "+fromStorageName+" skladista");
    }
}

export async function findByFromStorage_Location(fromLocation){
    try{
        if(!fromLocation || typeof fromLocation !== "string" || fromLocation.trim() ===""){
            throw new Error("Nepozna lokacija "+fromLocation+" skladista odakle dolazi roba");
        }
        const response = await api.get(url+`/fromLocation`,{
            params:{
                fromLocation:fromLocation
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prema dobavlajnju od lokacije "+fromLocation+" skladista");
    }
}

export async function findByToStorage_Name(toStorageName){
    try{ 
        if(!toStorageName || typeof toStorageName !== "string" || toStorageName.trim() ===""){
            throw new Error("Nepoznat naziv "+toStorageName+" skladista gde dolazi roba");
        }
        const response = await api.get(url+`/toStorageName`,{
            params:{
                toStorageName:toStorageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju do naziv "+toStorageName+" askladista");
    }
}

export async function findByToStorage_Location(toLocation){
    try{
        if(!toLocation || typeof toLocation !=="string" || toLocation.trim() === ""){
            throw new Error("Lokacija "+toLocation+" do skladista ne postojeca");
        }
        const response = await api.get(url+`/toLocation`,{
            params:{
                toLocation:toLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju do lokacije "+toLocation);
    }
}

export async function findByFromStorage_Type(fromStorageType){
    try{
        if(validateStorageType.includes(fromStorageType?.toUpperCase())){
            throw new Error("Nepoznat tip "+fromStorageType+" skladista odakle dolazi roba");
        }
        const response = await api.get(url+`/fromStorageType`,{
            params:{
                fromStorageType:fromStorageType
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju od tipa "+fromStorageType+" skladista");
    }
}

export async function findByToStorage_Type(toStorageType){
    try{
        if(validateStorageType.includes(toStorageType?.toUpperCase())){
            throw new Error("Nepoznat tip "+toStorageType+" skladista gde dolazi roba");
        }
        const response = await api.get(url+`/toStorageType`,{
            params:{
                toStorageType:toStorageType
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prema dobavljanju ka tipu "+toStorageType+" skladista");
    }
}

export async function findByStatusAndDateRange({status, start, end}){
    try{ 
        if (!status || typeof status !== "string") {
            alert("Status transfera nije validan.");
            return false;
        }
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
        handleApiError(error,"Greska prema pretrazi po statusu "+status+" i opsegu "+start+" - "+end+" datuma");
    }
}

export async function findByFromAndToStorageType({fromType, toType}){
    try{
        if(!validateStorageType.includes(fromType?.toUpperCase()) || !validateStorageType.includes(toType?.toUpperCase())){
            throw new Error("Nepoznati tipovi "+fromType+" od-do "+toType+" skladista");
        }
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
        handleApiError(error,"Greska prema dobavljanju od "+fromType+" do "+toType+" tipa skladista");
    }
}

export async function searchFromStorageByNameAndLocation({name, location}){
    try{
        if(!name || typeof name !=="string" || name.trim() === "" ||
            !location  || typeof location !=="string" || location.trim() === ""){
            throw new Error("Pretraga po nazivu "+name+" i lokaciji "+location+" skladista je nepoznata");
        }
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
        handleApiError(error,"Greska pre pretrazi po nazivu "+name+" i lokaciji "+location+" skladista");
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