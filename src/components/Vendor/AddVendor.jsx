import React, { useState } from "react";
import { createVendor } from "../utils/vendorApi";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AddVendor = () => {

    const[name, setName] = useState("")
    const[email, setEmail] = useState("");
    const[phoneNumber, setPhoneNumber] = useState("");
    const[address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await createVendor(name,email,phoneNumber,address);
            navigate("/vendor", { state: { message: "Vendor successfully added!" } });
        }
        catch(error){
            setErrorMessage(error.message);
        }
    }

    return(
        <div>
            <h2>Add New Vendor</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone number</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
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
            </form>
        </div>
    );

};

export default AddVendor;