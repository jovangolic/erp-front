import React from "react";
import { Form } from "react-bootstrap";
import { LanguageNameType } from "../../../shared/enums/LanguageNameType";

const LanguageNameTypes =({value, onChange = () => {}}) => {
    return(
        <Form.Group controlId="languageName">
            <Form.Label>Language-Name</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value=""> -- Select Language-Name --</option>
            {Object.values(LanguageNameType).map((cat) => (
                <option key={cat} value={cat}>
                    {cat.replaceAll("_"," ")}
                </option>
            ))}
            </Form.Select>
        </Form.Group>
    );
};

export default LanguageNameTypes;