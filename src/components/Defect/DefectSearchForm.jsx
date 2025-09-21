import React, { useState } from "react";
import { Row, Col, Form, Button, ButtonGroup } from "react-bootstrap";
import { searchDefects } from "../utils/defectApi";

const DefectSearchForm = ({ setResults, setErrorMessage }) => {
    const [searchMode, setSearchMode] = useState("single"); // "single" ili "range"
    const [id, setId] = useState("");
    const [idFrom, setIdFrom] = useState("");
    const [idTo, setIdTo] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [confirmed, setConfirmed] = useState("");

    const handleSearch = async () => {
      try {
        const params = {
          id: searchMode === "single" ? id || null : null,
          idFrom: searchMode === "range" ? idFrom || null : null,
          idTo: searchMode === "range" ? idTo || null : null,
          code: code || null,
          name: name || null,
          description: description || null,
          severity: severity !== "ALL" ? severity : null,
          status: status !== "ALL" ? status : null,
          confirmed: confirmed !== "" ? confirmed === "true" : null,
        };

        const data = await searchDefects(params);
        setResults(data);
        setErrorMessage("");
      } catch (error) {
        setResults([]);
        setErrorMessage(error.message);
      }
    };

    return (
      <>
        {/* Preklopnik: Single ID ili Range */}
        <Row className="mb-3">
          <Col>
            <ButtonGroup>
              <Button
                variant={searchMode === "single" ? "primary" : "outline-primary"}
                onClick={() => setSearchMode("single")}
              >
                Search by ID
              </Button>
              <Button
                variant={searchMode === "range" ? "primary" : "outline-primary"}
                onClick={() => setSearchMode("range")}
              >
                Search by Range
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        {/* Ako je single search */}
        {searchMode === "single" && (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                type="number"
                placeholder="Defect ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </Col>
          </Row>
        )}

        {/* Ako je range search */}
        {searchMode === "range" && (
          <Row className="mb-3">
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="ID From"
                value={idFrom}
                onChange={(e) => setIdFrom(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="ID To"
                value={idTo}
                onChange={(e) => setIdTo(e.target.value)}
              />
            </Col>
          </Row>
        )}

        {/* Ostali filteri */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="ALL">All Severities</option>
              <option value="TRIVIAL">Trivial</option>
              <option value="MINOR">Minor</option>
              <option value="MODERATE">Moderate</option>
              <option value="MAJOR">Major</option>
              <option value="CRITICAL">Critical</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={confirmed} onChange={(e) => setConfirmed(e.target.value)}>
              <option value="">All</option>
              <option value="true">Confirmed</option>
              <option value="false">Not Confirmed</option>
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="success" onClick={handleSearch}>
              Search
            </Button>
          </Col>
        </Row>
      </>
    );
};

export default DefectSearchForm;
