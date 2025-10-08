import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const isBarCodeStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];
const isUnitMeasureValid = ["KOM", "KG", "LITAR", "METAR", "M2"];
const isSupplierTypeValid = ["RAW_MATERIAL","MANUFACTURER","WHOLESALER","DISTRIBUTOR","SERVICE_PROVIDER","AGRICULTURE","FOOD_PROCESSING","LOGISTICS","PACKAGING","MAINTENANCE"];
const isStorageTypeValid = ["PRODUCTION","DISTRIBUTION","YARD","SILO","COLD_STORAGE","OPEN","CLOSED","INTERIM","AVAILABLE"];
const isGoodsTypeValid = ["RAW_MATERIAL","SEMI_FINISHED_PRODUCT","FINISHED_PRODUCT","WRITE_OFS","CONSTRUCTION_MATERIAL","BULK_GOODS","PALLETIZED_GOODS"];
const url = `${import.meta.env.VITE_API_BASE_URL}/barCodes`

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export async function createBarCode({code,scannedById, goodsId}){
    try{
        if(
            !code || typeof code !== "string" || code.trim() === "" || 
            goodsId == null || isNaN(goodsId) || scannedById == null || isNaN(scannedById)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody={code, goodsId};
        const response = await api.post(url+`/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja bar-koda: ${error.message}`);
        }
    }
}

