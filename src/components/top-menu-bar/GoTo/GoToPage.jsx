import { Container, Navbar, Nav, Row, Col, Form } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import Label from "./Label";
import IsActive from "./IsActive";
import GoToDropdownPage from "./GoToDropdownPage";
import GoToTypeSelect from "./GoToTypeSelect";
import GoToCategorySelect from "./GoToCategorySelect";
import { useState } from "react";


const GoToPage =() =>{

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    //Za greske i poruke
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");   
};

export default GoToPage;