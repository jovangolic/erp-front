import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function EditOptDropdownPage(){
    return(
        <NavDropdown title="EditOpt" id="top-nav-editOpt">
            <NavDropdown.Item as={Link} to="/edit/name">Edit-Name</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/edit/value">Edit-Value</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/edit/opt-type">Edit-Type</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/edit/opt-list">Edit-List</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/edit/opt-form">Edit-Form</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/edit/opt-list-page">Edit-list-page</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}