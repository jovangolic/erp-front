import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPayment } from "../utils/paymentApi";
 
const ViewPayment = () => {

    const { id } = useParams();
    const [payment, setPayment] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPayment(id);
                setPayment(response.data);
            } catch (error) {
                setErrorMessage("Greška: " + error.message);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="container mt-4">
            <h2>Detalji Plaćanja</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <ul className="list-group">
                <li className="list-group-item"><strong>Iznos:</strong> {payment.amount} RSD</li>
                <li className="list-group-item"><strong>Datum:</strong> {new Date(payment.paymentDate).toLocaleString()}</li>
                <li className="list-group-item"><strong>Način plaćanja:</strong> {payment.method}</li>
                <li className="list-group-item"><strong>Status:</strong> {payment.status}</li>
                <li className="list-group-item"><strong>Referentni broj:</strong> {payment.referenceNumber}</li>
                <li className="list-group-item"><strong>Kupac:</strong> {payment.buyer?.companyName}</li>
                <li className="list-group-item"><strong>Prodaja ID:</strong> {payment.relatedSales?.id}</li>
            </ul>
            <Link to="/payments" className="btn btn-secondary mt-3">Nazad</Link>
        </div>
    );

};

export default ViewPayment;