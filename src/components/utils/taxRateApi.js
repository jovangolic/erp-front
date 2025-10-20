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
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD").isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD").isValid();
        if(
            !taxName || typeof taxName !=="string" || taxName.trim() === "" ||
            Number.isNaN(Number(parsePercentage)) || parsePercentage <= 0 ||
            !validateStart || !validateEnd || 
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
        const validateStart = moment.isMoment(startDate) || moment(startDate,"YYYY-MM-DD").isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate,"YYYY-MM-DD").isValid();
        if(
            id == null || Number.isNaN(Number(id)) ||
            !taxName || typeof taxName !=="string" || taxName.trim() === "" ||
            Number.isNaN(Number(parsePercentage)) || parsePercentage <= 0 ||
            !validateStart || !validateEnd || 
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za taxRate nije pronadjen");
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
        if(id == null || Number.isNaN(Number(id))){
            throw new Error("Dati ID "+id+" za taxRate nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom dobavljanja jednog taxRate-a po "+id+" id-iju");
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
            throw new Error("Dati tip "+type+" za taxRate nije pronadjen");
        }
        const response = await api.get(url+`/by-type`,{
            params:{type:(type  || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema tipu "+type+" taxRate-a");
    }
}

export async function findByTaxName(taxName){
    try{
        if(!taxName || typeof taxName !=="string" || taxName.trim() === ""){
            throw new Error("Dati taxName "+taxName+" nije pronadjen");
        }
        const response = await api.get(url+`/by-taxName`,{
            params:{taxName:taxName},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazena prema nazivu "+taxName+" taxRate-a");
    }
}

export async function findByPercentage(percentage){
    try{
        const parsePercentage = parseFloat(percentage);
        if(Number.isNaN(Number(parsePercentage)) || parsePercentage <= 0){
            throw new Error("Dati procenata "+parsePercentage+" nije pronadjen");
        }
        const response = await api.get(url+`/by-percentage`,{
            params:{percentage:parsePercentage},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema procentu "+percentage);
    }
}

export async function findByTaxNameAndPercentage({taxName, percentage}){
    try{
        const parsePercentage = parseFloat(percentage);
        if(
            !taxName || typeof taxName !=="string" || taxName.trim() === "" ||
            Number.isNaN(Number(parsePercentage)) || parsePercentage <= 0 ){
                throw new Error("Dati taxName "+taxName+" i procenat "+parsePercentage+" nisu pronadjeni");
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
        handleApiError(error,"Greska priliko9m trazenja po taxName-u "+taxName+" i procentu "+percentage);
    }
}

export async function findByStartDateBeforeAndEndDateAfter({date1, date2}){
    try{
        const validateStart = moment.isMoment(date1) || moment(date1, "YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(date2) || moment(date2, "YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati pocetni datum pre "+validateStart+" i krajnji datum posle "+validateEnd+" nisu pronadjeni");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/startDateBefore`,{
            params:{
                date1:moment(validateStart).format("YYYY-MM-DD"),
                date2:moment(validateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema pocetnom "+date1+" i krajnjem "+date2+" datumu");
    }
}

export async function findByStartDateLessThanEqualAndEndDateGreaterThanEqual({date1,date2}){
    try{
        const validateStart = moment.isMoment(date1) || moment(date1, "YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(date2) || moment(date2, "YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati pocetni daum manji od "+validateStart+" i krajni datum veci od "+validateEnd+" nisu pronadjeni");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/startDate-lessThan`,{
            params:{
                date1:moment(validateStart).format("YYYY-MM-DD"),
                date2:moment(validateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema pocetnom datumum manjem od "+date1+" i krajnjem datumu vecem od "+date2);
    }
}

export async function findOverlapping({start, end}){
    try{
        const validateStart = moment.isMoment(start) || moment(start, "YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(end) || moment(end, "YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd){
            throw new Error("Dati datumi "+validateStart+" - "+validateEnd+" koji se preklapaju, nisu pronadjeni");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/by-overlapping`,{
            params:{
                start:moment(validateStart).format("YYYY-MM-DD"),
                end:moment(validateEnd).format("YYYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli "+start+" - "+end+" datume, koji se preklapaju");
    }
}

export async function findByStartDate(start){
    try{
        const validateStart = moment.isMoment(start) || moment(start, "YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati pocetak "+validateStart+" datuma nije pronadjen");
        }
        const response = await api.get(url+`/by-startDate`,{
            params:{start:moment(validateStart).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po pocetku "+start+" datuma");
    }
}

export async function findByEndDate(endDate){
    try{
        const validateStart = moment.isMoment(endDate) || moment(endDate, "YYYY-MM-DD",true).isValid();
        if(!validateStart){
            throw new Error("Dati kraj "+validateStart+" datuma nije pronadjen");
        }
        const response = await api.get(url+`/by-endDate`,{
            params:{endDate:moment(validateStart).format("YYYY-MM-DD")},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po kraju "+endDate+" datuma");
    }
}

export async function findActiveByType({type, date}){
    try{
        const validateStart = moment.isMoment(stadatert) || moment(date, "YYYY-MM-DD",true).isValid();
        if(!isTaxRateTypeValid.includes(type?.toUpperCase()) || !validateStart){
            throw new Error("Dati tip "+type+" i datum "+validateStart+" nisu pronadjeni");
        }
        const response = await api.get(url+`/active-byType`,{
            params:{
                type:(type || "").toUpperCase(),
                date:moment(validateStart).format("YYY-MM-DD")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema aktivnom datumu "+date+" i tipu "+type+" taxRate-a");
    }
}

export async function findByTypeAndPeriod({type, startDate, endDate}){
    try{
        const validateStart = moment.isMoment(startDate) || moment(startDate, "YYYY-MM-DD",true).isValid();
        const validateEnd = moment.isMoment(endDate) || moment(endDate, "YYYY-MM-DD",true).isValid();
        if(!validateStart || !validateEnd || 
            !isTaxRateTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati taxRate tip "+type+", i opsegu "+validateStart+" - "+validateEnd+" datuma za odredjeni period, nisu pronadjeni");
        }
        if(moment(validateEnd).isBefore(moment(validateStart))){
            throw new Error("Datum za kraj ne sme biti ispred datuma za pocetak");
        }
        const response = await api.get(url+`/type-and-period`,{
            params:{
                startDate:moment(validateStart).format("YYYY-MM-DD"),
                endDate:moment(validateEnd).format("YYYY-MM-DD"),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja po taxRate tipu "+type+", i opsegu "+startDate+" - "+endDate+" datuma");
    }
}

export async function findByVat(){
    try{
        const response = await api.get(url+`/search/by-type-vat`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip za TaxRate koji je 'VAT'");
    }
}

export async function findByIncome_Tax(){
    try{
        const response = await api.get(url+`/searh/by-type-income-tax`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip za TaxRate koji je 'INCOME_TAX'");
    }
}

export async function findBySales_Tax(){
    try{
        const response = await api.get(url+`/searh/by-type-income-tax`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip za TaxRate koji je 'SALES_TAX'");
    }
}

export async function findByCustom(){
    try{
        const response = await api.get(url+`/search/by-type-custom`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip za TaxRate koji je 'CUSTOM'");
    }
}