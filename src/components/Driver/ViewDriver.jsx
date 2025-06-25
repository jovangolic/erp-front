import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findOneById } from "../utils/driverApi";
import { Form, Button, Col, Row, Alert, Container, Card } from "react-bootstrap";

const ViewDriver = async() => {

    const {id} = useParams();
    const navigate = useNavigate();
    const[errorMessage, setErrorMessage] = useState("");
    const[driver, setDriver] = useState(null);

    useEffect(() => {
        const fetchDriver = async() => {
            try{
                const data = findOneById(id);
                setDriver(data);
            }
            catch(error){
                setErrorMessage(error.message)
            }
        };
        fetchDriver()
    },[id]);

    if (errorMessage) {
            return (
                <Container className="mt-5">
                    <Alert variant="danger" className="text-center">
                        {errorMessage}
                    </Alert>
                    <div className="text-center">
                        <Button variant="secondary" onClick={() => navigate(-1)}>Nazad</Button>
                    </div>
                </Container>
            );
        }
    
    if (driver == null) {
            return <div className="text-center mt-5">Loading...</div>;
    }

    return(
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Detalji o vozacu</Card.Title>
                            <p><strong>ID:</strong>{driver.id}</p>
                            <p><strong>Name:</strong>{driver.name}</p>
                            <p><strong>Phone:</strong>{driver.phone}</p>
                            <div className="text-center mt-4">
                                <Button variant="secondary" onClick={() => navigate(-1)}>Nazad</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewDriver;