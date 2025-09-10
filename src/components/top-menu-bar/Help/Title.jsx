import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Spinner, Alert, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { findByTitleContainingIgnoreCase } from "../../utils/helpApi";

const Title =() => {
    const [searchTitle, setSearchTitle] = useState([]);
    const [helps, setHelps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSearch =async() =>{
        try{
            if(!searchTitle.trim()){
                setErrorMessage("Unesite naslov za pretragu.");
                return;
            }
            setLoading(true);
            setErrorMessage("");
            const data = await findByTitleContainingIgnoreCase(searchTitle);
            setHelps(data);
        }
        catch(error){
            setErrorMessage(error.message || "Greska pri pretrazi naslova.");
            setHelps([]);
        }
        finally{
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (errorMessage) return <Alert variant="danger">{errorMessage}</Alert>;

    return(
        <Container fluid className="p-4">
            <Row className="mb-3">
                <Col>
                    <h3>FAQ - Pitanja</h3>
                    <p>Pretraga pomoci po naslovu.</p>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                <Form.Control
                    type="text"
                    placeholder="Unesite naslov..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                </Col>
                <Col md="auto">
                <Button onClick={handleSearch} variant="primary">
                    {loading ? <Spinner size="sm" animation="border" /> : "Pretrazi"}
                </Button>
                </Col>
            </Row>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Row>
                <Col>
                    <ListGroup>
                        {searchTitle.map((item) => (
                        <ListGroup.Item
                            key={item.id}
                            action
                            onClick={() => navigate(`/help/content/${item.id}`)} // ide na Content.jsx
                        >
                            {item.title}
                        </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default Title;