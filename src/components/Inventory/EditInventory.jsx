import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findOneInventory, updateInventory } from "../../utils/inventoryApi";  // API funkcije za dohvatanje i ažuriranje
import moment from "moment";

const EditInventory = () => {
    const { id } = useParams(); // ID inventara koji se uređuje
    const [inventory, setInventory] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await findOneInventory(id); // Učitavanje postojećeg inventara
                setInventory(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchInventory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateInventory(id, inventory.storageEmployee.id, inventory.storageForeman.id, inventory.date, inventory.aligned, inventory.inventoryItems, inventory.status);
            navigate("/inventory", { state: { message: "Inventory successfully updated!" } });
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    if (!inventory) {
        return <div>Loading...</div>; // Prikazuje se dok se podaci učitavaju
    }

    return (
        <div>
            <h2>Edit Inventory</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Storage Employee ID</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={inventory.storageEmployee.id} 
                        onChange={(e) => setInventory({ ...inventory, storageEmployee: { id: e.target.value }})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Storage Foreman ID</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={inventory.storageForeman.id} 
                        onChange={(e) => setInventory({ ...inventory, storageForeman: { id: e.target.value }})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={moment(inventory.date).format("YYYY-MM-DD")} 
                        onChange={(e) => setInventory({ ...inventory, date: e.target.value })} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Aligned</label>
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={inventory.aligned} 
                        onChange={(e) => setInventory({ ...inventory, aligned: e.target.checked })} 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                        className="form-select" 
                        value={inventory.status} 
                        onChange={(e) => setInventory({ ...inventory, status: e.target.value })} 
                    >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RECONCILED">Reconciled</option>
                        <option value="PARTIALLY_COMPLETED">Partially Completed</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Inventory</button>
            </form>
        </div>
    );
};

export default EditInventory;