import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import GoToModal from "./GoToModal";
import { useState } from "react";

export default function GoToDropdownPage(){

    const [showModal, setShowModal] = useState(false);

    return(
        <>
        <NavDropdown title="Go To" id="top-nav-goto">
            <NavDropdown.Item as={Link} to="/accounting">Racunovodstvo</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/storage">Skladiste</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/logistics">Logistika</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/materials">Materijali</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/production">Planiranje proizvodnje</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/quality">Kontrola kvaliteta</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => setShowModal(true)}>
                Otvori GoTo
            </NavDropdown.Item>
        </NavDropdown>

        <GoToModal show={showModal} handleClose={() => setShowModal(false)} />
        </>
    );
};