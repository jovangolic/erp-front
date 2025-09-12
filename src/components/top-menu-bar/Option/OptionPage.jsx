import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import OptionDropdownPage from "./OptionDropdownPage";
import OptionCategorySelect from "./OptionCategorySelect";
import IsActive from "./isActive";
import Label from "./Label";
import Value from "./Value";

const OptionPage =() => {

    const [selectedCategory, setSelectedCategory] = useState("");
    const [label, setLabel] = useState("");
    const [value, setValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isActive, setIsActive] = useState(true);

    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <OptionDropdownPage />
                </Nav>
            </Navbar>
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <Label 
                            value={label}
                            onChange={(val) => setLabel(val)}
                            error={errorMessage}
                        />
                    </Form>
                </Col>
            </Row>
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <Value 
                            value={value}
                            onChange={(val) => setValue(val)}
                            error={errorMessage}
                        />
                    </Form>
                </Col>
            </Row>

            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <OptionCategorySelect
                            value={selectedCategory}
                            onChange={(val) => setSelectedCategory(val)}
                        />
                    </Form>
                </Col>
            </Row>
            <Row className="p-3">
                <Col md={6} lg={4}>
                    <Form>
                        <IsActive 
                            isActive={isActive}
                            onToggle={(val) => setIsActive(val)}
                        />
                    </Form>
                </Col>
            </Row>
            <Outlet />
        </Container>
    );
};

export default OptionPage;