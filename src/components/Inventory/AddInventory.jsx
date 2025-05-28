import React, { useState } from "react";
import { createInventory } from "../../utils/inventoryApi";  // API funkcija za kreiranje inventara
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AddInventory = () => {
    const [storageEmployeeId, setStorageEmployeeId] = useState("");
    const [storageForemanId, setStorageForemanId] = useState("");
    const [date, setDate] = useState("");
    const [aligned, setAligned] = useState(false);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [status, setStatus] = useState("PENDING");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createInventory(storageEmployeeId, storageForemanId, date, aligned, inventoryItems, status);
            // Preusmeravanje na listu inventara nakon uspešnog dodavanja
            navigate("/inventory", { state: { message: "Inventory successfully added!" } });
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Add New Inventory</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Storage Employee ID</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={storageEmployeeId} 
                        onChange={(e) => setStorageEmployeeId(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Storage Foreman ID</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={storageForemanId} 
                        onChange={(e) => setStorageForemanId(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Aligned</label>
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={aligned} 
                        onChange={(e) => setAligned(e.target.checked)} 
                    />
                </div>
                {/* Dodaj UI za unos stavki inventara ako je potrebno */}
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                        className="form-select" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                    >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RECONCILED">Reconciled</option>
                        <option value="PARTIALLY_COMPLETED">Partially Completed</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Inventory</button>
            </form>
        </div>
    );
};

export default AddInventory;