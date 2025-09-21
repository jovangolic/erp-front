import React from "react";
import { Card, Form } from "react-bootstrap";

const EditOptForm = ({ option, onChange }) => {
    if (!option) return null;

    const handleToggle = (field, checked) => {
        onChange(option.id, field, checked);
    };

    const handleValueChange = (e) => {
        onChange(option.id, "value", e.target.value);
    };

    return (
        <Card className="p-3 border rounded bg-light">
            <Card.Body>
                <h5>{option.name ?? "—"}</h5>
                <p className="text-muted">{option.type}</p>

                <Form.Group className="mb-3">
                <Form.Label>Value</Form.Label>
                <Form.Control
                    type="text"
                    value={option.value ?? ""}
                    onChange={handleValueChange}
                    disabled={!option.editable}
                />
                </Form.Group>

                <Form.Check
                type="switch"
                id={`visible-${option.id}`}
                label="Visible"
                checked={!!option.visible}
                onChange={(e) => handleToggle("visible", e.target.checked)}
                />

                <Form.Check
                type="switch"
                id={`editable-${option.id}`}
                label="Editable"
                checked={!!option.editable}
                onChange={(e) => handleToggle("editable", e.target.checked)}
                />
            </Card.Body>
        </Card>
    );
};

export default EditOptForm;
