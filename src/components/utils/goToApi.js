import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/goto`;
const isGoToCategoryValid = ["ACCOUNTING","USERS","STORAGE","INVENTORY","MATERIAL_MANAGEMENT","PRODUCTION_PLANNING","QUALITY_CONTROL","SALES","LOGISTICS","SETTINGS","REPORTS","GENERAL"];
const isGoToTypeValid = ["NAVIGATION","ACTION"];

export async function createGoTo({label,description,category,type,path,icon,active,roles}){
    try{
        if(!label || typeof label !== "string" || label.trim() === "" ||
          !description || typeof description !== "string" || description.trim() === "" ||
          !isGoToCategoryValid.includes(category?.toUpperCase()) || !isGoToTypeValid.includes(type?.toUpperCase()) || 
          !path || typeof path !== "string" || path.trim() === "" || typeof active !== "boolean" ||
          !roles || typeof roles !== "string" || roles.trim() === ""){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requiredBody = {label,description,category,type,path,icon,active,roles};
        const response = await api.post(url+`/create/new-goto`,requiredBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja GoTo sekcije");
    }
}

export async function updateGoTo({id,label,description,category,type,path,icon,active,roles}){
    try{
        if(isNaN(id) || id == null ||
          !label || typeof label !== "string" || label.trim() === "" ||
          !description || typeof description !== "string" || description.trim() === "" ||
          !isGoToCategoryValid.includes(category?.toUpperCase()) || !isGoToTypeValid.includes(type?.toUpperCase()) || 
          !path || typeof path !== "string" || path.trim() === "" || typeof active !== "boolean" ||
          !roles || typeof roles !== "string" || roles.trim() === ""){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requiredBody = {label,description,category,type,path,icon,active,roles};
        const response = await api.put(url+`/update/${id}`,requiredBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom azuriranja GoTo sekcije");
    }
}

export async function deleteGoTo(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za GotTo, nije pronadjen");
        }
        const response = await api.delete(url+`/delete/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greksa prilikom brisanja GoTO po "+id+" id-iju");
    }
}

export async function findOne(id){
    try{
        if(isNaN(id) || id == null){
            throw new Error("Dati id "+id+" za GotTo, nije pronadjen");
        }
        const response = await api.get(url+`/find-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja jednog GoTo po "+id+" id-iju");
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
        handleApiError(error,"Greska prilikom trazenja svih GoTo sekcija");
    }
}

export async function findByCategoryAndActiveTrue(category){
    try{
        if(!isGoToCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Kategorija "+category+" za aktivnost jednaka = 'tacno', nije pronadjena");
        }
        const response = await api.get(url+`/by-category-and-active-true`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju "+category+" gde je aktivnost jednaka = 'tacno'");
    }
}

export async function findByLabelContainingIgnoreCase(label){
    try{
        if(!label || typeof label !== "string" || label.trim() === ""){
            throw new Error("Label "+label+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-label`,{
            params:{label:label},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli label "+label+" za GoTo sekciju");
    }
}

export async function findByDescriptionContainingIgnoreCase(description){
    try{
        if(!description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Opis "+description+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-description`,{
            params:{description:description},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opis "+description+" za GoTo sekciju");
    }
}

export async function findByRolesContainingIgnoreCase(roles){
    try{
        if(!roles || typeof roles !== "string" || roles.trim() === ""){
            throw new Error("Uloge "+roles+" za GoTo sekciju, nije pronadjene");
        }
        const response = await api.get(url+`/by-roles`,{
            params:{roles:roles},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli uloge "+roles+" za GoTo sekciju");
    }
}

export async function findByCategory(category){
    try{
        if(!isGoToCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Kategorija "+category+" za GoTo sekciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-category`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nisno pronasli kategoriju "+category+" za GoTo sekciju");
    }
}

export async function findByType(type){
    try{
        if(!isGoToTypeValid.includes(type?.toUpperCase())){
            throw new Error("Tip "+type+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/by-type`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip "+type+" za GoTo sekciju");
    }
}

export async function findByCategoryAndType({category, type}){
    try{
        if(!isGoToCategoryValid.includes(category?.toUpperCase()) || !isGoToTypeValid.includes(type?.toUpperCase())){
            throw new Error("Kategorija "+category+" i tip "+type+" za GoTo sekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/category-and-type`,{
            params:{
                category:(category || "").toUpperCase(),
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju "+category+" i tip "+type+" za GoTo sekciju");
    }
}

export async function findByPathContainingIgnoreCase(path){
    try{
        if(!path || typeof path !== "string" || path.trim() === ""){
            throw new Error("Putanja "+path+" za GoTo sekciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-path`,{
            params:{path:path},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli putanju "+path+" za GoTo sekciju");
    }
}

export async function findByIcon(icon){
    try{
        if(!icon || typeof icon !== "string" || icon.trim() === ""){
            throw new Error("Ikonica "+icon+" za GoTo sekciju, nije pronadjena");
        }
        const response = await api.get(url+`/by-icon`,{
            params:{icon:icon},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ikonicu "+icon+" za GoTo sekciju");
    }
}

export async function findByActiveTrue(){
    try{
        const response = await api.get(url+`/active-true`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli da je aktivnost jednaka 'tacno'");
    }
}

export async function findByLabelContainingIgnoreCaseAndCategory({label, category}){
    try{
        if(!label || typeof label !== "string" || label.trim() === "" || !isGoToCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Label "+label+" i kategorija "+category+" za GoTo sekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/label-and-category`,{
            params:{
                label:label,
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli label "+label+" i kategoriju "+category+" za GoTo sekciju");
    }
}

export async function findByDescriptionContainingIgnoreCaseAndCategory({description, category}){
    try{
        if(!description || typeof description !== "string" || description.trim() === "" || !isGoToCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Opis "+description+" i kategorija "+category+" za GoTo sekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/description-and-category`,{
            params:{
                description:description,
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli opis "+description+" i kategoriju "+category+" za GoTo sekciju");
    }
}

export async function searchByKeyword(keyword){
    try{
        if(!keyword || typeof keyword !== "string" || keyword.trim() === ""){
            throw new Error("Data kljucna rec "+keyword+" za GoTo sekciju, nije pronasla ocekivani rezultat");
        }
        const response = await api.get(url+`/search-keyword`,{
            params:{keyword:keyword},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli rezultat po kljucnoj-reci "+keyword+" za GoTo sekciju");
    }
}

export async function findByActiveTrueOrderByLabelAsc(){
    try{
        const response = await api.get(url+`/active-true-order-by-label-asc`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli aktivnost jednaka = 'tacno', sortirana po rastucem poretku za label");
    }
}

export async function findByCategoryIn(categories){
    try{
        if(!isGoToCategoryValid.includes(categories?.toUpperCase())){
            throw new Error("Lista sa svim kategorijama, nije pronadjena");
        }
        const response = await api.get(url+`/categories-in`,{
            params:{
                categories: arrayLista
            },
            paramsSerializer: params => {
                return params.arrayLista.map(s => `arrayLista=${s.toUpperCase()}`).join("&");
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli listu sa svim kategorijama: "+categories);
    }
}

export async function findByLabelContainingIgnoreCaseAndDescriptionContainingIgnoreCase({label, description}){
    try{
        if(!label || typeof label !== "string" || label.trim() === "" ||
          !description || typeof description !== "string" || description.trim() === ""){
            throw new Error("Label "+label+" i opis "+description+" za GoTo sekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/label-and-description`,{
            params:{
                label:label,
                description:description
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli label "+label+" i opis "+description+" za GoTo sekciju");
    }
}

export async function existsByLabel(label){
    try{
        if(!label || typeof label !== "string" || label.trim() === ""){
            throw new Error("Postojanje labela "+label+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/by-label`,{
            params:{label:label},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje labela "+label+" za GoTo sekciju");
    }
}

export async function existsByCategory(category){
    try{
        if(!isGoToCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Postojanje kategorije "+category+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/by-category`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje kategorije "+category+" za GoTo sekciju");
    }
}

export async function existsByRolesContainingIgnoreCase(roles){
    try{
        if(!roles || typeof roles !== "string" || roles.trim() === ""){
            throw new Error("Postojanje uloga "+roles+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/by-roles`,{
            params:{roles:roles},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje uloga "+roles+" za GoTo sekciju");
    }
}

export async function existsByPathContainingIgnoreCase(path){
    try{
        if(!path || typeof path !== "string" || path.trim() === ""){
            throw new Error("Postojanje fragmenta putanje "+path+" za GoTo sekciju, nije pronadjen");
        }
        const response = await api.get(url+`/exists/by-path-fragment`,{
            params:{
                path:path
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje fragmenta putanje "+path+" za GoTo sekciju");
    }
}

export async function existsByIcon(icon){
    try{
        if(!icon || typeof icon !== "string" || icon.trim() === ""){
            throw new Error("Postojanje ikonicee "+icon+" za GoTo sekciju, nije pronadjena");
        }
        const response = await api.get(url+`/exists/by-icon`,{
            params:{
                icon:icon
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje ikonice "+icon+" za GoTo sekciju");
    }
}

export async function existsByLabelAndCategory({label, category}){
    try{
        if(!label || typeof label !== "string" || label.trim() === "" || !isGoToCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Postojanje labela "+label+" i kategorije "+category+" za GoTo sekciju, nisu pronadjeni");
        }
        const response = await api.get(url+`/exists//label-and-category"`,{
            params:{
                label:label,
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje labela "+label+" i kategorije "+category+" za GoTo sekciju");
    }
}

export async function existsByPath(path){
    try{
        if(!path || typeof path !== "string" || path.trim() === ""){
            throw new Error("Postojanje putanje "+path+" za GoTo sekciju, nije pronadjena");
        }
        const response = await api.get(url+`/exists/by-path`,{
            params:{path:path},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli postojanje putanje "+path+" za GoTo sekciju");
    }
}