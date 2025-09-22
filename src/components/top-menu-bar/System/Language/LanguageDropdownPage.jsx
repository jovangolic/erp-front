import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LanguageDropdownPage(){
    return(
        <NavDropdown title="Language" id="top-nav-language">
            <NavDropdown.Item as={Link} to="/language/code">Language-Code</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/language/name">Language-Name</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/language/form">Language-Form</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}