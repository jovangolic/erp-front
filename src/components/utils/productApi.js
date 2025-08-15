 import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isSupplierTypeValidated = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isStorageTypeValidated = ["PRODUCTION","DISTRIBUTION","OPEN","CLOSED","INTERIM","AVAILABLE","SILO","YARD","COLD_STORAGE"];
const isGoodsTypeValidated = ["RAW_MATERIAL", "SEMI_FINISHED_PRODUCT", "FINISHED_PRODUCT", "WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];

export async function createProduct({name, unitMeasure,supplierType,storageType,goodsType,storageId, currentQuantity,barCodes}){
    try{
        if(
            !nama || typeof name !=="string" || name.trim()==="" ||
            !unitMeasure || typeof unitMeasure !=="string" ||unitMeasure.trim() === ""||
            !isSupplierTypeValidated.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType?.toUpperCase()) ||
            !storageId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti validirana i popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId, currentQuantity,barCodes};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/products/create/new-product`,requestBody,{
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom kreiranja proizvoda: " + error.message);
        }
    }
}

export async function updateProduct({id,name, unitMeasure,supplierType,storageType,goodsType,storageId, currentQuantity,barCodes}){
    try{
        if(
            id == null || isNaN(id) ||
            !nama || typeof name !=="string" || name.trim()==="" ||
            !unitMeasure || typeof unitMeasure !=="string" ||unitMeasure.trim() === ""||
            !isSupplierTypeValidated.includes(supplierType?.toUpperCase()) ||
            !isStorageTypeValidated.includes(storageType?.toUpperCase()) ||
            !isGoodsTypeValidated.includes(goodsType?.toUpperCase()) ||
            !storageId || isNaN(currentQuantity) || parseInt(currentQuantity) <= 0 ||
            !Array.isArray(barCodes) || barCodes.length === 0
        ){
            throw new Error("Sva polja moraju biti validirana i popunjena");
        }
        const requestBody = {name, unitMeasure,supplierType:supplierType.toUpperCase(),storageType:storageType.toUpperCase(),
            goodsType: goodsType.toUpperCase(),storageId, currentQuantity,barCodes};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/products/update/${id}`,requestBody,{
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greška prilikom azuriranja proizvoda: " + error.message);
        }
    }
}

export async function deleteProduct(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Proizvod sa datim "+id+" ID-om nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/products/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOneProduct(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Proizvod sa datim "+id+" ID-om nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja jednog proizvoda po "+id+" id-iju");
    }
}

export async function getAllProducts(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih proizvoda");
    }
}

