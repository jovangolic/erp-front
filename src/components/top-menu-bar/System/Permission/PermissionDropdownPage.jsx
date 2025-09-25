import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PermissionDropdownPage() {
    return (
        <NavDropdown title="Permission" id="permission-dropdown">
            <NavDropdown.Item as={Link} to="/permission/resource-type">
                Resource-Type
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/permission/action-type">
                Action-Type
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/permission/form">
                Permission-Form
            </NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}