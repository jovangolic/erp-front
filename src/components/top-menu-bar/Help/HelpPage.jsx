import React, { useState } from "react";
import HelpDropdownPage from "./HelpDropdownPage";
import About from "./About";
import Welcome from "./Welcome";
import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import HelpCategorySelect from "./HelpCategorySelect";
import Content from "./Content";
import Title from "./Title";
import IsVisible from "./IsVisible";

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
            
            <Outlet />
        </Container>
    );
};

export default HelpPage;