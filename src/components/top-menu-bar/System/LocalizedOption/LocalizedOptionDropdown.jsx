import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LocalizedOptionDropdownPage() {
    return (
        <NavDropdown title="Localized Options" id="localized-options-dropdown">
            <NavDropdown.Item as={Link} to="/localized-options">
                Pregled svih
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/localized-options/create">
                Dodaj novi prevod
            </NavDropdown.Item>
            <NavDropdown.Divider />
        </NavDropdown>
    );
}