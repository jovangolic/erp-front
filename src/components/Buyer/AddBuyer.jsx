
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBuyer } from "../utils/buyerApi";

const AddBuyer = () => {
    const [companyName, setCompanyName] = useState("");
    const [pib, setPib] = useState("");
    const [address, setAddress] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [salesOrders, setSalesOrders] = useState([]); // Lista Sales Orders
    const [orderNumber, setOrderNumber] = useState(""); // Za unos order number
    const [orderDate, setOrderDate] = useState(""); // Za unos order date
    const [totalAmount, setTotalAmount] = useState(""); // Za unos total amount
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Dodavanje novog Sales Order-a u listu
    const addSalesOrder = () => {
        setSalesOrders([
            ...salesOrders,
            {
                orderNumber,
                orderDate,
                totalAmount,
            },
        ]);
        // Resetovanje polja za unos nakon dodavanja
        setOrderNumber("");
        setOrderDate("");
        setTotalAmount("");
    };

    // Funkcija za slanje podataka na backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBuyer(companyName, pib, address, contactPerson, email, phoneNumber, salesOrders);
            navigate("/buyer", { state: { message: "Buyer successfully added!" } });
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Add New Buyer</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">PIB</label>
                    <input
                        type="text"
                        className="form-control"
                        value={pib}
                        onChange={(e) => setPib(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contact Person</label>
                    <input
                        type="text"
                        className="form-control"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                {/* Sales Order Inputs */}
                <h3>Add Sales Order</h3>
                <div className="mb-3">
                    <label className="form-label">Order Number</label>
                    <input
                        type="text"
                        className="form-control"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Order Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Total Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-secondary" onClick={addSalesOrder}>
                    Add Sales Order
                </button>

                <h4>Sales Orders List</h4>
                <ul>
                    {salesOrders.map((order, index) => (
                        <li key={index}>
                            Order Number: {order.orderNumber}, Order Date: {order.orderDate}, Total Amount: {order.totalAmount}
                        </li>
                    ))}
                </ul>

                <button type="submit" className="btn btn-primary">
                    Add Buyer
                </button>
            </form>
        </div>
    );
};

export default AddBuyer;