import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const isGoodsTypeValid = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const url = `${import.meta.env.VITE_API_BASE_URL}/billOfMaterials`;

export async function createBillOfMaterial({parentProductId,componentId,quantity}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null ||
            isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {parentProductId,componentId,quantity};
        const response = await api.post(url+`/create/new-billOfMaterial`,requestBody,{
            Headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja bill-of-material");
    }
}

export async function updateBillOfMaterial({id,parentProductId,componentId,quantity}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(id == null || isNaN(id) ||
            isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null ||
            isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {parentProductId,componentId,quantity};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            Headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja bill-of-material");
    }
}

export async function deleteBillOfMaterial(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati ID za billOfMaterial nije pronadjen");
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
            throw new Error("Dati ID za billOfMaterial nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli billOfMaterial po datom id-iju");
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
        handleApiError(error,"Trenutno nismo pronasli date billOfMaterials");
    }
}

export async function findByParentProductId(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID za parent-product nije pronadjen");
        }
        const response = await api.get(url+`/by-parent/${parentProductId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trentuno nismo pornasli dati billOfMaterial po datom parent-product id-iju");
    }
}

export async function findByComponentId(componentId){
    try{
        if(isNaN(componentId) || componentId == null){
            throw new Error("Dati ID za komponentu, nije pronadjen");
        }
        const response = await api.get(url+`/by-component/${componentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu komponentu za bill-of-material");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od, nije pronadjena za bill-of-material");
        }
        const response = await api.get(url+`/quantity-greater-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od, za dati bill-of-material");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina, nije pronadjena za bill-of-material");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu, za dati bill-of-material");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od, nije pronadjena za bill-of-material");
        }
        const response = await api.get(url+`/quantity-less-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od, za dati bill-of-material");
    }
}

export async function filterBOMs({parentProductId, componentId, minQuantity, maxQuantity}){
    try{
        const parseMinQuantity = parseFloat(minQuantity);
        const parseMaxQuantity = parseFloat(maxQuantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null ||
            isNaN(parseMinQuantity) || parseMinQuantity <= 0 || isNaN(parseMaxQuantity) || parseMaxQuantity <= 0){
            throw new Error("Parametri za pretragu bill-of-material, ne daju rezultat");
        }
        const response = await api.get(url+`/filter-boms`,{
            params:{
                parentProductId : parentProductId,
                componentId : componentId,
                minQuantity : parseMinQuantity,
                maxQuantity : parseMaxQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli bill-of-material po datom filteru pretrazivanja");
    }
}

export async function findByParentProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po trenutnoj kolicini");
    }
}

export async function findByParentProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina manja od, za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po kolicini manjoj od");
    }
}

export async function findByParentProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina veca od, za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po kolicini vecoj od");
    }
}

export async function findByComponent_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina za komponent, nije pronadjena");
        }
        const response = await api.get(url+`/search/component-current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu za dati komponent");
    }
}

export async function findByComponent_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina manja od, za komponent, nije pronadjena");
        }
        const response = await api.get(url+`/search/component-current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od, za datu komponentu");
    }
}

export async function findByComponent_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina veca od, za komponent, nije pronadjena");
        }
        const response = await api.get(url+`/search/component-current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od, za datu komponentu");
    }
}

export async function findByParentProductIdAndQuantityGreaterThan({parentProductId, quantity}){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Dati id za parent-product i kolicinu vecu od, nije pronadjena");
        }
        const response = awaitapi.get(url+`/search/by-parent-and-quantity-greater-than`,{
            params:{
                parentProductId:parentProductId,
                quantity: parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za parent-product i kolicinu vecu od");
    }
}

export async function findByParentProductIdAndQuantityLessThan({parentProductId, quantity}){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Dati id za parent-product i kolicinu manju od, nije pronadjena");
        }
        const response = awaitapi.get(url+`/search/by-parent-and-quantity-less-than`,{
            params:{
                parentProductId:parentProductId,
                quantity: parseCurrentQuantity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za parent-product i kolicinu manju od");
    }
}

export async function findByParentProductIdAndComponentId({parentProductId, componentId}){
    try{
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null){
            throw new Error("Dati ID za parent-product i komponent, nisu pronadjeni");
        }
        const response = await api.get(url+`/parent-product/${parentProductId}/component/${componentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za parent-product i komponent");
    }
}

