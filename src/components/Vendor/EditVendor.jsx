import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../utils/vendorApi"; // API funkcija za dohvat podataka o vendoru

const ViewVendor = () => {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null); // Koristi null umesto ""
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const data = await getById(id);
                setVendor(data);  // Postavljanje podataka o vendoru u state
            } catch (error) {
                setErrorMessage(error.message);  // Postavljanje greške u state
            }
        };

        fetchVendor();  // Pokrećemo asinhroni poziv za dohvat podataka
    }, [id]);  // Zavisnost od id, pokreće se svaki put kad se id promeni

    if (vendor === null) {
        return <div>Loading...</div>;  // Prikazivanje loading indikatora dok podaci nisu učitani
    }

    return (
        <div>
            <h2>Vendor Details</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Prikazivanje greške */}
            
            <div className="mb-3">
                <strong>Name: </strong> {vendor.name || "No name available"}
            </div>
            <div className="mb-3">
                <strong>Email: </strong> {vendor.email || "No email available"}
            </div>
            <div className="mb-3">
                <strong>Phone number: </strong> {vendor.phoneNumber || "No phone number available"}
            </div>
            <div className="mb-3">
                <strong>Address: </strong> {vendor.address || "No address available"}
            </div>

            {/* Dodatne informacije o vendoru (ako postoje) */}
            {vendor.products && vendor.products.length > 0 && (
                <div>
                    <h3>Products</h3>
                    <ul>
                        {vendor.products.map((product, index) => (
                            <li key={index}>{product.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ViewVendor;