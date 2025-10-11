import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/capacityPlannings`;
const isCapacityPlanningStatusValid = ["ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createCapacityPlanning({workCenterId,date,availableCapacity,plannedLoad}){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(workCenterId) || workCenterId == null || !moment(date,"YYYY-MM-DD",true).isValid() ||
            isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0 ||
            isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {workCenterId,date,availableCapacity,plannedLoad};
        const response = await api.post(url+`/create/new-capacityPlanning`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja");
    }
}

export async function updateCapacityPlanning({id,workCenterId,date,availableCapacity,plannedLoad}){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(id) || id == null ||
            isNaN(workCenterId) || workCenterId == null || !moment(date,"YYYY-MM-DD",true).isValid() ||
            isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0 ||
            isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {workCenterId,date,availableCapacity,plannedLoad};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja");
    }
}

export async function deleteCapacityPlanning(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati ID "+id+" nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja");
    }
}

export async function findOne(id){
    try{
       if(isNaN(id) || id == null){
            throw new Error("Dati ID "+id+" nije pronadjen");
        } 
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pronalazenja jednog capacity-planning po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom pronalazaka svih");
    }
}

export async function findByWorkCenter_Id(workCenterId){
    try{
        if(isNaN(workCenterId) || workCenterId == null){
            throw new Error("Dati id "+workCenterId+" za radni centar, nije pronadjen");
        }
        const response = await api.get(url+`/workCenter/${workCenterId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+workCenterId+" za radni-centar");
    }
}

export async function findByWorkCenter_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" radnog centra, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-name`,{
            params:{
                name:name
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" radnog centra");
    }
}

export async function findByWorkCenter_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" radnog centra, nije pronadjena");
        }
        const response = await api.get(url+`/work-center-location`,{
            params:{
                location:location
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" radnog centra");
    }
}

