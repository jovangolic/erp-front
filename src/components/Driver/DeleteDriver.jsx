import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findOneById, trackDriver,cancelDriver,confirmDriver, deleteDriver } from "../utils/driverApi";
import { Container, Row, Col, Card, Button, Navbar, Nav, ButtonGroup,Form } from "react-bootstrap";
import DriverDropdown from "./DriverDropdown";
import TrackModal from "./TrackModal";
import GeneralSearchDriver from "./GeneralSearchDriver";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import { logout } from "../utils/AppFunction";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";


const DeleteDriver =() => {

    const { id } = useParams();
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

    useEffect(() => {
        const fetchDriver = async() => {
            try{
                const data = await findOneById(id);
                setDriver(data);
                setFirstName(data.firstName || "");
                setLastName(data.lastName || "");
                setPhone(data.phone || "");
                setStatus(data.status || "NEW");
            }
            catch(error){
                setErrorMessage(error.errorMessage);
            }
        };
        fetchDriver()
    },[id]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await deleteDriver(id);
            navigate("/drivers" , {state : {message : "Driver successfully deleted"}});
        }
        catch(error){
            setErrorMessage(error.message);
        }
    };

    const handleExecute = async() => {
        if (!driver || !driver.id) {
            alert("Nema vozaca za izvrsenje!");
            return;
        } 
        if(!driver.trips || driver.trips.length === 0){
            alert("Vozac nema voznju");
            return;
        } 
        const updatedTrips = driver.trips.map(t => ({...t, confirmed : true}))
        setDriver({...driver, trips : updatedTrips});
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
        if(!driver.trips || driver.trips.length === 0){
            alert("Vozac nema voznju")
            return;
        }
        const updatedTrips = driver.trips.map(t => ({...t, confirmed : false}));
        try{
            await cancelDriver(driver.id);
            setDriver({
                ...driver,
                status: "CANCELLED",
                confirmed: false,
                trips : updatedTrips
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

    if(!driver) return <div>Loading...</div>   
    
    return(
        <Container fluid>
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
                        <LanguageDropdownPage />
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
                            driver={trackedDriver}
                            />
                        <Button variant="warning" onClick={handleCancel} className="me-2">Cancel</Button>
                        <Button variant="info" onClick={handleReports}>Reports</Button>
                        
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
            {/**Driver form card */}
            <Row className="d-flex justify-content-center my-5">
                <Col xs={12} md={12} lg={12} xl={12}>
                    <Card className="shadow-sm w-100">
                        <Card.Body>
                            <h3 className="text-center mb-4">Obrisi Vozaca</h3>
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ime</Form.Label>
                                    <Form.Control type="text" value={firstName} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Prezime</Form.Label>
                                    <Form.Control type="text" value={lastName} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Broj-telefona</Form.Label>
                                    <Form.Control type="tel"  value={phone} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control type="text" value={status} disabled />
                                </Form.Group>

                                <div className="d-flex justify-content-end">
                                    <Button type="submit" variant="danger">Obrisi</Button>
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

export default DeleteDriver;