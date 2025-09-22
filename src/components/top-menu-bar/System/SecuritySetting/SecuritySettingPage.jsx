import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import SecuritySettingDropdownPage from "./SecuritySettingDropdown";

const SecuritySettingPage = () => {
    return(
            <Container fluid>
                <Navbar bg="light" variant="light" className="border-bottom">
                    <Nav>
                        <SecuritySettingDropdownPage />
                    </Nav>
                </Navbar>
                <Outlet />
            </Container>
        );
};

export default SecuritySettingPage;