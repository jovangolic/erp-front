import moment from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isSettingDataTypeValid = ["STRING","INTEGER","BOOLEAN","DOUBLE","DATE","TIME","DATETIME"];
const isSustemSettingCategoryValid = ["GENERAL","SECURITY","NOTIFICATIONS","UI", "PERFORMANCE","EMAIL","INTEGRATIONS","FEATURE_FLAGS","USER_MANAGEMENT"];
const url = `${import.meta.env.VITE_API_BASE_URL}/settings`;

export async function createSystemSetting({key,value,description,category,dataType,editable,isVisible,defaultValue}){
    try{
        if(
            !key || typeof key !== "string" || key.trim() === "" ||
            !value || typeof value !== "string" || value.trim() === "" ||
            !description || typeof description !== "string" || description.trim() === "" ||
            !category || typeof category !== "string" || category.trim() === "" ||
            !isSettingDataTypeValid.includes(dataType?.toUpperCase()) ||
            typeof editable !=="boolean" || typeof isVisible !=="boolean" ||
            !defaultValue || typeof defaultValue !== "string" || defaultValue.trim() === "" 
        ){
            throw new Error("Sva polja moraju biti popunjena i validna");
        }
        const requestBody = {key,value,description,category,dataType:dataType.toUpperCase(),editable,isVisible,defaultValue};
        const response = await api.post(url+`/create-setting`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom kreiranja system-settings: ${error.message}`);
        }
    }
}

export async function updateSystemSetting({id,value,description,category,dataType,editable,isVisible,defaultValue}){
    try{
        if(
            id == null || isNaN(id) ||
            !value || typeof value !== "string" || value.trim() === "" ||
            !description || typeof description !== "string" || description.trim() === "" ||
            !category || typeof category !== "string" || category.trim() === "" ||
            !isSettingDataTypeValid.includes(dataType?.toUpperCase()) ||
            typeof editable !=="boolean" || typeof isVisible !=="boolean" ||
            !defaultValue || typeof defaultValue !== "string" || defaultValue.trim() === "" 
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {id,value,description,category,dataType:dataType.toUpperCase(),editable,isVisible,defaultValue};
        const response = await api.put(url+`/update`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom azuriranja system-settings: ${error.message}`);
        }
    }
}

export async function getOneById(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za systemSetting nije pronadjen");
        }
        const response = await api.get(url+`/get-one/${id}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom jednog dobavljanja");
    }
}

export async function deleteSystemSetting(id){
    try{
        if(id == null || isNaN(id)){
            throw new Error("Dati ID za systemSetting nije pronadjen");
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

export async function getByKey(key){
    try{
        if(!key || typeof key !== "string" || key.trim() === ""){
            throw new Error("Dati kljuc nije pronadjen");
        }
        const response = await api.get(url+`/${key}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greška prilikom dobavljanja ključa");
    }
}

export async function getAll(){
    try{
        const response = await api.get(url+`/get-all`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih kljuceva");
    }
}

export async function findByDataType(dataType){
    try{
        if(!isSettingDataTypeValid.includes(dataType?.toUpperCase())){
            throw new Error("Dati tip podataka za system-setting nije pronadjen");
        }
        const response = await api.get(url+`/search/data-type`,{
            params:{
                dataType:(dataType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podataka za system-setting");
    }
}

export async function findByValueAndCategory({value, category}){
    try{
        if(!value || typeof value !== "string" || value.trim() === "" ||
            !isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data vrednost i kategorija za system-setting nije pronadjena");
        }
        const response = await api.get(url+`/search/value-and-category`,{
            params:{
                value:value,
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vrednost i kategoriju za system-setting");
    }
}

export async function findString(){
    try{
        const response = await api.get(url+`/search/by-string`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je String");
    }
}

export async function findInteger(){
    try{
        const response = await api.get(url+`/search/by-integer`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je Integer");
    }
}

export async function findBoolean(){
    try{
        const response = await api.get(url+`/search/by-boolean`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je Boolean");
    }
}

export async function findDouble(){
    try{
        const response = await api.get(url+`/search/by-double`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je Double");
    }
}

export async function findDate(){
    try{
        const response = await api.get(url+`/search/by-date`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je Date");
    }
}

export async function findTime(){
    try{
        const response = await api.get(url+`/search/by-time`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je Time");
    }
}

export async function findDateTime(){
    try{
        const response = await api.get(url+`/search/by-date-time`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip podatka koji je DateTime");
    }
}

export async function findByDataTypeAndValue({dateType, value}){
    try{
        if(!value || typeof value !=="string" || value.trim() === "" ||
            !isSettingDataTypeValid.includes(dateType?.toUpperCase())){
            throw new Error("Dati tip-podatka i vrednost nisu pronadjeni");
        }
        const response = await api.get(url+`/search/date-type-and-value`,{
            params:{
                value:value,
                dateType:(dateType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nsmo pronasli tip podatka i vrednist za system-setting");
    }
}

export async function findByCategoryAndIsVisibleTrue(category){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data kategorija nije pronadjena");
        }
        const response = await api.get(url+`/search/by-category-and-isVisible`,{
            params:{category:(category || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju gde je atribut isVisible tacan");
    }
}

export async function findByEditableTrueAndIsVisibleTrue(){
    try{
        const response = await api.get(url+`/search/editable-and-isVisible`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli da su atributi za sytstem-setting editable i isVisible tacni");
    }
}

export async function findBySettingKeyContainingIgnoreCase(keyword){
    try{
        if(!keyword || typeof keyword !== "string" || keyword.trim() === ""){
            throw new Error("Data kljucna rec nije pronadjena");
        }
        const response = await api.get(url+`/search/setting-key`,{
            params:{keyword:keyword},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli setting-key po kljucnoj reci");
    }
}

export async function findBySettingKeyStartingWith(prefix){
    try{
        if(!prefix || typeof prefix !== "string" || prefix.trim() === ""){
            throw new Error("Dati prefiks nije pronadjen");
        }
        const response = await api.get(url+`/search/setting-key-starstwith`,{
            params:{prefix:prefix},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli setting-key koji pocinje sa datim prefiksom");
    }
}

export async function findBySettingKeyEndingWith(suffix){
    try{
        if(!suffix || typeof suffix !== "string" || suffix.trim() === ""){
            throw new Error("Dati sufiks nije pronadjen");
        }
        const response = await api.get(url+`/search/setting-key-endswith`,{
            params:{suffix:suffix},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli setting-key koji se zavrsava sa datim sufiksom");
    }
}

export async function findBySettingKeyContaining(substring){
    try{
        if(!substring || typeof substring !== "string" || substring.trim() === ""){
            throw new Error("Dati substring nije pronadjen");
        }
        const response = await api.get(url+`/search/setting-key-contains`,{
            params:{substring:substring},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli setting-key koji sadrzi dati substring");
    }
}

export async function findByCreatedAtBetween({start, end}){
    try{
        if(!moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() || 
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dati vremenski opseg nije pronadjen");
        }
        const response = await api.get(url+`/search/createdAt-between`,{
            params:{
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli vremenski opseg za datum kreiranja");
    }
}

export async function findByUpdatedAtAfter(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme za polje updatedAt nije pronadjeno");
        }
        const response = await api.get(url+`/search/updatedAt-after`,{
            params:{
                time:moment(time).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum azuriranja posle");
    }
}

export async function findByUpdatedAtBefore(time){
    try{
        if(!moment(time,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Dato vreme za polje updatedAt nije pronadjeno");
        }
        const response = await api.get(url+`/search/updateAt-before`,{
            params:{
                time:moment(time).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli datum azuriranja pre");
    }
}

export async function findAllByCategoryOrderBySettingKeyAsc(category){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data kategorja ya setting-key nije pronadjena");
        }
        const response = await api.get(url+`/search/category-order-by-asc`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tip kategorije sortiranog prema rastucem poretku po setting-key");
    }
}

export async function findAllByDataTypeOrderByUpdatedAtDesc(dataType){
    try{
        if(!isSettingDataTypeValid.includes(dataType?.toUpperCase())){
            throw new Error("Dati tip podatka za updatedAt nije pronadjeno");
        }
        const response = await api.get(url+`/search/data-type-order-by-desc`,{
            params:{dataType:(dataType || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nisno pronasli tip podatka sortiranog po opdajucem poretku za updatedAt");
    }
}

export async function findByDataTypeIn(types){
    try{
        if(!isSettingDataTypeValid.includes(types?.toUpperCase())){
            throw new Error("Dati tipovi podataka nisu pronadjeni");
        }
        const response = await api.get(url+`/search/data-type-in`,{
            params:{
                types:(types || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli tipove podataka koji pripadaju listi tipova");
    }
}

export async function findByDataTypeCustom(type){
    try{
        if(!isSettingDataTypeValid.includes(type?.toUpperCase())){
            throw new Error("Dati tip podataka nije pronadjen");
        }
        const response = await api.get(url+`/seach/data-type-custom`,{
            params:{
                type:(type || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli custom tip-podataka");
    }
}

export async function findGeneral(){
    try{
        const response = await api.get(url+`/search/by-general`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je General");
    }
}

export async function findSecurity(){
    try{
        const response = await api.get(url+`/search/by-security`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je Security");
    }
}

export async function findNotifications(){
    try{
        const response = await api.get(url+`/search/by-notifications`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je Notifications");
    }
}

export async function findUi(){
    try{
        const response = await api.get(url+`/search/by-ui`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je UI");
    }
}

export async function findPerformance(){
    try{
        const response = await api.get(url+`/search/by-performance`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je Performance");
    }
}

export async function findEmail(){
    try{
        const response = await api.get(url+`/search/by-email`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je Email");
    }
}

export async function findIntegrations(){
    try{
        const response = await api.get(url+`/search/by-integrations`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je Integrations");
    }
}

export async function findFeatureFlags(){
    try{
        const response = await api.get(url+`/search/by-feature-flags`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je Feature_Flags");
    }
}

export async function findUserManagement(){
    try{
        const response = await api.get(url+`/search/by-user-management`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(errpor,"Trenutno nismo pronasli kategoriju koje je User_Management");
    }
}

export async function findAllByCategory(category){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Date kategorije nisu pronadjene");
        }
        const response = await api.get(url+`/search/all-category`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli sve kategorije");
    }
}

export async function existsByCategory(category){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Date kategorije nisu pronadjene");
        }
        const response = await api.get(url+`/search/exists-by-category`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli koje sve kategorije postoje");
    }
}

export async function countByCategory(category){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Dati broj kategorija nije pronadjen");
        }
        const response = await api.get(url+`/search/count-category`,{
            params:{
                category:(category || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli ukupan broj kategorija");
    }
}

export async function findByCategoryAndDataType({category, dataType}){
    try{
        if(!isSettingDataTypeValid.includes(dataType?.toUpperCase() || 
        isSustemSettingCategoryValid.includes(category?.toUpperCase()))){
            throw new Error("Dati tip podatka i kategorija nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-and-data-type`,{
            params:{
                category:(category || "").toUpperCase(),
                dataType:(dataType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i tip podatka za system-setting");
    }
}

export async function existsByCategoryAndDataType({category, dataType}){
    try{
        if(!isSettingDataTypeValid.includes(dataType?.toUpperCase() || 
        isSustemSettingCategoryValid.includes(category?.toUpperCase()))){
            throw new Error("Dati tip podatka i kategorija nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-and-data-type`,{
            params:{
                category:(category || "").toUpperCase(),
                dataType:(dataType || "").toUpperCase()
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i tip podatka za system-setting koje postoje");
    }
}

export async function indDistinctCategories(){
    try{
        const response = await api.get(url+`/search/by-distinct-categories`,{
            headers:getHeader()
        });
        return response.data;
    }   
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli razlicite/posebne kategorije");
    }
}

export async function findByCategoryAndEditable({category, editable}){
    try{
        if(typeof editable !=="boolean" || !isSustemSettingCategoryValid.includes(category?.toUpperCase()) ){
            throw new Error("Data kategorija i editable atribut nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-and-editable`,{
            params:{
                category:(category || "").toUpperCase(),
                editable:editable
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i atribut editable");
    }
}

export async function findByCategoryAndIsVisible({category, isVisible}){
    try{
        if(typeof isVisible !== "boolean" || !isSustemSettingCategoryValid.includes(category?.toUpperCase())){
            throw new Error("Data kategorija i isVisible atribut nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-visible`,{
            params:{
                category:(category || "").toUpperCase(),
                isVisible:isVisible
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i atribut isVisible");
    }
}

export async function findByCategoryAndValue({category, value}){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase()) || 
            !value || typeof value !== "string" || value.trim() === ""){
            throw new Error("Data kategorija i vrednost nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-and-value`,{
            params:{
                category:(category || "").toUpperCase(),
                value:value
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i vrednost za system-setting");
    }
}

export async function findByCategoryIn(categories){
    try{    
        if(!isSustemSettingCategoryValid.includes(categories?.toUpperCase())){
            throw new Error("Date kategorije nisu pronadjene");
        }
        const response = await api.get(url+`/search/by-category-in`,{
            params:{categories:(categories || "").toUpperCase()},
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategorije koje pripadaju odredjenoj listi kategorija");
    }
}

export async function findByCategoryAndCreatedAtAfter({category, fromDate}){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase()) ||
            !moment(fromDate,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Data kategorija i datum kreiranja nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-and-createAt-after`,{
            params:{
                category:(category || "").toUpperCase(),
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i datum kreiranja posle");
    }
}

export async function findByCategoryAndUpdatedAtBetween({category, start, end}){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase()) ||
            !moment(start,"YYYY-MM-DDTHH:mm:ss",true).isValid() ||
            !moment(end,"YYYY-MM-DDTHH:mm:ss",true).isValid()){
            throw new Error("Data kategorija i datumski opseg nisu pronadjeni");
        }
        const response = await api.get(url+`/search/category-and-update-range`,{
            params:{
                category:(category || "").toUpperCase(),
                start:moment(start).format("YYYY-MM-DDTHH:mm:ss"),
                end:moment(end).format("YYYY-MM-DDTHH:mm:ss")
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutno nismo pronasli kategoriju i opseg datuma za azuriranje");
    }
}

export async function countByCategoryAndEditable({category, editable}){
    try{
        if(!isSustemSettingCategoryValid.includes(category?.toUpperCase()) || typeof editable !== "boolean"){
            throw new Error("Data kategorija i editable nisu pronadjeni");
        }
        const response = await api.get(url+`/search/count-by-category-and-editable`,{
            params:{
                category:(category || "").toUpperCase(),
                editable:editable
            },
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Trenutmo nismo pronasli broj kategorija i editable za system-setting");
    }
}



function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}