import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createBarCode({code,scannedById, goodsId}){
    try{
        if(
            !code || typeof code !== "string" || code.trim() === "" || 
            goodsId == null || isNaN(goodsId) || scannedById == null || isNaN(scannedById)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody={code, goodsId};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/barCodes/create`,requestBody,{
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
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/barCodes/update/${id}`,requestBody,{
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
            throw new Error("Dati ID za barCode nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/barCodes/delete/${id}`,{
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
            throw new Error("Dati ID za barCode nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog bar-koda");
    }
}

export async function getAllBarCodes(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/get-all`,{
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
            throw new Error("Dati code nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/get-by-code`,{
            params:{
                code
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pertrage po kodu");
    }
}

export async function getByGoodsId(goodsId){
    try{
        if(goodsId == null || isNaN(goodsId)){
            throw new Error("ID za robu ne sme biti null");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/goods/${goodsId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po ID robe");
    }
}

export async function findByGoods_Name(goodsName){
    try{
        if(!goodsName || typeof goodsName !== "string" || goodsName.trim() === ""){
            throw new Error("Dati naziv robe nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/by-goodsName`,{
            params:{goodsName:goodsName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po nazivu robe");
    }
}

export async function findByScannedBy_FirstNameContainingIgnoreCaseAndScannedBy_LastNameContainingIgnoreCase(userFirstName, userLastName){
    try{
        if(!userFirstName || typeof userFirstName !== "string" || userFirstName.trim=== "" ||
           !userLastName || typeof userLastName !== "string" || userLastName.trim() === "" 
        ){
            throw new Error("Dato ime i prezime osobe koja je vrsila skeniranje nije pronadjeno");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/scannedBy-first-last-name`,{
            params:{
                userFirstName:userFirstName,
                userLastName: userLastName
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja imena i prezimena osobe koje je vrsila skeniranje");
    }
}

export async function findByScannedBy_Id(scannedById){
    try{
        if(scannedById == null || isNaN(scannedById)){
            throw new Error("Dati ID za osobu koja je vrsila skeniranje nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/scannedBy/${scannedById}`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID osobe koja je vrsila skeniranje");
    }
}

export async function getByScannedAtBetween({from, to}){
    try{
        if(!moment(from,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(to,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Opseg skeniranog datuma nije validan");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/get-by-date-between`,{
            params:{
                from:moment(from).format("YYYY-MM-DDTHH:mm:ss"),
                to:moment(to).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom skeniranja izmedju datuma");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}