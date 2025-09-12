import React from "react";
import { Form } from "react-bootstrap";
import { GoToType } from "../../shared/enums/GoToType";

const GoToTypeSelect = ({value, onChange}) => {
    return(
        <Form.Group controlId="goToType">
            <Form.Label>Type</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Select Type --</option>
                {Object.values(GoToType).map((t) => (
                    <option key={t} value={t}>
                        {cat.replaceAll("_", " ")}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default GoToTypeSelect;