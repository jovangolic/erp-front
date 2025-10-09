import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/defects`;
const isSeverityLevelValid = ["TRIVIAL_SEVERITY", "MINOR_SEVERITY", "MODERATE_SEVERITY", "MAJOR_SEVERITY", "CRITICAL_SEVERITY"];
const isDefectStatusValid = ["All","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createDefect({ code, name, description = "", severity, status, confirmed = false }) {
    try {
        if (!code?.trim() || !name?.trim()) {
            throw new Error("Polja 'code' i 'name' moraju biti popunjena i validna");
        }
        const severityUpper = severity?.toUpperCase();
        const statusUpper = status?.toUpperCase();
        if (!isSeverityLevelValid.includes(severityUpper)) {
            throw new Error(`Nevalidan severity level: ${severity}`);
        }
        if (!isDefectStatusValid.includes(statusUpper)) {
            throw new Error(`Nevalidan defect status: ${status}`);
        }
        if (typeof confirmed !== "boolean") {
            throw new Error("Polje 'confirmed' mora biti boolean");
        }
        const requestBody = {
            code: code.trim(),
            name: name.trim(),
            description: description.trim(),
            severity: severityUpper,
            status: statusUpper,
            confirmed
        };
        const response = await api.post(`${url}/create/new-defect`, requestBody, {
            headers: getHeader()
        });
        return response.data;
    } 
    catch (error) {
        handleApiError(error, "Greska prilikom kreiranja defekta");
    }
}

export async function updateDefect({id, code, name, description = "", severity, status, confirmed = false }) {
    try {
        if(isNaN(id) || id == null){
            throw new Error("Polje 'id' mora biti ceo broj");
        }
        if (!code?.trim() || !name?.trim()) {
            throw new Error("Polja 'code' i 'name' moraju biti popunjena i validna");
        }
        const severityUpper = severity?.toUpperCase();
        const statusUpper = status?.toUpperCase();
        if (!isSeverityLevelValid.includes(severityUpper)) {
            throw new Error(`Nevalidan severity level: ${severity}`);
        }
        if (!isDefectStatusValid.includes(statusUpper)) {
            throw new Error(`Nevalidan defect status: ${status}`);
        }
        if (typeof confirmed !== "boolean") {
            throw new Error("Polje 'confirmed' mora biti boolean");
        }
        const requestBody = {
            code: code.trim(),
            name: name.trim(),
            description: description.trim(),
            severity: severityUpper,
            status: statusUpper,
            confirmed
        };
        const response = await api.put(`${url}/update/${id}`, requestBody, {
            headers: getHeader()
        });
        return response.data;
    } 
    catch (error) {
        handleApiError(error, "Greska prilikom azuriranja defekta");
    }
}

export async function deleteDefect(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za defekt, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja defekta po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" za defekt, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog defekta po "+id+" id-iju");
    }
}

export async function findAll(){
    try{
        const response = await api.get(url+`/find-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja svih defekata");
    }
}

export async function findByCodeContainingIgnoreCase(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati kod "+code+" za defekat, nije pronadjen");
        }
        const response = await api.get(url+`/by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po datom "+code+" kodu");
    }
}

export async function findByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" za defekat, nije pronadjena");
        }
        const response = await api.get(url+`/by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po datom "+name+" nazivu");
    }
}

