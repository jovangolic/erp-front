import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SystemSettingIndexPage = () => {
    const pages = [
        { path: "sys-category", title: "Kategorije", text: "Pregled i izbor kategorija sistemskih podesavanja." },
        { path: "sys-data-type", title: "Data Tipovi", text: "Podesavanje tipova podataka za sistemska podesavanja." },
        { path: "sys-key", title: "Ključevi", text: "Unos i pregled jedinstvenih kljuceva sistema." },
        { path: "sys-form", title: "Forma", text: "Dodavanje i izmena celih sistemskih podesavanja." },
    ];

    return (
        <Container className="py-4">
            <h3 className="mb-4">System Setting Panel</h3>
            <Row>
                {pages.map((page, idx) => (
                <Col key={idx} md={6} lg={3} className="mb-3">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>{page.title}</Card.Title>
                            <Card.Text>{page.text}</Card.Text>
                            <Button as={Link} to={`/system-setting/${page.path}`} variant="primary">
                                Otvori
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SystemSettingIndexPage;
