import React, { useEffect, useState } from "react";
import { createDriver, cancelDriver, confirmDriver, trackDriver } from "../utils/driverApi";
import { Container, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
import DriverDropdown from "./DriverDropdown";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import { logout } from "../utils/AppFunction";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import ReportsModal from "./ReportsModal";
import { useNavigate } from "react-router-dom";

const AddDriver = async () => {

    const navigate = useNavigate();
    const [driver, setDriver] = useState({trips : []});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("NEW"); 
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDriver, setTrackedDriver] = useState(null); 
    const [showReports, setShowReports] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await createDriver({firstName,lastName,phone,status});
            setSuccessMessage(`Vozac je uspesno kreiran!`);
            setErrorMessage("");
        }
        catch(error){
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleExecute = async() => {
        if (!driver || !driver.id) {
            alert("Nema vozaca za izvrsenje!");
            return;
        }  
        setDriver(driver);
        try{
            await confirmDriver(driver.id);
            alert(`Vozac ${driver.id} je potvrdjen!`);
        }
        catch(error){
            alert("Greska pri potvrdi ",error.message);
        }
    };

    const handleTrack = async (driverId) => {
        try {
            const data = await trackDriver(driverId);
            setTrackedDriver(data);
            setShowTrackModal(true);
        } catch (error) {
            alert("Greska pri pracenju vozaca: " + error.message);
        }
    };

    const handleCancel = async() => {
        if(!driver || !driver.id){
            alert("Nema vozaca za izvrsenje!");
            return;
        }
        try{
            await cancelDriver(driver.id);
            setDriver({
                ...driver,
                status: "CANCELLED",
                confirmed: false
            });
            alert(`Vozac ${driver.id} je otkazan!`);
        }
        catch(error){
            alert("Greska pri otkazivanju ",error.message);
        }
    };

    const handleReports = async() => {};

    const handleExit = async () => {
        try {
            await logout();
            navigate("/login"); // redirect na login stranicu
        } 
        catch (error) {
            alert("Greska pri odjavi");
        }
    };

    return (
        <Container fluid className="p-0">
            {/*Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom fixed-top">
                    <Nav className="ms-2">
                        <DriverDropdown handleExit={handleExit} />
                        <FileOptDropdownPage />
                        <EditOptDropdownPage />
                        <AdminDropdownPage />
                        <GoToDropdownPage />
                        <SystemSettingDropdownPage />
                        <SystemStateDropdownPage />
                        <SystemSettingDropdownPage />
                        <SecuritySettingDropdownPage />
                        <LocalizedOptionDropdownPage />
                        <PermissionDropdownPage />
                        <OptionDropdownPage />
                        <HelpDropdownPage />
                    </Nav>
                </Navbar>
            </Row>
            {/*Toolbar (red ispod – Execute, Track, Cancel, Reports, Search bar...) (fiksiran ispod navbar-a) */}
            <Row className="align-items-center bg-light border-bottom p-2 fixed-top" style={{ top: '56px', zIndex: 1000 }}>
                <Col>
                    <ButtonGroup>
                        <Button variant="primary" onClick={handleExecute} className="me-2">Execute</Button>
                        <Button variant="secondary" onClick={() => handleTrack(driver.id)} className="me-2">Track Driver</Button>
                        <TrackModal
                            show={showTrackModal}
                            onHide={() => setShowTrackModal(false)}
                            defect={trackedDriver}
                            />
                        <Button variant="warning" onClick={handleCancel} className="me-2">Cancel</Button>
                        <Button variant="info" onClick={handleReports}>Reports</Button>
                        <ReportsModal
                            show={showReports}
                            onHide={() => setShowReports(false)}
                            description={defect?.description}
                            />
                    </ButtonGroup>
                </Col>
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>

            {/*Page title (G-Soft: Driver) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: </h4>
                </Col>
            </Row>
            {/**Tool-bar */}

            {/* Driver Form in Card */}
            <Row className="d-flex justify-content-center my-5">
                <Col xs={12} md={12} lg={12} xl={12}>
                    <Card className="shadow-sm w-100">
                        <Card.Body>
                            <h3 className="text-center mb-4">Kreiraj Novog Vozaca</h3>
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                <Form.Label>Ime</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    required 
                                />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                <Form.Label>Prezime</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    required 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                <Form.Label>Opis</Form.Label>
                                <Form.Control 
                                    as="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="NEW">New</option>
                                    <option value="ALL">All</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CLOSED">Closed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </Form.Select>
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button type="submit" variant="primary">Sacuvaj</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Footer */}
            <Row>
                <Col className="text-center">© ERP G-Soft System 2025</Col>
            </Row>
            {/* Error message */}
            {errorMessage && (
            <Row>
                <Col className="text-danger">{errorMessage}</Col>
            </Row>
            )}
        </Container>
    );
};

export default AddDriver;