import React from "react";
import { Form } from "react-bootstrap";
import { SystemSettingCategory } from "../../../shared/enums/SystemSettingCategory";

const SystemSettingCategoryType = ({value, onChange}) => {
    return(
        <Form.Group controlId="systemSettingCategoryType">
            <Form.Label>Category</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Select Category --</option>
                {Object.values(SystemSettingCategory).map((cat) => (
                <option key={cat} value={cat}>
                {cat.replaceAll("_", " ")}
                </option>
            ))}
             </Form.Select>
        </Form.Group>
    );
};

export default SystemSettingCategoryType;