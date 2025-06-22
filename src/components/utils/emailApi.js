import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const isRoleTypeValid = ["SUPER_ADMIN", "ADMIN", "STORAGE_FOREMAN", "STORAGE_EMPLOYEE", "STORAGE_MANAGER"];

export async function sendEmail({to, subject, text}){
    try{
        if(
            !to || typeof to !== "string" || to.trim() === ""||
            !subject || typeof subject !=="string" || subject.trim() === "" ||
            !text || typeof text !=="string" || text.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {to, subject, text};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/email/send`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            throw new Error(`Greška prilikom slanja email-a : ${error.message}`);
        }
    }
}

export async function sendEmailToMultiple({recipients,string, body}){
    try{
        if(
            !Array.isArray(recipients) || recipients.length === 0 ||
            recipients.some(email => typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
            typeof subject !== "string" || subject.trim() === "" ||
            typeof body !== "string" || body.trim() === ""
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {recipients,string,body};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/email/send-multiple`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error, "Greska prilikom slavnja visestrukih email-ova");
    }
}

export async function createCompanyEmail({firstName,lastName,address,phoneNumber,types}){
    try{
        if(
            !firstName || typeof firstName !== "string" || firstName.trim() === "" ||
            !lastName || typeof lastName !== "string" || lastName.trim() === "" ||
            !address || typeof address !== "string" || address.trim() === "" ||
            !phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "" ||
            !isRoleTypeValid.includes(types?.toUpperCase())
        ){
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = {firtsName,lastName,address,phoneNumber,types};
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/email/create-company-email`,requestBody,{
            headers:getHeader()
        });
        return response.data;
    }
    catch(error){
        handleApiError(error,"Greska prilikom kreiranja kompanijskog email-a");
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

export async function generateCompanyEmail({firstName, lastName}){
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

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

///^[^\s@]+@[^\s@]+\.[^\s@]+$/ ->je jednostavna regularna ekspresija za osnovnu validaciju e-mail adrese