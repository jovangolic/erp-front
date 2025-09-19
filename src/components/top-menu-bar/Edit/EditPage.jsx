import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import EditOptDropdownPage from "./EditOptDropdownPage";

const EditPage = () => {

    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <EditOptDropdownPage />
                </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default EditPage;