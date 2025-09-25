import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SystemStateDropdownPage(){
    return(
        <NavDropdown title="SystemStatus" id="top-nav-system-status">
            <NavDropdown.Item as={Link} to="/system-state/status">System-Status</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/system-state/form">System-Form</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}