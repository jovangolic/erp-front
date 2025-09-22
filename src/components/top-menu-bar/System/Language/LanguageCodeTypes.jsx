import React from "react";
import { Form } from "react-bootstrap";
import { LanguageCodeType } from "../../../shared/enums/LanguageCodeType";

const LanguageCodeTypes =({value, onChange}) => {

    return(
        <Form.Group controlId="languageCode">
            <Form.Label>Language-Codes</Form.Label>
                <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Langugage-Type --</option>
                    {Object.values(LanguageCodeType).map((cat) => (
                    <option key={cat} value={cat}>
                    {cat.replaceAll("_", " ")}
                    </option>
                ))}
                </Form.Select>
         </Form.Group>
    );
};

export default LanguageCodeTypes;