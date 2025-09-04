import React, { useState } from "react";
import { Modal, Row, Col, Table, Badge, Button, Form } from "react-bootstrap";

const TrackModal = ({ show, onHide, defect }) => {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterConfirmed, setFilterConfirmed] = useState("ALL");

  if (!defect) return null;

  // Filtriranje inspekcija
  const filteredInspections = (defect.inspections || []).filter((ins) => {
    const statusMatch =
      filterStatus === "ALL" || defect.status === filterStatus;
    const confirmedMatch =
      filterConfirmed === "ALL" ||
      (filterConfirmed === "YES" && ins.confirmed) ||
      (filterConfirmed === "NO" && !ins.confirmed);
    return statusMatch && confirmedMatch;
  });

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Track Defect: {defect.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Detalji defekta */}
        <Row className="mb-3">
          <Col><strong>Name:</strong> {defect.name}</Col>
          <Col>
            <strong>Status:</strong>{" "}
            <Badge bg={getStatusColor(defect.status)}>{defect.status}</Badge>
          </Col>
          <Col><strong>Confirmed:</strong> {defect.confirmed ? "Yes" : "No"}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>Description:</strong> {defect.description}</Col>
          <Col><strong>Severity:</strong> {defect.severity}</Col>
        </Row>

        {/* Filteri */}
        <Row className="mb-3">
          <Col xs="auto">
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Form.Select
              value={filterConfirmed}
              onChange={(e) => setFilterConfirmed(e.target.value)}
            >
              <option value="ALL">All Confirmed</option>
              <option value="YES">Confirmed Only</option>
              <option value="NO">Unconfirmed Only</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Tabela inspekcija */}
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Inspection ID</th>
              <th>Quantity Affected</th>
              <th>Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {filteredInspections.map((ins) => (
              <tr key={ins.id}>
                <td>{ins.id}</td>
                <td>{ins.inspection?.id}</td>
                <td>{ins.quantityAffected}</td>
                <td>{ins.confirmed ? "Yes" : "No"}</td>
              </tr>
            ))}
            {filteredInspections.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No inspections match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Helper za boje badge-a
function getStatusColor(status) {
  switch (status) {
    case "NEW":
      return "secondary";
    case "CONFIRMED":
      return "primary";
    case "CLOSED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "dark";
  }
}

export default TrackModal;
