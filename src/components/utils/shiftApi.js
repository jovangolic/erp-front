import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";
import moment from "moment";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/shifts`;

export async function createShift({startTime, endTime, shiftSupervisorId}){
    try{
        const validateStart = moment.isMoment(startTime) || moment(startTime, "YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(endTime) || moment(endTime, "YYYY-MM-DDTHH:mm:ss").isValid();
        if(
            !validateStart || !validateEnd ||
            shiftSupervisorId == null || isNaN(shiftSupervisorId)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        if(moment(endTime).isBefore(moment(startTime))){
            throw new Error("Datum-vreme za kraj ne sme biti ispred datum-vreme za pocetak");
        }
        const requestBody = {
            startTime, endTime,shiftSupervisorId: shiftSupervisorId
        };
        const response = await api.post(url+`/new/create-shift`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom kreiranja smene: " + error.message);
        }
    }
}

export async function updateShift({id,startTime, endTime, shiftSupervisorId}){
    try{
        const validateStart = moment.isMoment(startTime) || moment(startTime, "YYYY-MM-DDTHH:mm:ss").isValid();
        const validateEnd = moment.isMoment(endTime) || moment(endTime, "YYYY-MM-DDTHH:mm:ss").isValid();
        if(
            id == null || isNaN(id) ||
            !validateStart || !validateEnd ||
            shiftSupervisorId == null || isNaN(shiftSupervisorId)
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        if(moment(endTime).isBefore(moment(startTime))){
            throw new Error("Datum-vreme za kraj ne sme biti ispred datum-vreme za pocetak");
        }
        const requestBody = {
            startTime, endTime,shiftSupervisorId: shiftSupervisorId
        };
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error("Greska prilikom azuriranja smene: " + error.message);
        }
    }
}

export async function deleteShift(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije nadjen");
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

export async function getShiftById(id){
    try{   
        if(id == null || isNaN(id)){
            throw new Error("Dati ID "+id+" nije nadjen");
        } 
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom trazenja po "+id+" id-iju");
    }
}

export async function getAllShifts(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja svih smeni");
    }
}

export async function findByEndTimeBefore(time){
    try{
        const validateDateTime = moment.isMoment(time) || moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateTime){
            throw new Error("Dato vreme "+time+" kraja smene nije pronadjeno");
        }
        const response = await api.get(url+`/search/end-time-before`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo smene koje se zavrsavaju pre "+time+" izabranog vremena");
    }
}

export async function findByEndTimeAfter(time){
    try{
        const validateDateTime = moment.isMoment(time) || moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateTime){
            throw new Error("Dato vreme "+time+" kraja smene nije pronadjeno");
        }
        const response = await api.get(url+`/search/end-time-after`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo smene koje se zavrsavaju posle "+time+" izabranog vremena");
    }
}

export async function findByStartTimeAfter(time){
    try{
        const validateDateTime = moment.isMoment(time) || moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateTime){
            throw new Error("Dato vreme "+time+" pocetka smene nije pronadjeno");
        }
        const response = await api.get(url+`/search/start-time-after`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo smene koje pocinju posle "+time+" izabranog vremena");
    }
}

export async function findByStartTimeBefore(time){
    try{
        const validateDateTime = moment.isMoment(time) || moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateTime){
            throw new Error("Dato vreme "+time+" pocetka smene nije pronadjeno");
        }
        const response = await api.get(url+`/search/start-time-before`,{
            params:{time:moment(time).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo smene koje pocinju pre "+time+" izabranog vremena");
    }
}

export async function findByEndTimeBetween({start, end}){
    try{
        const validateDateTimeStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateTimeEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(!validateDateTimeStart || !validateDateTimeEnd){
            throw new Error("Dati opseg "+start+" - "+end+" kraja smene nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/end-time-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo smene koje se zavrsavaju u unetom vremenskom "+start+" - "+end+" opsegu");
    }
}

export async function findActiveShifts(){
    try{
        const response = await api.get(url+`/search/active-shifts`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja aktivnih smena");
    }
}

export async function findByEndTimeIsNull(){
    try{
        const response = await api.get(url+`/search/end-time-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo kraj smene koje su nepostojece");
    }
}

