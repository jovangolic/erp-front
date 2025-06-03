import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPayment, updatePayment } from "../utils/paymentApi";
import { getAllBuyers } from "../utils/buyerApi";
import { getAllSales } from "../utils/salesApi";


const EditPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [payment, setPayment] = useState(null);
    const [buyers, setBuyers] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [paymentRes, buyersRes, salesRes] = await Promise.all([
                    getPayment(id),
                    getAllBuyers(),
                    getAllSales()
                ]);
                setPayment(paymentRes.data);
                setBuyers(buyersRes.data);
                setSalesList(salesRes.data);
            } catch (error) {
                setErrorMessage("Greška prilikom učitavanja podataka: " + error.message);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePayment(payment);
            navigate("/payments");
        } catch (error) {
            setErrorMessage("Greška prilikom ažuriranja: " + error.message);
        }
    };

    if (!payment) return <p>Učitavanje...</p>;

    return (
        <div className="container mt-4">
            <h2>Izmeni Plaćanje</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Iznos</label>
                    <input type="number" name="amount" value={payment.amount} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label>Datum plaćanja</label>
                    <input type="datetime-local" name="paymentDate" value={payment.paymentDate} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label>Način plaćanja</label>
                    <select name="method" value={payment.method} onChange={handleChange} className="form-control" required>
                        <option value="BANK_TRANSFER">Bankovni transfer</option>
                        <option value="CASH">Gotovina</option>
                        <option value="CARD">Kartica</option>
                        <option value="PAYPAL">PayPal</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Status</label>
                    <select name="status" value={payment.status} onChange={handleChange} className="form-control" required>
                        <option value="PENDING">Na čekanju</option>
                        <option value="COMPLETED">Završeno</option>
                        <option value="FAILED">Neuspešno</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Referentni broj</label>
                    <input type="text" name="referenceNumber" value={payment.referenceNumber} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label>Kupac</label>
                    <select name="buyerId" value={payment.buyer?.id} onChange={handleChange} className="form-control" required>
                        {buyers.map((b) => (
                            <option key={b.id} value={b.id}>{b.companyName}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Prodaja</label>
                    <select name="relatedSalesId" value={payment.relatedSales?.id} onChange={handleChange} className="form-control" required>
                        {salesList.map((s) => (
                            <option key={s.id} value={s.id}>Prodaja #{s.id}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Sačuvaj izmene</button>
            </form>
        </div>
    );
};

export default EditPayment;