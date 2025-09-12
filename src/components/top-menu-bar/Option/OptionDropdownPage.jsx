import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function OptionDropdownPage(){
    return(
        <NavDropdown title="Option" id="top-nav-option">
            <NavDropdown.Item as={Link} to="/option/label">Label</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/option/value">Value</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/option/category">Category</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/option/active">Active</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
};