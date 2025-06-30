import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createDriver } from "../utils/driverApi";

const AddDriver = async () => {

    const[name,setName] = useState("");
    const[phone, setPhone] = useState("");
    const[errorMessage,setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await createDriver({name,phone});
            navigate("/driver",{state: {message : "Driver created successfully!"}})
        }
        catch(error){
            setErrorMessage(error.message);
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mx-auto">
                    <h2 className="text-center mb-4">Add New Driver</h2>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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

export default AddDriver;