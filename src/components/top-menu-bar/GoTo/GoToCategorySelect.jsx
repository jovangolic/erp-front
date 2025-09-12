import React from "react";
import { Form } from "react-bootstrap";
import { GoToCategory} from "../../shared/enums/GoToCategory";

const GoToCategorySelect = ({value, onChange}) => {

    return(
            <Form.Group controlId="goToCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Category --</option>
                    {Object.values(GoToCategory).map((cat) => (
                    <option key={cat} value={cat}>
                    {cat.replaceAll("_", " ")}
                    </option>
                ))}
                </Form.Select>
            </Form.Group>
    );
};

export default GoToCategorySelect;
