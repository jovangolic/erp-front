import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import { createRoute } from "../utils/routeApi";
import { useNavigate } from "react-router-dom";


const AddRoute = () => {

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [distanceKm, setDistanceKm] = useState(0);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            await createRoute({origin,destination,distanceKm});
            navigate("/route", { state: { message: "Route successfully added!" } });
        }
        catch(error){
            setErrorMsg(error.message);
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mx-auto">
                    <h2 className="text-center mb-4">Add New Route</h2>
                    {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                    <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formOrigin">
                        <Form.Label>Origin</Form.Label>
                        <Form.Control
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDestination">
                        <Form.Label>Destination</Form.Label>
                        <Form.Control
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDistance">
                        <Form.Label>Distance (km)</Form.Label>
                        <Form.Control
                        type="number"
                        step="0.01"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                        required
                        />
                    </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddRoute;