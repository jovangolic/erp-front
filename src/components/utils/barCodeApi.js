import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export async function createBarCode(code, goodsId){
    try{
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

export async function updateBarCode(id,code, goodsId ){
    try{
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

export async function getByGoods(goodsId){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/get-by-goodsId`,{
            params:{
                goodsId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja preko id-ja robe");
    }
}

export async function getByScannedBy(scannedBy){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/barCodes/get-by-scannedBy`,{
            params:{
                scannedBy
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom potraqge ko je skenirao");
    }
}

export async function getByScannedAtBetween(from, to){
    try{
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