import React, { useState, useEffect } from "react";
import {Container,Row,Col,Form,Button,Badge} from "react-bootstrap";

const FileOptForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        extension: "PDF",
        mimeType: "",
        maxSizeInBytes: "",
        uploadEnabled: true,
        previewEnabled: false,
        availableActions: []
    });

    // Ako se radi edit, postavi postojece podatke
    useEffect(() => {
        if (initialData) {
        setFormData(initialData);
        }
    }, [initialData]);

    const fileExtensions = ["PDF", "JPG", "PNG", "DOCX", "XLSX"];
    const fileActions = ["SAVE", "SAVE_AS", "SAVE_ALL", "EXIT"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleActionToggle = (action) => {
        setFormData((prev) => {
        const exists = prev.availableActions.includes(action);
        return {
            ...prev,
            availableActions: exists
            ? prev.availableActions.filter((a) => a !== action)
            : [...prev.availableActions, action]
        };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                <h4>{initialData ? "Edit File Option" : "Add File Option"}</h4>
                <Form onSubmit={handleSubmit}>
                    {/* Extension */}
                    <Form.Group className="mb-3">
                    <Form.Label>File Extension</Form.Label>
                    <Form.Select
                        name="extension"
                        value={formData.extension}
                        onChange={handleChange}
                    >
                        {fileExtensions.map((ext) => (
                        <option key={ext} value={ext}>
                            {ext}
                        </option>
                        ))}
                    </Form.Select>
                    </Form.Group>

                    {/* MIME type */}
                    <Form.Group className="mb-3">
                    <Form.Label>MIME Type</Form.Label>
                    <Form.Control
                        type="text"
                        name="mimeType"
                        value={formData.mimeType}
                        onChange={handleChange}
                        placeholder="npr. application/pdf"
                    />
                    </Form.Group>

                    {/* Max size */}
                    <Form.Group className="mb-3">
                    <Form.Label>Max Size (bytes)</Form.Label>
                    <Form.Control
                        type="number"
                        name="maxSizeInBytes"
                        value={formData.maxSizeInBytes}
                        onChange={handleChange}
                        placeholder="Unesi max veličinu u bajtovima"
                    />
                    </Form.Group>

                    {/* Booleans */}
                    <Form.Group className="mb-3">
                    <Form.Check
                        type="switch"
                        label="Upload Enabled"
                        name="uploadEnabled"
                        checked={formData.uploadEnabled}
                        onChange={handleChange}
                    />
                    <Form.Check
                        type="switch"
                        label="Preview Enabled"
                        name="previewEnabled"
                        checked={formData.previewEnabled}
                        onChange={handleChange}
                    />
                    </Form.Group>

                    {/* Available actions */}
                    <Form.Group className="mb-3">
                    <Form.Label>Available Actions</Form.Label>
                    <div>
                        {fileActions.map((action) => (
                        <Badge
                            key={action}
                            bg={
                            formData.availableActions.includes(action)
                                ? "primary"
                                : "secondary"
                            }
                            className="me-2 mb-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleActionToggle(action)}
                        >
                            {action}
                        </Badge>
                        ))}
                    </div>
                    </Form.Group>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end">
                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="success">
                        Save
                    </Button>
                    </div>
                </Form>
                </Col>
            </Row>
        </Container>
  );
};

export default FileOptForm;
