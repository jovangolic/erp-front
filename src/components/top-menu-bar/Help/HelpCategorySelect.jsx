import React from "react";
import { Form } from "react-bootstrap";
import { HelpCategory } from "../../shared/enums/HelpCategory";


const HelpCategorySelect = ({value, onChange}) => {
    
    return(
        <Form.Group controlId="helpCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Select Category --</option>
                {HelpCategory.map((cat) => (
                <option key={cat} value={cat}>
                    {cat.replaceAll("_", " ")} 
                </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default HelpCategorySelect;