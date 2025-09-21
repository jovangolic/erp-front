import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SystemSettingDropdownPage(){
    return(
        <NavDropdown title="SystemSetting" id="top-nav-system-setting">
            <NavDropdown.Item as={Link} to="/system-setting/sys-category">Category</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/system-setting/sys-data-type">Data-Type</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/system-setting/sys-key">Setting-Key</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/system-setting/sys-form">Setting-Form</NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}