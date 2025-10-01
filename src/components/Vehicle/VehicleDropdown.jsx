import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function VehicleDropdown({ handleExit, onSave, onSaveAs, onSaveAll }) {
  return (
    <NavDropdown title="Vehicle" id="top-nav-vehicle">
      <NavDropdown.Item as={Link} to="/vehicles/add">Create</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/edit">Update</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/view">View</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/lists">Lists</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/delete">Delete</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/search">Search</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/service">Vehicles-service</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/track-vehicle">Track-Vehicle</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/vehicles/general-search">General-search</NavDropdown.Item>
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