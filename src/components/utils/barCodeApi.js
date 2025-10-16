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
            goodsId == null || Number.isNaN(Number(goodsId)) || scannedById == null || Number.isNaN(Number(scannedById))
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
            id == null || Number.isNaN(Number(id)) ||
            !code || typeof code !== "string" || code.trim() === "" || 
            goodsId == null || isNaN(goodsId) || scannedById == null || Number.isNaN(Number(scannedById))
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
        if(id == null || Number.isNaN(Number(id)) ){
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
        if(id == null || Number.isNaN(Number(id)) ){
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
        if(goodsId == null || Number.isNaN(Number(goodsId))){
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
        if(scannedById == null || Number.isNaN(Number(scannedById))){
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
        const validDateFrom = moment.isMoment(from) || moment(from, "YYYY-MM-DDTHH:mm:ss", true).isValid();
        const validDateTo = moment.isMoment(to) || moment(to, "YYYY-MM-DDTHH:mm:ss", true).isValid();
        if(!validDateFrom || !validDateTo){
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
        if(Number.isNaN(Number(id)) || id == null){
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
        if(Number.isNaN(Number(id)) || id == null){
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
        if(Number.isNaN(Number(id)) || id == null){
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
        if(Number.isNaN(Number(id)) || id == null){
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
        if(Number.isNaN(Number(id)) || id == null || !isBarCodeStatusValid.includes(status?.toUpperCase())){
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
        const validDate = moment.isMoment(scannedAt) || moment(scannedAt, "YYYY-MM-DDTHH:mm:ss", true).isValid();
        if(!code || typeof code !== "string" || !validDate || Number.isNaN(Number(scannedById)) || scannedById == null ||
           Number.isNaN(Number(goodsId)) || goodsId == null || !isBarCodeStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
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
        if(Number.isNaN(Number(sourceId)) || sourceId == null){
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
        for(let i = 0; i < requests.length; i++){
            const req = requests[0];
            if (req.id == null || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if(req.code?.trim()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'code' je obavezan`);
            }
            const dateVal = moment.isMoment(req.scannedAt) || moment(req.scannedAt,"YYYY-MM-DDTHH:mm:ss",true).isValid();
            if(!dateVal){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'datum-vreme' skeniranja, je obavezan`);
            }
            if(req.scannedById == null || Number.isNaN(Number(req.scannedById))){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' korisnika je obavezan i mora biti broj`);
            }
            if(req.goodsId == null || Number.isNaN(Numner(req.goodsId))){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' robe je obavezan i mora biti broj`);
            }
            if(!isBarCodeStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' status je obavezan`);
            }
            if(typeof req.confirmBarCode !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' je obavezan`);
            }
        }
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
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