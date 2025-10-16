import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

const url = `${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments`
const isConfirmationDocumentValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];
function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

export const createConfirmationDocument = async ({filePath, userId, shiftId}) => {
    const requestBody = {
      filePath: filePath, // ili neka generisana putanja ako već postoji
      createdBy: { id: userId },
      shift: { id: shiftId }
    };

    return await api.post(url+`/create/new-confirm-document`, requestBody);
};

export const getConfirmationDocumentById = async (id) => {
    return await api.get(url+`/get-one/${id}`);
};

export const getAllConfirmationDocuments = async () => {
    return await api.get(url+`/get-all`);
};

export const getDocumentsByUser = async (userId) => {
    return await api.get(url+`/by-user/${userId}`);
};

export const getDocumentsCreatedAfter = async (isoDateTimeString) => {
    return await api.get(url+`/created-after/${isoDateTimeString}`);
};

export const deleteConfirmationDocument = async (id) => {
    return await api.delete(url+`/delete/${id}`);
};

export const uploadDocument = async ({file, userId, shiftId}) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("shiftId", shiftId);

    return await api.post(url+`/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
};

/*export const generateAndSaveDocument = async (goodsDispatchDto) => {
  return await api.post("/confirmationDocuments/generate", goodsDispatchDto, {
    responseType: 'blob' // ako hoćeš odmah da preuzmeš fajl
  });
};*/

export const generateAndSaveDocument = async (goodsDispatchDTO) => {
    try {
      const response = await api.post(url+`/generate`, goodsDispatchDTO, {
        responseType: "blob", // očekuješ PDF fajl
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "confirmation_document.pdf"; // ili naziv prema shiftu ili radniku ako želiš
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error("Greška prilikom generisanja dokumenta:", error);
      throw error;
    }
};

export async function updateConfirmationDocument({id, filePath, createdAt, userId, shiftId}){
    try{
      const requestBody = {filePath, createdAt: moment(createdAt).format("YYYY-MM-DDTHH:mm:ss"),userId,shiftId};
      const response = await api.put(url+`/update/${id}`,requestBody,{
        headers:getHeader()
      });
      return response.data;
    }
    catch(error){
      console.error("Greška prilikom azuriranja dokumenta:", error);
      throw error;
    }
}

export const downloadConfirmationDocument = async (id) => {
    const response = await api.get(url+`/download/${id}`, {
        responseType: 'blob' // Vrati PDF fajl kao binarni blob
    });
    return response;
};

export async function trackConfirmationDoc(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
          throw new Error("Dati id "+id+" za pracenje dokumenta, nije pronadjen");
        }
        const response = await api.get(url+`/track-confirmation-doc/${id}`,{
          headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" dokumenta za pracenje");
    }
}

export async function confirmConfDoc(id){
    try{
        if(Number.isNaN(Number(id))  || id == null){
            throw new Error("Dati id "+id+" za potvrdjivanje dokumenta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" dokumenta za potvrdjivanje");
    }
}

export async function cancelConfirmationDoc(id){
    try{
        if(Number.isNaN(Number(id))  || id == null){
            throw new Error("ID "+id+" za otkazivanje dokumenta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje dokumenta");
    }
}

export async function closeConfirmationDoc(id){
    try{
        if(Number.isNaN(Number(id))  || id == null){
            throw new Error("ID "+id+" za zatvaranje dokumenta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje dokumenta");
    }
}

export async function changeStatus({id, status}){
    try{
        if(Number.isNaN(Number(id))  || id == null || !isConfirmationDocumentValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status dokumenta "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status dokumenta "+status);
    }
}

export async function saveConfirmationDoc({filePath,createdAt,userId,shiftId,status, confirmed = false}){
    try{ 
        const validDate = moment.isMoment(createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!filePath?.trim() || !validDate || Number.isNaN(Number(userId)) || userId == null || Number.isNaN(Number(shiftId)) || shiftId == null ||
            !isConfirmationDocumentValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {filePath,createdAt,userId,shiftId,status, confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId, filePath,userId,shiftId,status,confirmed = false}){
    try{  
        if(Number.isNaN(Number(sourceId)) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(Number.isNaN(Number(userId)) || userId == null){
            throw new Error("Id "+userId+" mora biti ceo broj");
        }
        if(Number.isNaN(Number(shiftId)) || shiftId == null){
            throw new Error("Id "+shiftId+" mora biti ceo broj");
        }
        if(!isConfirmationDocumentValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" treba izabrati");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrdu "+confirmed+" treba izabrata");
        }
        const requestBody = {filePath,userId,shiftId,status,confirmed};
        const response = await api.post(url+`/save-as`,requestBody,{
              headers:getHeader()
        });
         return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}
 const validDate = moment.isMoment(createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid();
export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        for(let i = 0; i < requests.length; i++){
            const req = requests[0];
            const validDate = moment.isMoment(req.createdAt,"YYYY-MM-DDTHH:mm:ss",true).isValid();
            if (req.id == null || Number.isNaN(Number(req.id))) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if (req.userId == null || Number.isNaN(Number(req.userId))) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'userId' je obavezan i mora biti broj`);
            }
            if (req.shiftId == null || Number.isNaN(Number(req.shiftId))) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'shiftId' je obavezan i mora biti broj`);
            }
            if(!req.filePath?.trim()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'file-path' je obavezan`);
            }
            if(!isConfirmationDocumentValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' je obavezan `);
            }
            if(typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' je obavezan `);
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