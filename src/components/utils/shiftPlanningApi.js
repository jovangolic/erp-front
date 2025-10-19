import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/shiftPlannings`;
const isShiftTypeValid = ["MORNING","AFTERNOON","NIGHT"];

export async function createShiftPlanning({workCenterId,userId,date,shiftType,assigned}){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(
            Number.isNaN(Number(workCenterId)) || workCenterId == null || Number.isNaN(Number(userId)) || userId == null ||
            !validateDate || !isShiftTypeValid.includes(shiftType?.toUpperCase()) || typeof assigned !== "boolean"){
                throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {workCenterId,userId,date,shiftType,assigned};
        const response = await api.post(url+`/create/new-shiftPlanning`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja planiranje smena");
    }
}

export async function updateShiftPlanning({id,workCenterId,userId,date,shiftType,assigned}){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(
            id == null || Number.isNaN(Number(id)) ||
            Number.isNaN(Number(workCenterId)) || workCenterId == null || Number.isNaN(Number(userId)) || userId == null ||
            !validateDate || !isShiftTypeValid.includes(shiftType?.toUpperCase()) || typeof assigned !== "boolean"){
                throw new Error("Sva polja moraju biti popunjena i validirana");
        }
        const requestBody = {workCenterId,userId,date,shiftType,assigned};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja planiranje smena");
    }
}

export async function deleteShiftPlanning(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati id "+id+" za planiranje-smena, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom brisanja za planiranje smena");
    }
}

export async function findOne(id){
    try{
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati id "+id+" za planiranje-smena, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jedne smene po "+id+" id-iju");
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
        handleApiError(error,"Greksa prilikom trazenja svih smena");
    }
}

export async function findByWorkCenter_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv "+name+" radnog centra za smenu, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-name"`,{
            params:{name:name},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli naziv "+name+" radnog centra za smenu");
    }
}

export async function findByWorkCenter_Capacity(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet "+parseCapacity+" radnog centra za smenu, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet "+capacity+" radnog centra, za smenu");
    }
}

export async function findByWorkCenter_CapacityGreaterThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra veci od "+parseCapacity+", za smenu, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-greater-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra veceg od "+capacity+", za smenu");
    }
}

