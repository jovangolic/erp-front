import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/materialRequirements`;
const isMaterialRequestStatusValid = ["REQUESTED","APPROVED","ISSUED","REJECTED"];
const isProductionOrderStatusValid = ["PLANNED","IN_PROGRESS","COMPLETED","CANCELED"];
const isUnitOfMeasureValid = ["KG","METER","PCS","LITER","BOX","PALLET"];

export async function createMaterialRequirement({productionOrderId,materialId,requiredQuantity,availableQuantity,requirementDate,status}){
    try{
        const parseRequiredQuantity = parseFloat(requiredQuantity);
        const parseAvailableQuantity = parseFloat(availableQuantity);
        if(isNaN(productionOrderId) || productionOrderId == null || isNaN(materialId) || materialId == null ||
            isNaN(parseRequiredQuantity) || parseRequiredQuantity <= 0 || isNaN(parseAvailableQuantity) || parseAvailableQuantity <= 0 ||
            !moment(requirementDate,"YYYY-MM-DD",true).isValid() || !isMaterialRequestStatusValid.includes(status?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {productionOrderId,materialId,requiredQuantity,availableQuantity,requirementDate,status};
        const response = await api.post(url+`/create/new-materialRequirement`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateMaterialRequirement({id,productionOrderId,materialId,requiredQuantity,availableQuantity,requirementDate,status}){
    try{
        const parseRequiredQuantity = parseFloat(requiredQuantity);
        const parseAvailableQuantity = parseFloat(availableQuantity);
        if( isNaN(id) || id == null ||
            isNaN(productionOrderId) || productionOrderId == null || isNaN(materialId) || materialId == null ||
            isNaN(parseRequiredQuantity) || parseRequiredQuantity <= 0 || isNaN(parseAvailableQuantity) || parseAvailableQuantity <= 0 ||
            !moment(requirementDate,"YYYY-MM-DD",true).isValid() || !isMaterialRequestStatusValid.includes(status?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {productionOrderId,materialId,requiredQuantity,availableQuantity,requirementDate,status};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteMaterialRequirement(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati ID za material-requirement, nije pronadjen");
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
            throw new Error("Dati id za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog material-requirement");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-add`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih material-requirements");
    }
}

