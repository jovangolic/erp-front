import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isUnitMeasureValid = ["KOM","KG","LITAR","METAR","M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isGoodsTypeValid = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];

export async function findByName(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Naziv robe "+name+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-name`,{
            params:{
                name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom pretrage po nazivu "+name+" robe");
    }
}

export async function findByBarCode(barCode){
    try{
        if(!barCode || typeof barCode !== "string" || barCode.trim() === ""){
            throw new Error("Dati barCode "+barCode+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-barCode`,{
            params:{
                barCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, " Greska prilikom trazenja bar-kodu "+barCode);
    }
}

export async function findByUnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-unitMeasure`,{
            params:{
                unitMeasure
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema jedinici mere "+unitMeasure);
    }
}

export async function findBySupplierType(supplierType){
    try{
        if(!isSupplierTypeValid.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip dobavljaca "+supplierType+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-supplierType`,{
            params:{
                supplierType:supplierType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema tipu "+supplierType+" dobavljaca");
    }
}

export async function findByStorageType(storageType){
    try{
        if(!isStorageTypeValid.includes(storageType?.toUpperCase())){
            throw new Error("Dati tip "+storageType+" skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-storageType`,{
            params:{
                storageType:storageType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema tipu "+storageType+" skladista");
    }
}

export async function findByGoodsType(goodsType){
    try{
        if(!isGoodsTypeValid.includes(goodsType?.toUpperCase())){
            throw new Error("Dati tip "+goodsType+" robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-goodsType`,{
            params:{
                goodsType:goodsType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema tipu "+goodsType+" robe");
    }
}

export async function findByStorageName(storageName){
    try{
        if(!storageName || typeof storageName !== "string" || storageName.trim() === ""){
            throw new Error("Dati naziv "+storageName+" skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-storageName`,{
            params:{
                storageName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "greska prilikom trazenja prema nazivu "+storageName+" skladista");
    }
}

export async function findBySupplyId(supplyId){
    try{
        if(!supplyId){
            throw new Error("Dati ID "+supplyId+" za dobavljaca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/supply/${supplyId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema id "+supplyId+" dobavljaca");
    }
}

export async function findByBarCodeAndGoodsType({barCode, goodsType}){
    try{
        if(!barCode || typeof barCode !== "string" || barCode.trim() === "" ||
            !isGoodsTypeValid.includes(goodsType?.toUpperCase())){
                throw new Error("Dati barCode "+barCode+" i tip robe "+goodsType+" nije pronadjen");
            }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-barCode-and-goodsType`,{
            params:{
                barCode,goodsType:goodsType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema bar-kodu "+barCode+" i tipu "+goodsType+" robe");
    }
}

export async function findByBarCodeAndStorageId({barCode, storageId}){
    try{
        if(!barCode || typeof barCode !== "string" || barCode.trim() === "" || storageId){
            throw new Error("Dati barCode "+barCode+" i ID "+storageId+" skladista nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-barCode-and-storageId`,{
            params:{
                barCode, storageId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazaenja prema bar-kodu "+barCode+" i id-iju "+storageId+" skladista");
    }
}

export async function findSingleByBarCode(barCode){
    try{
        if(!barCode || typeof barCode !== "string" || barCode.trim() === ""){
            throw new Error("Dati barCode "+barCode+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/goods/by-single-barCode`,{
            params:{
                barCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja prema jedinstvenom bar-kodu "+barCode);
    }
}

export const getGoodsByStorageId = async (storageId) => {
    try{
        if(!storageId){
            throw new Error("Dati ID "+storageId+" sa skladiste nije pronadjen");
        }
        const response = await api.get(`/goods/by-storage/${storageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error, "Trenutno nismo pronasloi id "+storageId+" skladista za robu");
    }
};


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}