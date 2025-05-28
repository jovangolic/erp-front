
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBuyerById } from "../utils/buyerApi";

const ViewBuyer = () => {

    const { id } = useParams();  // Preuzimanje ID-ja buyer-a iz URL parametara
    const [buyer, setBuyer] = useState(null);  // State za čuvanje podataka o kupcu
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                const data = await getBuyerById(id);
                setBuyer(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchBuyer();
    }, [id]);

    if (buyer == null) {
        return <div>Loading...</div>;  // Prikazivanje "loading" dok se podaci učitavaju
    }

    return (
        <div>
            <h2>Buyer Details</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Prikazivanje greške ako postoji */}
            
            <div className="mb-3">
                <strong>Company Name: </strong> {buyer.companyName}
            </div>
            <div className="mb-3">
                <strong>PIB: </strong> {buyer.pib}
            </div>
            <div className="mb-3">
                <strong>Address: </strong> {buyer.address}
            </div>
            <div className="mb-3">
                <strong>Contact Person: </strong> {buyer.contactPerson}
            </div>
            <div className="mb-3">
                <strong>Email: </strong> {buyer.email}
            </div>
            <div className="mb-3">
                <strong>Phone Number: </strong> {buyer.phoneNumber}
            </div>

            <h3>Sales Orders</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Order Number</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Invoice</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {buyer.salesOrders && buyer.salesOrders.length > 0 ? (
                        buyer.salesOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.orderNumber}</td>
                                <td>{order.orderDate}</td>
                                <td>{order.totalAmount}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.items && order.items.length > 0 ? (
                                        <ul>
                                            {order.items.map((item, itemIndex) => (
                                                <li key={itemIndex}>
                                                    {item.goods.name} - {item.quantity} x {item.unitPrice}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "No items"
                                    )}
                                </td>
                                <td>
                                    {order.invoice ? (
                                        <>
                                            <strong>{order.invoice.invoiceNumber}</strong>
                                            <br />
                                            Due: {order.invoice.dueDate}
                                        </>
                                    ) : (
                                        "No invoice"
                                    )}
                                </td>
                                <td>{order.note || "No note"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No sales orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBuyer;
