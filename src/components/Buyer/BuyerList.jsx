import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBuyers, deleteBuyer } from "../utils/buyerApi";

const BuyerList = () => {

    const [buyers, setBuyers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetBuyers = async () => {
            try{
                const data = await getAllBuyers();
                setBuyers(data);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetBuyers();
    },[]);

    return (
        <div>
            <h2>Buyer List</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div>
                <Link to="/buyer/add" className="btn btn-success mb-3">Add New Buyer</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>PIB</th>
                        <th>Address</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {buyers.length > 0 ? (
                        buyers.map((buyer) => (
                            <tr key={buyer.id}>
                                <td>{buyer.id}</td>
                                <td>{buyer.companyName}</td>
                                <td>{buyer.pib}</td>
                                <td>{buyer.address}</td>
                                <td>{buyer.contactPerson}</td>
                                <td>{buyer.email}</td>
                                <td>{buyer.phoneNumber}</td>
                                <td>
                                    <Link to={`/buyers/edit/${buyer.pib}`} className="btn btn-warning btn-sm">Edit</Link>
                                    <button 
                                        className="btn btn-danger btn-sm ms-2" 
                                        onClick={() => deleteBuyer(buyer.pib)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No buyers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BuyerList;

