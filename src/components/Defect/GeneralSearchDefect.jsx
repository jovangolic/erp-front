import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { generalSearch } from "../utils/defectApi";

const GeneralSearchDefect = () => {
  const [id, setId] = useState("");
  const [idFrom, setIdFrom] = useState("");
  const [idTo, setIdTo] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [confirmed, setConfirmed] = useState("");
  
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    try {
      const response = await generalSearch({
        id,
        code,
        name,
        description,
        severity,
        status,
        confirmed: confirmed === "" ? null : confirmed === "true"
      });
      setResults(response);
      setCurrentIndex(0);
      setErrorMessage("");
    } catch (error) {
      setResults([]);
      setErrorMessage(error.message);
    }
  };

  const currentDefect = results[currentIndex] || null;

  return (
    <Container fluid className="p-3">
      {/* Toolbar za filtere */}
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
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Col>
        <Col xs={2}>
          <Form.Control
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        <Col xs={2}>
          <Form.Control
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3 bg-light border p-3 rounded">
        <Col xs={3}>
          <Form.Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">All Severities</option>
            <option value="TRIVIAL">Trivial</option>
            <option value="MINOR">Minor</option>
            <option value="MAJOR">Major</option>
            <option value="CRITICAL">Critical</option>
          </Form.Select>
        </Col>
        <Col xs={3}>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
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

      {/* Detaljan prikaz defekta */}
      {currentDefect && (
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <Row>
              <Col><strong>ID:</strong> {currentDefect.id}</Col>
              <Col><strong>Code:</strong> {currentDefect.code}</Col>
              <Col><strong>Name:</strong> {currentDefect.name}</Col>
            </Row>
            <Row className="mt-2">
              <Col><strong>Description:</strong> {currentDefect.description}</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Badge bg="info">{currentDefect.severity}</Badge>
              </Col>
              <Col>
                <Badge bg={
                  currentDefect.status === "CANCELLED" ? "danger" :
                  currentDefect.status === "CLOSED" ? "secondary" :
                  currentDefect.status === "CONFIRMED" ? "success" : "warning"
                }>
                  {currentDefect.status}
                </Badge>
              </Col>
              <Col>
                {currentDefect.confirmed ? (
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

      {/* Error message */}
      {errorMessage && (
        <Row className="mt-3">
          <Col className="text-danger">{errorMessage}</Col>
        </Row>
      )}
    </Container>
  );
};

export default GeneralSearchDefect;
