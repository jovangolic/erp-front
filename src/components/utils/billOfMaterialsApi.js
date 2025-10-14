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
const isBillOfMaterialsStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];
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
            throw new Error("Dati ID "+id+" za billOfMaterial nije pronadjen");
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
            throw new Error("Dati ID "+id+" za billOfMaterial nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli billOfMaterial po datom "+id+" id-iju");
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
            throw new Error("Dati ID "+parentProductId+" za parent-product nije pronadjen");
        }
        const response = await api.get(url+`/by-parent/${parentProductId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trentuno nismo pornasli dati billOfMaterial po datom parent-product "+parentProductId+" id-iju");
    }
}

export async function findByComponentId(componentId){
    try{
        if(isNaN(componentId) || componentId == null){
            throw new Error("Dati ID "+componentId+" za komponentu, nije pronadjen");
        }
        const response = await api.get(url+`/by-component/${componentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datu komponentu "+componentId+" za bill-of-material");
    }
}

export async function findByQuantityGreaterThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseQuantity+", nije pronadjena za bill-of-material");
        }
        const response = await api.get(url+`/quantity-greater-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od "+quantity+", za dati bill-of-material");
    }
}

export async function findByQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina "+parseQuantity+", nije pronadjena za bill-of-material");
        }
        const response = await api.get(url+`/by-quantity`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu "+quantity+", za dati bill-of-material");
    }
}

export async function findByQuantityLessThan(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseQuantity+", nije pronadjena za bill-of-material");
        }
        const response = await api.get(url+`/quantity-less-than`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od "+quantity+", za dati bill-of-material");
    }
}

export async function filterBOMs({parentProductId, componentId, minQuantity, maxQuantity}){
    try{
        const parseMinQuantity = parseFloat(minQuantity);
        const parseMaxQuantity = parseFloat(maxQuantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null ||
            isNaN(parseMinQuantity) || parseMinQuantity <= 0 || isNaN(parseMaxQuantity) || parseMaxQuantity <= 0){
            throw new Error("Parametri za pretragu bill-of-material,: "+parentProductId+" ,"+componentId+" ,"+parseMinQuantity+" ,"+parseMaxQuantity+" ne daju rezultat");
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
        handleApiError(error,"Trenutno nismo pronasli bill-of-material: "+parentProductId+" ,"+componentId+" ,"+minQuantity+" ,"+maxQuantity+" po datom filteru pretrazivanja");
    }
}

export async function findByParentProduct_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina "+parseCurrentQuantity+" za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product "+currentQuantity+" po trenutnoj kolicini");
    }
}

export async function findByParentProduct_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseCurrentQuantity+", za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po kolicini manjoj od "+currentQuantity);
    }
}

export async function findByParentProduct_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseCurrentQuantity+", za parent-product, nije pronadjena");
        }
        const response = await api.get(url+`/search/parent-product-current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po kolicini vecoj od "+currentQuantity);
    }
}

export async function findByComponent_CurrentQuantity(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data trenutna kolicina za komponent "+parseCurrentQuantity+", nije pronadjena");
        }
        const response = await api.get(url+`/search/component-current-quantity`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli trenutnu kolicinu "+currentQuantity+" za dati komponent");
    }
}

export async function findByComponent_CurrentQuantityLessThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina manja od "+parseCurrentQuantity+", za komponent, nije pronadjena");
        }
        const response = await api.get(url+`/search/component-current-quantity-less-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu manju od "+currentQuantity+", za datu komponentu");
    }
}

export async function findByComponent_CurrentQuantityGreaterThan(currentQuantity){
    try{
        const parseCurrentQuantity = parseFloat(currentQuantity);
        if(isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Data kolicina veca od "+parseCurrentQuantity+", za komponent, nije pronadjena");
        }
        const response = await api.get(url+`/search/component-current-quantity-greater-than`,{
            params:{currentQuantity:parseCurrentQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kolicinu vecu od "+currentQuantity+", za datu komponentu");
    }
}

export async function findByParentProductIdAndQuantityGreaterThan({parentProductId, quantity}){
    try{
        const parseCurrentQuantity = parseFloat(quantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Dati id "+parentProductId+" za parent-product i kolicinu vecu od "+parseCurrentQuantity+", nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli id "+parentProductId+" za parent-product i kolicinu vecu od "+quantity);
    }
}

export async function findByParentProductIdAndQuantityLessThan({parentProductId, quantity}){
    try{
        const parseCurrentQuantity = parseFloat(quantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(parseCurrentQuantity) || parseCurrentQuantity <= 0){
            throw new Error("Dati id  "+parentProductId+"za parent-product i kolicinu manju od "+parseCurrentQuantity+", nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli id "+parentProductId+" za parent-product i kolicinu manju od "+quantity);
    }
}

export async function findByParentProductIdAndComponentId({parentProductId, componentId}){
    try{
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null){
            throw new Error("Dati ID "+parentProductId+" za parent-product i komponent "+componentId+", nisu pronadjeni");
        }
        const response = await api.get(url+`/parent-product/${parentProductId}/component/${componentId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+parentProductId+" za parent-product i komponent "+componentId);
    }
}

