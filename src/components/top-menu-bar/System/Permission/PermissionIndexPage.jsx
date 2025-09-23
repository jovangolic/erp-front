import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import PermissionForm from "./PermissionForm";
import PermissionList from "./PermissionList";

const PermissionIndexPage =() => {
    return (
        <Container className="p-4">
            <Row>
                {/* Forma za dodavanje */}
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <h4>Dodaj odobrenje</h4>
                            <PermissionForm />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lista odobrenja */}
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <h4>Pregled odobrenja</h4>
                            <PermissionList />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PermissionIndexPage;