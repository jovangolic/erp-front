import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import OptionDropdownPage from "./OptionDropdownPage";
import OptionCategorySelect from "./OptionCategorySelect";
import IsActive from "./isActive";

const Option =() => {

    const [selectedCategory, setSelectedCategory] = useState("");

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
                        <IsActive />
                    </Form>
                </Col>
            </Row>
            <Outlet />
        </Container>
    );
};

export default Option;