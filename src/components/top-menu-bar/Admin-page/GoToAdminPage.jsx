import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import GoToLabel from "./GoToLabel";
import IsActivePage from "./IsActivePage";
import RoleSelect from "./RoleSelect";
import GoToCategorySelect from "../GoTo/GoToCategorySelect";
import { GoToType } from "../../shared/enums/GoToType";
import { createGoTo } from "../../utils/goToApi";

const GoToAdminPage =() =>{
    const [label, setLabel] = useState("");
    const [path, setPath] = useState("");
    const [icon, setIcon] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("NAVIGATION");
    const [isActive, setIsActive] = useState(true);
    const [roles, setRoles] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = {
                label,
                description: `Shortcut for ${label}`,
                category,
                type,
                path,
                icon,
                active: isActive,
                roles: roles.join(","),
            };
            await createGoTo(request);
            setSuccessMessage("GoTo opcija uspešno kreirana!");
            setErrorMessage("");
        } 
        catch (err) {
            setErrorMessage("Greska prilikom kreiranja GoTo opcije.");
            setSuccessMessage("");
        }
    };

    return(
        <Container fluid className="p-3">
            <h3>GoTo Admin konfiguracija</h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                <Col md={6}>
                    <GoToLabel value={label} onChange={setLabel} error={errorMessage} />
                </Col>
                <Col md={6}>
                    <Form.Group controlId="gotoPath" className="mb-3">
                    <Form.Label>Path</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="/users, /sales, /reports..."
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                    />
                    </Form.Group>
                </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <Form.Group controlId="gotoIcon" className="mb-3">
                    <Form.Label>Ikonica</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="npr. file-invoice, box, truck..."
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                    />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <GoToCategorySelect value={category} onChange={setCategory} />
                </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <Form.Group controlId="gotoType" className="mb-3">
                    <Form.Label>Tip</Form.Label>
                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                        {Object.values(GoToType).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                        ))}
                    </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <IsActivePage isActive={isActive} onToggle={setIsActive} />
                </Col>
                </Row>
                <Row>
                <Col>
                    <RoleSelect selectedRoles={roles} onChange={setRoles} />
                </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-3">
                    Sasuvaj GoTo opciju
                </Button>
                {successMessage && <p className="text-success mt-2">{successMessage}</p>}
                {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            </Form>
        </Container>
    );
};

export default GoToAdminPage;