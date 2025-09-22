import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import SystemStatusType from "./SystemStatusType";

const SystemStateForm = ({ initialData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        maintenanceMode: initialData.maintenanceMode ?? false,
        registrationEnabled: initialData.registrationEnabled ?? false,
        systemVersion: initialData.systemVersion || "",
        statusMessage: initialData.statusMessage || "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="maintenanceMode">
                <Form.Check
                type="checkbox"
                label="Maintenance Mode"
                checked={formData.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registrationEnabled">
                <Form.Check
                type="checkbox"
                label="Registration Enabled"
                checked={formData.registrationEnabled}
                onChange={(e) => handleChange("registrationEnabled", e.target.checked)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="systemVersion">
                <Form.Label>System Version</Form.Label>
                <Form.Control
                type="text"
                placeholder="npr. v1.0.3"
                value={formData.systemVersion}
                onChange={(e) => handleChange("systemVersion", e.target.value)}
                />
            </Form.Group>

            <SystemStatusType
                value={formData.statusMessage}
                onChange={(val) => handleChange("statusMessage", val)}
            />

            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
};

export default SystemStateForm;