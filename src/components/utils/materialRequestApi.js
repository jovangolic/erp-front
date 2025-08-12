import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/materialRequests`;
const isMaterialRequestStatusValid = ["REQUESTED","APPROVED","ISSUED","REJECTED"];
const isUnitOfMeasureValid = ["KG","METER","PCS","LITER","BOX","PALLET"];

export async function createMaterialRequest({requestingWorkCenterId,materialId,quantity,requestDate,neededBy,status}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(requestingWorkCenterId) || requestingWorkCenterId == null ||
            isNaN(materialId) || materialId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
            !moment(requestDate,"YYYY-MM-DD",true).isValid() || !moment(neededBy,"YYYY-MM-DD",true).isValid() ||
            !isMaterialRequestStatusValid.includes(status?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {requestingWorkCenterId,materialId,quantity,requestDate,neededBy,status};
        const response = await api.post(url+`/create/new-materialRequest`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateMaterialRequest({id,requestingWorkCenterId,materialId,quantity,requestDate,neededBy,status,}){
    try{
        const parseQuantity = parseFloat(quantity);
        if( isNaN(id) || id == null ||
            isNaN(requestingWorkCenterId) || requestingWorkCenterId == null ||
            isNaN(materialId) || materialId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
            !moment(requestDate,"YYYY-MM-DD",true).isValid() || !moment(neededBy,"YYYY-MM-DD",true).isValid() ||
            !isMaterialRequestStatusValid.includes(status?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {requestingWorkCenterId,materialId,quantity,requestDate,neededBy,status};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteMaterialRequest(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id za material-request nije pronadjen");
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
        if(isNaN(id) || id == null){
            throw new Error("Dati id za material-request nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-request");
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
        handleApiError(error,"Greska prilikom trazenja svih material-request");
    }
}

export async function findByRequestingWorkCenter_NameContainingIgnoreCase(workCenterName){
    try{
        if(!workCenterName || typeof workCenterName !== "string" || workCenterName.trim() === ""){
            throw new Error("Dati naziv radnog centra za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-name`,{
            params:{
                workCenterName:workCenterName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv radnog centra za material-request");
    }
}

export async function findByRequestingWorkCenter_LocationContainingIgnoreCase(workCenterLocation){
    try{
        if(!workCenterLocation || typeof workCenterLocation !== "string" || workCenterLocation.trim() === ""){
            throw new Error("Data lokacija radnog centra za material-request, nije pronadjena");
        }
        const response = await api.get(url+`/work-center-location`,{
            params:{
                workCenterLocation:workCenterLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju radnog centra za material-request");
    }
}

export async function findByRequestingWorkCenter_Capacity(workCenterCapacity){
    try{
        const parseWorkCenterCapacity = parseFloat(workCenterCapacity);
        if(isNaN(parseWorkCenterCapacity) || parseWorkCenterCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity`,{
            params:{workCenterCapacity:parseWorkCenterCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra za material-request");
    }
}

export async function findByRequestingWorkCenter_CapacityGreaterThan(workCenterCapacity){
    try{
        const parseWorkCenterCapacity = parseFloat(workCenterCapacity);
        if(isNaN(parseWorkCenterCapacity) || parseWorkCenterCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra za material-request veci od, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-greater-than`,{
            params:{workCenterCapacity:parseWorkCenterCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra veci od, za material-request");
    }
}

export async function findByRequestingWorkCenter_CapacityLessThan(workCenterCapacity){
    try{
        const parseWorkCenterCapacity = parseFloat(workCenterCapacity);
        if(isNaN(parseWorkCenterCapacity) || parseWorkCenterCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra za material-request manji od, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-less-than`,{
            params:{workCenterCapacity:parseWorkCenterCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra manji od, za material-request");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati kapacitet za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet za material-request");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati kapacitet veci od za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-greater-than"`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od, za material-request");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati kapacitet manji od za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-less-than"`,{
            params:{
                quantity:parseQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od, za material-request");
    }
}

export async function findByMaterial_Id(materialId){
    try{
        if(isNaN(materialId) || materialId == null){
            throw new Error("Dati id materijala za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/material/${materialId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronaslii id materiala za material-request");
    }
}

export async function findByMaterial_CodeContainingIgnoreCase(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material-by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod za materijal");
    }
}

export async function findByMaterial_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv za materijal");
    }
}

export async function findByMaterial_Unit(unit){
    try{
        if(!isUnitOfMeasureValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere za materijal nije pronadjena");
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
            params:{currentStock:parseCurrentStock},
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu za materijal");
    }
}

export async function findByMaterial_CurrentStockLessThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala manja od, nije pronadjena");
        }
        const response = await api.get(url+`//material-current-stock-less-than`,{
            params:{currentStock:parseCurrentStock},
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu za materijal manji od");
    }
}

export async function findByMaterial_CurrentStockGreaterThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala veca od, nije pronadjena");
        }
        const response = await api.get(url+`//material-current-stock-greater-than`,{
            params:{currentStock:parseCurrentStock},
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu za materijal veci od");
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
        return response.data;
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
        return response.data;
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
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal manji od");
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

export async function findByRequestDate(requestDate){
    try{
        if(!moment(requestDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum zahteva za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/request-date`,{
            params:{
                requestDate:moment(requestDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum zahteva za material-request");
    }
}

export async function findByRequestDateBefore(requestDate){
    try{
        if(!moment(requestDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum zahteva posle, za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/request-date-before`,{
            params:{
                requestDate:moment(requestDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum zahteva posle za material-request");
    }
}

export async function findByRequestDateAfter(requestDate){
    try{
        if(!moment(requestDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum zahteva pre, za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/request-date-after`,{
            params:{
                requestDate:moment(requestDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum zahteva pre za material-request");
    }
}

export async function findByRequestDateBetween({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || 
            !moment(endDate,"YYYY-MM-DD",true).isValid()){
                throw new Error("Dati opseg datuma za material-request, nije pronadjen");
            }
        const response = await api.get(url+`/request-date-between`,{
            params:{
                statusbar:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma za material-request");
    }
}

export async function findByNeededBy(neededBy){
    try{
        if(!moment(neededBy,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum potrebe za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/needed-by`,{
            params:{
                neededBy:moment(neededBy).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum potrebe za material-request");
    }
}

export async function findByNeededByBefore(neededBy){
    try{
        if(!moment(neededBy,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum potrebe, pre, za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/needed-before`,{
            params:{
                neededBy:moment(neededBy).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum potrebe, pre, za material-request");
    }
}

export async function findByNeededByAfter(neededBy){
    try{
        if(!moment(neededBy,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum potrebe, posle, za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/needed-after`,{
            params:{
                neededBy:moment(neededBy).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum potrebe, posle, za material-request");
    }
}

export async function findByNeededByBetween({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || 
        !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum opsega potrebe za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/needed-between`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma potrebe za material-request");
    }
}