export async function findByProductionOrder_Id(productionOrderId){
    try{
        if(isNaN(productionOrderId) || productionOrderId == null){
            throw new Error("Data proizvodna naredba za material-requirement, nije pronadjena");
        }
        const response = await api.get(url+`/productionOrder/${productionOrderId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenurtno nismo pronasli proizvodnu naredbu za material-requirement");
    }
}

export async function findByProductionOrder_OrderNumberContainingIgnoreCase(orderNumber){
    try{
        if(!orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === ""){
            throw new Error("Dati broj proizvodne naredbe za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/production-order-order-number`,{
            params:{
                orderNumber:orderNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj proizvodne naredbe za material-requirement");
    }
}

export async function findByProductionOrder_Product_Id(productId){
    try{
        if(isNaN(productId) || productId == null){
            throw new Error("Dati id za proizvod, nije pronadjen");
        }
        const response = await api.get(url+`/production-order/product/${productId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvodnu narednu za id proizvoda");
    }
}

export async function findByProductionOrder_QuantityPlanned(quantityPlanned){
    try{
        const parseQuantityPlanned = parseFloat(quantityPlanned);
        if(isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0){
            throw new Error("Data planirana kolicina za proizvodnu naredbu, nije pronadjena");
        }
        const response = await api.get(url+`/production-order-quantity-planned`,{
            params:{
                quantityPlanned:parseQuantityPlanned
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli planiranu kolicinu za proizvodnu naredbu");
    }
}

export async function findByProductionOrder_QuantityPlannedLessThan(quantityPlanned){
    try{
        const parseQuantityPlanned = parseFloat(quantityPlanned);
        if(isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0){
            throw new Error("Data planirana kolicina za proizvodnu naredbu manja od, nije pronadjena");
        }
        const response = await api.get(url+`/production-order-quantity-planned-less-than`,{
            params:{
                quantityPlanned:parseQuantityPlanned
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli planiranu kolicinu za proizvodnu naredbu, manju od");
    }
}

export async function findByProductionOrder_QuantityPlannedGreaterThan(quantityPlanned){
    try{
        const parseQuantityPlanned = parseFloat(quantityPlanned);
        if(isNaN(parseQuantityPlanned) || parseQuantityPlanned <= 0){
            throw new Error("Data planirana kolicina za proizvodnu naredbu veca od, nije pronadjena");
        }
        const response = await api.get(url+`/production-order-quantity-planned-greater-than`,{
            params:{
                quantityPlanned:parseQuantityPlanned
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli planiranu kolicinu za proizvodnu naredbu, vecu od");
    }
}

export async function findByProductionOrder_QuantityProduced(quantityProduced){
    try{
        const parseQuantityProduced = parseFloat(quantityProduced);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data planirana kolicina za proizvodnu naredbu, nije pronadjena");
        }
        const response = await api.get(url+`/production-order-quantity-produced`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu za proizvodnu naredbu");
    }
}

export async function findByProductionOrder_QuantityProducedGreaterThan(quantityProduced){
    try{
        const parseQuantityProduced = parseFloat(quantityProduced);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data planirana kolicina za proizvodnu naredbu veca od, nije pronadjena");
        }
        const response = await api.get(url+`/production-order-quantity-produced-greater-than`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu za proizvodnu naredbu vecu od");
    }
}

export async function findByProductionOrder_QuantityProducedLessThan(quantityProduced){
    try{
        const parseQuantityProduced = parseFloat(quantityProduced);
        if(isNaN(parseQuantityProduced) || parseQuantityProduced <= 0){
            throw new Error("Data planirana kolicina za proizvodnu naredbu manja od, nije pronadjena");
        }
        const response = await api.get(url+`/production-order-quantity-produced-less-than`,{
            params:{
                quantityProduced:parseQuantityProduced
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli proizvedenu kolicinu za proizvodnu naredbu manju od");
    }
}

export async function findByProductionOrder_StartDate(startDate){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Pocetak datuma za proizvodnu naredbu, nije pronadjen");
        }
        const response = await api.get(url+`/production-order-startDate`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum pocetka za proizvodnu naredbu");
    }
}

export async function findByProductionOrder_EndDate(endDate){
    try{
        if(!moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum kraja za proizvodnu naredbu, nije pronadjen");
        }
        const response = await api.get(url+`/production-order-endDate`,{
            params:{
                endDate:moment(endDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum kraja za proizvodnu naredbu");
    }
}

export async function findByProductionOrder_Status(status){
    try{
        if(!isProductionOrderStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za proizvodnu naredbu, nije pronadjen");
        }
        const response = await api.get(url+`/production-order-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za proizvodnu naredbu");
    }
}

export async function findByProductionOrder_WorkCenter_Id(workCenterId){
    try{
        if(workCenterId == null || isNaN(workCenterId)){
            throw new Error("Dati id radnog centra za proizvodnu naredbu, nije pronadjen");
        }
        const response = await api.get(url+`/production-order/workCenter/${workCenterId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id radnog centra za proizvodnu naredbu");
    }
}

export async function findByMaterial_Id(materialId){
    try{
        if(isNaN(materialId) || materialId == null){
            throw new Error("Dati id materijala za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/material/${materialId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id materijala za material-requirement");
    }
}

export async function findByMaterial_CodeContainingIgnoreCase(materialCode){
    try{
        if(!materialCode || typeof materialCode !== "string" || materialCode.trim() === ""){
            throw new Error("Dati kod materijala za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/material-code`,{
            params:{materialCode:materialCode},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kod materijala, za material-requirement");
    }
}

export async function findByMaterial_NameContainingIgnoreCase(materialName){
    try{
        if(!materialName || typeof materialName !== "string" || materialName.trim() === ""){
            throw new Error("Dati naziv materijala za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/material-name`,{
            params:{materialName:materialName},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv materijala, za material-requirement");
    }
}

export async function findByMaterial_Unit(unit){
    try{
        if(!isUnitOfMeasureValid.includes(unit?.toUpperCase())){
            throw new Error("Data jedinica mere za materija, nije pronadjena");
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
            throw new Error("Trenutna kolicina materijala, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu materijala");
    }
}

export async function findByMaterial_CurrentStockLessThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna kolicina materijala manja od, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu materijala manju od");
    }
}

export async function findByMaterial_CurrentStockGreaterThan(currentStock){
    try{
        const parseCurrentStock = parseFloat(currentStock);
        if(isNaN(parseCurrentStock) || parseCurrentStock <= 0){
            throw new Error("Trenutna kolicina materijala veca od, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu materijala vecu od");
    }
}

export async function findByMaterial_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("ID skladista za materijal, nije pronadjen");
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

export async function findByStatus(status){
    try{
        if(!isMaterialRequestStatusValid.includes(status?.toUpperCase())){
            throw new Error("Dati status za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/material-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status za material-requirement");
    }
}

export async function findByRequiredQuantity(requiredQuantity){
    try{
        const parseRequiredQuantity = parseFloat(requiredQuantity);
        if(isNaN(parseRequiredQuantity) || parseRequiredQuantity <= 0){
            throw new Error("Trazena kolicina za material-requirement, nije pronadjena");
        }
        const response = await api.get(url+`/material-required-quantity`,{
            params:{
                requiredQuantity:parseRequiredQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trazenu kolicinu za material-requirement");
    }
}

export async function findByRequiredQuantityLessThan(requiredQuantity){
    try{
        const parseRequiredQuantity = parseFloat(requiredQuantity);
        if(isNaN(parseRequiredQuantity) || parseRequiredQuantity <= 0){
            throw new Error("Trazena kolicina za material-requirement manja od, nije pronadjena");
        }
        const response = await api.get(url+`/material-required-quantity-less-than`,{
            params:{
                requiredQuantity:parseRequiredQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trazenu kolicinu manju od, za material-requirement");
    }
}

export async function findByRequiredQuantityGreaterThan(requiredQuantity){
    try{
        const parseRequiredQuantity = parseFloat(requiredQuantity);
        if(isNaN(parseRequiredQuantity) || parseRequiredQuantity <= 0){
            throw new Error("Trazena kolicina za material-requirement veca od, nije pronadjena");
        }
        const response = await api.get(url+`/material-required-quantity-greater-than`,{
            params:{
                requiredQuantity:parseRequiredQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trazenu kolicinu vecu od, za material-requirement");
    }
}

export async function findByAvailableQuantity(availableQuantity){
    try{
        const parseAvailableQuantity = parseFloat(availableQuantity);
        if(isNaN(parseAvailableQuantity) || parseAvailableQuantity <= 0){
            throw new Error("Dostupna kolicina za material-requirement, nije pronadjena");
        }
        const response = await api.get(url+`/available-quantity`,{
            params:{
                availableQuantity:parseAvailableQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupnu kolicinu za material-requirement");
    }
}

export async function findByAvailableQuantityLessThan(availableQuantity){
    try{
        const parseAvailableQuantity = parseFloat(availableQuantity);
        if(isNaN(parseAvailableQuantity) || parseAvailableQuantity <= 0){
            throw new Error("Dostupna kolicina za material-requirement manja od, nije pronadjena");
        }
        const response = await api.get(url+`/available-quantity-less-than`,{
            params:{
                availableQuantity:parseAvailableQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupnu kolicinu manju od, za material-requirement");
    }
}

export async function findByAvailableQuantityGreaterThan(availableQuantity){
    try{
        const parseAvailableQuantity = parseFloat(availableQuantity);
        if(isNaN(parseAvailableQuantity) || parseAvailableQuantity <= 0){
            throw new Error("Dostupna kolicina za material-requirement veca od, nije pronadjena");
        }
        const response = await api.get(url+`/available-quantity-greater-than`,{
            params:{
                availableQuantity:parseAvailableQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dostupnu kolicinu vecu od, za material-requirement");
    }
}

export async function findByRequirementDate(requirementDate){
    try{
        if(!moment(requirementDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Obavezan datum za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/requirement-date`,{
            params:{
                requirementDate:moment(requirementDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli obavezan datum za material-requirement");
    }
}

export async function findByRequirementDateBetween({start,end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || 
           !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Opseg datuma za material-requirement, nije pronadjen");
           }
        const response = await api.get(url+`/requirement-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma za material-requirement");
    }
}

export async function findByRequirementDateGreaterThanEqual(requirementDate){
    try{
        if(!moment(requirementDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Obavezan datum, veci ili jednak za material-requirement, nije pronadjen");
        }
        const response = await api.get(url+`/requirement-date-greater-than-equal`,{
            params:{
                requirementDate:moment(requirementDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datuk koji je jedan ili veci, za material-requirement");
    }
}

export async function findByProductionOrder_OrderNumberContainingIgnoreCaseAndMaterial_CodeContainingIgnoreCase({orderNumber,materialCode}){
    try{
        if(!orderNumber || typeof orderNumber !== "string" || orderNumber.trim() === "" ||
           !materialCode || typeof materialCode !== "string" || materialCode.trim() === ""){
            throw new Error("Broj naredbe i kod materijala za proizvodnju, nije pronadjen");
           }
        const response = await api.get(url+`/production-order/order-number-and-material-code`,{
            params:{
                orderNumber:orderNumber,
                materialCode:materialCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj naredbe i kod materijala za production-order");
    }
}

export async function findWhereShortageIsGreaterThan(minShortage){
    try{
        const parseMinShortage = parseFloat(minShortage);
        if(isNaN(parseMinShortage) || parseMinShortage <= 0){
            throw new Error("Dati manjak veci od, nije pronadjen");
        }
        const response = await api.get(url+`/search-by-minShortage`,{
            params:{
                minShortage:parseMinShortage
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli stanje, gde je manjak veci od");
    }
}
