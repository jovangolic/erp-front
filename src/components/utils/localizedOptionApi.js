import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function create(optionId,languageId,localizedLabel){
    try{
        if(!optionId || !languageId || !localizedLabel || typeof localizedLabel !== "string" || localizedLabel.trim()===""){
            throw new Error("Sv apolja moraju biti validna i popunjena");
        }
        const requestBody = {optionId,languageId,localizedLabel};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/create/new-localizedOption`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom kreiranja");
    }
}

export async function update(id, optionId,languageId,localizedLabel){
    try{
        if(!id || !optionId || !languageId || !localizedLabel || typeof localizedLabel !== "string" || localizedLabel.trim()===""){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {optionId,languageId,localizedLabel};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/update/${id}`,requestBody,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/find-one/${id}`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/find-all`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/option/${optionId}/translations`,{
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
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/delete/${id}`,{
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
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/deleteAll-option/${optionId}`,{
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
            `${import.meta.env.VITE_API_BASE_URL}/localizedOption/option/${optionId}/translations`,
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

export async function getTranslation(optionId,languageId){
    try{
        if(!optionId || languageId){
            throw new Error("Dati id za optionid i languageId nisu pronadjeni");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/option/${optionId}/language/${languageId}`,{
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
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/localizedOption/translations/language/${languageId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih jezika  ");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}