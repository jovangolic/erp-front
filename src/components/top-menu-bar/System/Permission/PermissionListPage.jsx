import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container } from "react-bootstrap";
import { getAll } from "../../../utils/permissionApi";

const PermissionListPage = () => {

    const [permission, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllPermissions = async () => {
            try {
                const data = await getAll();
                setPermissions(data || []);
            } catch (err) {
                setError(err.message || "Greska prilikom ucitavanja odobrenja");
            } finally {
                setLoading(false);
            }
        };
        fetchAllPermissions();
    }, []);

    if (loading) {
        return (
            <Container className="text-center p-5">
                <Spinner animation="border" />
                <div>Loading permissions...</div>
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
            <h3>Permissions</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Action-Type</th>
                        <th>Resource-Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {permission.map((per) => (
                        <tr key={per.id}>
                        <td>{per.id}</td>
                        <td>{per.resourceType}</td>
                        <td>{per.actionType}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default PermissionListPage;