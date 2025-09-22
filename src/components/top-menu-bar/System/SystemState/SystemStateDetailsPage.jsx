import React, { useEffect, useState } from "react";
import { Card, Container, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { getOneById } from "../../../utils/systemSettingsApi";

const SystemStateDetailsPage = () => {
    const { id } = useParams();
    const [systemState, setSystemState] = useState(null);

    useEffect(() => {
        const fetchState = async () => {
        try {
            const data = await getOneById(id);
            setSystemState(data);
        } catch (err) {
            console.error("Greska prilikom dohvatanja detalja system state:", err);
        }
        };
        fetchState();
    }, [id]);

    if (!systemState) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                <h4>System State Details (ID: {systemState.id})</h4>
                </Card.Header>
                <Card.Body>
                <p><strong>Maintenance Mode:</strong> {systemState.maintenanceMode ? "Enabled" : "Disabled"}</p>
                <p><strong>Registration Enabled:</strong> {systemState.registrationEnabled ? "Yes" : "No"}</p>
                <p><strong>System Version:</strong> {systemState.systemVersion}</p>
                <p><strong>Status Message:</strong> {systemState.statusMessage}</p>
                <p><strong>Last Restart Time:</strong> {systemState.lastRestartTime}</p>
                </Card.Body>
                <Card.Footer>
                <Button as={Link} to="/system-state/index" variant="secondary">
                    Back to List
                </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default SystemStateDetailsPage;