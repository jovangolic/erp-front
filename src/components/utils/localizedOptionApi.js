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
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/create/new-localizedOption`,requestBody,{
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
        if(!id || !optionId || !languageId || !localizedLabel || typeof localizedLabel !== "string" || localizedLabel.trim()===""){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {optionId,languageId,localizedLabel};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/update/${id}`,requestBody,{
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
        if(!id){
            throw new Error("Dati ID ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog");
    }
}

export async function getAll(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/find-all`,{
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
            throw new Error("Dati ID za option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/option/${optionId}/translations`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom prevodjenja");
    }
}

export async function deleteLocalizedOption(id){
    try{
        if(!id){
            throw new Error("Dati ID ne postoji");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/delete/${id}`,{
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
        if(!optionId){
            throw new Error("Dati id za option nije pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/deleteAll-option/${optionId}`,{
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
            `${import.meta.env.VITE_API_BASE_URL}/localizedOptions/option/${optionId}/translations`,
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
        if(!optionId || languageId){
            throw new Error("Dati id za optionid i languageId nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/option/${optionId}/language/${languageId}`,{
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
        if(!languageId){
            throw new Error("Dati ID za language nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/translations/language/${languageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih jezika  ");
    }
}

export async function findByOption_Label(label){
    try{
        if(!label || typeof label !== "string" || label.trim() === ""){
            throw new Error("Dati label za Option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/label`,{
            params:{label:label},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja labela za Option");
    }
}

export async function findByOption_Value(value){
    try{
        if(!value || typeof value !== "string" || value.trim() === ""){
            throw new Error("Data vrednost za Option nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/value`,{
            params:{value:value},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja vrednosti za Option");
    }
}

export async function findByOption_Category(category){
    try{
        if(!isOptionCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data Option kategorija nije pronadjena");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/category`,{
            params:{category:(category || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kategoriji za Option");
    }
}

export async function findByLanguage_Id(languageId){
    try{
        if(languageId == null || isNaN(languageId)){
            throw new Error("Dati ID za jezik nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/language/${languageId}`);
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja ID-ja za jezik");
    }
}

export async function findByLanguage_LanguageCodeType(languageCodeType){
    try{
        if(!isLanguageCodeTypeValid.includes(languageCodeType?.toUpperCase())){
            throw new Error("Dati codeType za jezik nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/language/code-type`,{
            params:{languageCodeType:(languageCodeType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja codeType za jezik");
    }
}

export async function findByLanguage_LanguageNameType(languageNameType){
    try{
        if(!isLanguageNameTypeValid.includes(languageNameType?.toUpperCase())){
            throw new Error("Dati nameType za jezik nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOptions/language/name-type`,{
            params:{languageNameType:(languageNameType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja nameType za jezik");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}