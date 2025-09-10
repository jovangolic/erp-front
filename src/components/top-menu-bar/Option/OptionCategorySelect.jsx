import React from "react";
import { Form } from "react-bootstrap";
import {OptionCategory } from "../../shared/enums/OptionCategory";

const OptionCategorySelect = ({value, onChange}) => {
    return(
        <Form.Group controlId="helpCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Select Category --</option>
                {Object.values(OptionCategory).map((cat) => (
                <option key={cat} value={cat}>
                {cat.replaceAll("_", " ")}
                </option>
            ))}
            </Form.Select>
        </Form.Group>
    );
};

export default OptionCategorySelect;