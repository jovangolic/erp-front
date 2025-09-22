import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { saveSecuritySettings } from "../../../utils/SecuritySettingApi";

const SecuritySettingForm = ({ initialData = {}, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        settingName: initialData.settingName || "",
        value: initialData.value || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (field, val) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const saved = await saveSecuritySettings(formData);
            setSuccess(`Podesavanje sacuvano (ID: ${saved.id})`);
            if (onSubmitSuccess) onSubmitSuccess(saved);
        } 
        catch (err) {
            setError(err.message || "Greska prilikom cuvanja");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3" controlId="settingName">
            <Form.Label>Setting Name</Form.Label>
            <Form.Control
            type="text"
            value={formData.settingName}
            onChange={(e) => handleChange("settingName", e.target.value)}
            />
        </Form.Group>

        <Form.Group className="mb-3" controlId="value">
            <Form.Label>Value</Form.Label>
            <Form.Control
            type="text"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Save"}
        </Button>
        </Form>
    );
};

export default SecuritySettingForm;