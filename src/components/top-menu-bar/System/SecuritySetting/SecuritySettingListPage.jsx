import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container } from "react-bootstrap";
import { getAllSettings } from "../../../utils/SecuritySettingApi";

const SecuritySettingListPage = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
        try {
            const data = await getAllSettings();
            setSettings(data);
        } catch (err) {
            setError(err.message || "Greska prilikom ucitavanja podesavanja");
        } finally {
            setLoading(false);
        }
        };
        fetchSettings();
    }, []);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
        <h3>Security Settings</h3>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Setting Name</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {settings.map(s => (
                <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.settingName}</td>
                <td>{s.value}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        </Container>
    );
};

export default SecuritySettingListPage;