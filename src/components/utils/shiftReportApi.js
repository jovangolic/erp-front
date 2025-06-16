import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

export async function createShiftReport(description, createdById, relatedShiftId, filePath) {
    try {
        // Obavezna polja
        if (
            !description || typeof description !== "string" || description.trim() === "" ||
            createdById == null || relatedShiftId == null
        ) {
            throw new Error("Polja 'opis', 'ID osobe' i 'ID smene' moraju biti popunjena i validna.");
        }
        // filePath je opciono, ali ako postoji, mora biti string dužine do 255
        if (filePath && (typeof filePath !== "string" || filePath.length > 255)) {
            throw new Error("Putanja fajla mora biti string i kraća od 255 karaktera.");
        }
        const requestBody = {
            description,
            createdById,
            relatedShiftId,
            filePath
        };
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/shiftReports/new/create-shift-report`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom kreiranja izveštaja o smenama: " + error.message);
        }
    }
}

export async function updateShiftReport(id, description, createdById, relatedShiftId, filePath) {
    try {
        if (
            !id ||
            !description || typeof description !== "string" || description.trim() === "" ||
            createdById == null || relatedShiftId == null
        ) {
            throw new Error("Polja 'opis', 'ID osobe' i 'ID smene' moraju biti popunjena i validna.");
        }
        // filePath je opciono, ali ako postoji, mora biti string dužine do 255
        if (filePath && (typeof filePath !== "string" || filePath.length > 255)) {
            throw new Error("Putanja fajla mora biti string i kraća od 255 karaktera.");
        }
        const requestBody = {
            id,
            description,
            createdById, // takođe samo broj
            relatedShiftId,
            filePath
        };
        const response = await api.put(
            `${import.meta.env.VITE_API_BASE_URL}/shiftReports/update/${id}`,
            requestBody,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Greška prilikom ažuriranja izveštaja o smenama: " + error.message);
        }
    }
}

export async function deleteShiftReport(id){
    try{
        if(!id){
            throw new Error("Dati id ne postoji");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/shiftReports/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
       handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function getShiftReportById(id){
    try{
        if(!id){
            throw new Error("Dati id ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shiftReports/shift-report/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja jednog izvestaja o smeni");
    }
}

export async function getAllShiftsReports(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shiftReports/get-all-shift-reports`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih izvestaja o smeni");
    }
}

export async function getShiftReportsByShiftId(shiftId){
    try{
        if(!shiftId){
            throw new Error("Dati shifId ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/shiftReports/reports/${shiftId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja izvestaja o smeni");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}