import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DriverDropdown({ handleExit, onSave, onSaveAs, onSaveAll }) {
  return (
    <NavDropdown title="Driver" id="top-nav-driver">
      <NavDropdown.Item as={Link} to="/driver/add">Create</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/edit">Update</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/view">View</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/lists">Lists</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/delete">Delete</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/search">Search</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/track-defect">Track-Defects</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/driver/general-search">General-search</NavDropdown.Item>
      <NavDropdown.Divider />
      {/* Ove stavke ne vode na link, nego pozivaju funkciju za save, saveAs i saveAll */}
      <NavDropdown.Item onClick={onSave}>Save</NavDropdown.Item>
      <NavDropdown.Item onClick={onSaveAs}>Save As</NavDropdown.Item>
      <NavDropdown.Item onClick={onSaveAll}>Save All</NavDropdown.Item>
      <NavDropdown.Item onClick={handleExit}>Exit</NavDropdown.Item>
      <NavDropdown.Divider />
    </NavDropdown>
  );
}