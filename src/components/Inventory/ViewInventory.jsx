import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { findOneInventory } from "../../utils/inventoryApi";  // API poziv za dohvat jednog inventara

const ViewInventory = () => {
    const { id } = useParams();  // Preuzimanje ID-ja inventara iz URL parametara
    const [inventory, setInventory] = useState(null);  // State za čuvanje podataka o inventaru
    const [errorMessage, setErrorMessage] = useState("");  // State za greške

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await findOneInventory(id);  // Pozivanje API funkcije za dohvat inventara
                setInventory(data);  // Postavljanje podataka u state
            } catch (error) {
                setErrorMessage(error.message);  // Ako dođe do greške, postavi grešku
            }
        };

        fetchInventory();  // Učitavanje podataka prilikom renderovanja
    }, [id]);

    if (!inventory) {
        return <div>Loading...</div>;  // Prikazivanje "loading" dok se podaci učitavaju
    }

    return (
        <div>
            <h2>Inventory Details</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Prikazivanje greške ako postoji */}
            
            <div className="mb-3">
                <strong>Storage Employee: </strong> {inventory.storageEmployeeName}
            </div>
            <div className="mb-3">
                <strong>Storage Foreman: </strong> {inventory.storageForemanName}
            </div>
            <div className="mb-3">
                <strong>Date: </strong> {inventory.date}
            </div>
            <div className="mb-3">
                <strong>Status: </strong> {inventory.status}
            </div>
            <div className="mb-3">
                <strong>Aligned: </strong> {inventory.aligned ? "Yes" : "No"}
            </div>

            <h3>Inventory Items</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.inventoryItems && inventory.inventoryItems.length > 0 ? (
                        inventory.inventoryItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName}</td> {/* Pretpostavljamo da imaš naziv proizvoda */}
                                <td>{item.quantity}</td>
                                <td>{item.itemCondition}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No inventory items found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewInventory;