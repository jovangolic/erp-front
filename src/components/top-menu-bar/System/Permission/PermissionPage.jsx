import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import PermissionDropdownPage from "./PermissionDropdown";

const Permission = () => {

    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <PermissionDropdownPage />
                </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default Permission;