export async function existsByParentProductIdAndComponentId({parentProductId, componentId}){
    try{
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null){
            throw new Error("Dati ID "+parentProductId+" za parent-product i komponent "+componentId+", nisu pronadjeni");
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
        handleApiError(error,"Trenutno nismo pronasli postojanje datih id-ijeva za parent-product "+parentProductId+" i komponent "+componentId);
    }
}

export async function deleteByParentProductId(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID "+parentProductId+" za parent-product, nije pronadjen");
        }
        const response = await api.delete(url+`/delete-parent/${parentProductId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja za parent-product "+parentProductId);
    }
}

export async function findByParentProductIdOrderByQuantityDesc(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID "+parentProductId+" za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product-by-quantity-desc`,{
            params:{parentProductId:parentProductId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+parentProductId+" za product-parent po opadajucem poretku za kolicinu");
    }
}

export async function findByParentProductIdOrderByQuantityAsc(parentProductId){
    try{
        if(isNaN(parentProductId) || parentProductId == null){
            throw new Error("Dati ID "+parentProductId+" za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product-by-quantity-asc`,{
            params:{parentProductId:parentProductId},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+parentProductId+" za product-parent po rastucem poretku za kolicinu");
    }
}

export async function findByQuantityBetween({min, max}){
    try{
        const parseMin = parseFloat(min);
        const parseMax = parseFloat(max);
        if(isNaN(parseMin) || parseMin <= 0 || isNaN(parseMax) || parseMax <= 0){
            throw new Error("Dati opseg "+min+" - "+max+" za kolicinu, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli opseg "+min+" - "+max+" date kolicine");
    }
}

export async function findComponentsByProductIdAndComponentNameContaining({productId, name}){
    try{
        if(isNaN(productId) || productId == null ||
            !name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati id "+productId+" za parent-product i njegov naziv "+name+", nisu pronadjeni");
        }
        const response = await api.get(url+`/product/${productId}/components-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli parent-product po "+productId+" id-iju i nazivu "+name);
    }
}

export async function findByComponent_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" komponente, nije pronadjen");
        }
        const response = await api.get(url+`/search/component-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati naziv "+name+" komponente");
    }
}

export async function findByParentProduct_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/search/parent-product-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati naziv "+name+" za parent-product");
    }
}

export async function findByComponent_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe za komponent, nije pronadjen");
        }
        const response = await api.get(url+`/search/component-by-goods-type`,{
            params:{
                goodsType:(goodsType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+goodsType+" robe za komponent");
    }
}

export async function findByComponent_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" dobavljaca za komponentu, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+supplierType+" dobavljaca za datu komponentu");
    }
}

export async function findByParentProduct_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" za parent-product, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" za dati parent-product");
    }
}

export async function findByComponent_Shelf_Id(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id  "+shelfId+"za policu, nije pronadjen");
        }
        const response = await api.get(url+`/component/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police za datu komponentu");
    }
}

export async function findByParentProduct_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati ID "+storageId+" skladista, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista za parent-product");
    }
}

export async function findByParentProduct_Shelf_Id(shelfId){
    try{
        if(isNaN(shelfId) || shelfId == null){
            throw new Error("Dati id "+shelfId+" za policu, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/shelf/${shelfId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+shelfId+" police za dati parent-product");
    }
}

export async function findByComponent_Storage_Id(storageId){
    try{
        if(isNaN(storageId) || storageId == null){
            throw new Error("Dati ID "+storageId+" skladista, nije pronadjen");
        }
        const response = await api.get(url+`/component/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista za dati komponent");
    }
}

export async function findByParentProduct_GoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe za parent-product, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+goodsType+" robe za parent-product");
    }
}

export async function findByParentProduct_SupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" dobavljaca za parent-product, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+supplierType+" dobavljaca za parent-product");
    }
}

export async function findByComponent_UnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" za komponentu, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli jedinicu mere "+unitMeasure+" za datu komponentu");
    }
}

export async function findByParentProduct_Supply_Id(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id "+supplyId+" dobavljaca za parent-product, nije pronadjen");
        }
        const response = await api.get(url+`/parent-product/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za dati parent-product");
    }
}

export async function findByComponent_Supply_Id(supplyId){
    try{
        if(isNaN(supplyId) || supplyId == null){
            throw new Error("Dati id "+supplyId+" dobavljaca za komponent, nije pronadjen");
        }
        const response = await api.get(url+`/component/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+supplyId+" dobavljaca za dati komponent");
    }
}

export async function findByComponent_StorageType(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista za komponentu, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista za dati komponent");
    }
}

export async function findByParentProduct_StorageType(type){
    try{
        if(!isStorageTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip "+type+" skladista za parent-product, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" skladista za dati parent-product");
    }
}

export async function findByParentProduct_Storage_IdAndComponent_GoodsType({storageId, goodsType}){
    try{
        if(isNaN(storageId) || storageId == null || !isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati id "+storageId+" skladista i tip "+goodsType+" robe, za parent-product, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista i tip "+goodsType+" robe za parent-product");
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
            throw new Error("Data minimalna "+parseMinQuantity+" kolicina i tip "+goodsType+" robe za komponentu, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli minimalnu "+minQuantity+" kolicinu i tip "+goodsType+" robe za dati komponent");
    }
}

export async function findByComponentStorageAndUnitMeasure({storageId, unitMeasure}){
    try{
        if(isNaN(storageId) || storageId == null || !isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Dati id "+storageId+" skladista i jedinica mere "+unitMeasure+" za komponentu, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli id "+storageId+" skladista i jedinicu mere "+unitMeasure+" za datu komponentu");
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

export async function trackParentProduct(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" parent-product za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track-parent-product/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" parent-product za pracenje");
    }
}

export async function trackComponent(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" component za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track-component/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" component za pracenje");
    }
}

export async function confirmBOM(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu bom, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu bom");
    }
}

export async function cancelBOM(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje bom, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje bom");
    }
}

export async function closeBOM(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje bom, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje bom");
    }
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isBillOfMaterialsStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status bom "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status bom "+status);
    }
}

export async function saveBOM({parentProductId,componentId,quantity,status,confirmed = false}){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parentProductId) || parentProductId == null || isNaN(componentId) || componentId == null || isNaN(parseQuantity) || parseQuantity <= 0 ||
           !isBillOfMaterialsStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {parentProductId,componentId,quantity,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,newParentProductId,newParentProductName,newComponentId,newComponentName,quantity,confirmed = false, status}){
    try{
        if(sourceId === undefined || sourceId == null || Number.isNaN(Number(sourceId))){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Kolicina "+parseQuantity+" mora biti broj");
        }
        if(isNaN(newParentProductId) || newParentProductId == null || isNaN(newComponentId) || newComponentId == null){
            throw new Error("ID za parent "+newParentProductId+ " i ID za komponentu"+newComponentId+" mora biti ceo broj");
        }
        if(!newComponentName?.trim() || !newParentProductName?.trim()){
            throw new Error("Novi naziv proizvoda "+newParentProductName+" i novi naziv komponente "+newComponentName+" moraju biti uneti");
        }
        if(!isBillOfMaterialsStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" treba izabrati");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrdu "+confirmed+" treba izabrata");
        }
        const requestBody = {newParentProductId,newParentProductName,newComponentId,newComponentName,quantity,confirmed, status};
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        requests.forEach((req, index) => {
            if (req.id == null || req.id === undefined || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            const parseQuantity = parseFloat(req.quantity);
            if(isNaN(parseQuantity) || parseQuantity <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'kolicina' mora biti broj`);
            }
            if(req.parentProductId == null || req.parentProductId === undefined || Number.isNaN(Number(req.parentProductId))){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'parent-product-id' je obavezan i mora biti broj`);
            }
            if(req.componentId == null || req.componentId === undefined || Number.isNaN(Number(req.componentId))){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'component-id' je obavezan i mora biti broj`);
            }
            if(!isBillOfMaterialsStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' je obavezan `);
            }
            if(typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' je obavezan `);
            }
        });
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/sava-all");
    }
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
}

export async function generalSearch(filters = {}){
    try{
        const cleanedFilters = cleanFilters(filters);
        const response = await api.post(url+`/general-search`,cleanedFilters,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom generalne pretrage");
    }
}