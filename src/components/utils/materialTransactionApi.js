import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/materialTransactions`;
const isTransactionTypeValid = ["RECEIPT","RETURN","TRANSFER_TO_LAB","SCRAP","INTERNAL_USE", "CORRECTION"];
const isMaterialTransactionStatusValid = ["PENDING","APPROVED","SENT_TO_LAB","LAB_CONFIRMED","COMPLETED","REJECTED"];
const isUnitOfMeasureValid = ["KG","METER","PCS","LITER","BOX","PALLET"];

export async function createMaterialTransactionRequest({materialId,quantity,type,transactionDate,vendorId,documentReference,notes,status,createdByUserId}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(materialId) || materialId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
           !isTransactionTypeValid.includes(type?.toUpperCase()) || !moment(transactionDate,"YYYY-MM-DD",true).isValid() ||
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
        if( id == null || isNaN(id) ||
            isNaN(materialId) || materialId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
           !isTransactionTypeValid.includes(type?.toUpperCase()) || !moment(transactionDate,"YYYY-MM-DD",true).isValid() ||
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
            throw new Error("Dati id za material-transaction, nije pronadjen");
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
            throw new Error("Dati id za material-transaction, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-transaction");
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
            throw new Error("Dati id za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material/${materialId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"TRenutno nismo pronasli id za materijal");
    }
}

export async function findByMaterial_CodeContainingIgnoreCase(materialCode){
    try{
        if(!materialCode || typeof materialCode !== "string" || materialCode.trim() === ""){
            throw new Error("Dati kod materijala nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati kod materijala");
    }
}

export async function findByMaterial_NameContainingIgnoreCase(materialName){
    try{
        if(!materialName || typeof materialName !== "string" || materialName.trim() === ""){
            throw new Error("Dati naziv materijala nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati naziv materijala");
    }
}

export async function findByMaterial_Unit(unit){
    try{
        if(!isUnitOfMeasureValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere za materijal, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere za materijal");
    }
}

export async function findByMaterial_CurrentStock(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu materijala");
    }
}

export async function findByMaterial_CurrentStockGreaterThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala veca od, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu materijala vecu od");
    }
}

export async function findByMaterial_CurrentStockLessThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala manja od, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu materijala manju od");
    }
}

export async function findByMaterial_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati id skladista za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista za materijal");
    }
}

export async function findByMaterial_ReorderLevel(reorderLevel){
    try{
        const parseReorderLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderLevel) || parseReorderLevel <= 0){
            throw new Error("Dati reorder-level za materijal, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal");
    }
}

export async function findByMaterial_ReorderLevelGreaterThan(reorderLevel){
    try{
        const parseReorderLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderLevel) || parseReorderLevel <= 0){
            throw new Error("Dati reorder-level za materijal veci od, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal veci od");
    }
}

export async function findByMaterial_ReorderLevelLessThan(reorderLevel){
    try{
        const parseReorderLevel = parseFloat(reorderLevel);
        if(isNaN(parseReorderLevel) || parseReorderLevel <= 0){
            throw new Error("Dati reorder-level za materijal manji od, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal manji od");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za materijal, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu za materijal");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za materijal veca od, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu za materijal veci od");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina za materijal manja od, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kolicinu za materijal manji od");
    }
}

export async function findByType(type){
    try{
        if(!isTransactionTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip transakcije za materijal, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip transakcije za materijal");
    }
}

export async function findByTransactionDate(transactionDate){
    try{
        if(!moment(transactionDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum transakcije za materijal, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum transakcije za materijal");
    }
}

export async function findByTransactionDateBetween({transactionDateStart, transactionDateEnd}){
    try{
        if(!moment(transactionDateStart,"YYYY-MM-DD",true).isValid() || 
          !moment(transactionDateEnd,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati opseg datuma za transakciju materijala, nije pronadjen");
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
        handleApiError(error,"Trenurtno nismo pronasli opseg datuma za transakciju materijala");
    }
}

export async function findByTransactionDateGreaterThanEqual(transactionDate){
    try{    
        if(!moment(transactionDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum transakcije za materijale veci od, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum treansakcije veci od");
    }
}

export async function findByVendor_Id(vendorId){
    try{
        if(isNaN(vendorId) || vendorId == null){
            throw new Error("Dati ID za prodavca, nije pronadjen");
        }
        const response = await api.get(url+`/vendor/${vendorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za prodavca");
    }
}

export async function findByVendor_NameContainingIgnoreCase(vendorName){
    try{
        if(!vendorName || typeof vendorName !== "string" || vendorName.trim() === ""){
            throw new Error("Dati naziv prodavca nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv prodavca");
    }
}

export async function findByVendor_EmailContainingIgnoreCase(vendorEmail){
    try{
        if(!vendorEmail || typeof vendorEmail !== "string" || vendorEmail.trim() === ""){
            throw new Error("Dati email prodavca nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli email prodavca");
    }
}

export async function findByVendor_PhoneNumber(vendorPhone){
    try{
        if(!vendorPhone || typeof vendorPhone !== "string" || vendorPhone.trim() === ""){
            throw new Error("Dati broj-telefona prodavca nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli broj-telefona prodavca");
    }
}

export async function findByVendor_AddressContainingIgnoreCase(vendorAddress){
    try{
        if(!vendorAddress || typeof vendorAddress !== "string" || vendorAddress.trim() === ""){
            throw new Error("Data adresa prodavca nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli adresu prodavca");
    }
}

export async function findByDocumentReference(documentReference){
    try{
        if(!documentReference || typeof documentReference !== "string" || documentReference.trim() === ""){
            throw new Error("Data dokument referenca za materijal transakciju, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli dokument referencu za transakciju materijala");
    }
}

export async function findByNotes(notes){
    try{
        if(!notes || typeof notes !== "string" || notes.trim() === ""){
            throw new Error("Dati notes za materijal transakciju, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli notes za materijal transakciju");
    }
}

export async function findByStatus(status){
    try{
        if(!isMaterialTransactionStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za transkciju materijala nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli status za transakciju materijala");
    }
}

export async function findByCreatedByUser_Id(userId){
    try{
        if(isNaN(userId) || userId == null){
            throw new Error("Dati id korisnika za materijal transakciju, nije pronadjen");
        }
        const response = await api.get(url+`/createdByUser/${userId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id korisnika, koji je kreirao transakciju materijala");
    }
}

export async function findByCreatedByUser_FirstNameContainingIgnoreCaseAndCreatedByUser_LastNameContainingIgnoreCase({userFirstName, userLastName}){
    try{
        if(!userFirstName || typeof userFirstName !== "string" || userFirstName.trim() === "" ||
           !userLastName || typeof userLastName !== "string" || userLastName.trim() === ""){
            throw new Error("Dato ime i prezime korinika, nije pronadjeno");
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
        handleApiError(error,"Trenutno nismo pronasli ime-prezime korisnika vezanu za transakciju materijala");
    }
}

export async function findByCreatedByUser_EmailContainingIgnoreCase(userEmail){
    try{
        if(!userEmail ||  typeof userEmail !== "string" || userEmail.trim() === ""){
            throw new Error("Dati email korisnika nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli email korisnika");
    }
}
