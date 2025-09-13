import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AdminDropdownPage(){
    return(
        <NavDropdown title="Admin-page" id="top-nav-admin-page">
            <NavDropdown.Item as={Link} to="/go-to-label">Label</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/is-active">IsActive</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/roles">Roles</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
};