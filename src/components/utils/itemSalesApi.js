import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export async function createItemSales({goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice}){
    try{
        if(
            !goodsId || !salesId || !procurementId || !salesOrderId ||
            isNaN(quantity) || parseInt(quantity) <= 0 ||
            isNaN(unitPrice) || parseFloat(unitPrice) <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {goodsId, salesId, procurementId, salesOrderId, quantity:parseInt(quantity), unitPrice:parseFloat(unitPrice)};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/itemSales/create/new-item-sales`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja stavke-placanja: ${error.message}`);
        }
    }
}

export async function updateItemSales({id, goodsId, salesId, procurementId, salesOrderId, quantity, unitPrice}){
    try{
        if(
            !id ||
            !goodsId || !salesId || !procurementId || !salesOrderId ||
            isNaN(quantity) || parseInt(quantity) <= 0 ||
            isNaN(unitPrice) || parseFloat(unitPrice) <= 0
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {goodsId, salesId, procurementId, salesOrderId, quantity:parseInt(quantity), unitPrice:parseFloat(unitPrice)};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/itemSales/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja stavke-placanja: ${error.message}`);
        }
    }
}

export async function deleteItemSales(id){
    try{
        if(!id){
            throw new Error("Dati ID za itemSales ne postoji");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/itemSales/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getOneItemSales(id){
    try{
        if(!id){
            throw new Error("Dati ID za itemSales ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jedne stavke-nabavke");
    }
}

export async function getAllItemSales(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih stavki-nabavke ");
    }
}

export async function getByQuantity(quantity){
    try{
        if(isNaN(quantity) || parseInt(quantity) <= 0){
            throw new Error("Količina mora biti pozitivna");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/be-quantity`,{
            params:{
                quantity:parseInt(quantity)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kolicini");
    }
}

export async function getBySalesId(salesId){
    try{
        if(!salesId){
            throw new Error("Dati ID za sales nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/by-salesId`,{
            params:{
                salesId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id-iju prodaje");
    }
}

export async function getByGoodsId(goodsId){
    try{
        if(!goodsId){
            throw new Error("Dati ID za goodsId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/by-goodsId`,{
            params:{
                goodsId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id-iju robe");
    }
}

export async function getByProcurementId(procurementId){
    try{
        if(!procurementId){
            throw new Error("Dati ID za procurementId nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/by-procurementId`,{
            params:{
                procurementId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id-iju nabavke");
    }
}

export async function getByUnitPrice(unitPrice){
    try{
        if(isNaN(unitPrice) || parseFloat(unitPrice) <= 0){
            throw new Error("UnitPrice mora biti pozitivan broj");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/by-unitPrice`,{
            params:{
                unitPrice:parseFloat(unitPrice)
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po ceni za komad");
    }
}

export async function getBySalesOrderId(salesOrderId){
    try{
        if(!salesOrderId){
            throw new Error("Dati ID  za salesOreder nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/by-salesOrderId`,{
            params:{
                salesOrderId
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po id-iju za prodaju-narudzbine");
    }
}

export async function getBySalesOrderNumber(orderNumber){
    try{
        if(!orderNumber || typeof orderNumber !=="string" || orderNumber.trim() === ""){
            throw new Error("Dati orderNumber nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales/item/by-salesOrderNumber`,{
            params:{
                orderNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po broju narudzbine");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}