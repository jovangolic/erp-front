import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { findAll } from "../utils/defectApi";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const DefectList = () => {
    
    const [defect, setDefect] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fectAllDefect =async() => {
            try{
                const response = await findAll();
                setDefect(response);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fectAllDefect();
    },[]);

    return(
        <Container fluid>
            {/*Top menu-bar */}
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <Nav.Link href="#">Defect</Nav.Link>
                    <Nav.Link href="#">Edit</Nav.Link>
                    <Nav.Link href="#">Goto</Nav.Link>
                    <Nav.Link href="#">System</Nav.Link>
                    <Nav.Link href="#">Help</Nav.Link>
                </Nav>
            </Navbar>
            {/*Toolbar (red ispod – Execute, Track, Cancel, Reports, Search bar...) */}
            <Row className="align-items-center bg-light border-bottom p-2">
                <Col>
                    <ButtonGroup>
                    <Button variant="primary">Execute</Button>
                    <Button variant="secondary">Track</Button>
                    <Button variant="warning">Cancel</Button>
                    <Button variant="info">Reports</Button>
                    </ButtonGroup>
                </Col>
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>
            {/*Page title (G-Soft: Create Defect) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: Create Defect</h4>
                </Col>
            </Row>
            {/* Toolbar */}
            <Row className="mb-3 bg-primary text-white p-2">
                <Col>
                    <Button variant="light">Execute</Button>
                    <Button variant="light">Track Defect</Button>
                    <Button variant="light">Cancel</Button>
                    <Button variant="light">Reports</Button>
                    <Button variant="light">Trailer Management</Button>
                    <Button variant="light">Trail Defect</Button>
                </Col>
            </Row>
            {/* Tabs*/}
            <Row>

            </Row>
            {/*Footer */}
            <Row>
                <Col className="text-center">© ERP G-soft System 2025</Col>
            </Row>
        </Container>
    );
};

export default DefectList;