import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const LanguageIndexPage = () => {
    return (
        <Container className="p-3">
            <h2>Language Management</h2>
            <p>Ovde mozes upravljati jezicima u sistemu.</p>
            <ul>
                <li><Link to="/language/list">Pregled jezika</Link></li>
                <li><Link to="/language/form">Dodaj jezik</Link></li>
            </ul>
        </Container>
    );
};

export default LanguageIndexPage;