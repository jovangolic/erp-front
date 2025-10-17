import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isHelpCategoryValid = ["USER","BUYER","PRODUCT","ORDER","INVENTORY","SHIFT","GENERAL",
    "SYSTEM_SETTING","PROCUREMENT","GOODS","RAW_MATERIAL","INVOICE","PAYMENT","ROLE","SALES","VENDOR","SHELF",
    "CONFIRMATION_DOCUMENT","ITEM_SALES","SALES_ORDER","STORAGE","SUPPLY","TOKEN","SUPPLY_ITEM","INVENTORY_ITEMS","SHIFT_REPORT","BARCODE","VEHICLE",
    "DRIVER","ROUTE","SHIPMENT","LOGISTICS_PROVIDER","STOCK_TRANSFER","STOCK_TRANSFER_ITEM","TRACKING_INFO","TRANSPORT_ORDER","OUTBOUND_DELIVERY",
    "INBOUND_DELIVERY","DELIVERY_ITEM","COMPANY_EMAIL","DASHBOARD","OPTION","EMAI_SETTING"
]; 

export async function createHelp({title,content,category,isVisible}){
    try{
        if(
            !title || typeof title !== "string" || title.trim() === ""||
            !content || typeof content !== "string" || content.trim() === ""||
            !isHelpCategoryValid.includes(category?.toUpperCase()) ||
            typeof isVisible !== "boolean"
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {title,content,category: (category || "").toUpperCase(),isVisible};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/help/create/`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja help: ${error.message}`);
        }
    }
}

export async function updateHelp({id,title,content,category,isVisible}){
    try{
        if(
            Number.isNaN(Number(id)) || id == null ||
            !title || typeof title !== "string" || title.trim() === ""||
            !content || typeof content !== "string" || content.trim() === ""||
            !isHelpCategoryValid.includes(category?.toUpperCase()) ||
            typeof isVisible !== "boolean"
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {title,content,category: (category || "").toUpperCase(),isVisible};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/help/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja help: ${error.message}`);
        }
    }
}

export async function deleteHelp(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" za help nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/help/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getById(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" za help nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja jednog "+id+" po id-iju");
    }
}

export async function getAllHelp(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/get-all-help`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getVisible(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/visible`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom dobavljanja vidljivih helpova");
    }
}

export async function getByCategory(category){
    try{
        if(!isHelpCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Nepostojeca kategorija "+category+"");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/category/${category}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja po kategoriji "+category);
    }
}

export async function findAllCategories(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/all-categories`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve tipove kategorija za Help");
    }
}

export async function findByTitleContainingIgnoreCase(title){
    try{
        if(!title || typeof title !== "string" || title.trim() === ""){
            throw new Error("Dati naslov "+title+" za  Help, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/search/title`,{
            params:{title:title},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naslov "+title+" za dati Help");
    }
}

export async function findByContentContainingIgnoreCase(content){
    try{
        if(!content || typeof content !== "string" || content.trim() === ""){
            throw new Error("Dati sadrzaj "+content+" za Help, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/search/content`,{
            params:{content:content},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sadrzaj "+content+" za dati Help");
    }
}

export async function findByTitleContainingIgnoreCaseAndContentContainingIgnoreCase({title, content}){
    try{    
        if(!title || typeof title !== "string" || title.trim() === "" || !content || typeof content !== "string" || content.trim() === ""){
            throw new Error("Dati naslov "+title+" i sadrzaj "+content+" za Help, nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/search/title-content`,{
            params:{
                title:title,
                content:content
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(errorr){
        handleApiError(errorr,"Trenutno nismo pronasli naslov "+title+" i sadrzaj "+content+" za dati Help");
    }
}

export async function existsByTitle(title){
    try{
        if(!title || typeof title !== "string" || title.trim() === ""){
            throw new Error("Dati naslov "+title+" za Help, nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/exists/title`,{
            params:{title:title},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje naslova "+title+" za dati Help");
    }
}

export async function findFaqContent(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/help/faq`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli FAQ sadrzaj");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}