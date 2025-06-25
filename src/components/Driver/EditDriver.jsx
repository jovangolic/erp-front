import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Alert, Container } from "react-bootstrap";
import { updateDriver, findOneById } from "../utils/driverApi";

const EditDriver = async () => {
    const[errorMessage,setErrorMessage] = useState("");
    const[isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const[name, setName] = useState("");
    const[phone, setPhone] = useState("");

    useEffect(() => {
        const fetchDriver = async() => {
            try{
                const data = await findOneById(id);
                setName(data.name);
                setPhone(data.phone);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchDriver();
    },[id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await updateDriver({id,name,phone});
            navigate("/driver", {state : {message: "Driver successfully updated!"}});
        }
        catch(error){
            setErrorMessage(error.message || "Greska prilikom azuriranja vozaca")
        }
        finally{
            setIsLoading(false);
        }
    };

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!name && !phone){
        return <div>Loading...</div>
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mx-auto">
                    <h2 className="text-center mb-4">Edit Driver</h2>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3"> 
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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

export default EditDriver;