export async function updateBarCode({id,code, goodsId }){
    try{
        if(
            id == null || isNaN(id) ||
            !code || typeof code !== "string" || code.trim() === "" || 
            goodsId == null || isNaN(goodsId) || scannedById == null || isNaN(scannedById)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody={code, goodsId};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja bar-koda: ${error.message}`);
        }
    }
}

export async function deleteBarCode(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za barCode nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOneBarCode(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za barCode nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog bar-koda po "+id+" id-iju");
    }
}

export async function getAllBarCodes(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih bar-kodova");
    }
}

export async function getByCode(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati "+code+" code nije pronadjen");
        }
        const response = await api.get(url+`/get-by-code`,{
            params:{
                code
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pertrage po kodu "+code);
    }
}

export async function getByGoodsId(goodsId){
    try{
        if(goodsId == null || isNaN(goodsId)){
            throw new Error("ID "+goodsId+" za robu ne sme biti null");
        }
        const response = await api.get(url+`/goods/${goodsId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID "+goodsId+" robe");
    }
}

export async function findByGoods_Name(goodsName){
    try{
        if(!goodsName || typeof goodsName !== "string" || goodsName.trim() === ""){
            throw new Error("Dati naziv "+goodsName+" robe nije pronadjen");
        }
        const response = await api.get(url+`/by-goodsName`,{
            params:{goodsName:goodsName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu "+goodsName+" robe");
    }
}

export async function findByScannedBy_FirstNameContainingIgnoreCaseAndScannedBy_LastNameContainingIgnoreCase(userFirstName, userLastName){
    try{
        if(!userFirstName || typeof userFirstName !== "string" || userFirstName.trim=== "" ||
           !userLastName || typeof userLastName !== "string" || userLastName.trim() === "" 
        ){
            throw new Error("Dato ime "+userFirstName+" i prezime "+userLastName+" osobe koja je vrsila skeniranje nije pronadjeno");
        }
        const response = await api.get(url+`/scannedBy-first-last-name`,{
            params:{
                userFirstName:userFirstName,
                userLastName: userLastName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja imena "+userFirstName+" i prezimena "+userLastName+" osobe koje je vrsila skeniranje");
    }
}

export async function findByScannedBy_Id(scannedById){
    try{
        if(scannedById == null || isNaN(scannedById)){
            throw new Error("Dati ID "+scannedById+" za osobu koja je vrsila skeniranje nije pronadjen");
        }
        const response = await api.get(url+`/scannedBy/${scannedById}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID "+scannedById+" osobe koja je vrsila skeniranje");
    }
}

export async function getByScannedAtBetween({from, to}){
    try{
        if(!moment(from,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(to,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Opseg skeniranog datuma "+from+" - "+to+" nije validan");
        }
        const response = await api.get(url+`/get-by-date-between`,{
            params:{
                from:moment(from).format("YYYY-MM-DDTHH:mm:ss"),
                to:moment(to).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom skeniranja izmedju datuma "+from+" - "+to+" ");
    }
}

export async function trackBarCode(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" bar-kod za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" bar-kod za pracenje");
    }
}

export async function confirmBarCode(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu bar-koda, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
       handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu bar-koda");
    }
}

export async function closeBarCode(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje bar-koda, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
       handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje bar-koda");
    }
}

export async function cancelBarCode(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje bar-koda, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
       handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje bar-koda");
    }
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isBarCodeStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status bar-koda "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status bar-koda "+status);
    }
}

export async function saveBarCode({code,scannedAt,scannedById,goodsId,status,confirmed = false}){
    try{
        if(!code || typeof code !== "string" || !moment(scannedAt ,"YYYY-MM-DDTHH:mm:ss",true).isValid() || isNaN(scannedById) || scannedById == null ||
           isNaN(goodsId) || goodsId == null || !isBarCodeStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {code,scannedAt,scannedById,goodsId,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId, code}){
    try{
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" ne sme biti prazan");
        }
        const requestBody = {code};
        const response = await api.post(url+`/save-as`,requestBody,{headers:getHeader()});
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
            if (req.id == null || isNaN(req.id)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if(req.code?.trim()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'code' je obavezan`);
            }
            if(!moment(req.scannedAt,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'datum-vreme' skeniranja, je obavezan`);
            }
            if(req.scannedById == null || isNaN(req.scannedById)){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' korisnika je obavezan i mora biti broj`);
            }
            if(req.goodsId == null || isNaN(req.goodsId)){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' robe je obavezan i mora biti broj`);
            }
            if(!isBarCodeStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' status je obavezan`);
            }
            if(typeof req.confirmBarCode !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' je obavezan`);
            }
        });
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}

export async function generalSearch({id,idFrom,idTo,code,scannedAt,scannedAtBefore,scannedAtAfter,scannedAtStart,scannedAtEnd,userId, userIdFrom,userIdTo,
    firstName,lastName,goodsId,goodsIdFrom,goodsIdTo,goodsName,unitMeasure,supplierType,storageType,goodsType,storageId,storageIdFrom,storageIdTo,
    supplyId,supplyIdFrom,supplyIdTo,shelfId,shelfIdFrom,shelfIdTo,status,confirmed
}){
    try{
        if(isNaN(id) || id == null || isNaN(idFrom) || idFrom == null || isNaN(idTo) || idTo == null || !code || typeof code !== "string" || code.trim() === "" ||
           !moment(scannedAt,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(scannedAtAfter,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(scannedAtBefore,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !moment(scannedAtStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(scannedAtEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid() || isNaN(userId) || userId == null || 
           isNaN(userIdFrom) || userIdFrom == null || isNaN(userIdTo) || userIdTo == null || !firstName?.trim() || !lastName?.trim() || isNaN(goodsId) || goodsId == null ||
           isNaN(goodsIdFrom) || goodsIdFrom == null || isNaN(goodsIdTo) || goodsIdTo == null || !goodsName?.trim() || !isUnitMeasureValid.includes(unitMeasure?.toUpperCase()) ||
           !isSupplierTypeValid.includes(supplierType?.toUpperCase()) || !isStorageTypeValid.includes(storageType?.toUpperCase()) || !isGoodsTypeValid.includes(goodsType?.toUpperCase()) ||
           isNaN(storageId) || storageId == null || isNaN(storageIdFrom) || storageIdFrom == null || isNaN(storageIdTo) || storageIdTo == null || isNaN(supplyId) || supplyId == null ||
           isNaN(supplyIdFrom) || supplyIdFrom == null || isNaN(supplyIdTo) || supplyIdTo == null || isNaN(shelfId) || shelfId == null || isNaN(shelfIdFrom) || shelfIdFrom == null ||
           isNaN(shelfIdTo) || shelfIdTo == null || !isBarCodeStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Dati parametri za pretragu ne daju ocekivani rezultat");
        }
        const response = await api.post(url+`/general-search`,{
            params:{
                id:id,
                idFrom:idFrom,
                idTo:idTo,
                code:code,
                scannedAt:moment(scannedAt).format("YYYY-MM-DDTHH:mm:ss"),
                scannedAtBefore:moment(scannedAtBefore).format("YYYY-MM-DDTHH:mm:ss"),
                scannedAtAfter:moment(scannedAtAfter).format("YYYY-MM-DDTHH:mm:ss"),
                scannedAtStart:moment(scannedAtStart).format("YYYY-MM-DDTHH:mm:ss"),
                scannedAtEnd:moment(scannedAtEnd).format("YYYY-MM-DDTHH:mm:ss"),
                userId:userId,
                userIdFrom:userIdFrom,
                userIdTo:userIdTo,
                firstName:firstName,
                lastName:lastName,
                goodsId:goodsId,
                goodsIdFrom:goodsIdFrom,
                goodsIdTo:goodsIdTo,
                goodsName:goodsName,
                unitMeasure:(unitMeasure || "").toUpperCase(),
                supplierType:(supplierType || "").toUpperCase(),
                storageType:(storageType || "").toUpperCase(),
                goodsType:(goodsType || "").toUpperCase(),
                storageId:storageId,
                storageIdFrom:storageIdFrom,
                storageIdTo:storageIdTo,
                supplyId:supplyId,
                supplyIdFrom:supplyIdFrom,
                supplyIdTo:supplyIdTo,
                shelfId:shelfId,
                shelfIdFrom:shelfIdFrom,
                shelfIdTo:shelfIdTo,
                status:(status || "").toUpperCase(),
                confirmed:confirmed
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat pretrage po datim parametrima");
    }
}