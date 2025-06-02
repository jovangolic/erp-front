import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBuyers, deleteBuyer } from "../utils/buyerApi";
import TableComponent from "../TableComponent/TableComponent";

const BuyerList = () => {
    
    const [buyers, setBuyers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const data = await getAllBuyers();
                setBuyers(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchBuyers();
    }, []);

    const handleDelete = async (pib) => {
        try {
            await deleteBuyer(pib);
            setBuyers(prev => prev.filter(b => b.pib !== pib));
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Company Name", accessor: "companyName" },
        { header: "PIB", accessor: "pib" },
        { header: "Address", accessor: "address" },
        { header: "Contact Person", accessor: "contactPerson" },
        { header: "Email", accessor: "email" },
        { header: "Phone Number", accessor: "phoneNumber" },
    ];

    return (
        <div>
            <h2>Buyer List</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div>
                <Link to="/buyer/add" className="btn btn-success mb-3">Add New Buyer</Link>
            </div>

            <TableComponent
                columns={columns}
                data={buyers}
                actions={(buyer) => (
                    <>
                        <Link to={`/buyers/edit/${buyer.pib}`} className="btn btn-warning btn-sm">
                            Edit
                        </Link>
                        <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => handleDelete(buyer.pib)}
                        >
                            Delete
                        </button>
                    </>
                )}
            />
        </div>
    );
};

export default BuyerList;

