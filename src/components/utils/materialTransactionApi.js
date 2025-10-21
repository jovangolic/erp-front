import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/materialTransactions`;
const isMaterialTransactionTypeValid = ["RECEIPT","RETURN","TRANSFER_TO_LAB","SCRAP","INTERNAL_USE", "CORRECTION"];
const isMaterialTransactionStatusValid = ["PENDING","APPROVED","SENT_TO_LAB","LAB_CONFIRMED","COMPLETED","REJECTED"];
const isUnitOfMeasureValid = ["KG","METER","PCS","LITER","BOX","PALLET"];

export async function createMaterialTransactionRequest({materialId,quantity,type,transactionDate,vendorId,documentReference,notes,status,createdByUserId}){
    try{
        const parseQuantity = parseFloat(quantity);
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DD",true).isValid();
        if(
            isNaN(materialId) || materialId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
            !isTransactionTypeValid.includes(type?.toUpperCase()) || !validateTransactionDate ||
            isNaN(vendorId) || vendorId == null || 
            !documentReference || typeof documentReference !== "string" || documentReference.trim() === "" ||
            !notes || typeof notes !== "string" || notes.trim() === "" ||
            !isMaterialTransactionStatusValid.includes(status?.toUpperCase()) || isNaN(createdByUserId) || createdByUserId == null){
                throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {materialId,quantity,type,transactionDate,vendorId,documentReference,notes,status,createdByUserId};
        const response = await api.post(url+`/create/new-materialTransaction`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateMaterialTransactionRequest({id,materialId,quantity,type,transactionDate,vendorId,documentReference,notes,status,createdByUserId}){
    try{
        const parseQuantity = parseFloat(quantity);
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DD",true).isValid();
        if(
            id == null || isNaN(id) ||
            isNaN(materialId) || materialId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
            !isTransactionTypeValid.includes(type?.toUpperCase()) || !validateTransactionDate ||
            isNaN(vendorId) || vendorId == null || 
            !documentReference || typeof documentReference !== "string" || documentReference.trim() === "" ||
            !notes || typeof notes !== "string" || notes.trim() === "" ||
            !isMaterialTransactionStatusValid.includes(status?.toUpperCase()) || isNaN(createdByUserId) || createdByUserId == null){
                throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {materialId,quantity,type,transactionDate,vendorId,documentReference,notes,status,createdByUserId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteMaterialTransactionRequest(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati id "+id+" za material-transaction, nije pronadjen");
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
            throw new Error("Dati id "+id+" za material-transaction, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-transaction po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih material-transaction");
    }
}

export async function findByMaterial_Id(materialId){
    try{
        if(isNaN(materialId) || materialId == null){
            throw new Error("Dati id "+materialId+"za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material/${materialId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"TRenutno nismo pronasli id "+materialId+" za materijal");
    }
}

export async function findByMaterial_CodeContainingIgnoreCase(materialCode){
    try{
        if(!materialCode || typeof materialCode !== "string" || materialCode.trim() === ""){
            throw new Error("Dati kod "+materialCode+" materijala nije pronadjen");
        }
        const response = await api.get(url+`/material/material-code`,{
            params:{
                materialCode:materialCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kod "+materialCode+" materijala");
    }
}

export async function findByMaterial_NameContainingIgnoreCase(materialName){
    try{
        if(!materialName || typeof materialName !== "string" || materialName.trim() === ""){
            throw new Error("Dati naziv "+materialName+" materijala nije pronadjen");
        }
        const response = await api.get(url+`/material/material-name`,{
            params:{
                materialName:materialName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati naziv "+materialName+" materijala");
    }
}

export async function findByMaterial_Unit(unit){
    try{
        if(!isUnitOfMeasureValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere "+unit+" za materijal, nije pronadjena");
        }
        const response = await api.get(url+`/material-unit`,{
            params:{
                unit:(unit || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unit+" za materijal");
    }
}

export async function findByMaterial_CurrentStock(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha "+parseCurrentStock+" materijala, nije pronadjena");
        }
        const response = await api.get(url+`/material-current-stock`,{
            params:{
                currentStock:parseCurrentStock
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu "+currentStock+" materijala");
    }
}

export async function findByMaterial_CurrentStockGreaterThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala veca od "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`/material-current-stock-greater-than`,{
            params:{
                currentStock:parseCurrentStock
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu materijala vecu od "+currentStock);
    }
}

export async function findByMaterial_CurrentStockLessThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala manja od "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`/material-current-stock-less-than`,{
            params:{
                currentStock:parseCurrentStock
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu materijala manju od "+currentStock);
    }
}

export async function findByMaterial_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id "+storageId+" skladista za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista za materijal");
    }
}

export async function findByMaterial_ReorderLevel(reorderLevel){
    try{
        const parseReorderLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderLevel) || parseReorderLevel <= 0){
            throw new Error("Dati reorder-level "+parseReorderLevel+" za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material-reorder-level`,{
            params:{
                reorderLevel:parseReorderLevel
            },
            headers:getHeader()
        });
        return response.date;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli reorder-level "+reorderLevel+" za materijal");
    }
}

