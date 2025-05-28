import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../utils/vendorApi";

const ViewVendor = () => {

    const{ id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchVendor = async () => {
            try{
                const data = await getById(id);
                setVendor(data);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchVendor();
    },[id]);

    if (vendor === null) {
        return <div>Loading...</div>; // ili bolje: <Spinner />
    }

    return(
        <div>
            <h2>Vendor Details</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Prikazivanje greške ako postoji */}
            
            <div className="mb-3">
                <strong>Name: </strong> {vendor.name}
            </div>
            <div className="mb-3">
                <strong>Email: </strong> {vendor.email}
            </div>
            <div className="mb-3">
                <strong>Phone number: </strong> {vendor.phoneNumber}
            </div>
            <div className="mb-3">
                <strong>Address: </strong> {vendor.address}
            </div>
        </div>
    );
};

export default ViewVendor;