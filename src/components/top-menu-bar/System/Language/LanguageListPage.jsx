import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container } from "react-bootstrap";
import { getAllLanguages } from "../../../utils/languageApi";

const LanguageListPage = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getAllLanguages();
            setLanguages(data);
        } catch (err) {
            setError("Greska prilikom ucitavanja jezika.");
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="p-3">
            <h3>Languages</h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {languages.map((lang) => (
                    <tr key={lang.id}>
                    <td>{lang.id}</td>
                    <td>{lang.languageCodeType}</td>
                    <td>{lang.languageNameType}</td>
                    </tr>
                ))}
                </tbody>
        </Table>
        </Container>
    );
};

export default LanguageListPage;
