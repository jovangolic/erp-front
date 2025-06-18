import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isRoleTypeValid = ["NOTIFICATION_METHOD","REPORT_FORMAT","USER_PERMISSION","DASHBOARD_WIDGET"];

export async function createCompanyEmail(firstName,lastName,address, phoneNumber, types){
    try{
        if(
            !firstName || typeof firtsName !== "string" || firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            !isRoleTypeValid.includes(types.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {firstName,lastName,address,phoneNumber,types: (types || "").toUpperCase()};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/create-company-email`,requestBody,{
            heander:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja ");
    }
}

export async function createAllCompanyEmails(users) {
    try {
        if (
            !Array.isArray(users) || users.length === 0 ||
            users.some(user =>
                !user ||
                typeof user.firstName !== "string" || user.firstName.trim() === "" ||
                typeof user.lastName !== "string" || user.lastName.trim() === "" ||
                typeof user.address !== "string" || user.address.trim() === "" ||
                typeof user.phoneNumber !== "string" || user.phoneNumber.trim() === "" ||
                !isRoleTypeValid.includes(String(user.types).toUpperCase())
            )
        ) {
            throw new Error("Svi korisnici moraju imati validna i popunjena polja.");
        }
        const response = await api.post(
            `${import.meta.env.VITE_API_BASE_URL}/email/create-company-emails`,
            users,
            { headers: getHeader() }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Greška prilikom kreiranja svih kompanijskih email-ova");
    }
}

export async function generateCompanyEmail(firstName, lastName){
    try{
        const requestBody = {firstName, lastName};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/generate-company-email`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom generisanja email-a");
    }
}

export async function generateCompanyEmail(firstName, lastName){
    try{
        if(
            !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || firslastNametName.trim() === ""
        ){
            throw new Error("Dati email vec postoji");
        }
    }
    catch(error){
        handleApiError(error, "Greska prilikom generisanja kompanijskog email-a");
    }
}

export async function getAllCompanyEmails(){
    try{
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/company-emails`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom dobavljanja svih email-ova");
    }
}

export async function deleteCompanyEmail(email){
    try{
        if(!email){
            throw new Error("Dati emai ne postoji");
        }
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/company-email/${email}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska priliko brisanja email-a");
    }
}

export async function getCompanyEmail(email){
    try{
        if(!email || typeof email !== "string" || email.trim() === ""){
            throw new Error("Dati email ne postoji");
        }
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/companyEmail/company-email/${email}`,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom trazenja kompanijskog email-a");
    }
}

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}