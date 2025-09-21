import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import SettingDataType from "./SettingDataType";
import SystemSettingCategory from "./SystemSettingCategory";


const SystemSettingForm = ({ initialData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        settingKey: initialData.settingKey || "",
        value: initialData.value || "",
        description: initialData.description || "",
        category: initialData.category || "",
        dataType: initialData.dataType || "",
        editable: initialData.editable ?? true,
        isVisible: initialData.isVisible ?? true,
        defaultValue: initialData.defaultValue || ""
    });

    const handleChange = (field, val) => {
        setFormData((prev) => ({ ...prev, [field]: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <SettingKeyField
                value={formData.settingKey}
                onChange={(val) => handleChange("settingKey", val)}
                isEdit={!!initialData.id}
            />

            <Form.Group className="mb-3">
                <Form.Label>Value</Form.Label>
                <Form.Control
                type="text"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                />
            </Form.Group>

            <SystemSettingCategory
                value={formData.category}
                onChange={(val) => handleChange("category", val)}
            />

            <SettingDataType
                value={formData.dataType}
                onChange={(val) => handleChange("dataType", val)}
            />

            <Form.Group className="mb-3" controlId="editable">
                <Form.Check
                type="checkbox"
                label="Editable"
                checked={formData.editable}
                onChange={(e) => handleChange("editable", e.target.checked)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="isVisible">
                <Form.Check
                type="checkbox"
                label="Visible"
                checked={formData.isVisible}
                onChange={(e) => handleChange("isVisible", e.target.checked)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Default Value</Form.Label>
                <Form.Control
                type="text"
                value={formData.defaultValue}
                onChange={(e) => handleChange("defaultValue", e.target.value)}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
};

export default SystemSettingForm;