export async function findByMaterial_ReorderLevelGreaterThan(reorderLevel){
    try{
        const parseReorderLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderLevel) || parseReorderLevel <= 0){
            throw new Error("Dati reorder-level za materijal veci od "+parseReorderLevel+", nije pronadjen");
        }
        const response = await api.get(url+`/material-reorder-level-greater-than`,{
            params:{
                reorderLevel:parseReorderLevel
            },
            headers:getHeader()
        });
        return response.date;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal veci od "+reorderLevel);
    }
}

export async function findByMaterial_ReorderLevelLessThan(reorderLevel){
    try{
        const parseReorderLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderLevel) || parseReorderLevel <= 0){
            throw new Error("Dati reorder-level za materijal manji od "+parseReorderLevel+", nije pronadjen");
        }
        const response = await api.get(url+`/material-reorder-level-less-than`,{
            params:{
                reorderLevel:parseReorderLevel
            },
            headers:getHeader()
        });
        return response.date;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal manji od "+reorderLevel);
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+" za materijal, nije pronadjena");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+quantity+" za materijal");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za materijal veca od "+parseQuantity+", nije pronadjena");
        }
        const response = await api.get(url+`/quantity-greater-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu za materijal veci od "+quantity);
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za materijal manja od "+parseQuantity+", nije pronadjena");
        }
        const response = await api.get(url+`/quantity-less-than`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu za materijal manji od "+quantity);
    }
}

export async function findByType(type){
    try{
        if(!isMaterialTransactionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" transakcije za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" transakcije za materijal");
    }
}

export async function findByTransactionDate(transactionDate){
    try{
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DD",true).isValid();
        if(!validateTransactionDate){
            throw new Error("Datum transakcije "+transactionDate+" za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/by-transaction-date`,{
            params:{
                transactionDate:moment(transactionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum transakcije "+transactionDate+" za materijal");
    }
}

export async function findByTransactionDateBetween({transactionDateStart, transactionDateEnd}){
    try{
        const validateTransactionDateStart = moment.isMoment(transactionDateStart) || moment(transactionDateStart,"YYYY-MM-DD",true).isValid();
        const validateTransactionDateEnd = moment.isMoment(transactionDateEnd) || moment(transactionDateEnd,"YYYY-MM-DD",true).isValid();
        if(!validateTransactionDateStart || !validateTransactionDateEnd){
            throw new Error("Dati opseg datuma "+transactionDateStart+" - "+transactionDateEnd+" za transakciju materijala, nije pronadjen");
        }
        if(moment(transactionDateEnd).isBefore(moment(transactionDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/transaction-date-range`,{
            params:{
                transactionDateStart:moment(transactionDateStart).format("YYYY-MM-DD"),
                transactionDateEnd:moment(transactionDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenurtno nismo pronasli opseg "+transactionDateStart+" - "+transactionDateEnd+" datuma za transakciju materijala");
    }
}

export async function findByTransactionDateGreaterThanEqual(transactionDate){
    try{    
        const validateTransactionDate = moment.isMoment(transactionDate) || moment(transactionDate,"YYYY-MM-DD",true).isValid();
        if(!validateTransactionDate){
            throw new Error("Dati datum transakcije za materijale veci od "+transactionDate+", nije pronadjen");
        }
        const response = await api.get(url+`/transaction-date-greater-than-equal`,{
            params:{
                transactionDate:moment(transactionDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum treansakcije veci od "+transactionDate);
    }
}

export async function findByVendor_Id(vendorId){
    try{
        if(isNaN(vendorId) || vendorId == null){
            throw new Error("Dati ID "+vendorId+" za prodavca, nije pronadjen");
        }
        const response = await api.get(url+`/vendor/${vendorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+vendorId+" za prodavca");
    }
}

export async function findByVendor_NameContainingIgnoreCase(vendorName){
    try{
        if(!vendorName || typeof vendorName !== "string" || vendorName.trim() === ""){
            throw new Error("Dati naziv "+vendorName+" prodavca nije pronadjen");
        }
        const response = await api.get(url+`/vendor-name`,{
            params:{
                vendorName:vendorName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+vendorName+" prodavca");
    }
}

export async function findByVendor_EmailContainingIgnoreCase(vendorEmail){
    try{
        if(!vendorEmail || typeof vendorEmail !== "string" || vendorEmail.trim() === ""){
            throw new Error("Dati email "+vendorEmail+" prodavca nije pronadjen");
        }
        const response = await api.get(url+`/vendor-email`,{
            params:{
                vendorEmail:vendorEmail
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+vendorEmail+" prodavca");
    }
}

export async function findByVendor_PhoneNumber(vendorPhone){
    try{
        if(!vendorPhone || typeof vendorPhone !== "string" || vendorPhone.trim() === ""){
            throw new Error("Dati broj-telefona "+vendorPhone+" prodavca nije pronadjen");
        }
        const response = await api.get(url+`/vendor-phone`,{
            params:{
                vendorPhone:vendorPhone
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+vendorPhone+" prodavca");
    }
}

export async function findByVendor_AddressContainingIgnoreCase(vendorAddress){
    try{
        if(!vendorAddress || typeof vendorAddress !== "string" || vendorAddress.trim() === ""){
            throw new Error("Data adresa "+vendorAddress+" prodavca nije pronadjena");
        }
        const response = await api.get(url+`/vendor-address`,{
            params:{
                vendorAddress:vendorAddress
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli adresu "+vendorAddress+" prodavca");
    }
}

export async function findByDocumentReference(documentReference){
    try{
        if(!documentReference || typeof documentReference !== "string" || documentReference.trim() === ""){
            throw new Error("Data dokument referenca "+documentReference+" za materijal transakciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-documentReference`,{
            params:{
                documentReference:documentReference
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dokument referencu "+documentReference+" za transakciju materijala");
    }
}

export async function findByNotes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Data beleska "+notes+" za materijal transakciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-notes`,{
            params:{
                notes:notes
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli belesku "+notes+" za materijal transakciju");
    }
}

export async function findByStatus(status){
    try{
        if(!isMaterialTransactionStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status "+status+" za transkciju materijala nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status "+status+" za transakciju materijala");
    }
}

export async function findByCreatedByUser_Id(userId){
    try{
        if(isNaN(userId) || userId == null){
            throw new Error("Dati id "+userId+" korisnika za materijal transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/createdByUser/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+userId+" korisnika, koji je kreirao transakciju materijala");
    }
}

export async function findByCreatedByUser_FirstNameContainingIgnoreCaseAndCreatedByUser_LastNameContainingIgnoreCase({userFirstName, userLastName}){
    try{
        if(!userFirstName || typeof userFirstName !== "string" || userFirstName.trim() === "" ||
           !userLastName || typeof userLastName !== "string" || userLastName.trim() === ""){
            throw new Error("Dato ime "+userFirstName+" i prezime "+userLastName+" korinika, nije pronadjeno");
           }
           const response = await api.get(url+`/createdUser-full-name`,{
            params:{
                userFirstName:userFirstName,
                userLastName:userLastName
            },
            headers:getHeader()
           });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+userFirstName+" prezime "+userLastName+" korisnika vezanu za transakciju materijala");
    }
}

export async function findByCreatedByUser_EmailContainingIgnoreCase(userEmail){
    try{
        if(!userEmail ||  typeof userEmail !== "string" || userEmail.trim() === ""){
            throw new Error("Dati email "+userEmail+" korisnika nije pronadjen");
        }
        const response = await api.get(url+`/createdByUser-user-email`,{
            params:{
                userEmail:userEmail
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+userEmail+" korisnika");
    }
}
