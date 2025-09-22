import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LocalizedOptionDropdownPage from "./LocalizedOptionDropdown";

const LocalizedOptionPage = () => {
    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <LocalizedOptionDropdownPage />
                </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default LocalizedOptionPage;