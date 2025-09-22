import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAll, deleteLocalizedOption } from "../../../utils/localizedOptionApi";

const LocalizedOptionIndexPage = () => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getAll();
            setOptions(data || []);
        } 
        catch (err) {
            setError("Greska prilikom ucitavanja prevoda");
        } 
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Da li ste sigurni da zelite obrisati prevod?")) return;
        try {
        await deleteLocalizedOption(id);
        setOptions((prev) => prev.filter((opt) => opt.id !== id));
        } catch (err) {
        setError("Greska prilikom brisanja");
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="p-3">
        <h3>Localized Options</h3>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>ID</th>
                <th>Option</th>
                <th>Language</th>
                <th>Localized Label</th>
                <th>Akcije</th>
            </tr>
            </thead>
            <tbody>
            {options.length > 0 ? (
                options.map((opt) => (
                <tr key={opt.id}>
                    <td>{opt.id}</td>
                    <td>{opt.option?.label} ({opt.option?.category})</td>
                    <td>{opt.language?.languageNameType}</td>
                    <td>{opt.localizedLabel}</td>
                    <td>
                    <Button
                        as={Link}
                        to={`/localized-option/edit/${opt.id}`}
                        size="sm"
                        variant="warning"
                        className="me-2"
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(opt.id)}
                    >
                        Delete
                    </Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5" className="text-center">
                    Nema prevoda
                </td>
                </tr>
            )}
            </tbody>
        </Table>
    </Container>
  );
};

export default LocalizedOptionIndexPage;