export async function findByShiftSupervisorIdAndStartTimeBetween({supervisorId, start, end}){
    try{
        const validateDateTimeStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        const validateDateTimeEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid();
        if(
            supervisorId == null || isNaN(supervisorId) ||
            !validateDateTimeStart || !validateDateTimeEnd
         ){
            throw new Error("Dati ID "+supervisorId+" nadzorinka i opseg "+start+" - "+end+" smena nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/supervisor/${supervisorId}/start-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo I "+supervisorId+" za nadzornika i dati opseg "+start+" - "+end+" smena");
    }
}

export async function findByShiftSupervisorIdAndEndTimeIsNull(supervisorId){
    try{
        if(isNaN(supervisorId) || supervisorId == null ){
            throw new Error("Dati ID "+supervisorId+" za nadzornika nije pronadjen");
        }
        const response = await api.get(url+`/search/supervisor/${supervisorId}/end-time-null`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo ID "+supervisorId+" za nadzornika i kada je kraj smene nepostojeci");
    }
}

export async function countShiftsByStartDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD", true).isValid();
        if(!validateDate){
            throw new Error("Dati ukupan broj smena sa pocetnim "+date+" datumom nije pronadjen");
        }
        const response = await api.get(url+`/search/count-start-date`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo ukupan broj smena sa pocetkom datog "+date+"datuma");
    }
}

export async function countShiftsByEndDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD", true).isValid();
        if(!validateDate){
            throw new Error("Dati ukupan broj smena sa datumom "+date+" zavrsetka nije pronadjen");
        }
        const response = await api.get(url+`/search/count-end-date`,{
            params:{date:moment(date).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo ukupan broj smena koje se zavrsavaju odredjenog "+date+" datuma");
    }
}

export async function findCurrentShiftBySupervisor(supervisorId){
    try{
        if(supervisorId == null || isNaN(supervisorId)){
            throw new Error("Dati ID "+supervisorId+" nadzornika za trenutnu smenu nije pronadjen");
        }
        const response = await api.get(url+`/search/supervisor/${supervisorId}/current`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da nadjemo ID "+supervisorId+" nadzornika za trenutnu smenu");
    }
}

export async function findShiftsLongerThan(hours){
    try{
        const parseHours = parseInt(hours,10);
        if(isNaN(parseHours) || parseHours <= 0 ){
            throw new Error("Dato vreme "+parseHours+" za smene koje trazju duze od 8 sati nisu pronadjene");
        }
        const response = await api.get(url+`/search/shift-longer-than`,{
            params:{hours:parseHours},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo smene koje traju duze "+hours+" od 8 sati");
    }
}

export async function findShiftsOverlappingPeriod({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DDTHH:mm:ss", true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DDTHH:mm:ss", true).isValid();
        if(!validateDateStart || !validateDateEnd ){
            throw new Error("Dati opseg "+start+" - "+end+" preklapanja smena nije pronadjen");
        }
        if(moment(end).isBefore(moment(start))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/search/overlapping-shifts`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo pronasli smene koje se preklapaju za odredjeni vremenski "+start+" - "+end+" period");
    }
}

export async function findNightShifts(){
    try{
        const response = await api.get(url+`/search/night-shifts`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo nocnu smenu");
    }
}

export async function findFutureShifts(now){
    try{
        const validateDate = moment.isMoment(now) || moment(now,"YYYY-MM-DDTHH:mm:ss", true).isValid();
        if(!validateDate){
            throw new Error("Date buduce smene koje pocinju od datog "+now+" datuma i vremena nisu pronadjene");
        }
        const response = await api.get(url+`/search/future-shifts`,{
            params:{now:moment(now).format("YYYY-MM-DDTHH:mm:ss")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo buduce nocne smene koje pocinju od datog "+now+" datuma i vremena");
    }
}

export async function findAllFutureShifts(){
    try{
        const response = await api.get(url+`/future`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismu uspeli da pronadjemo sve buduce smene");
    }
}

export async function findByShiftSupervisor_EmailLikeIgnoreCase(email){
    try{
        if(!email || typeof email !=="string" || email.trim() === ""){
            throw new Error("Dati email "+email+" za nadzornika nije pronadjen");
        }
        const response = await api.get(url+`/search/supervisor/email`,{
            params:{email:email},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo email "+email+" koji pripada nadzorniku");
    }
}

export async function findByShiftSupervisorPhoneNumberLikeIgnoreCase(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !=="string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" za nadzornika nije pronadjen");
        }
        const response = await api.get(url+`/search/supervisor/phone-number`,{
            params:{phoneNumber:phoneNumber},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo broj-telefona "+phoneNumber+" koji pripada nadzorniku");
    }
}

export async function findByShiftSupervisor_FirstNameLikeIgnoreCaseAndLastNameLikeIgnoreCase({firstName, lastName}){
    try{
        if(!firstName || typeof firstName !=="string" || firstName.trim() === "" ||
            !lastName || typeof lastName !=="string" || lastName.trim() === ""){
            throw new Error("Dato ime "+firstName+" i prezime "+lastName+" nadzornika nije pronadjeno");
        }
        const response = await api.get(url+`/search/supervisor/fullName`,{
            params:{firstName:firstName, lastName:lastName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Nismo uspeli da pronadjemo ime "+firstName+" i prezime "+lastName+" za datog nadzornika");
    }
}

export async function hasActiveShift(supervisorId){
    try{
        if(isNaN(supervisorId) || supervisorId == null){
            throw new Error("ID "+supervisorId+" nadzornika za proveru aktivne smene nije validan ili nije unet");
        }
        const response =await api.get(url+`/active/${supervisorId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nije moguce proveriti da li nadzornik sa id-ijem "+supervisorId+" ima aktivnu smenu");
    }
}



