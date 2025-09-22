import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import SystemStateDropdownPage from "./SystemStateDropdown";

const SystemStatePage =() => {

    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <SystemStateDropdownPage />
                 </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default SystemStatePage;