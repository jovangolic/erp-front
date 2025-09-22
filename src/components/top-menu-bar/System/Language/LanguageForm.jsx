import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import LanguageCodeTypes from "./LanguageCodeTypes";
import LanguageNameTypes from "./LanguageNameTypes";
import { saveLanguage } from "../../../utils/languageApi";

const LanguageForm = () => {
    const [formData, setFormData] = useState({
        languageCodeType: "",
        languageNameType: "",
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
            const saved = await saveLanguage(formData);
            setSuccess(`Jezik uspesno sacuvan (ID: ${saved.id})`);
            setFormData({ languageCodeType: "", languageNameType: "" }); // reset forme
        } 
        catch (err) {
            setError(err.message || "Greska prilikom cuvanja jezika");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <LanguageCodeTypes
                value={formData.languageCodeType}
                onChange={(val) => handleChange("languageCodeType", val)}
            />

            <LanguageNameTypes
                value={formData.languageNameType}
                onChange={(val) => handleChange("languageNameType", val)}
            />

            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Save"}
            </Button>
        </Form>
    );
};

export default LanguageForm;