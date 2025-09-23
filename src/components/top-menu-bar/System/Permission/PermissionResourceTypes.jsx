import React from "react";
import { Form } from "react-bootstrap";
import { PermissionResourceType } from "../../../shared/enums/PermissionResourceType";

const PermissionResourceTypes = ({value, onChange = () => {}}) => {

    return(
        <Form.Group controlId="resourceType">
            <Form.Label>Resource-Type</Form.Label>
                <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Resource-Type --</option>
                    {Object.values(PermissionResourceType).map((cat) => (
                    <option key={cat} value={cat}>
                    {cat.replaceAll("_", " ")}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default PermissionResourceTypes;