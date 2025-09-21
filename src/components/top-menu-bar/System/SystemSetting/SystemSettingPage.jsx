import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import SystemSettingDropdownPage from "./SystemSettingDropdownPage";

const SystemSettingPage = () => {
    return(
         <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <SystemSettingDropdownPage />
                </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default SystemSettingPage;