export async function findByDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || 
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati opseg datuma "+start+" - "+end+" za planiranje kapaciteta nije pronadjen");
        }
        const response = await api.get(url+`/date-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opseg datuma "+start+" - "+end+" za planiranje kapaciteta");
    }
}

export async function findByDate(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datuma "+date+" za kapacitet planiranja, nije pronadjen");
        }
        const response = await api.get(url+`/by-date`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po datumu "+date);
    }
}

export async function findByDateGreaterThanEqual(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum "+date+" za kapacitet planiranja, nije pronadjen");
        }
        const response = await api.get(url+`/date-greater-than`,{
            params:{
                date:moment(date).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po datumu "+date);
    }
}

export async function findByAvailableCapacity(availableCapacity){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dati slobodni kapacitet "+parseAvailableCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/by-available-capacity`,{
            params:{
                availableCapacity: parseAvailableCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po dostupnom kapactetu "+availableCapacity);
    }
}

export async function findByAvailableCapacityGreaterThan(availableCapacity){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dati slobodni kapacitet veci od "+parseAvailableCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/available-capacity-greater-than`,{
            params:{
                availableCapacity: parseAvailableCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po slobodnom kapactetu vecem od "+availableCapacity);
    }
}

export async function findByAvailableCapacityLessThan(availableCapacity){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dati slobodni kapacitet manji od "+parseAvailableCapacity+", nije pronadjen");
        }
        const response = await api.get(url+`/available-capacity-less-than`,{
            params:{
                availableCapacity: parseAvailableCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po slobodnom kapactetu manjem od "+availableCapacity);
    }
}

export async function findByPlannedLoad(plannedLoad){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Data planirana kolicina "+parsePlannedLoad+" za kapacitet planiranja, nije pronadjena");
        }
        const response = await api.get(url+`/by-planned-load`,{
            params:{
                plannedLoad:parsePlannedLoad
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po planiranoj kolicini "+plannedLoad);
    }
}

export async function findByPlannedLoadGreaterThan(plannedLoad){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Data planirana kolicina veca od "+parsePlannedLoad+", za kapacitet planiranja, nije pronadjena");
        }
        const response = await api.get(url+`/planned-load-greater-than`,{
            params:{
                plannedLoad:parsePlannedLoad
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po planiranoj kolicini vecoj od "+plannedLoad);
    }
}

export async function findByPlannedLoadLessThan(plannedLoad){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Data planirana kolicina manja od "+parsePlannedLoad+", za kapacitet planiranja, nije pronadjena");
        }
        const response = await api.get(url+`/planned-load-less-than`,{
            params:{
                plannedLoad:parsePlannedLoad
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po planiranoj kolicini manjoj od "+plannedLoad);
    }
}

export async function findByPlannedLoadAndAvailableCapacity({plannedLoad, availableCapacity}){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0 || isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Data planirana "+parsePlannedLoad+" i dostupna "+parseAvailableCapacity+" kolicina za planiranje kapaciteta, nije pronadjena");
        }
        const response = await api.get(url+`/planned-load-available-capacity`,{
            params:{
                plannedLoad:parsePlannedLoad,
                availableCapacity: parseAvailableCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja za planiranu "+plannedLoad+" i slobodnu kolicinu "+availableCapacity);
    }
}

export async function findByRemainingCapacity(remainingCapacity){
    try{
        const parseRemainingCapacity = parseFloat(remainingCapacity);
        if(isNaN(parseRemainingCapacity) || parseRemainingCapacity <= 0){
            throw new Error("Data preostala "+parseRemainingCapacity+" kolicina nije pronadjena");
        }
        const response = await api.get(url+`/remaining-capacity`,{
            params:{
                remainingCapacity:parseRemainingCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po preostaloj kolicini "+remainingCapacity);
    }
}

export async function findWhereRemainingCapacityIsLessThanAvailableCapacity(){
    try{
        const response = await api.get(url+`/remaining-less-than`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli preostalu kolicinu koja je manja od dostupne kolicine");
    }
}

export async function findWhereRemainingCapacityIsGreaterThanAvailableCapacity(){
    try{
        const response = await api.get(url+`/remaining-greater-than`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli preostalu kolicinu koja je veca od dostupne kolicine");
    }
}

export async function findAllOrderByUtilizationDesc(){
    try{
        const response = await api.get(url+`/all-orderBy-utilization-desc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve upotrebe po opadajucem poretku");
    }
}

export async function findWhereLoadExceedsCapacity(){
    try{
        const response = await api.get(url+`/load-exceeds-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat, gde kolicina premasuje kapacitet");
    }
}

export async function findByUtilizationGreaterThan(threshold){
    try{
        if(isNaN(threshold) || threshold == null){
            throw new Error("Dati prag "+threshold+" za upotrebu vecu od, nije pronadjen");
        }
        const response = await api.get(url+`/utilization-greater-than`,{
            params:{
                threshold: threshold
            },
            headers:getHeader()
        });
        return response.data;
    } 
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli upotrebu vecu od datog praga "+threshold);
    }
}

export async function countCapacityPlanningByPlannedLoad(){
    try{
        const response = await api.get(url+`/count/by-planned-load`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj planirane kolicine za planiranje kapaciteta");
    }
}

export async function countCapacityPlanningByAvailableCapacity(){
    try{
        const response = await api.get(url+`/count/by-available-capacity`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj dostupne kolicine za planiranje kapaciteta");
    }
}

export async function countCapacityPlanningsByYearAndMonth(){
    try{
        const response = await api.get(url+`/count/by-year-and-month"`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj planiranja kapaciteta po godini i mesecu");
    }
}

export async function trackCapacityPlanning(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" planiranja-kapaciteta za pracenje, nije pronadjen");
        }
        const response = await api.post(url+`/track/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" planiranja-kapaciteta za pracenje");
    }
}

export async function confirmCapacityPlanning(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu planiranja-kapaciteta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu planiranja-kapaciteta");
    }
}

export async function closeCapacityPlanning(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje planiranja-kapaciteta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
             headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu zatvaranje planiranja-kapaciteta");
    }
}

export async function cancelCapacityPlanning(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje planiranja-kapaciteta, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu otkazivanje planiranja-kapaciteta");
    }
}

export async function changeStatus({id, status}){
    try{
        if(isNaN(id) || id == null || !isCapacityPlanningStatusValid.includes(status?.toUpperCase())){
            throw new Error("ID "+id+" i status planiranja-kapaciteta "+status+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${status}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status planiranja-kapaciteta "+status);
    }
}

export async function saveCapacityPlanning({workCenterId,date,availableCapacity,plannedLoad,status,confirmed = false}){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(workCenterId) || workCenterId == null || !moment(date,"YYYY-MM-DD",true).isValid() || isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0 ||
           isNaN(parsePlannedLoad) || parsePlannedLoad <= 0 || !isCapacityPlanningStatusValid.includes(status?.toUpperCase()) || typeof confirmed !== "boolean") {
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {workCenterId,date,availableCapacity,plannedLoad,status,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({sourceId, workCenterId,date,availableCapacity,plannedLoad,status,confirmed = false}){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(sourceId) || sourceId == null){
            throw new Error("Id "+sourceId+" mora biti ceo broj");
        }
        if(isNaN(workCenterId) || workCenterId == null){
            throw new Error("Id "+workCenterId+" mora biti ceo broj");
        }
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dostupna kolicina "+parseAvailableCapacity+" nora biti broj");
        }
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Planirana kolicina "+parsePlannedLoad+" mora biti broj");
        }
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Datum "+date+" mora biti unet");
        }
        if(!isCapacityPlanningStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" treba izabrati");
        }
        if(typeof confirmed !== "boolean"){
            throw new Error("Potvrdu "+confirmed+" treba izabrata");
        }
        const requestBody = {workCenterId,date,availableCapacity,plannedLoad,status,confirmed};
        const response = await api.post(url+`/save-as`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja-kao/save-as");
    }
}

export async function saveAll(requests){
    try{
        if(!Array.isArray(requests) || requests.length === 0){
            throw new Error("Lista zahteva mora biti validan niz i ne sme biti prazna");
        }
        requests.forEach((index, req) => {
            if (req.id == null || isNaN(req.id)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'id' je obavezan i mora biti broj`);
            }
            if (req.workCenterId == null || isNaN(req.workCenterId)) {
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'workCenterId' je obavezan i mora biti broj`);
            }
            const parseAvailableCapacity = parseFloat(req.availableCapacity);
            const parsePlannedLoad = parseFloat(req.plannedLoad);
            if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'dostupna-kolicina' mora biti broj`);
            }
            if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'planirana-kolicina' mora biti broj`);
            }
            if(!moment(date,"YYYY-MM-DD",true).isValid()){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'datum' se mora uneti`);
            }
            if(!isCapacityPlanningStatusValid.includes(req.status?.toUpperCase())){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'status' je obavezan `);
            }
            if(typeof req.confirmed !== "boolean"){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'confirmed' je obavezan `);
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