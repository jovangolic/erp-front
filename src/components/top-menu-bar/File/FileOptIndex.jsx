import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const FileOptIndex = () => {
    return (
        <Container className="p-4">
            <Card className="shadow-sm">
                <Card.Body>
                <Card.Title>Upravljanje File Opcijama</Card.Title>
                <Card.Text>
                    Ovde mozete pregledati, dodavati ili menjati podešavanja fajlova i njihove akcije.  
                    Koristite meni iznad da odaberete zeljenu opciju:
                </Card.Text>

                <Row className="mt-3">
                    <Col xs={12} md={4} className="mb-2">
                        <Button as={Link} to="opt-list" variant="primary" className="w-100">
                            Lista fajl opcija
                        </Button>
                    </Col>
                    <Col xs={12} md={4} className="mb-2">
                        <Button as={Link} to="opt-form" variant="success" className="w-100">
                            Dodaj novu opciju
                        </Button>
                    </Col>
                    <Col xs={12} md={4} className="mb-2">
                        <Button as={Link} to="action-selector" variant="info" className="w-100">
                            Selector akcija fajla
                        </Button>
                    </Col>
                </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FileOptIndex;
