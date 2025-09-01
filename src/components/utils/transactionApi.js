import moment, { min } from "moment";
import { api, getHeader, getToken, getHeaderForFormData } from "./AppFunction";

function handleApiError(error, customMessage) {
    if (error.response && error.response.data) {
        throw new Error(error.response.data);
    }
    throw new Error(`${customMessage}: ${error.message}`);
}

const url = `${import.meta.env.VITE_API_BASE_URL}/transactions`;
const isTransactionTypeValid = ["TRANSFER","DEPOSIT","WITHDRAWAL","PAYMENT","REFUND","CASH","DEBIT"];
const isPaymentMethodValid = ["BANK_TRANSFER", "CASH", "CARD", "PAYPAL"];
const isAccountTypeValid = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];