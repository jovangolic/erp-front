import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

export const createConfirmationDocument = async (filePath, userId, shiftId) => {
  const requestBody = {
    filePath: filePath, // ili neka generisana putanja ako već postoji
    createdBy: { id: userId },
    shift: { id: shiftId }
  };

  return await api.post('${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/create/new-confirm-document', requestBody);
};

export const getConfirmationDocumentById = async (id) => {
  return await api.get(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/get-one/${id}`);
};

export const getAllConfirmationDocuments = async () => {
  return await api.get(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/get-all`);
};

export const getDocumentsByUser = async (userId) => {
  return await api.get(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/by-user/${userId}`);
};

export const getDocumentsCreatedAfter = async (isoDateTimeString) => {
  return await api.get(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/created-after/${isoDateTimeString}`);
};

export const deleteConfirmationDocument = async (id) => {
  return await api.delete(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/delete/${id}`);
};

export const uploadDocument = async (file, userId, shiftId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("shiftId", shiftId);

  return await api.post(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/upload`, formData, {
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
    const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/generate`, goodsDispatchDTO, {
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

export async function updateConfirmationDocument(id, filePath, createdAt, userId, shiftId){
  try{
    const requestBody = {filePath, createdAt: moment(createdAt).format("YYYY-MM-DDTHH:mm:ss"),userId,shiftId};
    const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/update/${id}`,requestBody,{
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
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/confirmationDocuments/download/${id}`, {
        responseType: 'blob' // Vrati PDF fajl kao binarni blob
    });
    return response;
};