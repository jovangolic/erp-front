import React from "react";
import { Form } from "react-bootstrap";
import { SettingDataType } from "../../../shared/enums/SettingDataType";

const SystemSettingDataType = ({value, onChange = () => {}}) => {
    return(
        <Form.Group controlId="settingDataType">
            <Form.Label>Data-Type</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Select Data-Type --</option>
                {Object.values(SettingDataType).map((cat) => (
                <option key={cat} value={cat}>
                {cat.replaceAll("_", " ")}
                </option>
            ))}
            </Form.Select>
        </Form.Group>
    );
};

export default SystemSettingDataType;