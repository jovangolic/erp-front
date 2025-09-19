import React from "react";
import { Form } from "react-bootstrap";

const EditOptForm = ({ option, onChange }) => {
    return (
        <div className="p-3 border rounded bg-light">
            <h5>{option.name}</h5>
            <p className="text-muted">{option.type}</p>
            {/* Visible toggle */}
            <Form.Check 
                type="switch"
                id={`visible-${option.id}`}
                label="Visible"
                checked={option.visible}
                onChange={(e) => onChange(option.id, "visible", e.target.checked)}
            />
            {/* Editable toggle */}
            <Form.Check 
                type="switch"
                id={`editable-${option.id}`}
                label="Editable"
                checked={option.editable}
                onChange={(e) => onChange(option.id, "editable", e.target.checked)}
            />
        </div>
    );
};

export default EditOptForm;
