import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isLanguageCodeTypeValid = ["EN","RS","ES","FR","RU","DE"];  

const isLanguageNameTypeValid = ["ENGLISH","SRPSKI","ESPAÑOL","FRANÇAIS","ITALIANO","DEUTSCH","РУССКИЙ"];

export async function create({languageCodeType, languageNameType}){
    try{
        if(
            !isLanguageCodeTypeValid.includes(languageCodeType?.toUpperCase()) ||
            !isLanguageNameTypeValid.includes(languageNameType?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {languageCodeType: (languageCodeType || "").toUpperCase(),languageNameType:(languageNameType || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/language/create`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function update({id, languageCodeType, languageNameType}){
    try{
        if(
            id == null || isNaN(id) ||
            !isLanguageCodeTypeValid.includes(languageCodeType?.toUpperCase()) ||
            !isLanguageNameTypeValid.includes(languageNameType?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {languageCodeType: (languageCodeType || "").toUpperCase(),languageNameType:(languageNameType || "").toUpperCase()};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/language/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteLanguage(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za language nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/language/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za language nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/language/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog jezika po "+id+" id-iju");
    }
}

export async function getALL(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/language/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function findByCodeType(code){
    try{
        if(!isLanguageCodeTypeValid.includes(code?.toUpperCase())){
            throw new Error("Dati code "+code+" jezika nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/language/by-code/${code}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasi tip koda "+code);
    }
}

export async function findByNameType(nameType){
    try{
        if(!isLanguageNameTypeValid.includes(nameType?.toUpperCase())){
            throw new Error("Dati naziv/tip "+nameType+" jezika nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/language/by-name/${nameType}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv tipa "+nameType+" za dati jezik");
    }
}

export async function saveLanguage({languageCodeType, languageNameType}){
    try{
        if(!isLanguageCodeTypeValid.includes(languageCodeType?.toUpperCase()) || !isLanguageNameTypeValid.includes(languageNameType?.toUpperCase())){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {languageCodeType, languageNameType};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/language/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}