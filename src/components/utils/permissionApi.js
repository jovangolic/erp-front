import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isPermissionActionTypeValid = ["CREATE","READ","UPDATE", "DELETE", "FIND_ONE", "FIND_ALL", "EXPORT", "APPROVE", "SEARCH"];
const isPermissionResourceTypeValid = [
    //SKLADISTE
    "INVENTORY",
    "INVENTORY_ITEM",
    "STORAGE",
    "MATERIAL_MOVEMENT",
    "PRODUCT",
    "GOODS",
    "SUPPLY",
    "OUTBOUND_DELIVERY",
    "INBOUND_DELIVERY",
    "SHELF",
    "BAR_CODE",

    // LOGISTIKA
    "SALES_ORDER",
    "DELIVERY_ITEM",
    "DRIVER",
    "LOGISTICS_PROVIDER",
    "VEHICLE",
    "ROUTE",
    "SHIPMENT",
    "TRANSPORT_ORDER",

    // MATERIJALI
    "MATERIAL",
    "BILL_OF_MATERIAL",
    "MATERIAL_REQUEST",
    "MATERIAL_REQUIREMENT",
    "MATERIAL_TRANSACTION",
    "RAW_MATERIAL",

    // PLANIRANJE PROIZVODNJE
    "CAPACITY_PLANNING",
    "CONFIRMATION_DOCUMENT",
    "WORK_CENTER",
    "TRACKING_INFO",
    "STOCK_TRANSFER",
    "STOCK_ITEM_TRANSFER",
    "PRODUCTION_ORDER",
    "SHIFT",
    "SHIFT_REPORT",
    "SHIFT_PLANNING",
    "REPORT",

    // RACUNOVODSTVO
    "ACCOUNT",
    "BALANCE_SHEET",
    "JOURNAL_ENTRY",
    "JOURNAL_ITEM",
    "LEDGER_ENTRY",
    "INVOICE",
    "FISCAL_YEAR",
    "FISCAL_QUARTER",
    "INCOME_STATEMENT",
    "PAYMENT",
    "TRANSACTION",
    "TAX",

    // KONTROLA KVALITETA
    "INSPECTION",
    "INSPECTION_DEFECT",
    "DEFECT",
    "BATCH",
    "QUALITY_CHECK",
    "QUALITY_STANDARD",
    "TEST_MEASUREMENT",
    
    //PRODAJA & DISTRIBUCIJA
    "PROCUREMENT",
    "SALES",
    "SUPPLY_ITEM",
    "VENDOR",

    // SISTEMSKI ENTITETI (globalni)
    "USER",
    "ROLE",
    "LANGUAGE",
    "PERMISSION",
    "OPTION",
    "LOCALIZED_OPTION",
    "SECURITY_SETTING",
    "SYSTEM_STATE",
    "SYSTEM_SETTING",
    "HELP",
    "GOTO",
    "FILE_OPT",
    "EDIT_OPT",
    "EMAIL_SETTING"];

export async function cratePermission(resourceType, actionType){
    try{
        if(
            !isPermissionResourceTypeValid.includes(resourceType?.toUpperCase()) || !isPermissionActionTypeValid.includes(actionType?.toUpperCase())
        ){
            throw new Error("Tip mora biti validan i popunjen");
        }
        const requestBody = {resourceType, actionType};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/permission/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih");
    }
}

export async function deletePermission(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za permisson nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/permission/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function updatePermission({id, resourceType,actionType}){
    try{
        if(
            id == null || Number.isNaN(Number(id)) ||
            !isPermissionResourceTypeValid.includes(resourceType?.toUpperCase()) || !isPermissionActionTypeValid.includes(actionType?.toUpperCase())
        ){
            throw new Error("Tip mora biti validan i popunjen");
        }
        const requestBody = {resourceType, actionType};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/permission/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Gresja prilikom azuriranja");
    }
}

export async function getPermissionById(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za permision nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/get/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog permission po "+id+" id-iju");
    }
}

export async function findByActionType(actionType){
    try{
        if(!isPermissionActionTypeValid.includes(actionType?.toUpperCase())){
            throw new Error("Dati tip-akcije "+actionType+" za odobrenje, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/by-action-type`,{
            params:{
                actionType:(actionType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip akcije "+actionType+" za dato odobrenje/permission");
    }
}

export async function findByResourceType(resourceType){
    try{
        if(!isPermissionResourceTypeValid.includes(resourceType?.toUpperCase())){
            throw new Error("Dati tip-resursa "+resourceType+" za odobrenje, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/by-resource-type`,{
            params:{
                resourceType : (resourceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip-resursa "+resourceType+" za dato odobrenje/permission");
    }
}

export async function findByActionTypeAndResourceType({actionType, resourceType}){
    try{
        if(!isPermissionActionTypeValid.includes(actionType?.toUpperCase()) || !isPermissionResourceTypeValid.includes(resourceType?.toUpperCase())){
            throw new Error("Tip-akcije "+actionType+" i tip-resursa "+resourceType+" za dato odobrenje, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/action-type-and-resource-type`,{
            params:{
                actionType:(actionType || "").toUpperCase(),
                resourceType : (resourceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip-akcije "+actionType+" i tip-resursa "+resourceType+" za dato odobrenje/permission");
    }
}

export async function existsByActionType(actionType){
    try{
        if(!isPermissionActionTypeValid.includes(actionType?.toUpperCase())){
            throw new Error("Tip akcije "+actionType+" za dato odobrenje, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/exists/by-action-type`,{
            params:{
                actionType :(actionType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje tipa akicje "+actionType+" za dato odobrenje/permission");
    }
}

export async function existsByResourceType(resourceType){
    try{
        if(!isPermissionResourceTypeValid.includes(resourceType?.toUpperCase())){
            throw new Error("Tip-resursa "+resourceType+" za dato odobrenje, nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/permission/exists/by-resource-type`,{
            params:{
                resourceType:(resourceType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje tipa resursa "+resourceType+" za dato odobrenje/permission");
    }
}

export async function savePermission({resourceType,actionType}){
    try{
        if(!isPermissionActionTypeValid.includes(actionType?.toUpperCase()) || !isPermissionResourceTypeValid.includes(resourceType?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {resourceType,actionType};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/permission/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}