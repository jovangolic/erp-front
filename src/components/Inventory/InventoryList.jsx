import React, { useState, useEffect } from "react";
import { findAllInventories } from "../../utils/inventoryApi";  // API funkcija za dohvat svih inventara
import { Link } from "react-router-dom";

const InventoryList = () => {
    const [inventories, setInventories] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const data = await findAllInventories();
                setInventories(data);
            } catch (error) {
                setErrorMessage("There was an error fetching the inventories.");
            }
        };

        fetchInventories();
    }, []);

    return (
        <div>
            <h2>Inventory List</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div>
                <Link to="/inventory/add" className="btn btn-success mb-3">Add New Inventory</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Storage Employee ID</th>
                        <th>Storage Foreman ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventories.length > 0 ? (
                        inventories.map((inventory) => (
                            <tr key={inventory.id}>
                                <td>{inventory.storageEmployeeId}</td>
                                <td>{inventory.storageForemanId}</td>
                                <td>{inventory.date}</td>
                                <td>{inventory.status}</td>
                                <td>
                                    <Link to={`/inventory/edit/${inventory.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                    <button 
                                        className="btn btn-danger btn-sm ms-2" 
                                        onClick={() => deleteInventory(inventory.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No inventories found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryList;