import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isInventoryValid = ["PENDING","IN_PROGRESS","COMPLETED","CANCELLED","RECONCILED","PARTIALLY_COMPLETED","PENDING_APPROVAL","APPROVED"];
const url = `${import.meta.env.VITE_API_BASE_URL}/inventories/`;

export async function createInventory({storageEmployeeId, storageForemanId, date,aligned, inventoryItems, status}){
    try{
        if(
            !storageEmployeeId || !storageForemanId ||
            !moment(date,"YYYY-MM-DD",true).isValid() || typeof aligned !=="boolean" ||
            !Array.isArray(inventoryItems) || inventoryItems.length === 0||
            !isInventoryValid.includes(status?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {storageEmployeeId,storageForemanId,date:moment(date).format("YYYY-MM-DD"), aligned,inventoryItems,status:status.toUpperCase()};
        const response = await api.post(url+`create/new-inventory`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function updateInventory({id,storageEmployeeId, storageForemanId, date,aligned, inventoryItems, status} ){
    try{
        if(
            id == null || isNaN(id) ||
            !storageEmployeeId || !storageForemanId ||
            !moment(date,"YYYY-MM-DD",true).isValid() || typeof aligned !=="boolean" ||
            !Array.isArray(inventoryItems) || inventoryItems.length === 0||
            !isInventoryValid.includes(status?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {storageEmployeeId,storageForemanId,date:moment(date).format("YYYY-MM-DD"), aligned,inventoryItems,status:status.toUpperCase()};
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
            throw new Error(`Greška prilikom kreiranja skladišta: ${error.message}`);
        }
    }
}

export async function deleteInventory(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za Inventory nije pronadjen");
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

export async function findInventoryByStatus(status){
    try{
        if(!isInventoryValid.includes(status?.toUpperCase())){
            throw new Error("Dati status ne postoji");
        }
        const response = await api.get(url+`/find-by-status`,{
            params:{
                status:status.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog");
    }
}

export async function findByStorageEmployeeId(storageEmployeeId){
    try{
        if(!storageEmployeeId){
            throw new Error("Dati ID za storageEmployee nije pronadjen");
        }
        const response = await api.get(url+`/by-storageEmployeeId`,{
            params:{
                storageEmployeeId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja inventara po magacioneru");
    }
}

export async function findByStorageForemanId(storageForemanId){
    try{
        if(storageForemanId == null || isNaN(storageForemanId)){
            throw new Error("Dati ID za storageForeman nije pronadjen");
        }
    const response = await api.get(url+`/by-storageForemanId`,{
        params:{
            storageForemanId
        },
        headers:getHeader()
    });
    return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage inventara po smenovodji");
    }
}

export async function findOneInventory(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za Inventory nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog inventara");
    }
}

export async function findAllInventories(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja svih inventara");
    }
}

export async function findByDate(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum mora biti ispravan i validan");
        }
        const response = await api.get(url+`/find-by-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage inventara po datumu");
    }
}

export async function findByDateRange({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() ||
           !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Netacan opseg datuma");
           }
        const response = await api.get(url+`/find-by-date-range`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja inventara po opsegu datuma");
    }
}

export async function changeStatus({inventoryId, newStatusStr}){
    try{
        if(!inventoryId || !newStatusStr || typeof newStatusStr !== "string" || newStatusStr.trim() === ""){
            throw new Error("Nepoznat inventoryId i newStatusStr");
        }
        const response = await api.post(url+`/changeStatus/${inventoryId}`,{
            params:{
                newStatusStr:newStatusStr.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po statusu inventara");
    }
}

export async function findPendingInventories(){
    try{
        const response = await api.get(url+`/find-by-pending-inventories`,{
            headers:getHeader()
        });
        return response.data
    }
    catch(error){
        handleApiError(error," Greska prilikom trazenja po cekanju");
    }
}

export async function findByDateAfter(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum posle za inventar nije pronadjen");
        }
        const response = await api.get(url+`/date-after`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar za datum posle");
    }
}

export async function findByDateBefore(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum pre za inventar nije pronadjen");
        }
        const response = await api.get(url+`/date-before`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli inventar za datum pre");
    }
}

export async function findByStorageEmployee_FullNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string"|| firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Dato ime i prezime magacionera nije pronadjeno");
        }
        const response = await api.get(url+`/search/employee-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime i prezime magacionera");
    }
}

export async function findBystorageForeman_FullNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string"|| firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Dato ime i prezime smenovodje nije pronadjeno");
        }
        const response = await api.get(url+`/search/foreman-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime i prezime smenovodje");
    }
}

export async function findByStorageEmployee_EmailILikegnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email za magacionera nije pronadjen");
        }
        const response = await api.get(url+`/search/employee-email`,{
            params:{
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email za magacionera");
    }
}

export async function findByStorageEmployee_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa za magacionera nije pronadjena");
        }
        const response = await api.get(url+`/search/employee-address`,{
            params:{
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu za magacionera");
    }
}

export async function findByStorageEmployee_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona za magacionera nije pronadjen");
        }
        const response = await api.get(url+`/search/employee-phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona za magacionera");
    }
}

export async function findByStorageForeman_Address(address){
    try{
        if(!address || typeof address !== "string" || address.trim() === ""){
            throw new Error("Data adresa za smenovodju nije pronadjena");
        }
        const response = await api.get(url+`/search/foreman-address`,{
            params:{
                address:address
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu za smenovodju");
    }
}

export async function findByStorageForeman_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona za smenovodju nije pronadjen");
        }
        const response = await api.get(url+`/search/foreman-phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona za smenovodju");
    }
}

export async function findByStorageForeman_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email za smenovodju nije pronadjen");
        }
        const response = await api.get(url+`/search/foreman-email`,{
            params:{
                email:phonemaileNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email za smenovodju");
    }
}

export async function findByStatusAndStorageEmployeeFullNameContainingIgnoreCase({status, firstName, lastName}){
    try{
        if(!isInventoryValid.includes(status?.toUpperCase()) ||
            !firstName || typeof firstName !== "string"|| firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Dati status inventara, ime i prezime magacionera nisu pronadjeni");
        }
        const response = await api.get(url+`/search/status-and-employee-full-name`,{
            params:{
                status:(status || "").toUpperCase(),
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status inventara i ime i prezime magacionera");
    }
}

export async function findByStatusAndStorageForemanFullNameContainingIgnoreCase({status, firstName, lastName}){
    try{
        if(!isInventoryValid.includes(status?.toUpperCase()) ||
            !firstName || typeof firstName !== "string"|| firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Dati status inventara, ime i prezime smenovodje nisu pronadjeni");
        }
        const response = await api.get(url+`/search/status-and-foreman-full-name`,{
            params:{
                status:(status || "").toUpperCase(),
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status inventara i ime i prezime smenovodje");
    }
}

export async function findInventoryByStorageForemanIdAndDateRange({foremanId, startDate, endDate}){
    try{
        if(isNaN(foremanId) || foremanId == null || 
            !moment(startDate,"YYYY-MM-DD",true).isValid() ||
            !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati id smenovodje i datumski opseg inventara nije pronadjen");
        }
        const response = await api.get(url+`/foreman/${foremanId}/inventory-date-range`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id smenovodje i datumski opseg za inventar");
    }
}


export async function findByStorageEmployeeIdAndStatus({employeeId, status}){
    try{
        if(isNaN(employeeId) || employeeId == null || !isInventoryValid.includes(status?.toUpperCase())){
            throw new Error("Dati id magacionera i status inventara nije pronadjen");
        }
        const response = await api.get(url+`/search/employee/${employeeId}/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id magacionera i status inventara");
    }
}

export async function findByStorageForemanIdAndStatus({foremanId, status}){
    try{
        if(isNaN(foremanId) || foremanId == null || !isInventoryValid.includes(status?.toUpperCase())){
            throw new Error("Dati id smenovodje i status inventara nije pronadjen");
        }
        const response = await api.get(url+`/search/foreman/${foremanId}/status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id smenovodje i status inventara");
    }
}

export async function findByStorageEmployeeIdAndDateBetween({employeeId, startDate, endDate}){
    try{
        if(isNaN(employeeId) || employeeId == null ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() ||
            !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati id magacionera i datumski opseg za inventar nisu pronadjeni");
        }
        const response = await api.get(url+`/employee/${employeeId}/date-range`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id magacionera i datumski opseg inventara");
    }
}

export async function findByStorageForemanIdAndDateBetween({foremanId, startDate, endDate}){
    try{
        if(isNaN(foremanId) || foremanId == null ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() ||
            !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati id smenovodje i datumski opseg za inventar nisu pronadjeni");
        }
        const response = await api.get(url+`/foreman/${foremanId}/date-range`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id smenovodje i datumski opseg inventara");
    }
}

export async function countByStorageForemanId(foremanId){
    try{
        if(isNaN(foremanId) || foremanId == null){
            throw new Error("Dati id za smenovodju nije pronadjen");
        }
        const response = await api.get(url+`/count-by/${foremanId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj smenovodja po njihovom id-iju");
    }
}

export async function existsByStatus(status){
    try{
        if(!isInventoryValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za inventar nije pronadjen");
        }
        const response = await api.get(url+`/exists-by-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenurno nismo pronasli postojanje datog statusa za inventar");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}