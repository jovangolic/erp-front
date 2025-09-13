import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import GoToDropdownPage from "./GoToDropdownPage";
import GoToTypeSelect from "./GoToTypeSelect";
import GoToCategorySelect from "./GoToCategorySelect";
import { useState } from "react";
import GoToModal from "./GoToModal";


const GoToPage =() =>{

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [roles, setRoles] = useState([]);
    //Za greske i poruke
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");   


    return(
        <Container fluid>
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <GoToCategorySelect />
                </Nav>
                <Nav>
                    <GoToTypeSelect />
                </Nav>
               <Nav>
                    <GoToModal />
               </Nav>
            </Navbar>
            <Outlet />
        </Container>
    );
};

export default GoToPage;