import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findOne } from "../utils/routeApi";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";

const ViewRoute = () => {
    const{ id } = useParams();
    const[route,setRoute] = useState(null);
    const[errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoute = async() => {
            try{
                const data = await findOne(id);
                setRoute(data);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        }
        fetchRoute();
    },[id]);

    const formatKm = (value) => `${parseFloat(value).toFixed(2)} km`;

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

    if (route == null) {
        return <div className="text-center mt-5">Učitavanje...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Detalji rute</Card.Title>
                            <p><strong>ID:</strong> {route.id}</p>
                            <p><strong>Početna lokacija:</strong> {route.origin}</p>
                            <p><strong>Krajnja lokacija:</strong> {route.destination}</p>
                            <p><strong>Udaljenost:</strong> {formatKm(route.distanceKm)}</p>

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

export default ViewRoute;