import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { generalSearch } from "../utils/driverApi";

const GeneralSearchDriver = () => {

    const [id, setId] = useState("");
    const [idFrom, setIdFrom] = useState("");
    const [idTo, setIdTo] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("");
    const [confirmed, setConfirmed] = useState("");
    
    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = async() => {
        try{
            const response = await generalSearch({
                id,
                idFrom,
                idTo,
                firstName,
                lastName,
                phone,
                status,
                confirmed: confirmed === "" ? null : confirmed === "true"
            });
            setResults(response);
            setCurrentIndex(0);
            setErrorMessage("");
        }
        catch(error){
            setResults([]);
            setErrorMessage(error.message);
        }
    };

    const currentDriver = results[currentIndex] || null;

    return(
        <Container fluid className="p-3">
            {/* Toolbar za osnovne filtere */}
            <Row className="mb-3 bg-light border p-3 rounded">
                <Col xs={2}>
                    <Form.Control
                        type="number"
                        placeholder="ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="number"
                        placeholder="ID From"
                        value={idFrom}
                        onChange={(e) => setIdFrom(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="number"
                        placeholder="ID To"
                        value={idTo}
                        onChange={(e) => setIdTo(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="text"
                        placeholder="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="text"
                        placeholder="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="text"
                        placeholder="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </Col>
            </Row>
            
            {/* Filteri za status, confirmed */}
            <Row className="mb-3 bg-light border p-3 rounded">
                <Col xs={3}>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="ALL">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="NEW">New</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CLOSED">Closed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </Form.Select>
                </Col>
                <Col xs={3}>
                    <Form.Select value={confirmed} onChange={(e) => setConfirmed(e.target.value)}>
                        <option value="">All Confirmed</option>
                        <option value="true">Confirmed</option>
                        <option value="false">Not Confirmed</option>
                    </Form.Select>
                </Col>
                <Col xs={3}>
                    <Button variant="primary" onClick={handleSearch} className="w-100">
                          Search
                    </Button>
                </Col>
            </Row>
             
            {/* Detaljan prikaz vozaca */}
            {currentDriver && (
                <Card className="mb-3 shadow-sm">
                    <Card.Body>
                          <Row>
                            <Col><strong>ID:</strong> {currentDriver.id}</Col>
                            <Col><strong>First-name:</strong> {currentDriver.code}</Col>
                            <Col><strong>Last-name:</strong> {currentDriver.name}</Col>
                            <Col><strong>Phone:</strong> {currentDriver.phone}</Col>
                          </Row>
                        <Row className="mt-2">
                            <Col>
                              <Badge bg="info">{currentDriver.status}</Badge>
                            </Col>
                            <Col>
                              <Badge bg={
                                currentDriver.status === "CANCELLED" ? "danger" :
                                currentDriver.status === "CLOSED" ? "secondary" :
                                currentDriver.status === "CONFIRMED" ? "success" : "warning"
                              }>
                                {currentDriver.status}
                              </Badge>
                            </Col>
                            <Col>
                              {currentDriver.confirmed ? (
                                <Badge bg="success">Confirmed</Badge>
                              ) : (
                                <Badge bg="warning">Not Confirmed</Badge>
                              )}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
            
            {/* Navigacija */}
            {results.length > 1 && (
                <Row className="mt-2">
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex(currentIndex - 1)}
                        >
                            Previous
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            disabled={currentIndex === results.length - 1}
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                        >
                            Next
                        </Button>
                    </Col>
                    <Col className="align-self-center">
                        <span>
                            {currentIndex + 1} of {results.length}
                        </span>
                    </Col>
                </Row>
            )}
            {/* Footer */}
            
            {/* Error message */}
            {errorMessage && (
                <Row className="mt-3">
                    <Col className="text-danger">{errorMessage}</Col>
                </Row>
            )}
        </Container>
    );
};

export default GeneralSearchDriver;