export async function existsByParentProductIdAndComponentId({parentProductId, componentId}){
    try{
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null){
            throw new Error("Dati ID za parent-product i komponent, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists-by-parent-component`,{
            params:{
                parentProductId:parentProductId,
                componentId:componentId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje datih id-ijeva za parent-product i komponent");
    }
}

export async function deleteByParentProductId(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID za parent-product, nije pronadjen");
        }
        const response = await api.delete(url+`/delete-parent/${parentProductId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja za parent-product");
    }
}

export async function findByParentProductIdOrderByQuantityDesc(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product-by-quantity-desc`,{
            params:{parentProductId:parentProductId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za product-parent po opadajucem poretku za kolicinu");
    }
}

export async function findByParentProductIdOrderByQuantityAsc(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product-by-quantity-asc`,{
            params:{parentProductId:parentProductId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za product-parent po rastucem poretku za kolicinu");
    }
}

export async function findByQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg za kolicinu, nije pronadjen");
        }
        const response = await api.get(url+`/quantity-between`,{
            params:{
                min:parseMin,
                max: parseMax
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg date kolicine");
    }
}

export async function findComponentsByProductIdAndComponentNameContaining({productId, name}){
    try{
        if(isNaN(productId) || productId == null ||
            !name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati id za parent-product i njegov naziv, nisu pronadjeni");
        }
        const response = await api.get(url+`/product/${productId}/components-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po id-iju i nazivu");
    }
}

export async function findByComponent_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv komponente, nije pronadjen");
        }
        const response = await api.get(url+`/search/component-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati naziv komponente");
    }
}

export async function findByParentProduct_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/search/parent-product-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati naziv za parent-product");
    }
}

export async function findByComponent_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip robe za komponent, nije pronadjen");
        }
        const response = await api.get(url+`/search/component-by-goods-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe za komponent");
    }
}

export async function findByComponent_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca za komponentu, nije pronadjen");
        }
        const response = await api.get(url+`/search/component-by-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca za datu komponentu");
    }
}

export async function findByParentProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-by-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere za dati parent-product");
    }
}

export async function findByComponent_Shelf_Id(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id za policu, nije pronadjen");
        }
        const response = await api.get(url+`/component/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id police za datu komponentu");
    }
}

export async function findByParentProduct_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati ID skladista, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista za parent-product");
    }
}

export async function findByParentProduct_Shelf_Id(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id za policu, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id police za dati parent-product");
    }
}

export async function findByComponent_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati ID skladista, nije pronadjen");
        }
        const response = await api.get(url+`/component/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista za dati komponent");
    }
}

export async function findByParentProduct_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip robe za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/search/parent-product-by-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip robe za parent-product");
    }
}

export async function findByParentProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/search/parent-product-by-supplier-type`,{
            params:{
                supplierType:(supplierType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip dobavljaca za parent-product");
    }
}

export async function findByComponent_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere za komponentu, nije pronadjena");
        }
        const response = await api.get(url+`/search/component-by-unit-measure`,{
            params:{
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere za datu komponentu");
    }
}

export async function findByParentProduct_Supply_Id(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id dobavljaca za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca za dati parent-product");
    }
}

export async function findByComponent_Supply_Id(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id dobavljaca za komponent, nije pronadjen");
        }
        const response = await api.get(url+`/component/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id dobavljaca za dati komponent");
    }
}

export async function findByComponent_StorageType(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista za komponentu, nije pronadjen");
        }
        const response = await api.get(url+`/search/component-by-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista za dati komponent");
    }
}

export async function findByParentProduct_StorageType(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip skladista za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/search/parent-product-by-storage-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip skladista za dati parent-product");
    }
}

export async function findByParentProduct_Storage_IdAndComponent_GoodsType({storageId, goodsType}){
    try{
        if(isNaN(storageId) || storageId == null || !isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati id skladista i tip robe, za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/storage/${storageId}/goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista i tip robe za parent-product");
    }
}

export async function findWhereParentAndComponentShareSameStorage(){
    try{
        const response = await api.get(url+`/search/parent-component-share-same-storage`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product i komponent, koji dele isto skladiste");
    }
}

export async function findByMinQuantityAndComponentGoodsType({minQuantity, goodsType}){
    try{
        const parseMinQuantity = parseFloat(minQuantity);
        if(parseMinQuantity <= 0 || isNaN(parseMinQuantity) || !isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Data minimalna kolicina i tip robe za komponentu, nije pronadjena");
        }
        const response = await api.get(url+`/search/min-quantity-component-goods-type`,{
            params:{
                minQuantity:parseMinQuantity,
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli minimalnu kolicini i tip robe za dati komponent");
    }
}

export async function findByComponentStorageAndUnitMeasure({storageId, unitMeasure}){
    try{
        if(isNaN(storageId) || storageId == null || !isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Dati id skladista i jedinica mere za komponentu, nije pronadjena");
        }
        const response = await api.get(url+`/search/by-component-storage-and-unit`,{
            params:{
                storageId:storageId,
                unitMeasure:(unitMeasure || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id skladista i jedinicu mere za datu komponentu");
    }
}

export async function findAllOrderByQuantityDesc(){
    try{
        const response = await api.get(url+`/search/quantity-desc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli svu kolicinu u opadajucem poretku");
    }
}

export async function findAllOrderByQuantityAsc(){
    try{
        const response = await api.get(url+`/search/quantity-asc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli svu kolicinu po rastucem poretku");
    }
}