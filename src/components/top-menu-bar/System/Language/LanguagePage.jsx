import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LanguageDropdownPage from "./LanguageDropdownPage";

const LanguagePage =() => {

    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <LanguageDropdownPage />
                </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default LanguagePage;