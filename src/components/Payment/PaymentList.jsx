import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPayments, deletePayment } from "../utils/paymentApi";

const PaymentList = () => {

    const[payments, setPayments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async() => {
            try{
                const response = await getAllPayments();
                setPayments(response.data);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchData();
    },[]);

    const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovo plaćanje?")) {
        try {
            await deletePayment(id);
            setPayments(payments.filter((p) => p.id !== id));
        } catch (error) {
            setErrorMessage("Greška prilikom brisanja: " + error.message);
        }
    }
};

    return (
    <div className="container mt-4">
        <h2>Lista Plaćanja</h2>

        {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
        )}

        <div className="mb-3">
            <Link to="/payments/add" className="btn btn-success">
                Dodaj novo plaćanje
            </Link>
        </div>

        {payments.length === 0 ? (
            <p>Nema unetih plaćanja.</p>
        ) : (
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Iznos</th>
                            <th>Datum uplate</th>
                            <th>Način plaćanja</th>
                            <th>Status</th>
                            <th>Referentni broj</th>
                            <th>Kupac</th>
                            <th>Prodaja</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.amount} RSD</td>
                                <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                                <td>{payment.method}</td>
                                <td>{payment.status}</td>
                                <td>{payment.referenceNumber}</td>
                                <td>{payment.buyer?.companyName}</td>
                                <td>{payment.relatedSales?.id}</td>
                                <td>
                                    <Link to={`/payments/view/${payment.id}`} className="btn btn-info btn-sm me-2">
                                        Detalji
                                    </Link>
                                    <Link to={`/payments/edit/${payment.id}`} className="btn btn-warning btn-sm me-2">
                                        Izmeni
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(payment.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Obriši
                                    </button>
                                    {/* Možeš dodati i delete ako želiš */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

};

export default PaymentList;