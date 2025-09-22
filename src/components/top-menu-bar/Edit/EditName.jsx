import React from "react";
import { Form } from "react-bootstrap";

const EditName = ({name, onChange, error}) => {

    return(
        <Form.Group controlId="editName" className="mb-3">
            <Form.Label>Name</Form.Label>
                <Form.Control
                type="text"
                placeholder="Unesite sistemsku vrednost (npr. ROLE_ADMIN, APPROVED, M)"
                name={name}
                onChange={(e) => onChange(e.target.value)} 
                isInvalid={!!error}
            />
            {error && (
            <Form.Control.Feedback type="invalid">
            {error}
            </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
                Ovo je naziv koju backend koristi u bazi i logici sistema.
            </Form.Text>
        </Form.Group>
    );
};

export default EditName;