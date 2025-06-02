import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/email-setting`;
export async function getCurrentSettings(){
    const response = await api.get(BASE_URL,{
        method:GET,
        headers:getHeader(),
    });
    if(!response.ok){
        throw new Error('Greška pri učitavanju email podešavanja');
    }
    return await response.json();
}

export async function updateEmailSettings(data) {
  const response = await api.put(BASE_URL, {
    method: 'PUT',
    headers:getHeader(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Greška pri ažuriranju email podešavanja');
  return await response.json();
}