export async function findByBarCode(barCode){
    try{
        if(!barCode || typeof barCode !== "string" || barCode.trim()=== ""){
            throw new Error("BarCode "+barCode+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-barCode`,{
            params:{
                barCode
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja proizvoda po bar-kodu "+barCode);
    }
}

export async function findByCurrentQuantityLessThan(quantity){
    try{
        if(isNaN(quantity) || parseFloat(quantity) <= 0){
            throw new Error("Data kolicina "+quantity+" za proizvod, nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-quantity`,{
            params:{
                quantity:parseFloat(quantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja proizvoda po kolicini "+quantity);
    }
}

export async function findByName(name){
    try{
        if(!nama || typeof name !=="string" || name.trim()===""){
            throw new Error("Naziv "+name+" proizvoda nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-name`,{
            params:{
                name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja proizvoda po nazivu "+name);
    }
}

export async function findByStorageId(storageId){
    try{
        if(!storageId){
            throw new Error("Dati storageId "+storageId+"  za proizvod, ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja proizvoda po "+storageId+" id-ju skladista");
    }
}

export async function findBySupplierType(supplierType){
    try{
        if(!isSupplierTypeValidated.includes(supplierType?.toUpperCase())){
            throw new Error("Dati tip "+supplierType+" dobavljaca za proizvod, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-supplier-type`,{
            params:{
                supplierType:supplierType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja proizvoda po tipu "+supplierType+" dobavljaca");
    }
}

export async function findByStorageType(storageType){
    try{
        if(!isStorageTypeValidated.includes(storageType?.toUpperCase())){
            throw new Error("Tip "+storageType+" skladista nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-storage-type`,{
            params:{
                storageType:storageType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error ,"Greska prilikom trazenja proizvoda po tipu "+storageType+" skladista");
    }
}

export async function findByGoodsType(goodsType){
    try{
        if(!isGoodsTypeValidated.includes(goodsType?.toUpperCase())){
            throw new Error("Tip "+goodsType+" robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/product-by-goods-type`,{
            params:{
                goodsType:goodsType.toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja proizvoda po tipu "+goodsType+" robe");
    }
}

export async function findByUnitMeasure(unitMeasure){
    try{
        if(!isUnitMeasureValid.includes(unitMeasure?.toUpperCase())){
            throw new Error("Data jedinica mere "+unitMeasure+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/by-unitMeasure`,{
            params:{unitMeasure:(unitMeasure || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po jedinici mere "+unitMeasure);
    }
}

export async function findByShelfRowColAndStorage(row, col, storageId){
    try{
        const parseRow = parseInt(row, 10);
        const parseCol = parseInt(col, 10);
        const parseStorageId = parseInt(storageId, 10);
        if(
            [parseRow, parseCol, parseStorageId].some(n => isNaN(n) || n <= 0)
        ){
            throw new Error("Dati red "+parseRow+",kolona "+parseCol+" i "+storageId+" ID za skladiste nisu prnadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/storage/${storageId}/shelf`,{
            params:{
                row:parseRow, col:parseCol, storageId:parseStorageId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po redu "+row+" i koloni "+col+" police i "+storageId+" ID-ju za to skladiste");
    }
}

export async function findByShelfRow(row){
    try{
        const parseRow = parseInt(row,10);
        if(isNaN(parseRow) || parseRow <= 0){
            throw new Error("Dati red "+parseRow+" za policu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/shelf/row`,{
            params:{row:parseRow},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po redu "+row+" u polici");
    }
}

export async function findByShelfColumn(col){
    try{
        const parseCol = parseInt(col,10);
        if(isNaN(parseCol) || parseCol <= 0){
            throw new Error("Data kolona "+parseCol+" za policu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/shelf/col`,{
            params:{col:parseCol},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po koloni "+col+" za policu");
    }
}

export async function findBySupplyMinQuantity(quantity){
    try{
        const parseQuantity = parseFloat(quantity);
        if(isNaN(parseQuantity) || parseQuantity <= 0){
            throw new Error("Data minimalna kolicina "+parseQuantity+" za dobavljaca nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/supply-min-quantity`,{
            params:{quantity:parseQuantity},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikon trazenja po minimalnoj kolicini "+quantity+" za dobavljaca");
    }
}

export async function findBySupplyUpdateRange(from, to){
    try{
        if(
            !moment(from,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(to,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati opseg "+from+" - "+to+" datuma za dobavljaca nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/supply/updated`,{
            params:{
                from:moment(from).format("YYYY-MM-DDTHH:mm:ss"),
                to:moment(to).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja dobavljaca po opsegu "+from+" - "+to+" datuma");
    }
}

export async function findBySupplyStorageId(storageId){
    try{
        if(storageId == null || isNaN(storageId)){
            throw new Error("Dati ID "+storageId+" za skaldiste nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/storage/${storageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja "+storageId+" ID-ija skladista za Supply");
    }
}

export async function countByShelfRowCount(rowCount){
    try{
        const parseRowCount = parseInt(rowCount,10);
        if(isNaN(parseRowCount) || parseRowCount <= 0){
            throw new Error("Dati broj redova "+parseRowCount+" za policu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/count/shelf/rows`,{
            params:{rowCount:parseRowCount},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju redova "+rowCount+" za policu");
    }
}

export async function countByShelfCols(cols){
    try{
        const parseCols = parseInt(cols,10);
        if(isNaN(parseCols) || parseCols <= 0){
            throw new Error("Dati broj kolona "+parseCols+" za policu nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/products/count/shelf/cols`,{
            params:{cols:parseCols},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju kolona "+cols+" za policu");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}