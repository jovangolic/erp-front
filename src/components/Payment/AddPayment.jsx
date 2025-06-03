import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../utils/paymentApi";
import { getAllBuyers } from "../utils/buyerApi";
import { getAllSales } from "../utils/salesApi";

const AddPayment = () => {

    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState({
        amount: "",
        paymentDate: "",
        method: "BANK_TRANSFER",
        status: "PENDING",
        referenceNumber: "",
        buyerId: "",
        relatedSalesId: ""
    });

    const [buyers, setBuyers] = useState([]);
    const [sales, setSales] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyerResponse = await getAllBuyers();
                setBuyers(buyerResponse.data);
                const salesResponse = await getAllSales();
                setSales(salesResponse.data);
            } catch (error) {
                setErrorMessage("Greška pri učitavanju kupaca ili prodaja.");
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPayment(paymentData);
            navigate("/payments");
        } catch (error) {
            setErrorMessage("Greška pri dodavanju plaćanja: " + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Dodaj novo plaćanje</h2>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Iznos</label>
                    <input
                        type="number"
                        step="0.01"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Datum plaćanja</label>
                    <input
                        type="datetime-local"
                        name="paymentDate"
                        value={paymentData.paymentDate}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Način plaćanja</label>
                    <select
                        name="method"
                        value={paymentData.method}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="BANK_TRANSFER">Prenos na račun</option>
                        <option value="CASH">Gotovina</option>
                        <option value="CARD">Kartica</option>
                        <option value="PAYPAL">PayPal</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Status</label>
                    <select
                        name="status"
                        value={paymentData.status}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="PENDING">Na čekanju</option>
                        <option value="COMPLETED">Završeno</option>
                        <option value="FAILED">Neuspešno</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Referentni broj</label>
                    <input
                        type="text"
                        name="referenceNumber"
                        value={paymentData.referenceNumber}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Kupac</label>
                    <select
                        name="buyerId"
                        value={paymentData.buyerId}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">-- Izaberi kupca --</option>
                        {buyers.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.companyName} ({b.pib})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Prodaja</label>
                    <select
                        name="relatedSalesId"
                        value={paymentData.relatedSalesId}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">-- Izaberi prodaju --</option>
                        {sales.map((s) => (
                            <option key={s.id} value={s.id}>
                                #{s.id} - {s.salesDescription || "Bez opisa"}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Sačuvaj</button>
            </form>
        </div>
    );
};

export default AddPayment;