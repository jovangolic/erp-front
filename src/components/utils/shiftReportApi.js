import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const url = `${import.meta.env.VITE_API_BASE_URL}/shiftReports`;

export async function createShiftReport({description, createdById, relatedShiftId, filePath}) {
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
           url+ `/new/create-shift-report`,
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

export async function updateShiftReport({id, description, createdById, relatedShiftId, filePath}) {
    try {
        if (
            id = null || isNaN(id) ||
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
            url+`/update/${id}`,
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
        if(id = null || isNaN(id)){
            throw new Error("Dati id ne postoji");
        }
        const response = await api.delete(url+`/delete/${id}`,{
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
        if(id = null || isNaN(id)){
            throw new Error("Dati id ne postoji");
        }
        const response = await api.get(url+`/shift-report/${id}`,{
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
        const response = await api.get(url+`/get-all-shift-reports`,{
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
        if(shiftId == null || isNaN(shiftId)){
            throw new Error("Dati shifId ne postoji");
        }
        const response = await api.get(url+`/reports/${shiftId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja izvestaja o smeni");
    }
}

export async function findByDescription(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Opis nije pronadjen");
        }
        const response = await api.get(url+`/search/description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nije moguce naci opis");
    }
}

export async function findByCreatedAtBetween({start, end}){
    try{
        if(
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Opseg datuma kreiranja nije pronadjen");
        }
        const response = await api.get(url+`/search/createdBy-date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja opsega datuma kreiranja");
    }
}

export async function findByCreatedAtAfterOrEqual(date){
    try{
        if(!moment(date,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum kreiranja nije pronadjen");
        }
        const response = await api.get(url+`/search/createdBy-after`,{
            params:{date:moment(date).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po datumu kreiranja");
    }
}

export async function findByCreatedBy_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email nadzornika nije pronadjen");
        }
        const response = await api.get(url+`/search/createdBy-email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po emailu nadzornika");
    }
}

export async function findByCreatedBy_PhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona nadzornika nije pronadjen");
        }
        const response = await api.get(url+`/search/createdBy-phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po broju-telefona nadzornika");
    }
}

export async function findByCreatedBy_FirstNameLikeIgnoreCaseAndLastNameLikeIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === "" ){
            throw new Error("Dato ime i prezime nadzornika nije pronadjeno");
        }
        const response = await api.get(url+`/search/createdBy-fullName`,{
            params:{firstName:firstName,lastName:lastName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po imenu i prezimenu nadzornika");
    }
}

export async function findByRelatedShift_EndTimeBefore(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme za zavrsene smene pre datog vremena nisu pronadjene");
        }
        const response = await api.get(url+`/search/related-shift/end-time-before`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema trazenih smena koje su se zavrsile pre datom vremena");
    }
}

export async function findByRelatedShift_EndTimeAfter(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme za zavrsene smene posle datog vremena nisu pronadjene");
        }
        const response = await api.get(url+`/search/related-shift/end-time-after`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema trazenih smena koje su se zavrsile posle datom vremena");
    }
}

export async function findByRelatedShift_StartTimeAfter(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme za pocetne smene posle datog vremena nisu pronadjene");
        }
        const response = await api.get(url+`/search/related-shift/start-time-after`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema trazenih smena koje su pocele posle datom vremena");
    }
}

export async function findByRelatedShift_StartTimeBefore(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme za pocetne smene pre datog vremena nisu pronadjene");
        }
        const response = await api.get(url+`/search/related-shift/start-time-before`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema trazenih smena koje su pocele pre datom vremena");
    }
}

export async function findByRelatedShift_EndTimeBetween({start, end}){
    try{
        if(
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()
        ){
            throw new Error("Dati vremenski opseg za zavrsene smene nije pronadjen");
        }
        const response = await api.get(url+`/search/related-shift/end-time-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema trazenih smena koje su se zavrsile u datom vremenskom opsegu");
    }
}

export async function findRelatedShift_ActiveShifts(){
    try{
        const response = await api.get(url+`/search/related-shift/active`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema aktivnih smena za pretragu");
    }
}

export async function findByRelatedShift_EndTimeIsNull(){
    try{
        const response = await api.get(url+`/search/related-shift/end-time-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema smena gde je kraj vremena prazan");
    }
}

export async function findByRelatedShift_ShiftSupervisorIdAndStartTimeBetween({supervisorId, start, end}){
    try{
        if(supervisorId == null || isNaN(supervisorId) ||
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati ID nadzornika, kao i opseg datuma njegovih smena, nisu pronadjene");
        }
        const response = await api.get(url+`/search/related-shift/supervisor/${supervisorId}/start-time-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nema ID nadzornika i opseg njegovih smena");
    }
}

export async function findByRelatedShift_ShiftSupervisorIdAndEndTimeIsNull(supervisorId){
    try{
        if(supervisorId == null || isNaN(supervisorId)){
            throw new Error("Dati ID za nadzornika nije pronadjen");
        }
        const response = await api.get(url+`/search/related-shift/supervisor/${supervisorId}/end-time-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo ID za nadzornika i kada je kraj smene nepostojeci");
    }
}


function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}