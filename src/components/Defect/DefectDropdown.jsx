import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DefectDropdown({ handleExit, onSave, onSaveAs, onSaveAll }) {
  return (
    <NavDropdown title="Defect" id="top-nav-defect">
      <NavDropdown.Item as={Link} to="/defects/add">Create</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/edit">Update</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/view">View</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/delete">Delete</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/search">Search</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/track">Track-Defects</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/reports">Reports</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/defects/general-search">General-search</NavDropdown.Item>
      <NavDropdown.Divider />
      {/* Ove stavke ne vode na link, nego pozivaju funkciju */}
      <NavDropdown.Item onClick={onSave}>Save</NavDropdown.Item>
      <NavDropdown.Item onClick={onSaveAs}>Save As</NavDropdown.Item>
      <NavDropdown.Item onClick={onSaveAll}>Save All</NavDropdown.Item>
      <NavDropdown.Item onClick={handleExit}>Exit</NavDropdown.Item>
      <NavDropdown.Divider />
    </NavDropdown>
  );
}