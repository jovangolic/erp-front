import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { saveLocalizedOption } from "../../../utils/localizedOptionApi";
import { getAllLanguages } from "../../../utils/languageApi";
import { getAllOptions } from "../../../utils/optionApi";

const LocalizedOptionForm = () => {
    const [formData, setFormData] = useState({
        optionId: "",
        languageId: "",
        localizedLabel: "",
    });

    const [options, setOptions] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadData() {
        try {
            const [opts, langs] = await Promise.all([getAllOptions(), getAllLanguages()]);
            setOptions(opts || []);
            setLanguages(langs || []);
        } catch (err) {
            setError("Greska prilikom ucitavanja podataka");
        }
        }
        loadData();
    }, []);

    const handleChange = (field, val) => {
        setFormData((prev) => ({ ...prev, [field]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const saved = await saveLocalizedOption(formData);
            setSuccess(`Localized opcija uspešno sačuvana (ID: ${saved.id})`);
            setFormData({ optionId: "", languageId: "", localizedLabel: "" });
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

        {/* Option dropdown */}
        <Form.Group controlId="optionId" className="mb-3">
            <Form.Label>Option</Form.Label>
            <Form.Select
            value={formData.optionId}
            onChange={(e) => handleChange("optionId", e.target.value)}
            >
            <option value="">-- Select Option --</option>
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                {opt.label} ({opt.category})
                </option>
            ))}
            </Form.Select>
        </Form.Group>

        {/* Language dropdown */}
        <Form.Group controlId="languageId" className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Select
            value={formData.languageId}
            onChange={(e) => handleChange("languageId", e.target.value)}
            >
            <option value="">-- Select Language --</option>
            {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                {lang.languageNameType}
                </option>
            ))}
            </Form.Select>
        </Form.Group>

        {/* Localized label */}
        <Form.Group controlId="localizedLabel" className="mb-3">
            <Form.Label>Localized Label</Form.Label>
            <Form.Control
            type="text"
            placeholder="Unesi prevod..."
            value={formData.localizedLabel}
            onChange={(e) => handleChange("localizedLabel", e.target.value)}
            />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Save"}
        </Button>
        </Form>
    );
};

export default LocalizedOptionForm;
