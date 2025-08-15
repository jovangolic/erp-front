import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment, { max } from "moment";

const isSupplierTypeValidated = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isStorageTypeValidated = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isGoodsTypeValidated = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
	
export async function createRawMaterial({name, unitMeasure, supplierType, storageType, goodsType, storageId, supplyId, currentQuantity, productId, barCodes}){
    try{
        if(
            !nama || typeof name !=="string" || name.trim()==="" ||
            !isSupplierTypeValidated.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType?.toUpperCase()) ||
            !storageId || !supplyId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !productId || !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId,supplyId, currentQuantity,productId, barCodes};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/create/new-rawMaterial`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja sirovine: " + error.message);
        }
    }
}

export async function updateRawMaterial({id, name, unitMeasure, supplierType, storageType, goodsType, storageId, supplyId, currentQuantity, productId, barCodes}){
    try{
        if(
            id = null || isNaN(id) ||
            !nama || typeof name !=="string" || name.trim()==="" ||
            !isSupplierTypeValidated.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType?.toUpperCase()) ||
            !storageId || !supplyId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !productId || !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId,supplyId, currentQuantity,productId, barCodes};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranja sirovine: " + error.message);
        }
    }
}

export async function deleteRawMaterial(id){
    try{
        if(id = null || isNaN(id)){
            throw new Error("Dati rawMaterial ID "+id+" nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOneRawMaterial(id){
    try{
        if(id = null || isNaN(id)){
            throw new Error("Dati rawMaterial ID "+id+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jedne sirovine po "+id+" po id-iju");
    }
}

export async function findAllRawMaterials(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/get-all-raw-materials`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prikazivanja svih sirovina");
    }
}

export async function findByName(name){
    try{
        if(!name || typeof name !=="string" || name.trim() === ""){
            throw new Error("Naziv "+name+" sirovene nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/find-by-material-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po nazivu "+name);
    }
}

export async function filterRawMaterials(shelfId, minQty, maxQty, productId){
    try{
        const parseMinQty = parseFloat(minQty);
        const parseMaxQty = parseFloat(maxQty);
        if(shelfId == null || isNaN(shelfId) || productId == null || isNaN(productId) ||
            isNaN(parseMinQty) || parseMinQty < 0 || isNaN(parseMaxQty) || parseMaxQty <= 0){
            throw new Error("Dati filter parametri: "+shelfId+" ,"+parseMinQty+" , "+parseMaxQty+" , "+productId+" ne daju ocekivani rezultat");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/filter`,{
            params:{
                shelfId:shelfId, productId:productId,
                minQty:parseMinQty, maxQty: parseMaxQty
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom filtriranja po ID-iju "+shelfId+" za policu i proizvod "+productId+" kao i po min "+minQty+" - "+maxQty+" max kolicini");
    }
}

export async function findByCurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina "+parseCurrentQuantity+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po trenutnoj kolicini "+currentQuantity);
    }
}

export async function findByCurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina manja od "+parseCurrentQuantity+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po trenutnoj kolicini manjoj od "+currentQuantity);
    }
}

export async function findByCurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina veca od "+parseCurrentQuantity+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po trenutnoj kolicini vecoj od "+currentQuantity);
    }
}

export async function findByProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina "+parseCurrentQuantity+" za proizvod nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/product/current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po trenutnoj kolicini "+currentQuantity+" proizvoda");
    }
}

export async function findByProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseCurrentQuantity+" za proizvod nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/product/current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po trenutnoj kolicini proizvoda vecoj od "+currentQuantity);
    }
}

export async function findByProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseCurrentQuantity+" za proizvod nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/product/current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Grska prilikom trazenja po trenutnoj kolicini proizvoda manjoj od "+currentQuantity);
    }
}

export async function findByShelf_Id(shelfId){
    try{
        if(shelfId == null || isNaN(shelfId)){
            throw new Error("Dati ID "+shelfId+" za policu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+shelfId+" ID-iju za policu");
    }
}

export async function countByShelf_RowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(parseRowCount <= 0 || isNaN(parseRowCount)){
            throw new Error("Dati red "+parseRowCount+" za policu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/count/shelf/rows`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+rowCount+" redu police za sirovinu");
    }
}

export async function countByShelf_Cols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(parseCols <= 0 || isNaN(parseCols)){
            throw new Error("Data kolona "+parseCols+" za policu nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/count/shelf/cols`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po koloni "+cols+" police za sirovinu");
    }
}

export async function findByShelfAndExactQuantity(shelfId, quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(shelfId == null || isNaN(shelfId) || parseQuantity <= 0 || isNaN(parseQuantity)){
            throw new Error("Dati ID "+shelfId+" za policu i kolicinu "+parseQuantity+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/shelf/${shelfId}/quantity-equal`,{
            params:{shelfId:shelfId, quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+shelfId+" polici i tacnoj kolicini "+quantity);
    }
}

export async function findByShelfAndQuantityGreaterThan(shelfId, quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(shelfId == null || isNaN(shelfId) || parseQuantity <= 0 || isNaN(parseQuantity)){
            throw new Error("Dati ID "+shelfId+" za policu i kolicinu vecu od "+parseQuantity+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/shelf/${shelfId}/quantity-greater-than`,{
            params:{shelfId:shelfId, quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+shelfId+" polici i kolicini vecoj od "+quantity);
    }
}

export async function findByShelfAndQuantityLessThan(shelfId, quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(shelfId == null || isNaN(shelfId) || parseQuantity <= 0 || isNaN(parseQuantity)){
            throw new Error("Dati ID "+shelfId+" za policu i kolicinu manju od "+parseQuantity+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/shelf/${shelfId}/quantity-less-than`,{
            params:{shelfId:shelfId, quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po "+shelfId+" polici i kolicini manjoj od "+quantity);
    }
}

export async function findByShelf_IdAndCurrentQuantityGreaterThan(shelfId, quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(shelfId == null || isNaN(shelfId) || parseQuantity <= 0 || isNaN(parseQuantity)){
            throw new Error("Dati ID "+shelfId+" za policu i kolicinu vecu od "+parseQuantity+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/shelf/${shelfId}/current-quantity-greater-than`,{
            params:{shelfId:shelfId, quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID-iju "+shelfId+" police i kolicine vece od "+quantity);
    }
}

export async function findByShelf_IdAndCurrentQuantityLessThan(shelfId, quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(shelfId == null || isNaN(shelfId) || parseQuantity <= 0 || isNaN(parseQuantity)){
            throw new Error("Dati ID "+shelfId+" za policu i kolicinu manju od "+parseQuantity+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/shelf/${shelfId}/current-quantity-less-than`,{
            params:{shelfId:shelfId, quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja "+shelfId+" ID-iju police i kolicine manje od "+quantity);
    }
}

export async function findBySupplierType(supplierType){
    try{
        if(!isSupplierTypeValidated.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" nabavke nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/supplierType`,{
            params:{supplierType:(supplierType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu "+supplierType+" nabavke");
    }
}

export async function findByStorageType(storageType){
    try{
        if(!isStorageTypeValidated.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/storageType`,{
            params:{storageType:(storageType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu "+storageType+" skladista");
    }
}

export async function findByGoodsType(goodsType){
    try{
        if(!isGoodsTypeValidated.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/goodsType`,{
            params:{goodsType:(goodsType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po tipu "+goodsType+" robe");
    }
}

export async function findByUnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/rawMaterials/unitMeasure`,{
            params:{unitMeasure:(unitMeasure || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko trazenja po jedinici mere "+unitMeasure);
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}