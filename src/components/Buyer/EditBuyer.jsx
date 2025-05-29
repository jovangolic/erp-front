import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateBuyer, getBuyerByPib } from "../utils/buyerApi"; 

const EditBuyer = () => {

    const { pib } = useParams(); // PIB iz URL-a
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Učitaj kupca prilikom mountovanja
    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                const buyer = await getBuyerByPib(pib);
                setCompanyName(buyer.companyName);
                setAddress(buyer.address);
                setContactPerson(buyer.contactPerson);
                setEmail(buyer.email);
                setPhoneNumber(buyer.phoneNumber);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchBuyer();
    }, [pib]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBuyer(pib, companyName, address, contactPerson, email, phoneNumber);
            navigate("/buyer", { state: { message: "Kupac je uspešno ažuriran!" } });
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    if(buyer == null){
        return <div>Loading....</div>
    }

    return (
        <div className="container">
            <h2>Izmeni Kupca</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Naziv kompanije</label>
                    <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Adresa</label>
                    <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Kontakt osoba</label>
                    <input type="text" className="form-control" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefon</label>
                    <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Sačuvaj Izmene</button>
            </form>
        </div>
    );

};

export default EditBuyer;