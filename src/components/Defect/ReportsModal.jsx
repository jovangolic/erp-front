import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { searchDefects } from "../utils/defectApi";

const ReportsModal = ({ show, onHide, description }) => {
    // Stanja za filtere
    const [severity, setSeverity] = useState("TRIVIAL_SEVERITY");
    const [descPart, setDescPart] = useState(description || "");
    const [defectStatus, setDefectStatus] = useState("ALL"); 
    const [confirmed, setConfirmed] = useState(false);
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAdvanced, setIsAdvanced] = useState(false); // toggle simple vs advanced

    // Jedinstvena funkcija za pretragu
    const handleSearch = async () => {
        try {
            const data = await searchDefects({
                severity,
                descPart,
                status: isAdvanced ? defectStatus : null, // simple pretraga ignorise status
                confirmed: isAdvanced ? confirmed : null   // simple pretraga ignorise confirmed
            });
            setResults(data);
            setErrorMessage("");
        } catch (error) {
            setResults([]);
            setErrorMessage(error.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Defect Reports</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Simple filter */}
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Severity</Form.Label>
                            <Form.Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                                <option value="TRIVIAL_SEVERITY">Trivial</option>
                                <option value="MINOR_SEVERITY">Minor</option>
                                <option value="MODERATE_SEVERITY">Moderate</option>
                                <option value="MAJOR_SEVERITY">Major</option>
                                <option value="CRITICAL_SEVERITY">Critical</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={descPart} 
                                onChange={(e) => setDescPart(e.target.value)} 
                                placeholder="Search description..." 
                            />
                        </Col>
                    </Row>

                    {/* Advanced toggle */}
                    <Form.Check 
                        type="checkbox" 
                        label="Advanced filters" 
                        checked={isAdvanced} 
                        onChange={() => setIsAdvanced(!isAdvanced)} 
                        className="mb-2"
                    />

                    {isAdvanced && (
                        <Row className="mb-2">
                            <Col>
                                <Form.Label>Status</Form.Label>
                                <Form.Select value={defectStatus} onChange={(e) => setDefectStatus(e.target.value)}>
                                    <option value="ALL">ALL</option>
                                    <option value="NEW">NEW</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="CLOSED">CLOSED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Check 
                                    type="checkbox" 
                                    label="Confirmed" 
                                    checked={confirmed} 
                                    onChange={(e) => setConfirmed(e.target.checked)} 
                                />
                            </Col>
                        </Row>
                    )}

                    <Button variant="primary" onClick={handleSearch}>Search</Button>
                </Form>

                {/* Prikaz rezultata */}
                {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                {results.length > 0 && (
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Confirmed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>{d.code}</td>
                                    <td>{d.name}</td>
                                    <td>{d.description}</td>
                                    <td>{d.severity}</td>
                                    <td>{d.status}</td>
                                    <td>{d.confirmed ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportsModal;
