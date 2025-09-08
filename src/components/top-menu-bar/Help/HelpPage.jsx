import React, { useState } from "react";
import HelpDropdownPage from "./HelpDropdownPage";
import About from "./About";
import Welcome from "./Welcome";
import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import HelpCategorySelect from "./HelpCategorySelect";
import Content from "./Content";

const HelpPage = () => {

    const [selectedCategory, setSelectedCategory] = useState("");
    //Za greske i poruke
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    return(
        <Container fluid>  
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <HelpDropdownPage />
                </Nav>
            </Navbar>
            
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <Welcome />
                    </Form>
                </Col>
            </Row>
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <About />
                    </Form>
                </Col>
            </Row>
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <Content />
                    </Form>
                </Col>
            </Row>
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <HelpCategorySelect
                            value={selectedCategory}
                            onChange={(val) => setSelectedCategory(val)}
                        />
                    </Form>
                </Col>
            </Row>
            <Outlet />
        </Container>
    );
};

export default HelpPage;