import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GoToDropdownPage(){
    return(
        <NavDropdown title="Help" id="top-nav-help">
            <NavDropdown.Item as={Link} to="/goto/label">Label</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/goto/description">Description</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/goto/category">Category</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/goto/type">Type</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/goto/path">Path</NavDropdown.Item>
            <NavDropdown.Item as={Link} tp="/goto/icon">Icon</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/goto/active">Active</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/goto/roles">Roles</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
};