import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllConfirmationDocuments, deleteConfirmationDocument } from "../utils/confirmationDocumentApi";
import  { downloadConfirmationDocument} from "../utils/confirmationDocumentApi";

const ConfirmationDocumentList = () => {
    const [confirmationDocs, setConfirmationDocs] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllConfirmationDocuments();
                setConfirmationDocs(response.data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Da li ste sigurni da želite da obrišete ovaj dokument?")) {
            try {
                await deleteConfirmationDocument(id);
                setConfirmationDocs(prevDocs => prevDocs.filter(doc => doc.id !== id));
            } catch (error) {
                setErrorMessage("Greška pri brisanju: " + error.message);
            }
        }
    };

    const handleDownload = async (id, filename) => {
        try {
            const response = await downloadConfirmationDocument(id);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || `confirmation-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setErrorMessage("Greška pri preuzimanju: " + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Lista Potvrdnih Dokumenata</h2>

            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}

            <div className="mb-3">
                <Link to="/confirmation-documents/add" className="btn btn-success">
                    Dodaj novi dokument
                </Link>
            </div>

            {confirmationDocs.length === 0 ? (
                <p>Nema dokumenata za prikaz.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Putanja fajla</th>
                            <th>Kreiran</th>
                            <th>Korisnik</th>
                            <th>Smena</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {confirmationDocs.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.id}</td>
                                <td>{doc.filePath}</td>
                                <td>{new Date(doc.createdAt).toLocaleString()}</td>
                                <td>{doc.createdBy?.username || "Nepoznato"}</td>
                                <td>{doc.shift?.id || "Nepoznato"}</td>
                                <td>
                                    <Link
                                        to={`/confirmation-documents/view/${doc.id}`}
                                        className="btn btn-info btn-sm me-2"
                                    >
                                        Pregledaj
                                    </Link>
                                    <Link
                                        to={`/confirmation-documents/edit/${doc.id}`}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Izmeni
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Obriši
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc.id, `confirmation-${doc.id}.pdf`)}
                                        className="btn btn-secondary btn-sm me-2">
                                            Preuzmi PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ConfirmationDocumentList;