import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function HelpDropdownPage(){
    return(
        <NavDropdown title="Defect" id="top-nav-defect">
            <NavDropdown.Item as={Link} to="/help/welcome">Welcome</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/help/about">About</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/help/content">Content</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/help/category">Category</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/help/title">Title</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/help/isVisible">IsVisible</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
};


