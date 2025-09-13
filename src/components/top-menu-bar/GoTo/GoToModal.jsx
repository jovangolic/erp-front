import React, { useEffect, useState } from "react";
import { Modal, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import { findByActiveTrue } from "../../utils/goToApi";
import { useNavigate } from "react-router-dom";

const GoToModal =({ show, handleClose }) => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!show) return; // ucitavanje samo kad se modal otvori
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await findByActiveTrue(); // API poziv
                if (isMounted) {
                setItems(data);
                }
            } 
            catch (err) {
                if (isMounted) {
                setError("Greska pri ucitavanju aktivnih opcija.");
                }
            } 
            finally {
                if (isMounted) {
                setLoading(false);
                }
            }
        };
        fetchData();
        return () => {
        isMounted = false;
        };
    }, [show]);
    
    const handleGoTo = (item) => {
        if (item.type === "NAVIGATION") {
            navigate(item.path); // frontend ruta
        } 
        else if (item.type === "ACTION") {
            window.location.href = item.path; // API endpoint ili eksterni link
        }
        handleClose(); // zatvori modal posle akcije
    };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Go To</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <ListGroup>
            {items.map((item) => (
              <ListGroup.Item
                key={item.id}
                action
                onClick={() => handleGoTo(item)}
              >
                <strong>{item.label}</strong>
                <br />
                <small className="text-muted">{item.description}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Zatvori
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GoToModal;