import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";


export const createConfirmationDocument = async (filePath, userId, shiftId) => {
  const requestBody = {
    filePath: filePath, // ili neka generisana putanja ako već postoji
    createdBy: { id: userId },
    shift: { id: shiftId }
  };

  return await api.post('/confirmationDocuments/create/new-confirm-document', requestBody);
};

export const getConfirmationDocumentById = async (id) => {
  return await api.get(`/confirmationDocuments/get-one/${id}`);
};

export const getAllConfirmationDocuments = async () => {
  return await api.get(`/confirmationDocuments/get-all`);
};

export const getDocumentsByUser = async (userId) => {
  return await api.get(`/confirmationDocuments/by-user/${userId}`);
};

export const getDocumentsCreatedAfter = async (isoDateTimeString) => {
  return await api.get(`/confirmationDocuments/created-after/${isoDateTimeString}`);
};

export const deleteConfirmationDocument = async (id) => {
  return await api.delete(`/confirmationDocuments/delete/${id}`);
};

export const uploadDocument = async (file, userId, shiftId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("shiftId", shiftId);

  return await api.post("/confirmationDocuments/upload", formData, {
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
    const response = await api.post("/confirmationDocuments/generate", goodsDispatchDTO, {
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