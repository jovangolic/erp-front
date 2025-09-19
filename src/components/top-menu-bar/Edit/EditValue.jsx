import React from "react";
import { Form } from "react-bootstrap";

const EditValue =({ value, onChange, error }) => {

    return (
        <Form.Group controlId="editValue" className="mb-3">
            <Form.Label>Value</Form.Label>
            <Form.Control
                type="text"
                placeholder="Unesite sistemsku vrednost (npr. ROLE_ADMIN, APPROVED, M)"
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
                Ovo je vrednost koju backend koristi u bazi i logici sistema.
            </Form.Text>
        </Form.Group>
    );
};

export default EditValue;