export async function findByWorkCenter_CapacityLessThan(capacity){
    try{
        const parseCapacity = parseFloat(capacity);
        if(Number.isNaN(Number(parseCapacity)) || parseCapacity <= 0){
            throw new Error("Dati kapacitet radnog centra manji od "+parseCapacity+", za smenu, nije pronadjen");
        }
        const response = await api.get(url+`/work-center-capacity-less-than`,{
            params:{
                capacity:parseCapacity
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kapacitet radnog centra manjeg od "+capacity+", za smenu");
    }
}

export async function findByWorkCenter_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija "+location+" radnog centra za smenu, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju "+location+" radnog centra za smenu");
    }
}

export async function findByEmployee_Id(id){
    try{
        if(Number.isNaN(Number(id)) || id == null){
            throw new Error("Dati ID "+id+" zaposlenog, nije pronadjen");
        }
        const response = await api.get(url+`/employee/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+id+" zaposlenog za trenutnu smenu");
    }
}

export async function findByEmployee_Email(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email "+email+" zaposlenog, nije pronadjen");
        }
        const response = await api.get(url+`/employee-email`,{
            params:{
                email:email
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli email "+email+" zapolsenog za planiranje smene");
    }
}

export async function findByEmployee_UsernameContainingIgnoreCase(username){
    try{
        if(!username || typeof username !== "string" || username.trim() === ""){
            throw new Error("Dato korisnicko ime "+username+" zaposlenog, nije pronadjeno");
        }
        const response = await api.get(url+`/employee-username`,{
            params:{
                username:username
            },
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli korisnicko ime "+username+" zapolsenog za planiranje smene");
    }
}

export async function findByEmployee_PhoneNumber(phoneNumber){
    try{
        if(!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === ""){
            throw new Error("Dati broj-telefona "+phoneNumber+" zaposlenog, nije pronadjen");
        }
        const response = await api.get(url+`/employee-phone-number`,{
            params:{
                phoneNumber:phoneNumber
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli broj-telefona "+phoneNumber+" zaposlenog za planiranje smene");
    }
}

export async function findByDate(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum "+validateDate+" za planiranje smene nije pronadjen");
        }
        const response = await api.get(url+`/by-date`,{
            params:{
                datr:moment(validateDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum "+date+" za planiranje smene");
    }
}

export async function findByDateBetween({start, end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(!validateDateStart || !validateDateEnd){
            throw new Error("Datum opsega "+validateDateStart+" - "+validateDateEnd+" za planiranje smene, nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za pocetak ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/date-range`,{
            params:{
                start:moment(validateDateStart).format("YYYY-MM-DD"),
                end:moment(validateDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trewnutno nismo pronasli opseg "+start+" - "+end+" datuma za planiranje smene");
    }
}

export async function findByDateGreaterThanEqual(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Datum veci od "+validateDate+" za planiranje smene nije pronadjen");
        }
        const response = await api.get(url+`/date-greater-than`,{
            params:{
                date:moment(validateDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum veci od "+date+" za planiranje smene");
    }
}

export async function findOrdersWithStartDateAfterOrEqual(date){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(!validateDate){
            throw new Error("Start datuma posle "+validateDate+" za planiranje smene, nije pronadjen");
        }
        const response = await api.get(url+`/orders-with-start-date-after`,{
            params:{
                date:moment(validateDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli start datuma posle "+date+" za planiranje smene");
    }
}

export async function findByShiftType(shiftType){
    try{
        if(!isShiftTypeValid.includes(shiftType?.toUpperCase())){
            throw new Error("Tip smene "+shiftType+" za planiranje nije pronadjen");
        }
        const response = await api.get(url+`/by-shift-type`,{
            params:{
                shiftType:(shiftType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip smene "+shiftType+" za planiranje");
    }
}

export async function findByAssigned(assigned){
    try{
        if(typeof assigned !== "boolean"){
            throw new Error("Dodeljena smena "+assigned+" nije pronadjena");
        }
        const response = await api.get(url+`/by-assigned`,{
            params:{
                assigned:assigned
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli dodeljenu smenu = "+assigned);
    }
}

export async function findByEmployee_IdAndAssignedTrue(employeeIds){
    try{
        if(Number.isNaN(Number(employeeIds)) || employeeIds == null){
            throw new Error("ID  "+employeeIds+"zapolsenog nije pronadjen");
        }
        const response = await api.get(url+`/employee/${employeeIds}/assigned`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id "+employeeIds+" zaposlenog gde je dodeljena smena tacna");
    }
}

export async function findByEmployee_IdAndShiftType({employeeId,shiftType}){
    try{
        if(Number.isNaN(Number(employeeId)) || employeeId == null || !isShiftTypeValid.includes(shiftType?.toUpperCase())){
            throw new Error("ID zaposlenog "+employeeId+" i tip smene "+shiftType+" nije pronadjen");
        }
        const response = await api.get(url+`/employee/${employeeId}/shift-type`,{
            params:{
                shiftType:(shiftType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id zaposlenog "+employeeId+" i tip smene "+shiftType);
    }
}

export async function findByWorkCenter_IdAndDateAfterAndAssignedFalse({workCenterIds, date}){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(Number.isNaN(Number(workCenterIds)) || workCenterIds == null || !validateDate){
            throw new Error("ID radnog centra "+workCenterIds+" i datum posle "+validateDate+" nisu pronadjeni");
        }
        const response = await api.get(url+`/work-center/${workCenterIds}/date`,{
            params:{
                date:moment(validateDate).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id radnog centra "+workCenterIds+" i datum posle "+date);
    }
}

export async function findShiftsForEmployeeBetweenDates({employeeId, start,end}){
    try{
        const validateDateStart = moment.isMoment(start) || moment(start,"YYYY-MM-DD",true).isValid();
        const validateDateEnd = moment.isMoment(end) || moment(end,"YYYY-MM-DD",true).isValid();
        if(Number.isNaN(Number(employeeId)) || employeeId == null || !validateDateStart || !validateDateEnd){
            throw new Error("ID zaposlenog "+employeeId+" i opseg datuma "+validateDateStart+" i "+validateDateEnd+" nije pronadjen");
        }
        if(moment(validateDateEnd).isBefore(moment(validateDateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/employee/${employeeId}/date-range`,{
            params:{
                start:moment(validateDateStart).format("YYYY-MM-DD"),
                end:moment(validateDateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id zaposlenog "+employeeId+" i opseg datuma "+start+" i "+end+".");
    }
}

export async function existsByEmployee_IdAndDateAndShiftType({employeeId, date, shiftType}){
    try{
        const validateDate = moment.isMoment(date) || moment(date,"YYYY-MM-DD",true).isValid();
        if(Number.isNaN(Number(employeeId)) || employeeId == null || !validateDate || !isShiftTypeValid.includes(shiftType?.toUpperCase())){
            throw new Error("ID zaposlenog "+employeeId+" datum "+validateDate+" i tip smene "+shiftType+" nisu pronadjeni");
        }
        const response = await api.get(url+`/employee/${employeeId}/date-shift-type`,{
            params:{
                date:moment(validateDate).format("YYYY-MM-DD"),
                shiftType:(shiftType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id zaposlenog "+employeeId+" datum "+date+" i tip smene "+shiftType);
    }
}

export async function findByEmployeeFirstContainingIgnoreCaseAndLastNameContainingIgnoreCase({firstName,lastName}){
    try{
        if(!firstName || typeof firstName !== "string" || firstName.trim() === "" ||
           !lastName || typeof lastName !== "string" || lastName>trim() === ""){
            throw new Error("Dato "+firstName+" "+lastName+" zaposlenog za planiranje smene, nije pronadjeno");
        }
        const response = await api.get(url+`/by-employee-full-name`,{
            params:{
                firstName:firstName,
                lastName:lastName
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli "+firstName+" "+lastName+" zaposlenog za planiranje smene");
    }
}