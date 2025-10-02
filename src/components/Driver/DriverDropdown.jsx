import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DriverDropdown({ onOpenChooseDriver, handleExit, onSave, onSaveAs, onSaveAll }) {
    return (
      <NavDropdown title="Driver" id="top-nav-driver">
        <NavDropdown.Item as={Link} to="/drivers/add">Create</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/edit">Update</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/view">View</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/lists">Lists</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/delete">Delete</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/search">Search</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/report">Driver-report</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/dashboard">Dashboard</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/drivers-report">Drivers-advanced-report</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/track-driver">Track-Defects</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/drivers/general-search">General-search</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onOpenChooseDriver}>Choose driver's id</NavDropdown.Item>
        <NavDropdown.Item onClick={onSave}>Save</NavDropdown.Item>
        <NavDropdown.Item onClick={onSaveAs}>Save As</NavDropdown.Item>
        <NavDropdown.Item onClick={onSaveAll}>Save All</NavDropdown.Item>
        <NavDropdown.Item onClick={handleExit}>Exit</NavDropdown.Item>
        <NavDropdown.Divider />
      </NavDropdown>
    );
}
