import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/taxRates`;
const isTaxRateTypeValid = ["VAT", "INCOME_TAX", "SALES_TAX", "CUSTOM"];

export async function createTaxRate({taxName,percentage,startDate,endDate,type}){
    try{
        const parsePercentage = parseFloat(percentage);
        if(
            !taxName || typeof taxName !=="string" || taxName.trim() === "" ||
            isNaN(parsePercentage) || parsePercentage <= 0 ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid() ||
            !isTaxRateTypeValid.includes(type?.toUpperCase())
        ){ 
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {taxName,percentage,startDate,endDate,type};
        const response = await api.post(url+`/create/new-taxRate`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja TaxRate-a");
    }
}

export async function updateTaxRate({id,taxName,percentage,startDate,endDate,type}){
    try{
        const parsePercentage = parseFloat(percentage);
        if( id == null || isNaN(id) ||
            !taxName || typeof taxName !=="string" || taxName.trim() === "" ||
            isNaN(parsePercentage) || parsePercentage <= 0 ||
            !moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid() ||
            !isTaxRateTypeValid.includes(type?.toUpperCase())
        ){ 
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {taxName,percentage,startDate,endDate,type};
        const response = await api.put(url+`/update/${id}`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja taxRate-a");
    }
}

export async function deleteTaxRate(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za taxRate nije pronadjen");
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
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za taxRate nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja jednog taxRate-a");
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
        handleApiError(error,"Greska prilikom dobavljanja svih taxRate-ova");
    }
}

export async function findByType(type){
    try{
        if(!isTaxRateTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip za taxRate nije pronadjen");
        }
        const response = await api.get(url+`/by-type`,{
            params:{type:(type  || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema tipu taxRate-a");
    }
}

export async function findByTaxName(taxName){
    try{
        if(!taxName || typeof taxName !=="string" || taxName.trim() === ""){
            throw new Error("Dati taxName nije pronadjen");
        }
        const response = await api.get(url+`/by-taxName`,{
            params:{taxName:taxName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazena prema nazivu taxRate-a");
    }
}

export async function findByPercentage(percentage){
    try{
        const parsePercentage = parseFloat(percentage);
        if(isNaN(parsePercentage) || parsePercentage <= 0){
            throw new Error("");
        }
        const response = await api.get(url+`/by-percentage`,{
            params:{percentage:parsePercentage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema procentu");
    }
}

export async function findByTaxNameAndPercentage({taxName, percentage}){
    try{
        const parsePercentage = parseFloat(percentage);
        if(
            !taxName || typeof taxName !=="string" || taxName.trim() === "" ||
            isNaN(parsePercentage) || parsePercentage <= 0 ){
                throw new Error("Dati taxName i procenat nisu pronadjeni");
            }
        const response = await api.get(url+`/taxName-percentage`,{
            params:{
                taxName:taxName,
                percentage:parsePercentage
            },
            headers:getHeader()
        });    
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko9m trazenja po taxName-u i procentu");
    }
}

export async function findByStartDateBeforeAndEndDateAfter({date1, date2}){
    try{
        if(!moment(date1,"YYYY-MM-DD",true).isValid() || !moment(date2,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati date1 i date2 nisu pronadjeni");
        }
        const response = await api.get(url+`/startDateBefore`,{
            params:{
                date1:moment(date1).format("YYYY-MM-DD"),
                date2:moment(date2).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema pocetnom i krajnjem datumu");
    }
}

export async function findByStartDateLessThanEqualAndEndDateGreaterThanEqual({date1,date2}){
    try{
        if(!moment(date1,"YYYY-MM-DD",true).isValid() || !moment(date2,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati date1 i date2 nisu pronadjeni");
        }
        const response = await api.get(url+`/startDate-lessThan`,{
            params:{
                date1:moment(date1).format("YYYY-MM-DD"),
                date2:moment(date2).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema manjem,vecem i jednakom datumu");
    }
}

export async function findOverlapping({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid() || !moment(end,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati date1 i date2 nisu pronadjeni");
        }
        const response = await api.get(url+`/by-overlapping`,{
            params:{
                start:moment(start).format("YYYY-MM-DD"),
                end:moment(end).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema preklapanju pocetka i kraja datuma");
    }
}

export async function findByStartDate(start){
    try{
        if(!moment(start,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati pocetak datuma nije pronadjen");
        }
        const response = await api.get(url+`/by-startDate`,{
            params:{start:moment(start).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po pocetku datuma");
    }
}

export async function findByEndDate(endDate){
    try{
        if(!moment(endDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati kraj datuma nije pronadjen");
        }
        const response = await api.get(url+`/by-endDate`,{
            params:{endDate:moment(start).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kraju datuma");
    }
}

export async function findActiveByType({type, date}){
    try{
        if(!isTaxRateTypeValid.includes(type?.toUpperCase()) || !moment(date,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati tip i datum nisu pronadjeni");
        }
        const response = await api.get(url+`/active-byType`,{
            params:{
                type:(type || "").toUpperCase(),
                date:moment(date).format("YYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema aktivnom datumu i tipu taxRate-a");
    }
}

export async function findByTypeAndPeriod({type, startDate, endDate}){
    try{
        if(!moment(startDate,"YYYY-MM-DD",true).isValid() || !moment(endDate,"YYYY-MM-DD",true).isValid() ||
            !isTaxRateTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati taxRate tip, pocet i kraj datuma nisu pronadjeni");
        }
        const response = await api.get(url+`/type-and-period`,{
            params:{
                startDate:moment(startDate).format("YYYY-MM-DD"),
                endDate:moment(endDate).format("YYYY-MM-DD"),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po taxRate tipu, pocetku i kraju datuma");
    }
}