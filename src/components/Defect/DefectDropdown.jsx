import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DefectDropdown({ handleExit }) {
  return (
    <NavDropdown title="Defect" id="top-nav-defect">
      <NavDropdown.Item as={Link} to="/defects/add">Create</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/edit">Update</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/delete">Delete</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/search">Search</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/track">Track-Defects</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/reports">Reports</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/general-search">General-search</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleExit}>Exit</NavDropdown.Item>
    </NavDropdown>
  );
}