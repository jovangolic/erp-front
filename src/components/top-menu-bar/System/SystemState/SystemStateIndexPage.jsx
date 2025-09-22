import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllSystemStates } from "../../../utils/systemStateApi";

const SystemStateIndexPage = () => {
    const [systemStates, setSystemStates] = useState([]);

    useEffect(() => {
        const fetchStates = async () => {
        try {
            const data = await getAllSystemStates(); 
            setSystemStates(data);
        } catch (err) {
            console.error("Greska prilikom dohvatanja system state:", err);
        }
        };
        fetchStates();
    }, []);

    return (
        <Container className="mt-4">
            <h2>System States</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Maintenance Mode</th>
                    <th>Registration Enabled</th>
                    <th>System Version</th>
                    <th>Status</th>
                    <th>Last Restart</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {systemStates.map((state) => (
                    <tr key={state.id}>
                    <td>{state.id}</td>
                    <td>{state.maintenanceMode ? "Yes" : "No"}</td>
                    <td>{state.registrationEnabled ? "Yes" : "No"}</td>
                    <td>{state.systemVersion}</td>
                    <td>{state.statusMessage}</td>
                    <td>{state.lastRestartTime}</td>
                    <td>
                        <Button
                        as={Link}
                        to={`/system-state/details/${state.id}`}
                        size="sm"
                        variant="info"
                        >
                        Details
                        </Button>
                        {" "}
                        <Button
                        as={Link}
                        to={`/system-state/edit/${state.id}`}
                        size="sm"
                        variant="warning"
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

export default SystemStateIndexPage;