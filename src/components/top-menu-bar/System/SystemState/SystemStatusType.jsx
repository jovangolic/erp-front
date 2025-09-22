import React from "react";
import { Form } from "react-bootstrap";
import { SystemStatus } from "../../../shared/enums/SystemStatus";

const SystemStatusType = ({value, onChange}) => {
    return(
        <Form.Group controlId="systemStatus">
            <Form.Label>System-Status</Form.Label>
            <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Select System-Status --</option>
                {Object.values(SystemStatus).map((cat) => (
                <option key={cat} value={cat}>
                {cat.replaceAll("_", " ")}
                </option>
            ))}
            </Form.Select>
        </Form.Group>
    );
};

export default SystemStatusType;