import React from "react";
import { Modal, Row, Col, Table, Badge, Button } from "react-bootstrap";

const TrackModal = ({ show, onHide, defect }) => {
    if (!defect) return null;

    return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Track Defect: {defect.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Detalji defekta */}
        <Row className="mb-3">
          <Col><strong>Name:</strong> {defect.name}</Col>
          <Col><strong>Status:</strong> <Badge bg={getStatusColor(defect.status)}>{defect.status}</Badge></Col>
          <Col><strong>Confirmed:</strong> {defect.confirmed ? "Yes" : "No"}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>Description:</strong> {defect.description}</Col>
          <Col><strong>Severity:</strong> {defect.severity}</Col>
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
            {defect.inspections?.map((ins) => (
              <tr key={ins.id}>
                <td>{ins.id}</td>
                <td>{ins.inspection?.id}</td>
                <td>{ins.quantityAffected}</td>
                <td>{ins.confirmed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

// Helper funkcija za boju status badge-a
function getStatusColor(status) {
    switch (status) {
    case "NEW": return "secondary";
    case "CONFIRMED": return "primary";
    case "CLOSED": return "success";
    case "CANCELLED": return "danger";
    default: return "dark";
  }
}

export default TrackModal;