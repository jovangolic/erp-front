import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";
import { getAllSettings } from "../../../utils/SecuritySettingApi"; 
import { Link } from "react-router-dom";

const SecuritySettingIndexPage = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getAllSettings();
                setSettings(data);
            } 
            catch (err) {
                setError("Greska prilikom ucitavanja security setting-a");
            } 
            finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <Container className="text-center p-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="p-3">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="p-3">
            <h3 className="mb-4">Security Settings</h3>
            <Button as={Link} to="/security-settings/form" variant="primary" className="mb-3">
                Add New Setting
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Setting Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {settings.map((setting) => (
                        <tr key={setting.id}>
                            <td>{setting.id}</td>
                            <td>{setting.settingName}</td>
                            <td>{setting.value}</td>
                            <td>
                                <Button 
                                    as={Link} 
                                    to={`/security-settings/form/${setting.id}`} 
                                    variant="warning" 
                                    size="sm"
                                >
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default SecuritySettingIndexPage;
