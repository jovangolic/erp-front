import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function FileOptDropdownPage(){
    return(
        <NavDropdown title="FileOpt" id="top-nav-fileOpt">
            <NavDropdown.Item as={Link} to="/file/opt-index">FileOpt-Index</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/file/action-selector">File-Action-Selector</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/file/opt-list">File-List</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/file/opt-form">File-Form</NavDropdown.Item>
            { /**<NavDropdown.Item as={Link} to="/file/opt-advanced-actions">File-Advanced-Actions</NavDropdown.Item> */}
           <NavDropdown.Item as={Link} to="/fileOpt/opt-advanced-actions/1">
                 File-Advanced-Actions
            </NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}