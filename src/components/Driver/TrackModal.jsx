import React, { useState } from "react";
import { Modal, Row, Col, Table, Badge, Button, Form } from "react-bootstrap";

const TrackModal =({show, onHide, driver}) => {
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterConfirmed, setFilterConfirmed] = useState("ALL");

    if(!driver) return null;

    // Filtriranje putovanja
    const filteredTrips = (driver.trips || []).filter((t) => {
        const statusMatch =
        filterStatus === "ALL" || driver.status === filterStatus;
        const confirmedMatch =
        filterConfirmed === "ALL" ||
        (filterConfirmed === "YES" && t.confirmed) ||
        (filterConfirmed === "NO" && !t.confirmed);
        return statusMatch && confirmedMatch;
    });

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Track Driver: {driver.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Detalji driver-a */}
            <Row className="mb-3">
              <Col><strong>First-name:</strong> {driver.firstName}</Col>
              <Col><strong>Last-name:</strong> {driver.lastName}</Col>
              <Col><strong>Phone:</strong> {driver.phone}</Col>
              <Col>
                <strong>Status:</strong>{" "}
                <Badge bg={getStatusColor(driver.status)}>{driver.status}</Badge>
              </Col>
              <Col><strong>Confirmed:</strong> {driver.confirmed ? "Yes" : "No"}</Col>
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
    
            {/* Tabela putovanja */}
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Start location</th>
                  <th>End location</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th>Trip status</th>
                  <th>Type status</th>
                  <th>Driver ID</th>
                  <th>Confirmed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((t) => (
                  <tr key={ins.id}>
                    <td>{t.id}</td>
                    <td>{t.trip?.id}</td>
                    <td>{t.startLocation}</td>
                    <td>{t.endLocation}</td>
                    <td>{t.startTime}</td>
                    <td>{t.endTime}</td>
                    <td>{t.status}</td>
                    <td>{t.typeStatus}</td>
                    <td>{t.driver.id}</td>
                    <td>{t.confirmed ? "Yes" : "No"}</td>
                  </tr>
                ))}
                {filteredTrips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No trips match the selected filters.
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

