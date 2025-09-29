import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/trips`;
const isTripStatusValid = ["PLANNED","IN_PROGRESS","COMPLETED","CANCELLED"];
const isTripTypeStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];
const isDriverStatusValid = ["ALL","ACTIVE","NEW","CONFIRMED","CLOSED","CANCELLED"];

export async function createTrip({startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed}){
    try{
        if(!startLocation || typeof startLocation !== "string" || startLocation.trim() === "" ||
           !endLocation || typeof endLocation !== "string" || endLocation.trim() === "" ||
           !moment(startTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !isTripStatusValid.includes(status?.toUpperCase()) || !isTripTypeStatusValid.includes(typeStatus?.toUpperCase()) ||
           isNaN(driverId) || driverId == null || typeof confirmed !== "boolean" ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed};
        const response = await api.post(url+`/create/new-trip`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja putovanja/trip");
    }
}

export async function updateTrip({id, startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed}){
    try{
        if(isNaN(id) || id == null ||
           !startLocation || typeof startLocation !== "string" || startLocation.trim() === "" ||
           !endLocation || typeof endLocation !== "string" || endLocation.trim() === "" ||
           !moment(startTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !isTripStatusValid.includes(status?.toUpperCase()) || !isTripTypeStatusValid.includes(typeStatus?.toUpperCase()) ||
           isNaN(driverId) || driverId == null || typeof confirmed !== "boolean" ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja putovanja/trip");
    }
}

export async function deleteTrip(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za putovanje/trip, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja jednog putovanja/trip po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za putovanje/trip, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog pitovanja/trip po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih putovanja");
    }
}

export async function findByStartLocationContainingIgnoreCase(startLocation){
    try{
        if(!startLocation || typeof startLocation !== "string" || startLocation.trim() === ""){
            throw new Error("Pocetna lokacija "+startLocation+" putovanja, nije pronadjena");
        }
        const response = await api.get(url+`/start-location`,{
            params:{
                startLocation:startLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli startnu "+startLocationLocation+" lokaciju za dato putovanje/trip");
    }
}

export async function findByEndLocationContainingIgnoreCase(endLocation){
    try{
        if(!endLocation || typeof endLocation !== "string" || endLocation.trim() === ""){
            throw new Error("Krajnja lokacija "+endLocation+" putovanja, nije pronadjena");
        }
        const response = await api.get(url+`/end-location`,{
            params:{
                endLocation:endLocation
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli krajnju "+endLocation+" lokaciju za dato putovanje/trip");
    }
}

export async function findByStartTime(startTime){
    try{
        if(!moment(startTime,"YYYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Vreme pocetka "+startTime+" datog putovanja, nije pronadjeno");
        }
        const response = await api.get(url+`/start-time`,{
            params:{
                startTime:moment(startTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme "+startTime+" pocetka, datog putovanja");
    }
}

export async function findByStartTimeBefore(startTime){
    try{
        if(!moment(startTime,"YYYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Vreme pocetka-pre "+startTime+" datog putovanja, nije pronadjeno");
        }
        const response = await api.get(url+`/start-time-before`,{
            params:{
                startTime:moment(startTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme "+startTime+" pocetka pre, datog putovanja");
    }
}

export async function findByStartTimeAfter(startTime){
    try{
        if(!moment(startTime,"YYYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Vreme pocetka-posle "+startTime+" datog putovanja, nije pronadjeno");
        }
        const response = await api.get(url+`/start-time-after`,{
            params:{
                startTime:moment(startTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme "+startTime+" pocetka-posle, datog putovanja");
    }
}

export async function findByStartTimeBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum opsega "+start+" - "+end+" datog putovanja, nije pronadjeno");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj putovanja, ne sme biti ispred datuma za pocetak putovanja");
        }
        const response = await api.get(url+`/start-time-range`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno mismo pronasli datum opsega "+start+" - "+end+" za dato putovanje");
    }
}

export async function findByEndTime(endTime){
    try{
        if(!moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum za kraj "+endTime+" putovanja, nije pronadjen");
        }
        const response = await api.get(url+`/end-time`,{
            params:{
                end:moment(endTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme za kraj "+endTime+" datog putovanja");
    }
}

export async function findByEndTimeBefore(endTime){
    try{
        if(!moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum za kraj-pre "+endTime+" putovanja, nije pronadjen");
        }
        const response = await api.get(url+`/end-time-before`,{
            params:{
                end:moment(endTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme za kraj-pre "+endTime+" datog putovanja");
    }
}

export async function findByEndTimeAfter(endTime){
    try{
        if(!moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Datum za kraj-posle "+endTime+" putovanja, nije pronadjen");
        }
        const response = await api.get(url+`/end-time-after`,{
            params:{
                end:moment(endTime).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vreme za kraj-posle "+endTime+" datog putovanja");
    }
}

export async function findByEndTimeBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Opseg datuma kraja "+start+" - "+end+" za dato putovanje, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj putovanja, ne sme biti ispred datuma za pocetak putovanja");
        }
        const response = await api.get(url+`/end-time-range"`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum opsega kraja "+start+" - "+end+" za dato putovanje");
    }
}

