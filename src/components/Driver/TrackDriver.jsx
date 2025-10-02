import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
import DriverDropdown from "./DriverDropdown";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import TrackModal from "./TrackModal";
import ReportsModal from "./ReportsModal";
import { logout } from "../utils/AppFunction";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import { findAllDrivers, cancelDriver, confirmDriver, trackDriver, deleteDriver} from "../utils/driverApi";
import { FaCheck, FaTimes, FaTrash, FaChartBar, FaSearch } from "react-icons/fa";

const TrackDriver = () => {

    const [driver, setDriver] = useState("");
    // Lista vozaca (master)
    const [drivers, setDrivers] = useState([]);
    // Selektovani vozac (detail)
    const [selectedDriver, setSelectedDriver] = useState(null);
    // UI state
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showReports, setShowReports] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDriver, setTrackedDriver] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDrivers = async() => {
            setLoading(true);
            try{
                const data = await findAllDrivers();
                setDrivers(data || []);
            }
            catch(error){
                setErrorMessage(error.message || "Greska pri ucitavanju svih vozaca.");
            }
            finally{
                setLoading(false);
            }
        };
        fetchDrivers();
    },[]);

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

    const handleConfirm = async() => {
        try{
            await confirmDriver(selectedDriver.id);
            setSuccessMessage("Vozac potvrdjen");
        }
        catch(error){
            setErrorMessage("Greska pri potvrdjivanju vozaca");
        }
    };

    const handleDelete = async () => {
        try{
            await deleteDriver(selectedDriver.id);
            setDrivers(driver.filter(d => d.id !== selectedDriver.id));
            setSelectedDriver(null);
            setSuccessMessage("Vozac obrisan");
        }
        catch(error){
            setErrorMessage("Greska pri brisanju vozaca");
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

    return(
        <Container fluid className="mt-4">
            {/* Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom fixed-top">
                    <Nav className="ms-2">
                        <DriverDropdown handleExit={handleExit} />
                        <FileOptDropdownPage />
                        <EditOptDropdownPage />
                        <AdminDropdownPage />
                        <GoToDropdownPage />
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
                    <h4>G-Soft: Prati Vozaca </h4>
                </Col>
            </Row>
            <Row>
                {/* Master view (tabela sa listom) */}
                <Col md={8}>
                    <h4>Lista Vozaca</h4>
                    {loading && <p>Ucitavanje...</p>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Ime</td>
                                <td>Prezime</td>
                                <td>Broj-telefona</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((d) => (
                                <tr
                                    key={d.id}
                                    style={{cursor : "pointer"}}
                                    onClick={() => setSelectedDriver(d)}
                                >
                                    <td>{d.id}</td>
                                    <td>{d.firstName}</td>
                                    <td>{d.lastName}</td>
                                    <td>{d.phone}</td>
                                    <td>{d.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                {/* Detail view (detaljan prikaz + akcije) */}
                <Col md={4}>
                  {selectedDriver ? (
                    <Card className="shadow-sm" >
                        <Card.Body>
                            <h5>Detalji Vozaca</h5>
                            <p><b>ID:</b> {selectedDriver.id}</p>
                            <p><b>Ime:</b> {selectedDriver.firstName}</p>
                            <p><b>Prezime:</b> {selectedDriver.lastName}</p>
                            <p><b>Broj-telefona:</b> {selectedDriver.phone}</p>
                            <p><b>Status:</b> {selectedDriver.status}</p>
                            <p><b>Potvrđen:</b> {selectedDriver.confirmed ? "Da" : "Ne"}</p>

                            {/*Dugmici za akcije */}
                            <ButtonGroup className="mt-3 d-flex flex-wrap gap-2">
                                <Button variant="success" onClick={handleConfirm}>
                                        <FaCheck className="me-2" /> Potvrdi
                                </Button>
                                <Button variant="warning" onClick={handleCancel}>
                                    <FaTimes className="me-2" /> Otkazi
                                </Button>
                                <Button variant="info">
                                    <FaChartBar className="me-2" /> Izvestaji
                                </Button>
                                <Button variant="secondary">
                                    <FaSearch className="me-2" /> Prati
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    <FaTrash className="me-2" /> Obrisi
                                </Button>
                            </ButtonGroup>
                        </Card.Body>
                    </Card>
                  ) : (
                    <p>Klikni na red u tabeli da vidis detalje i akcije.</p>
                  )}          
                </Col>
            </Row>
            <Row>
                <Col className="text-center">© ERP G-Soft System 2025</Col>
            </Row>
        </Container>
    );
};

export default TrackDriver;