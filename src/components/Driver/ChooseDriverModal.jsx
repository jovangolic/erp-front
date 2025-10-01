import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ChooseDriverModal({ show, onClose, onConfirm }) {
    const [driverId, setDriverId] = useState("");

    const handleConfirm = () => {
        if (driverId.trim()) {
            onConfirm(driverId);   
            setDriverId("");       
            onClose();             
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Choose Driver by ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group controlId="formDriverId">
                <Form.Label>Driver ID</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
        </Modal.Footer>
        </Modal>
    );
}
