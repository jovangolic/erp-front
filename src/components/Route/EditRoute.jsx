import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findOne, updateRoute } from "../utils/routeApi";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";

const EditRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [distanceKm, setDistanceKm] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoute = async() => {
            try{
                const data = await findOne(id);
                setOrigin(data.origin);
                setDestination(data.destination);
                setDistanceKm(data.distanceKm);
            }
            catch(error){
                setErrorMessage(error.mesage)
            }
        };
        fetchRoute();
    },[id]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await updateRoute({ id, origin, destination, distanceKm });
            navigate("/route",{state: {message: "Route successfully updated!"}});
        }
        catch(error){
            setErrorMessage(error.message || "Greška pri ažuriranju rute");
        }
        finally{
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!origin && !destination && !distanceKm) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mx-auto">
                 <h2 className="text-center mb-4">Edit Route</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Origin</Form.Label>
                        <Form.Control
                            type="text"
                            value={origin}
                            onChange={(e => setOrigin(e.target.value))}
                            required
                        />
                    </Form.Group>    
                    <Form.Group className="mb-3">
                        <Form.Label>Destination</Form.Label>
                        <Form.Control 
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        /> 
                    </Form.Group>      
                    <Form.Group className="mb-3">
                        <Form.Label>distance (km)</Form.Label> 
                        <Form.Control
                            type="number"
                            value={distanceKm}
                            onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                            required
                        />
                    </Form.Group> 
                    <Button type="submit" variant="primary" className="w-100">
                            Save changes
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditRoute;