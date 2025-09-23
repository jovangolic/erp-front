import React from "react";
import { Form } from "react-bootstrap";
import { PermissionActionType } from "../../../shared/enums/PermissionActionType"; 

const PermissionActionTypes = ({value, onChange = () => {}}) => {

    return(
        <Form.Group controlId="actionType">
            <Form.Label>Action-Type</Form.Label>
                <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Action-Type --</option>
                    {Object.values(PermissionActionType).map((cat) => (
                    <option key={cat} value={cat}>
                    {cat.replaceAll("_", " ")}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default PermissionActionTypes;