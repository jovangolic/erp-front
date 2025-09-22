import React from "react";
import { Form } from "react-bootstrap";
import { EditOptType } from "../../shared/enums/EditOptType";

const EditTypeSelect = ({value, onChange = () => {}}) => {
    return(
        <Form.Group controlId="optionCategory">
            <Form.Label>Type</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                 <option value="">-- Select Type --</option>
                {Object.values(EditOptType).map((cat) => (
                <option key={cat} value={cat}>
                {cat.replaceAll("_", " ")}
                </option>
            ))}
            </Form.Select>
        </Form.Group>
    );
};

export default EditTypeSelect;