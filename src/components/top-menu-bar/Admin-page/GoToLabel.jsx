import React from "react";
import { Form } from "react-bootstrap";

const GoToLabel = ({ value, onChange, error }) => {

    return (
        <Form.Group controlId="goToLabel" className="mb-3">
            <Form.Label>Label</Form.Label>
            <Form.Control
                type="text"
                placeholder="Unesite naziv opcije u meniju (npr. Skladište, Računovodstvo, Prodaja...)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                isInvalid={!!error}
            />
            {error && (
                <Form.Control.Feedback type="invalid">
                {error}
                </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
                Ovo je naziv opcije koji ce korisnik videti u GoTo meniju.
                <br />
                Primeri: <i>Skladiste</i>, <i>Racunovodstvo</i>, <i>Izvestaji</i>, <i>Logistika</i>, <i>Materijali</i>
            </Form.Text>
        </Form.Group>
  );
};

export default GoToLabel;