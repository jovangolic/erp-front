import React from "react";
import {Form} from "react-bootstrap";


const Label = ({ value, onChange, error }) => {

    return (
        <Form.Group controlId="optionLabel" className="mb-3">
            <Form.Label>Label</Form.Label>
            <Form.Control
                type="text"
                placeholder="Unesite prikaznu vrednost (npr. Administrator, Odobren, Muško...)"
                value={value}
                onChange={(e) => onChange(e.target.value)}   // callback ka parentu
                isInvalid={!!error}
            />
            {error && (
                <Form.Control.Feedback type="invalid">
                {error}
                </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
                Ovo je naziv koji će korisnik videti u aplikaciji (user-friendly).
            </Form.Text>
        </Form.Group>
  );
};

export default Label;