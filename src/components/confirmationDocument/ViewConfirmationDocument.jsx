import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getConfirmationDocumentById} from "../utils/confirmationDocumentApi";

const ViewConfiramtionDocument = () => {
    const { id } = useParams(); 
    const [confirmationDoc, setConfirmationDoc] = useState(null);  
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async() => {
            try{
                const response = await getConfirmationDocumentById(id);
                setConfirmationDoc(response.data)
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchData();
    },[id]);

    if(confirmationDoc == null){
        return <div>Loading ....</div>
    } 
    if (!confirmationDoc) {
         return <div>Loading ...</div>;
    }

    return(
        <div className="container mt-4">
            <h2>Detalji potvrde dokumenta</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="card">
            <div className="card-body">
                <p><strong>ID dokumenta:</strong> {confirmationDoc.id}</p>
                <p><strong>Putanja fajla:</strong> {confirmationDoc.filePath}</p>
                <p><strong>Datum kreiranja:</strong> {new Date(confirmationDoc.createdAt).toLocaleString()}</p>

                <hr />
                <h5>Kreirao korisnik:</h5>
                <p><strong>Korisničko ime:</strong> {confirmationDoc.createdBy?.username}</p>
                <p><strong>Ime:</strong> {confirmationDoc.createdBy?.firstName}</p>
                <p><strong>Prezime:</strong> {confirmationDoc.createdBy?.lastName}</p>
                <p><strong>Email:</strong> {confirmationDoc.createdBy?.email}</p>

                <hr />
                <h5>Informacije o smeni:</h5>
                <p><strong>Početak smene:</strong> {new Date(confirmationDoc.shift?.startTime).toLocaleString()}</p>
                <p><strong>Kraj smene:</strong> {new Date(confirmationDoc.shift?.endTime).toLocaleString()}</p>

                <h6>Rukovodilac smene:</h6>
                <p><strong>Ime:</strong> {confirmationDoc.shift?.shiftSupervisor?.firstName} {confirmationDoc.shift?.shiftSupervisor?.lastName}</p>
                <p><strong>Email:</strong> {confirmationDoc.shift?.shiftSupervisor?.email}</p>
            </div>
            </div>
        </div>
    );
};

export default ViewConfiramtionDocument;