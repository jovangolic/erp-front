import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SecuritySettingDropdownPage() {
    return (
        <NavDropdown title="SecuritySetting" id="top-nav-security-setting">
            <NavDropdown.Item as={Link} to="/security-setting/list">Settings List</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/security-setting/form">Settings Form</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}