import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GoToDropdownPage(){
    return(
        <NavDropdown title="Go To" id="top-nav-goto">
            <NavDropdown.Item as={Link} to="/accounting">Racunovodstvo</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/storage">Skladiste</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/logistics">Logistika</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/materials">Materijali</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/production">Planiranje proizvodnje</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/quality">Kontrola kvaliteta</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
};