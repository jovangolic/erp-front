import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isOptionCategoryValid = ["GENDER","ROLE","STATUS","LANGUAGE","THEME"];
const isLanguageCodeTypeValid = ["EN", "RS", "ES", "FR", "RU", "DE"];
const isLanguageNameTypeValid = ["ENGLISH", "SRPSKI", "ESPAÑOL", "FRANÇAIS", "ITALIANO", "DEUTSCH", "РУССКИЙ"];

export async function create({optionId,languageId,localizedLabel}){
    try{
        if(!optionId || !languageId || !localizedLabel || typeof localizedLabel !== "string" || localizedLabel.trim()===""){
            throw new Error("Sv apolja moraju biti validna i popunjena");
        }
        const requestBody = {optionId,languageId,localizedLabel};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/localized-options/create/new-localized-option`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function update({id, optionId,languageId,localizedLabel}){
    try{
        if(id == null || isNaN(id) || !optionId || !languageId || !localizedLabel || typeof localizedLabel !== "string" || localizedLabel.trim()===""){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {optionId,languageId,localizedLabel};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/localized-options/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog localized-option po "+id+" id-iju");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getTranslationsForOption(optionId){
    try{
        if(!optionId){
            throw new Error("Dati ID "+optionId+" za option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/option/${optionId}/translations`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prevodjenja po id-iju opcije "+optionId);
    }
}

export async function deleteLocalizedOption(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" ne postoji");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/localized-options/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function deleteAllByOptionId(optionId){
    try{
        if(optionId == null || isNaN(optionId)){
            throw new Error("Dati id "+optionId+"za option nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/localized-options/deleteAll-option/${optionId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pilikom brisanja svih po optionId-ju");
    }
}

export async function addTranslationForOption(optionId, { languageId, localizedLabel }) {
    try {
        const requestBody = {
            languageId,
            localizedLabel
            // optionId NE IDE u body jer se nalazi u URL-u
        };
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/localized-options/option/${optionId}/translations`,
            requestBody,
            {
                headers: getHeader()
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom dodavanja prevoda");
    }
}

export async function getTranslation({optionId,languageId}){
    try{
        if(optionId == null || isNaN(optionId) || languageId){
            throw new Error("Dati id "+optionId+" za optionid i languageId "+languageId+" nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/option/${optionId}/language/${languageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom prevoda");
    }
}

export async function getAllByLanguage(languageId){
    try{
        if(languageId == null || isNaN(languageId)){
            throw new Error("Dati ID "+languageId+" za language nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/translations/language/${languageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih jezika ");
    }
}

export async function findByOption_Label(label){
    try{
        if(!label || typeof label !== "string" || label.trim() === ""){
            throw new Error("Dati label "+label+" za Option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/label`,{
            params:{label:label},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja labela "+label+" za Option");
    }
}

export async function findByOption_Value(value){
    try{
        if(!value || typeof value !== "string" || value.trim() === ""){
            throw new Error("Data vrednost "+value+" za Option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/value`,{
            params:{value:value},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja vrednosti "+value+" za Option");
    }
}

export async function findByOption_Category(category){
    try{
        if(!isOptionCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data Option kategorija "+category+" nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/category`,{
            params:{category:(category || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kategoriji "+category+" za Option");
    }
}

export async function findByLanguage_Id(languageId){
    try{
        if(languageId == null || isNaN(languageId)){
            throw new Error("Dati ID "+languageId+" za jezik nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/language/${languageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID-ja "+languageId+" za jezik");
    }
}

export async function findByLanguage_LanguageCodeType(languageCodeType){
    try{
        if(!isLanguageCodeTypeValid.includes(languageCodeType?.toUpperCase())){
            throw new Error("Dati codeType "+languageCodeType+" za jezik nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/language/code-type`,{
            params:{languageCodeType:(languageCodeType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja codeType "+languageCodeType+" za jezik");
    }
}

export async function findByLanguage_LanguageNameType(languageNameType){
    try{
        if(!isLanguageNameTypeValid.includes(languageNameType?.toUpperCase())){
            throw new Error("Dati nameType "+languageNameType+" za jezik nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localized-options/language/name-type`,{
            params:{languageNameType:(languageNameType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja nameType "+languageNameType+" za jezik");
    }
}

export async function saveLozalizedOptions({optionId,languageId, localizedLabel}){
    try{
        if(isNaN(optionId) || optionId == null || isNaN(languageId) || languageId == null ||
           !localizedLabel || typeof localizedLabel !== "string" || localizedLabel.trim() === ""){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {optionId,languageId, localizedLabel};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/localized-options/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,newLabel}){
    try{
        if(sourceId == null || isNaN(sourceId) || !newLabel || typeof newLabel !== "string" || newLabel.trim() === ""){
            throw new Error(`Nevalidni parametri: id=${sourceId}, label=${newLabel}`);
        }
        const requestBody = {sourceId,newLabel};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/localized-options/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save-as");
    }
}

export async function saveAll(requests) {
    try {
        if (!Array.isArray(requests) || requests.length === 0) {
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        // Opcionalna validacija svakog elementa
        requests.forEach((req, index) => {
            if (!req.optionId || !req.languageId || !req.localizedLabel) {
                throw new Error(`Nevalidan zahtev na indexu ${index}`);
            }
        });
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/localized-options/save-all`,
            requests, // telo je niz objekata!
            { headers: getHeader() }
        );
        return response.data;
    } 
    catch (error) {
        handleApiError(error, "Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}