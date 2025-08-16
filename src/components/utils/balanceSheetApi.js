import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/balanceSheets`;
const isFiscalYearStatusValid = ["OPEN", "CLOSED", "ARCHIVED"];
const isFiscalQuarterStatusValid = ["Q1", "Q2", "Q3", "Q4"];

export async function createBalanceSheet(date, totalAssets, totalLiabilities, totalEquity, fiscalYearId) {
    try {
        if (
            !moment(date, "YYYY-MM-DD", true).isValid() ||
            isNaN(parseFloat(totalAssets)) || parseFloat(totalAssets) <= 0 ||
            isNaN(parseFloat(totalLiabilities)) || parseFloat(totalLiabilities) <= 0 ||
            isNaN(parseFloat(totalEquity)) || parseFloat(totalEquity) <= 0 ||
            Number.isInteger(fiscalYearId) && fiscalYearId > 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = { date, totalAssets, totalLiabilities, totalEquity, fiscalYearId };
        const response = await api.post(url + `/create/new-balance-sheet`, requestBody, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom kreiranja balanceSheet-a");
    }
}

export async function updateBalanceSheet(id, date, totalAssets, totalLiabilities, totalEquity, fiscalYearId) {
    try {
        if (id == null || isNaN(id) ||
            !moment(date, "YYYY-MM-DD", true).isValid() ||
            isNaN(parseFloat(totalAssets)) || parseFloat(totalAssets) <= 0 ||
            isNaN(parseFloat(totalLiabilities)) || parseFloat(totalLiabilities) <= 0 ||
            isNaN(parseFloat(totalEquity)) || parseFloat(totalEquity) <= 0 ||
            Number.isInteger(fiscalYearId) && fiscalYearId > 0
        ) {
            throw new Error("Sva polja moraju biti validna i popunjena");
        }
        const requestBody = { date, totalAssets, totalLiabilities, totalEquity, fiscalYearId };
        const response = await api.put(url + `/update/${id}`, requestBody, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom azuriranja");
    }
}

export async function deleteBalanceSheet(id) {
    try {
        if (id == null || isNaN(id)) {
            throw new Error("Dati ID "+id+" za balanceSheet nije pronadjen");
        }
        const response = await api.delete(url + `/delete/${id}`, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom brisanja");
    }
}

export async function findOne(id) {
    try {
        if (id == null || isNaN(id)) {
            throw new Error("Dati ID "+id+"za balanceSheet nije pronadjen");
        }
        const response = await api.get(url + `/find-one/${id}`, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom pronalazenja jednog balanceSheet-a");
    }
}

export async function findAll() {
    try {
        const response = await api.get(url + `/find-all`, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja svih");
    }
}

export async function findByDate(date) {
    try {
        if (!moment(date, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Dati datum "+date+" nije pronadjen");
        }
        const response = await api.get(url + `/by-date`, {
            params: {
                date: moment(date).format("YYYY-MM-DD")
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po "+date+" datumu");
    }
}

export async function findByDateBetween({ start, end }) {
    try {
        if (!moment(start, "YYYY-MM-DD", true).isValid() || !moment(end, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Dati opseg "+start+" - "+end+" datuma nije pronadjen");
        }
        const response = await api.get(url + `/date-between`, {
            params: {
                start: moment(start).format("YYYY-MM-DD"),
                end: moment(end).format("YYYY-MM-DD")
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po opsegu "+start+" - "+end+" datuma ");
    }
}

export async function findByTotalLiabilities(totalLiabilities) {
    try {
        if (isNaN(parseFloat(totalLiabilities)) || parseFloat(totalLiabilities) <= 0) {
            throw new Error("Dati "+totalLiabilities+" totalLiabilities nije pronadjen");
        }
        const response = await api.get(url + `/totalLiabilities`, {
            params: {
                totalLiabilities: totalLiabilities
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom pretrage po totalLiabilities "+totalLiabilities);
    }
}

export async function findByTotalEquity(totalEquity) {
    try {
        if (isNaN(parseFloat(totalEquity)) || parseFloat(totalEquity) <= 0) {
            throw new Error("Dati "+totalEquity+" totalEquity nije pronadjen");
        }
        const response = await api.get(url + `/totalEquity`, {
            params: {
                totalEquity: totalEquity
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po "+totalEquity+" totalEquity");
    }
}

export async function findByTotalAssets(totalAssets) {
    try {
        if (isNaN(parseFloat(totalAssets)) || parseFloat(totalAssets) <= 0) {
            throw new Error("Dati "+totalAssets+" totalAssets nije pronadjen");
        }
        const response = await api.get(url + `/totalAssets`, {
            params: {
                totalAssets: totalAssets
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja prema totalAssets-u "+totalAssets);
    }
}

export async function findByFiscalYear_Id(id) {
    try {
        if (id == null || isNaN(id)) {
            throw new Error("Dati ID "+id+" za fiscalYear nije pronadjen");
        }
        const response = await api.get(url + `/fiscalYear/${id}`, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom trazenja po fiscalYear ID-iju "+id);
    }
}

export async function findByFiscalYear_Year(year) {
    try {
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear) || parsedYear <= 0) {
            throw new Error("Data "+year+" godina nije pronadjena");
        }
        const response = await api.get(url + `/fiscalYear-year`, {
            params: { year: parsedYear },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Greska prilikom trazenja po godini "+year);
    }
}

export async function findByFiscalYear_YearStatus(yearStatus) {
    try {
        if (!isFiscalYearStatusValid.includes(yearStatus?.toUpperCase())) {
            throw new Error("Dati "+yearStatus+" godisnji-status nije pronadjen");
        }
        const response = await api.get(url + `/fiscalYeay-yearStatus`, {
            params: {
                yearStatus: (yearStatus || "").toUpperCase()
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom pretrage po "+yearStatus+" godisnjem statusus");
    }
}

export async function findByFiscalYear_QuarterStatus(quarterStatus) {
    try {
        if (!isFiscalQuarterStatusValid.includes(quarterStatus?.toUpperCase())) {
            throw new Error("Dati "+quarterStatus+" kvartal za godinu nije pronadjen");
        }
        const response = await api.get(url + `/fiscalYear-quarterStatus`, {
            params: {
                quarterStatus: (quarterStatus || "").toUpperCase()
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom pretrage po "+quarterStatus+" kvartalnom statusu");
    }
}

export async function findByStatusAndDateRange({ status, start, end }) {
    try {
        if (!isFiscalYearStatusValid.includes(status?.toUpperCase()) ||
            !moment(start, "YYYY-MM-DD", true).isValid() || !moment(end, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Dati godisnji status "+status+" i opseg datuma "+start+" - "+end+" nisu pronadjeni");
        }
        const response = await api.get(url + `/by-statu-dateRange`, {
            params: {
                status: (status || "").toUpperCase(),
                start: moment(start).format("YYYY-MM-DD"),
                end: moment(end).format("YYYY-MM-DD")
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom pretrage prema godisnjem statusu "+status+", pocetnom "+start+" datumu i krajnjem "+end+" datumu");
    }
}

export async function findByTotalAssetsGreaterThan(totalAssets) {
    try {
        const parseTotalAsset = parseFloat(totalAssets)
        if (isNaN(parseTotalAsset || parseTotalAsset < 0)) {
            throw new Error("Ukupna imovina (totalAssets) "+totalAssets+" mora biti pozitvan broj");
        }
        const response = await api.get(url + `/totalAssets-greater-than`, {
            params: {
                totalAssets: parseTotalAsset,
                headers: getHeader()
            }
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom dobavljanja totalAssets veceg od "+totalAssets);
    }
}

export async function findByTotalAssetsLessThan(totalAssets) {
    try {
        const parseTotalAsset = parseFloat(totalAssets)
        if (isNaN(parseTotalAsset || parseTotalAsset < 0)) {
            throw new Error("Ukupna imovina (totalAssets) "+totalAssets+" mora biti pozitvan broj");
        }
        const response = await api.get(url + `/totalAssets-less-than`, {
            params: {
                totalAssets: parseTotalAsset,
                headers: getHeader()
            }
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Greska prilikom dobavljanja totalAssets manjeg od "+totalAssets);
    }
}

export async function findByTotalEquityGreaterThan(totalEquity) {
    try {
        const parseTotalEquity = parseFloat(totalEquity);
        if (isNaN(parseTotalEquity) || parseTotalEquity < 0) {
            throw new Error("totalEquity "+totalEquity+" mora biti pozitivan broj");
        }
        const response = await api.get(url + `/totalEquity-greater-than`, {
            params: {
                totalEquity: parseTotalEquity
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Gresk aprilikom trazenja totalEquity veceg od "+totalEquity);
    }
}

export async function findByTotalAssetsLessThan(totalEquity) {
    try {
        const parseTotalEquity = parseFloat(totalEquity);
        if (isNaN(parseTotalEquity) || parseTotalEquity < 0) {
            throw new Error("totalEquity "+totalEquity+" mora biti pozitivan broj");
        }
        const response = await api.get(url + `/totalEquity-less-than`, {
            params: {
                totalEquity: parseTotalEquity
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Gresk aprilikom trazenja totalEquity manjeg od "+totalEquity);
    }
}

export async function searchBalanceSheets({ startDate, endDate, fiscalYearId, minAssets, minEquity, minLiabilities, onlySolvent }) {
    try {
        const parseMinAssets = parseFloat(minAssets);
        const parseMinEquity = parseFloat(minEquity);
        const parseMiLiabilities = parseFloat(minLiabilities);
        if (isNaN(parseMinAssets) || parseMinAssets <= 0 || isNaN(parseMinEquity) || parseMinEquity <= 0 ||
            isNaN(parseMiLiabilities) || parseMiLiabilities <= 0 || typeof onlySolvent !== "boolean" ||
            isNaN(Number(fiscalYearId)) || fiscalYearId == null ||
            !moment(startDate, "YYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
            throw new Error("Dati parametri za pretragu: "+startDate+" ,"+endDate+" ,"+fiscalYearId+" ,"+minAssets+" ,"+minEquity+" ,"+minLiabilities+" ,"+onlySolvent+" nisu pronasli ocekivani rezultat");
        }
        if (moment(startDate).isAfter(moment(endDate))) {
            throw new Error("Datum početka ne može biti posle datuma završetka");
        }
        const requestBody = { startDate, endDate, fiscalYearId, minAssets, minEquity, minLiabilities, onlySolvent };
        const response = await api.post(url + `/search`, requestBody, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli datu pertragu za balance-sheet po odredjenim parametrima: "+startDate+" ,"+endDate+" ,"+fiscalYearId+" ,"+minAssets+" ,"+minEquity+" ,"+minLiabilities+" ,"+onlySolvent);
    }
}

export async function findByTotalLiabilitiesLessThan(totalLiabilities) {
    try {
        const parseTotalLiabilities = parseFloat(totalLiabilities);
        if (isNaN(parseTotalLiabilities) || parseTotalLiabilities <= 0) {
            throw new Error("Dati ukupan trosak manji od "+totalLiabilities+", nije pronadjen");
        }
        const response = await api.get(url + `/by-total-liabilities-less-than`, {
            params: { totalLiabilities: parseTotalLiabilities },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli ukupan trosak manji od "+totalLiabilities);
    }
}

export async function findByTotalLiabilitiesGreaterThan(totalLiabilities) {
    try {
        const parseTotalLiabilities = parseFloat(totalLiabilities);
        if (isNaN(parseTotalLiabilities) || parseTotalLiabilities <= 0) {
            throw new Error("Dati ukupan trosak veci od "+totalLiabilities+", nije pronadjen");
        }
        const response = await api.get(url + `/by-total-liabilities-greater-than`, {
            params: { totalLiabilities: parseTotalLiabilities },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli ukupan trosak veci od "+totalLiabilities);
    }
}

export async function searchBalanceSheets({ startDate, endDate, fiscalYearId, minAssets }) {
    try {
        const parseMinAssets = parseFloat(minAssets);
        if (isNaN(fiscalYearId) || fiscalYearId == null ||
            !moment(startDate, "YYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid() ||
            isNaN(parseMinAssets) || parseMinAssets <= 0) {
            throw new Error("Dati parametri za pretragu BalanceSheet-a:"+startDate+" , "+endDate+" , "+fiscalYearId+" ,"+minAssets+" ne pronalazi ocekivani rezultat");
        }
        const response = await api.get(url + `/filter-balance-sheet`, {
            params: {
                startDate: moment(startDate).format("YYYY-MM-DD"),
                endDate: moment(endDate).format("YYYY-MM-DD"),
                fiscalYearId: fiscalYearId,
                minAssets: parseMinAssets
            },
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo uspeli da pronadjeno dati rezultat za BalanceSheet, "+startDate+" , "+endDate+" , "+fiscalYearId+
            " , "+minAssets+", koristeci parametre za pretragu");
    }
}

export async function findSolventBalanceSheets() {
    try {
        const response = await api.get(url + `/find-solvent-balance-sheet`, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli solventnost BalanceSheet-a");
    }
}

export async function findFirstByOrderByDateDesc() {
    try {
        const response = await api.get(url + `/find-first-by-order-date-desc`, {
            headers: getHeader()
        });
        return response.data;
    }
    catch (error) {
        handleApiError(error, "Trenutno nismo pronasli datum po opadajucem redosledu");
    }
}