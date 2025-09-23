import React, {  useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { savePermission } from "../../../utils/permissionApi";
import PermissionActionTypes from "./PermissionActionTypes";
import PermissionResourceTypes from "./PermissionResourceTypes";

const PermissionForm = () => {

    const [formData, setFormData] = useState({
            id: "",
            resourceType: "",
            actionType: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (field, val) => {
            setFormData((prev) => ({ ...prev, [field]: val }));
        };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const saved = await savePermission(formData);
            setSuccess(`Odobrenje uspesno sacuvan (ID: ${saved.id})`);
            setFormData({ resourceType: "", actionType: "" }); // reset forme
        } 
        catch (err) {
            setError(err.message || "Greska prilikom cuvanja odobrenja");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <PermissionActionTypes
                value={formData.actionType}
                onChange={(val) => handleChange("actionType", val)}
            />

            <PermissionResourceTypes
                value={formData.resourceType}
                onChange={(val) => handleChange("languageNameType", val)}
            />

            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Save"}
            </Button>
        </Form>
    );
};

export default PermissionForm;