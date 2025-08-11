import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/capacityPlannings`;

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
            throw new Error("Dati ID nije pronadjen");
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
            throw new Error("Dati ID nije pronadjen");
        } 
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pronalazenja jednog capacity-planning");
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
            throw new Error("Dati id za radni centar, nije pronadjen");
        }
        const response = await api.get(url+`/workCenter/${workCenterId}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli id za radni-centar");
    }
}

export async function findByWorkCenter_NameContainingIgnoreCase(name){
    try{
        if(!name || typeof name !== "string" || name.trim() === ""){
            throw new Error("Dati naziv radnog centra, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli naziv radnog centra");
    }
}

export async function findByWorkCenter_LocationContainingIgnoreCase(location){
    try{
        if(!location || typeof location !== "string" || location.trim() === ""){
            throw new Error("Data lokacija radnog centra, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli lokaciju radnog centra");
    }
}

export async function findByDateBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || 
            !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati opseg datuma za planiranje kapaciteta nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli opseg datumna za planiranje kapaciteta");
    }
}

export async function findByDate(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum za kapacitet planiranja, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po datumu");
    }
}

export async function findByDateGreaterThanEqual(date){
    try{
        if(!moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum za kapacitet planiranja, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po datumu");
    }
}

export async function findByAvailableCapacity(availableCapacity){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dati slobodni kapacitet, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po slobodnom kapactetu");
    }
}

export async function findByAvailableCapacityGreaterThan(availableCapacity){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dati slobodni kapacitet veci od, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po slobodnom kapactetu vecem od");
    }
}

export async function findByAvailableCapacityLessThan(availableCapacity){
    try{
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Dati slobodni kapacitet manji od, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli dati kapacitet planiranja po slobodnom kapactetu manjem od");
    }
}

export async function findByPlannedLoad(plannedLoad){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Data planirana kolicina za kapacitet planiranja, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po planiranoj kolicini");
    }
}

export async function findByPlannedLoadGreaterThan(plannedLoad){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Data planirana kolicina veca od, za kapacitet planiranja, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po planiranoj kolicini vecoj od");
    }
}

export async function findByPlannedLoadLessThan(plannedLoad){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0){
            throw new Error("Data planirana kolicina manja od, za kapacitet planiranja, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po planiranoj kolicini manjoj od");
    }
}

export async function findByPlannedLoadAndAvailableCapacity({plannedLoad, availableCapacity}){
    try{
        const parsePlannedLoad = parseFloat(plannedLoad);
        const parseAvailableCapacity = parseFloat(availableCapacity);
        if(isNaN(parsePlannedLoad) || parsePlannedLoad <= 0 || isNaN(parseAvailableCapacity) || parseAvailableCapacity <= 0){
            throw new Error("Data planirana i slobodna kolicina za planiranje kapaciteta, nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja za planiranu i slobodnu kolicinu");
    }
}

export async function findByRemainingCapacity(remainingCapacity){
    try{
        const parseRemainingCapacity = parseFloat(remainingCapacity);
        if(isNaN(parseRemainingCapacity) || parseRemainingCapacity <= 0){
            throw new Error("Data preostala kolicina nije pronadjena");
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
        handleApiError(error,"Trenutno nismo pronasli kapacitet planiranja po preostaloj kolicini");
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
            throw new Error("Dati prag za upotrebu vecu od, nije pronadjen");
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
        handleApiError(error,"Trenutno nismo pronasli upotrebu vecu od datog praga");
    }
}