export async function findTripsWithinPeriod({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Opseg datuma unutar perioda "+start+" - "+end+" za dato putovanje, nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj putovanja, ne sme biti ispred datuma za pocetak putovanja");
        }
        const response = await api.get(url+`/within-period-range"`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum opsega unutar perioda "+start+" - "+end+" za dato putovanje");
    }
}

export async function findByStatus(status){
    try{
        if(!isTripStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status "+status+" putovanja, nije pronadjen");
        }
        const response = await api.get(url+`/trip-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status "+status+"  datog putovanja");
    }
}

export async function findByDriverId(driverId){
    try{
        if(isNaN(driverId) || driverId == null){
            throw new Error("ID "+driverId+" vozaca za dato putovanje, nije pronadjen");
        }
        const response = await api.get(url+`/driver/${driverId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+driverId+" vozaca, za dato putovanje");
    }
}

export async function findByStatusAndDriverFirstNameContainingIgnoreCaseAndDriverLastNameContainingIgnoreCase({status, firstName, lastName}){
    try{
        if(!isTripStatusValid.includes(status?.toUpperCase()) || !firstName || typeof firstName !== "string" || firstName.trim === "" ||
           !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Status putovanja "+status+" i ime "+firstName+" i prezime "+lastName+" vozaca, nije pronadjeno");
        }
        const response = await api.get(url+`/trip-status-and-driver-first-last-name`,{
            params:{
                status:(status || "").toUpperCase(),
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status putovanja "+status+" i ime "+firstName+" i prezime "+lastName+" vozaca");
    }
}

export async function findByDriverFirstNameContainingIgnoreCaseAndDriverLastNameContainingIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === ""){
            throw new Error("Ime "+firstName+" i prezime "+lastName+" vozaca za dato putovanje, nije pronadjeno");
        }
        const response = await api.get(url+`/driver/first-name-and-last-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ime "+firstName+" i prezime "+lastName+" vozaca, za dato putovanje");
    }
}

export async function findByDriverPhoneLikeIgnoreCase(phone){
    try{
        if(!phone || typeof phone !== "string" || phone.trim() === ""){
            throw new Error("Broj-telefona "+phone+" vozaca za dato putovanje, nije pronadjeno");
        }
        const response = await api.get(url+`/search/driver-phone`,{
            params:{phone:phone},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phone+" vozaca za dato putovanje");
    }
}

export async function findByDriver_Status(status){
    try{
        if(!isDriverStatusValid.includes(status?.toUpperCase())){
            throw new Error("Status-vozaca "+status+" za putovanje, nije pronadjeno");
        }
        const response = await api.get(url+`/search/driver-status`,{
            params:{
                status:(status || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli status-vozaca "+status+" za dato putovanje");
    }
}

export async function findByStatusIn(statuses){
    try{
        if(!isTripStatusValid.includes(statuses?.toUpperCase())){
            throw new Error("Data lista svih ozbiljnosti za defekat, nije pronadjena");
        }
        const response = await api.get(url+`/trip-statuses`,{
            params:{
                statuses: arrayLevels
            },
            paramsSerializer: params =>{
                return params.statuses.map(l => `arrayLevels=${l.toUpperCase()}`).join("&")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli listu svih status-putovanja "+statuses);
    }
}

export async function searchByDateOnly(dateOnly){
    try{
        if(!moment(dateOnly,"YYYY-MM-DD",true).isValid()){
            throw new Error("Pretraga po samo datumu "+dateOnly+" ne daje odgovarajuci rezultat");
        }
        const response = await api.get(url+`/search/by-date"`,{
            params:{
                dateOnly:moment(dateOnly).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat pretrage po "+dateOnly+" samo datumu");
    }
}

export async function generalSearch(req){
    try{
        const response = await api.get(url+`/general-search`,{
            params:{
                req : req
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli odogvarajuci rezultat prema generalnoj pretrazi");
    }
}

export async function cancelTrip(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za otkazivanje putovanja, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/cancel`,{
            headers:getHeader()
        });
        return response.data;
        }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato otkazivanje putovanja");
    }
}

export async function closeTrip(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za zatvaranje putovanja, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/close`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za dato zatvaranje putovanja");
    }
}

export async function confirmTrip(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("ID "+id+" za potvrdu putovanja, nije pronadjen");
        }
        const response = await api.post(url+`/${id}/confirm`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" za datu potvrdu putovanja");
    }
}

export async function changeStatus(id, newStatus){
    try{
        if(isNaN(id) || id == null || !isTripTypeStatusValid.includes(newStatus?.toUpperCase())){
                throw new Error("ID "+id+" i status putovanja "+newStatus+" nisu pronadjeni");
        }
        const response = await api.post(url+`/${id}/status/${newStatus}`,{
            headers:getHeader()
        });
        return response.data;
        }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" i status putovanja "+newStatus);
    }
}

export async function saveTrip({startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed = false}){
    try{
        if(!startLocation || typeof startLocation !== "string" || startLocation.trim() === "" ||
           !endLocation || typeof endLocation !== "string" || endLocation.trim() === "" ||
           !moment(startTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !isTripStatusValid.includes(status?.toUpperCase()) || !isTripTypeStatusValid.includes(typeStatus?.toUpperCase()) ||
           isNaN(driverId) || driverId == null || typeof confirmed !== "boolean" ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed};
        const response = await api.post(url+`/save`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom memorisanja/save");
    }
}

export async function saveAs({id,startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed = false}){
    try{
        if( isNaN(id) || id == null ||
            !startLocation || typeof startLocation !== "string" || startLocation.trim() === "" ||
           !endLocation || typeof endLocation !== "string" || endLocation.trim() === "" ||
           !moment(startTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() || !moment(endTime,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
           !isTripStatusValid.includes(status?.toUpperCase()) || !isTripTypeStatusValid.includes(typeStatus?.toUpperCase()) ||
           isNaN(driverId) || driverId == null || typeof confirmed !== "boolean" ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {startLocation, endLocation,startTime,endTime,status,typeStatus,driverId,confirmed};
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
        requests.forEach((req, index) => {
            if(!req.startLocation?.trim() || !req.endLocation?.trim() || !moment(req.endTime) || !req.status || !req.typeStatus || isNaN(req.driverId)){
                throw new Error(`Nevalidan zahtev na indexu ${index}: 'start-location', 'end-location', 'end-time','status','typeStatus' i 'driver-id' su obavezni`);
            }
            req.status = req.status.toUpperCase();
            req.typeStatus = req.typeStatus.toUpperCase();
            if (req.status) req.status = req.status.toUpperCase();
            if(req.typeStatus) req.typeStatus = req.typeStatus.toUpperCase();
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