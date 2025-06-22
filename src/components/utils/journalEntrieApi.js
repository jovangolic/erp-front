import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url =`${import.meta.env.VITE_API_BASE_URL}/journalEntries`;


export async function createJournalEntry({ entryDate, description, itemRequests }){
    try{
        const formattedEntryDate = moment(entryDate).format("YYYY-MM-DDTHH:mm:ss");
        if(!moment(formattedEntryDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !description ||typeof description !=="string" || description.trim() === "" ||
            !Array.isArray(itemRequests) || itemRequests.length === 0){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const payload = {
            entryDate: formattedEntryDate,
            description,
            itemRequests: itemRequests.map(item => ({
                id: item.id || null,
                accountId: item.accountId,
                debit: parseFloat(item.debit),
                credit: parseFloat(item.credit)
            }))
        };
        const response = await api.post(url+`/create/new-journalEntry`,payload,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja journalEntry-ja");
    }
}

export async function updateJournalEntry({id,entryDate, description, itemRequests}){
    try{
        const formattedEntryDate = moment(entryDate).format("YYYY-MM-DDTHH:mm:ss");
        if( id == null || isNaN(id) ||
            !moment(formattedEntryDate,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !description ||typeof description !=="string" || description.trim() === "" ||
            !Array.isArray(itemRequests) || itemRequests.length === 0){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const payload = {
            entryDate: formattedEntryDate,
            description,
            itemRequests: itemRequests.map(item => ({
                id: item.id || null,
                accountId: item.accountId,
                debit: parseFloat(item.debit),
                credit: parseFloat(item.credit)
            }))
        };
        const response = await api.put(url+`/update/${id}`,payload,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja journalEntry-ja");
    }
}

export async function deleteJournalEntry(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za JournalEntry nije pronadjen");
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
            throw new Error("Dati ID za JournalEntry nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog JournalEntry-ja");
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
        handleApiError(error,"Greska prilikom trazenja svih JournalEntry-ja");
    }
}

export async function findByDescription(description){
    try{
        if(!description ||typeof description !=="string" || description.trim() === ""){
            throw new Error("Dati opis za JournalEntry nije pronadjen");
        }
        const response = await api.get(url+`/by-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja prema opisu");
    }
}

export async function findByEntryDateBetween({start, end}){
    try{
        const formattedStart = moment(start).format("YYYY-MM-DDTHH:mm:ss");
        const formattedEnd = moment(end).format("YYYY-MM-DDTHH:mm:ss");
        if(!moment(formattedStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(formattedEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati pocetak i kraj datuma nisu validni");
        }
        const response = await api.get(url+`/entry-date-between`,{
            params:{start:formattedStart,end:formattedEnd},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pilikom trazenja izmendju pocetka i kraja datuma");
    }
}

export async function findByEntryDateOn(date){
    try{
        const formattedDate = moment(date).format("YYYY-MM-DD");
        if(!moment(formattedDate,"YYYY-MM-DD",true).isValid()){
            throw new Error("Dati datum za entryDateOn nije pronadjen");
        }
        const response = await api.get(url+`/entry-dateOn`,{
            params:{date:formattedDate},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage po entryDateOn-u");
    }
}

export async function findByEntryDateBefore(dateTime){
    try{
        const formattedDateTime = moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
        if(!moment(formattedDateTime,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum i vreme za entryDateBefore nije pronadjen");
        }
        const response = await api.get(url+`/entry-date-before`,{
            params:{dateTime:formattedDateTime},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema entryDateBefore");
    }
}

export async function findByEntryDateAfter(dateTime){
    try{
        const formattedDateTime = moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
        if(!moment(formattedDateTime,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati datum i vreme za entryDateAfter nije pronadjen");
        }
        const response = await api.get(url+`/entry-date-after`,{
            params:{dateTime:formattedDateTime},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrage prema entryDateAfter");
    }
}

export async function findByYear(year){
    try{
        const parseYear = parseInt(year);
        if(isNaN(parseYear) || parseYear <= 0){
            throw new Error("Data godina nije pronadjena");
        }
        const response = await api.get(url+`/by-year`,{
            params:{year:parseYear},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom pretrtage prema datoj godini");
    }
}

export async function findByDescriptionAndEntryDateBetween({description,start, end}){
    try{
        const formattedStart = moment(start).format("YYYY-MM-DDTHH:mm:ss");
        const formattedEnd = moment(end).format("YYYY-MM-DDTHH:mm:ss");
        if(!description || typeof description !== "string" || description.trim() === "" ||
            !moment(formattedStart,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(formattedEnd,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati opis i opseg datuma nisu pronadjeni");
        }
        const response = await api.get(url+`/by-description-and-date`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss"),
                description:description
            },
            headers:getHeader()
        })
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska pilikom trazenja prema opisu, pocetnom i krajnje datumu za EntryDate");
    }
}