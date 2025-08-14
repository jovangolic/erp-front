import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isFileExtensionValid = ["PDF","JPG","PNG","DOCX","XLSX"];
const isFileActionValid = ["SAVE","SAVE_AS","SAVE_ALL","EXIT"];
//proverava validnost seta koji sadrzi enum objekte
function isValidFileActionSet(actionSet) {
    if (!(actionSet instanceof Set) || actionSet.size === 0) {
        return false;
    }
    for (const action of actionSet) {
        if (!isFileActionValid.includes(action?.toUpperCase())) {
            return false;
        }
    }
    return true;
}

export async function createFileOpt({extension,mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions}){
    try{
        if(
            !isFileExtensionValid.includes(extension?.toUpperCase()) ||
            !mimeType || typeof mimeType !== "string" || mimeType.trim() === "" ||
            maxSizeInBytes == null || maxSizeInBytes <= 0 ||
            typeof uploadEnabled !=="boolean" ||typeof previewEnabled !=="boolean" ||
            !isValidFileActionSet(availableActions)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena")
        }
        const requestBody = {extension: (extension || "").toUpperCase(),mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/file-opt/create/`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja fileOpt: ${error.message}`);
        }
    }
}

export async function updateFileOpt({id,extension,mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions}){
    try{
        if(
            !id ||
            !isFileExtensionValid.includes(extension?.toUpperCase()) ||
            !mimeType || typeof mimeType !== "string" || mimeType.trim() === "" ||
            maxSizeInBytes == null || maxSizeInBytes <= 0 ||
            typeof uploadEnabled !=="boolean" ||typeof previewEnabled !=="boolean" ||
            !isValidFileActionSet(availableActions)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena")
        }
        const requestBody = {extension: (extension || "").toUpperCase(),mimeType,maxSizeInBytes,uploadEnabled,previewEnabled,availableActions};
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/file-opt/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja fileOpt: ${error.message}`);
        }
    }
}

export async function deleteFileOpt(id){
    try{
        if(!id){
            throw new Error("Dati ID "+id+" za fileOpt nijr pronadjen");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/file-opt/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja")
    }
}

export async function getAllFileOpts(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih");
    }
}

export async function getFileOptById(id){
    try{
        if(!id){
            throw new Error("Dati ID "+id+" za fileOpt nijr pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog "+id+" id-iju");
    }
}

export async function getByExtension(extension){
    try{
        if(!isFileExtensionValid.includes(extension?.toUpperCase())){
            throw new Error("FileExtension "+extension+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/by-extension/${extension}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja prema ekstenziji "+extension);
    }
}

export async function getByAction(action){
    try{
        if(!isValidFileActionSet(availableActions)){
            throw new Error("Dati FileAction "+action+" nije pronadjen");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/file-opt/by-availableActions/${action}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja prema akciji "+action);
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}