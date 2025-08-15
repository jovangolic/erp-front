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
            throw new Error("Dati id "+id+" za material-request nije pronadjen");
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
            throw new Error("Dati id "+id+" za material-request nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-request po "+id+" id-iju");
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
            throw new Error("Dati naziv "+workCenterName+" radnog centra za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv "+workCenterName+" radnog centra za material-request");
    }
}

export async function findByRequestingWorkCenter_LocationContainingIgnoreCase(workCenterLocation){
    try{
        if(!workCenterLocation || typeof workCenterLocation !== "string" || workCenterLocation.trim() === ""){
            throw new Error("Data lokacija "+workCenterLocation+" radnog centra za material-request, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+workCenterLocation+" radnog centra za material-request");
    }
}

export async function findByRequestingWorkCenter_Capacity(workCenterCapacity){
    try{
        const parseWorkCenterCapacity = parseFloat(workCenterCapacity);
        if(isNaN(parseWorkCenterCapacity) || parseWorkCenterCapacity <= 0){
            throw new Error("Dati kapacitet "+parseWorkCenterCapacity+" radnog centra za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity`,{
            params:{workCenterCapacity:parseWorkCenterCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+workCenterCapacity+" radnog centra za material-request");
    }
}

export async function findByRequestingWorkCenter_CapacityGreaterThan(workCenterCapacity){
    try{
        const parseWorkCenterCapacity = parseFloat(workCenterCapacity);
        if(isNaN(parseWorkCenterCapacity) || parseWorkCenterCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra za material-request veci od "+parseWorkCenterCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-greater-than`,{
            params:{workCenterCapacity:parseWorkCenterCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra veci od "+workCenterCapacity+", za material-request");
    }
}

export async function findByRequestingWorkCenter_CapacityLessThan(workCenterCapacity){
    try{
        const parseWorkCenterCapacity = parseFloat(workCenterCapacity);
        if(isNaN(parseWorkCenterCapacity) || parseWorkCenterCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra za material-request manji od "+parseWorkCenterCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-less-than`,{
            params:{workCenterCapacity:parseWorkCenterCapacity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra manji od "+workCenterCapacity+", za material-request");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati kapacitet "+parseQuantity+" za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+quantity+" za material-request");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati kapacitet veci od "+parseQuantity+" za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet veci od "+quantity+", za material-request");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Dati kapacitet manji od "+parseQuantity+" za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet manji od "+quantity+", za material-request");
    }
}

export async function findByMaterial_Id(materialId){
    try{
        if(isNaN(materialId) || materialId == null){
            throw new Error("Dati id "+materialId+" materijala za material-request, nije pronadjen");
        }
        const response = await api.get(url+`/material/${materialId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronaslii id "+materialId+" materiala za material-request");
    }
}

export async function findByMaterial_CodeContainingIgnoreCase(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material-by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod "+code+" za materijal");
    }
}

export async function findByMaterial_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za materijal, nije pronadjen");
        }
        const response = await api.get(url+`/material-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" za materijal");
    }
}

export async function findByMaterial_Unit(unit){
    try{
        if(!isUnitOfMeasureValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere "+unit+" za materijal nije pronadjena");
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
            throw new Error("Trenutna zaliha materijala "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`/material-current-stock`,{
            params:{currentStock:parseCurrentStock},
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu "+currentStock+" za materijal");
    }
}

export async function findByMaterial_CurrentStockLessThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala manja od "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`//material-current-stock-less-than`,{
            params:{currentStock:parseCurrentStock},
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu za materijal manji od "+currentStock);
    }
}

export async function findByMaterial_CurrentStockGreaterThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna zaliha materijala veca od "+parseCurrentStock+", nije pronadjena");
        }
        const response = await api.get(url+`//material-current-stock-greater-than`,{
            params:{currentStock:parseCurrentStock},
            headers:getHeader()
        });
        return responses.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu zalihu za materijal veci od "+currentStock);
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
        return response.data;
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
        return response.data;
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
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli reorder-level za materijal manji od "+reorderLevel);
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

export async function findByRequestDate(requestDate){
    try{
        if(!moment(requestDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum "+requestDate+" zahteva za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum zahteva "+requestDate+" za material-request");
    }
}

export async function findByRequestDateBefore(requestDate){
    try{
        if(!moment(requestDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum zahteva posle "+requestDate+", za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum zahteva posle "+requestDate+" za material-request");
    }
}

export async function findByRequestDateAfter(requestDate){
    try{
        if(!moment(requestDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum zahteva pre "+requestDate+", za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum zahteva pre "+requestDate+" za material-request");
    }
}

export async function findByRequestDateBetween({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || 
            !moment(endDate,"YYYY-MM-DD",true).isValid()){
                throw new Error("Dati opseg datuma "+startDate+" - "+endDate+" za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli opseg "+startDate+" - "+endDate+" datuma za material-request");
    }
}

export async function findByNeededBy(neededBy){
    try{
        if(!moment(neededBy,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum potrebe "+neededBy+" za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum potrebe "+neededBy+" za material-request");
    }
}

export async function findByNeededByBefore(neededBy){
    try{
        if(!moment(neededBy,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum potrebe, pre "+neededBy+", za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum potrebe, pre "+neededBy+", za material-request");
    }
}

export async function findByNeededByAfter(neededBy){
    try{
        if(!moment(neededBy,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum potrebe, posle "+neededBy+", za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli datum potrebe, posle "+neededBy+", za material-request");
    }
}

export async function findByNeededByBetween({startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || 
        !moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum opsega potrebe "+startDate+" - "+endDate+" za material-request, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+startDate+" - "+endDate+" potrebe za material-request");
    }
}