export async function findByDescriptionContainingIgnoreCase(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Dati opis "+description+" defekata, nije pronadjen");
        }
        const response = await api.get(url+`/by-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po datom "+description+" opisu");
    }
}

export async function findByCodeContainingIgnoreCaseAndNameContainingIgnoreCase({code, name}){
    try{
        if(!code || typeof code !== "string" || code.trim() === "" ||
           !name || typeof name !== "string" || name.trim() === "" ){
            throw new Error("Dati kod "+code+" i naziv "+name+" za defekat, nisu pronadjeni"); 
        }
        const response = await api.get(url+`/by-code-and-name`,{
            params:{
                code:code,
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati defekat po "+code+" kodu i nazivu "+name);
    }
}

export async function findBySeverity(severity){
    try{
        if(!isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Data ozbiljnost "+severity+" za defekat, nije pronadjena");
        }
        const response = await api.get(url+`/by-severity`,{
            params:{
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekte po "+severity+" ozbiljnosti");
    }
}

export async function findByCodeContainingIgnoreCaseAndSeverity({code, severity}){
    try{
        if(!code || typeof code !== "string" || code.trim() === "" || !isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Dati kod "+code+" i ozbiljnost "+severity+" za defekat, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-code-and-severity`,{
            params:{
                code:code,
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po "+code+" kodu i "+severity+" datoj ozbiljnosti");
    }
}

export async function findByNameContainingIgnoreCaseAndSeverity({name, severity}){
    try{
        if(!name || typeof name !== "string" || name.trim() === "" || !isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Dati naziv "+name+" i ozbiljnost "+severity+" za defekat, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-name-and-severity`,{
            params:{
                name:name,
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po "+name+" nazivu i "+severity+" datoj ozbiljnosti");
    }
}

export async function findAllByOrderBySeverityAsc(){
    try{
        const response = await api.get(url+`/orders-by-severity-asc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat sortiran po rastucem poretku po ozbiljnosti");
    }
}

export async function findAllByOrderBySeverityDesc(){
    try{
        const response = await api.get(url+`/orders-by-severity-desc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat sortiran po opadajucem poretku po ozbiljnosti");
    }
}

export async function findBySeverityAndDescriptionContainingIgnoreCase({severity, descPart}){
    try{
        if(!isSeverityLevelValid.includes(severity?.toUpperCase()) || !descPart || typeof descPart !== "string" || descPart.trim() === ""){
            throw new Error("Data ozbiljnost "+severity+" i opis "+descPart+" za defekat, nisu pronadjeni");
        }
        const response = await api.get(url+`/by-severity-and-desc-part`,{
            params:{
                descPart:descPart,
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po ozbiljnosti "+severity+" i opisu "+descPart);
    }
}

export async function countBySeverity(severity){
    try{
        if(!isSeverityLevelValid.includes(severity?.toUpperCase())){
            throw new Error("Dati broj ozbiljnosti "+severity+" za defekat, nije pronadjena");
        }
        const response = await api.get(url+`/count-by-severity`,{
            params:{
                severity:(severity || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj ozbiljnosti "+severity+" za dati defekat");
    }
}

export async function countByCode(code){
    try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Dati broj kodova "+code+" za defekat, nije pronadjen");
        }
        const response = await api.get(url+`/count-by-code`,{
            params:{code:code},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj kodova "+code+" za dati defekat");
    }
}

export async function countByName(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati broj naziva "+name+" za defekat, nije pronadjen");
        }
        const response = await api.get(url+`/count-by-name`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj naziva "+name+" za dati defekat");
    }
}

export async function findBySeverityIn(levels){
    try{
        if(!isSeverityLevelValid.includes(levels?.toUpperCase())){
            throw new Error("Data lista svih ozbiljnosti za defekat, nije pronadjena");
        }
        const response = await api.get(url+`/by-severity-in-levels`,{
            params:{
                levels: arrayLevels
            },
            paramsSerializer: params =>{
                return params.levels.map(l => `arrayLevels=${l.toUpperCase()}`).join("&")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli listu sa svim ozbiljnostima "+levels+" za dati defekat");
    }
}

export async function existsByNameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Postojanje datog defekta po nazivu "+name+" ,nije pronadjen");
        }
        const response = await api.get(url+`/exists/by-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje datog defekta po nazivu "+name);
    }
}

export async function existsByCodeContainingIgnoreCase(code){
try{
        if(!code || typeof code !== "string" || code.trim() === ""){
            throw new Error("Postojanje datog defekta po kodu "+code+" ,nije pronadjeno");
        }
        const response = await api.get(url+`/exists/by-code`,{
            params:{
                code:code
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje datog defekta po kodu "+code);
    }
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isDefectStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status defekta "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status defekta "+status);
    }
}

export async function confirmDefect(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu defekta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu defekata");
    }
} 

export async function closeDefect(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje defekta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje defekata");
    }
}

export async function cancelDefect(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje defekta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje defekata");
    }
}

export async function searchDefects({severity, descPart, status, confirmed}){
    try{
        if(!isSeverityLevelValid.includes(severity?.toUpperCase()) || !descPart || typeof descPart !== "string" || descPart.trim() === "" || 
          !isDefectStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean"){
            throw new Error("Dati parametri pretrage "+severity+" ,"+descPart+" ,"+status+" ,"+confirmed+" ne daju ocekivani rezultat");
        }
        const response = await api.get(url+`/search-defects`,{
            params:{
                severity:(severity || "").toUpperCase(),
                descPart: descPart,
                status : (status || "").toUpperCase(),
                confirmed : confirmed
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat za unesene parametre: "+severity+" ,"+descPart+" ,"+status+" ,"+confirmed);
    }
}

export async function trackDefect(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" defekta za pracenje, nije pronadjen");
        }
        const response = await api.get(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" defekta za pracenje");
    }
}

export async function generalSearch({id, idFrom, idTo, code, name, description, severity, status, confirmed}){
    try{
        if(isNaN(id) || id == null || isNaN(idFrom) || idFrom == null || isNaN(idTo) || idTo == null ||
          !code || typeof code !== "string" || code.trim() === "" || 
          !name || typeof name !== "string" || name.trim() === "" || !description || typeof description !== "string" || description.trim === "" ||
          !isSeverityLevelValid.includes(severity?.toUpperCase()) || !isDefectStatusValid.includes(status?.toUpperCase()) ||
          typeof confirmed !== "boolean"){
            throw new Error("Dati parametri: id "+id+" ,opseg id-ijeva "+idFrom+" - "+idTo+" ,code "+code+" ,name "+name+" description, "+description+" ,severity "+severity+
                " ,status "+status+" ,confirmed "+confirmed+" ne daju ocekivani rezultat"
            );
        }
        if(idFrom > idTo){
            throw new Error("Pocetak opsega id-ija ne sme biti veci od kraja id-ja : idFrom - idTo, ne obrnuto");
        }
        const response = await api.get(url+`/general-search`,{
            params:{
                id:id,
                idFrom:idFrom,
                idTo:idTo,
                code:code,
                name:name,
                description:description,
                severity:(severity || "").toUpperCase(),
                status :(status || "").toUpperCase(),
                confirmed : confirmed
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat za unesene/uneti parametar/parametre: id "+
            id+" ,opseg id-ijeva "+idFrom+" - "+idTo+",code "+code+" ,name "+name+" ,description "+description+" ,severity "+severity+" ,status "+
            status+" ,confirmed "+confirmed+" ."
        );
    }
}

export async function getReports({ id = null, description = null }) {
    try {
        const response = await api.get(url+`/reports`, {
            params: { id, description },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, `Trenutno nismo pronasli rezultat za id: ${id}, description: ${description}`);
    }
}

export async function searchByDateOnly(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Uneti datum "+date+" ne daje ocekivani rezultat");
        }
        const response = await api.get(url+`/search/by-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat po samo unetom datumum "+date);
    }
}

export async function countDefectsBySeverity(){
    try{
        const response = await api.get(url+`/count/defects-severity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj defekata po ozbiljnosti");
    }
}

export async function countDefectsByStatus(){
    try{
        const response = await api.get(url+`/count/defects-status`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj defekata po statusu");
    }
}

export async function countDefectsByConfirmed(){
    try{
        const response = await api.get(url+`/count/defects-confirmed`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj defekata po potvrdi");
    }
}

export async function countDefectsByStatusAndSeverity(){
    try{    
        const response = await api.get(url+`/count/defects-status-and-severity`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj defekata po statusu i ozbiljnosti");
    }
}

export async function countDefectsByYearAndMonth(){
    try{
        const response = await api.get(url+`/count/defects-year-and-month`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj defekata po godini i mesecu");
    }
}

export async function findByCreatedDate(createdDate){
    try{
        if(!moment(createdDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum-vreme "+createdDate+" kreiranja datog defekta, nije pronadjeno");
        }
        const response = await api.get(url+`/created-date`,{
            params:{
                createdDate:moment(createdDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po datumu i vremenu "+createdDate+" kreiranja");
    }
}

export async function findByCreatedDateAfter(createdDate){
    try{
        if(!moment(createdDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum-vreme posle "+createdDate+" kreiranja datog defekta, nije pronadjeno");
        }
        const response = await api.get(url+`/created-date-after`,{
            params:{
                createdDate:moment(createdDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po datumu i vremenu posle "+createdDate+" kreiranja");
    }
}

export async function findByCreatedDateBefore(createdDate){
    try{
        if(!moment(createdDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum-vreme pre "+createdDate+" kreiranja datog defekta, nije pronadjeno");
        }
        const response = await api.get(url+`/created-date-before`,{
            params:{
                createdDate:moment(createdDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli defekat po datumu i vremenu pre "+createdDate+" kreiranja");
    }
}

export async function findByCreatedDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Opseg datuma i vremena "+start+" - "+end+" kreiranja defekta, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj, ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/created-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma i vremena "+start+" - "+end+" za kreiranje defekta");
    }
}

export async function countByCreatedAtBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Broj opsega datuma i vremena "+start+" - "+end+" kreiranja defekta, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj, ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/count/created-date-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj opsega datuma i vremena "+start+" - "+end+" za kreiranje defekta");
    }
}

export async function saveDefects({code, name, description = "", severity, status, confirmed = false }){
    try{
        if (!code?.trim() || !name?.trim()) {
            throw new Error("Polja 'code' i 'name' moraju biti popunjena i validna");
        }
        const severityUpper = severity?.toUpperCase();
        const statusUpper = status?.toUpperCase();
        if (!isSeverityLevelValid.includes(severityUpper)) {
            throw new Error(`Nevalidan severity level: ${severity}`);
        }
        if (!isDefectStatusValid.includes(statusUpper)) {
            throw new Error(`Nevalidan defect status: ${status}`);
        }
        if (typeof confirmed !== "boolean") {
            throw new Error("Polje 'confirmed' mora biti boolean");
        }
        const requestBody = {
            code: code.trim(),
            name: name.trim(),
            description: description.trim(),
            severity: severityUpper,
            status: statusUpper,
            confirmed
        };
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId,code,name,description}){
    try{
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if (!code?.trim() || !name?.trim()) {
            throw new Error("Polja 'code' i 'name' moraju biti popunjena i validna");
        }
        const requestBody = {
            code: code.trim(),
            name: name.trim(),
            description: description.trim(),
        };
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pirlikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        requests.forEach((req, index) => {
            // Validacija obaveznih polja
            if (!req.code?.trim() || !req.name?.trim() || !req.description?.trim() || !req.severity) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'code', 'name', 'description' i 'severity' su obavezni`);
            }
            req.severity = req.severity.toUpperCase();
            if (req.status) req.status = req.status.toUpperCase();
            if (typeof req.confirmed !== "boolean") {
                req.confirmed = false; // default ako nije prosledjeno
            }
        });
        const response = await api.post(url+`/save-all`,requests,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom sveobuhvatnog memorisanja/save-all");
    }
}