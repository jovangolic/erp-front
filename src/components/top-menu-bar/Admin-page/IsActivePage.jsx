import React, { useState } from "react";
import { Container, Form, Spinner } from "react-bootstrap";

const IsActivePage = ({ isActive, onToggle }) => {

    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        setLoading(true);

        try {
        // Simulacija async akcije (npr. API poziv ka backendu)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Okida callback parentu da promeni state
        onToggle(!isActive);
        } 
        finally {
        setLoading(false);
        }
    };

    return (
        <Container className="p-2">
            <Form.Group controlId="isActive">
                <Form.Check
                type="switch"
                label={isActive ? "Aktivna opcija" : "Neaktivna opcija"}
                checked={isActive}
                onChange={handleChange}
                disabled={loading}
                />
                {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                <Form.Text className="text-muted">
                    Ako je aktivno, ova opcija ce biti vidljiva korisnicima.
                </Form.Text>
            </Form.Group>
        </Container>
  );
};

export default IsActivePage;