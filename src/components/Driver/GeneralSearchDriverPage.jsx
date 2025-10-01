import React, { useState } from "react";
import { generalSearch } from "../utils/driverApi";
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
import { useNavigate } from "react-router-dom";
import TrackModal from "./TrackModal";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";


const GeneralSearchDriverPage =() => {

    const [activeTab, setActiveTab] = useState("details");
    const [drivers, setDrivers] = useState([]);
    const [driver, setDriver] = useState({ trips: [] });
    //state za paginaciju i filter
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [rangeStart, setRangeStart] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [showReports, setShowReports] = useState(false);
    //za pracenje defekata
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDriver, setTrackedDriver] = useState(null); 
    //za pretragu defekta
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams, setSearchParams] = useState({});  
        
    const filteredTrips = driver?.trips.filter(t => {
        if (filterStatus === "ALL") return true;
        if (filterStatus === "ACTIVE") return t.status !== "CANCELLED";
        if (filterStatus === "CANCELLED") return t.status === "CANCELLED";
        return true;
    }) || [];

    const [id, setId] = useState("");
    const [idFrom, setIdFrom] = useState("");
    const [idTo, setIdTo] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("");
    const [confirmed, setConfirmed] = useState("");
    
    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = async() => {
        try{
            const response = await generalSearch({
                id,
                idFrom,
                idTo,
                firstName,
                lastName,
                phone,
                status,
                confirmed: confirmed === "" ? null : confirmed === "true"
            });
            setResults(response);
            setCurrentIndex(0);
            setErrorMessage("");
        }
        catch(error){
            setResults([]);
            setErrorMessage(error.message);
        }
    };

    const currentDriver = results[currentIndex] || null;

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

    const handleDeleteItem = async(id) => {
        if(!window.confirm("Da li ste sigurni da zelite da obriste?")) return;
        try{
            await deleteDriver(id);
            const updateTrips = driver.trips.filter((item) => item.id !== id);
            setDriver({...driver, trips : updateTrips});
        }
        catch(error){
            setErrorMessage(error.message);
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

    // SACUVAJ jedan driver
    const handleSaveDriver = async() => {
        try{
            if (!driver || !driver.id || !driver.firstName || !driver.lastName || !driver.phone) {
                alert("Popunite obavezna polja (first-name, last-name, phone).");
                return;
            }
            const saved = await saveDriver(driver);
            setDriver(saved);
            alert(`Vozac ${saved.id} je uspesno sacuvan!`);
        }
        catch(error){
            alert("Greska pri cuvanju vozaca ", error.message);
        }
    };    

    // SACUVAJ KAO (kopija postojeceg defekta sa novim vrednostima)
    const handleSaveAsDriver = async() => {
        if(!driver || !driver.id){
            alert("Moras odabrati vozaca koji zelis da sacuvas kao novi.");
            return;
        }
        try{
            const overrides = {
                sourceId: driver.id,
                firstName: driver.firstName ? driver.firstName + "_COPY" : null,
                lastName: driver.lastName ? driver.lastName + " (Copy)" : null,
                phone: driver.phone || null,
            };
            const saved = await saveAs(overrides);
            alert(`Vozac sacuvan kao novi: ${saved.id}`);
        }
        catch(error){
            alert("Greska prilikom Save-as ", error.message);
        }
    };  

    // SACUVAJ VISE drivers odjednom
    const handleSaveAllDrivers = async() => {
        if(!Array.isArray(drivers) || drivers.length === 0){
            alert("Nema vozaca za Save All.");
            return;
        }
        try{
            const savedList = await saveAll(drivers); // lista requestova ide na backend
            alert(`Uspesno sacuvani ${savedList.length} vozaci!`);
        }
        catch(error){
            alert("Greska prilikom Save-All ",error.message)
        }
    };

    return(
        <Container fluid className="p-3">
            {/*Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom w-100">
                    <Nav className="ms-2">
                        <DriverDropdown 
                            handleExit={handleExit} 
                            onSave={handleSaveDriver}
                            onSaveAs={handleSaveAsDriver}
                            onSaveAll={handleSaveAllDrivers}
                        />
                        <FileOptDropdownPage />
                        <EditOptDropdownPage />
                        <AdminDropdownPage />
                        <GoToDropdownPage />
                        <SystemStateDropdownPage />
                        <SystemSettingDropdownPage />
                        <LanguageDropdownPage />
                        <SecuritySettingDropdownPage />
                        <LocalizedOptionDropdownPage />
                        <PermissionDropdownPage />
                        <OptionDropdownPage />
                        <HelpDropdownPage />
                    </Nav>
                </Navbar>
            </Row>
            {/*Toolbar (red ispod – Execute, Track, Cancel, Reports, Search bar...) */}
            <Row className="align-items-center bg-light border-bottom p-2 fixed-top" style={{ top: '56px', zIndex: 1000 }}>
                <Col>
                    <ButtonGroup>
                        <Button variant="primary" onClick={handleExecute} className="me-2">Execute</Button>
                        <Button variant="secondary" onClick={() => handleTrack(defect.id)} className="me-2">Track Driver</Button>
                        <TrackModal
                            show={showTrackModal}
                            onHide={() => setShowTrackModal(false)}
                            driver={trackedDriver}
                            />
                        <Button variant="warning" onClick={handleCancel} className="me-2">Cancel</Button>                       
                    </ButtonGroup>
                </Col>
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>
            {/*Page title (G-Soft: Defect List) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: Generalna pretraga</h4>
                </Col>
            </Row>
            {/* Toolbar za osnovne filtere */}
            <Row className="mb-3 bg-light border p-3 rounded">
                <Col xs={2}>
                    <Form.Control
                        type="number"
                        placeholder="ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="number"
                        placeholder="ID From"
                        value={idFrom}
                        onChange={(e) => setIdFrom(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="number"
                        placeholder="ID To"
                        value={idTo}
                        onChange={(e) => setIdTo(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="text"
                        placeholder="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="text"
                        placeholder="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        type="text"
                        placeholder="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </Col>
            </Row>
            
            {/* Filteri za status, confirmed */}
            <Row className="mb-3 bg-light border p-3 rounded">
                <Col xs={3}>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="ALL">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="NEW">New</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CLOSED">Closed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </Form.Select>
                </Col>
                <Col xs={3}>
                    <Form.Select value={confirmed} onChange={(e) => setConfirmed(e.target.value)}>
                        <option value="">All Confirmed</option>
                        <option value="true">Confirmed</option>
                        <option value="false">Not Confirmed</option>
                    </Form.Select>
                </Col>
                <Col xs={3}>
                    <Button variant="primary" onClick={handleSearch} className="w-100">
                          Search
                    </Button>
                </Col>
            </Row>
             
            {/* Detaljan prikaz vozaca */}
            {currentDriver && (
                <Card className="mb-3 shadow-sm">
                    <Card.Body>
                          <Row>
                            <Col><strong>ID:</strong> {currentDriver.id}</Col>
                            <Col><strong>First-name:</strong> {currentDriver.code}</Col>
                            <Col><strong>Last-name:</strong> {currentDriver.name}</Col>
                            <Col><strong>Phone:</strong> {currentDriver.phone}</Col>
                          </Row>
                        <Row className="mt-2">
                            <Col>
                              <Badge bg="info">{currentDriver.status}</Badge>
                            </Col>
                            <Col>
                              <Badge bg={
                                currentDriver.status === "CANCELLED" ? "danger" :
                                currentDriver.status === "CLOSED" ? "secondary" :
                                currentDriver.status === "CONFIRMED" ? "success" : "warning"
                              }>
                                {currentDriver.status}
                              </Badge>
                            </Col>
                            <Col>
                              {currentDriver.confirmed ? (
                                <Badge bg="success">Confirmed</Badge>
                              ) : (
                                <Badge bg="warning">Not Confirmed</Badge>
                              )}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
            
            {/* Navigacija */}
            {results.length > 1 && (
                <Row className="mt-2">
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex(currentIndex - 1)}
                        >
                            Previous
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            disabled={currentIndex === results.length - 1}
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                        >
                            Next
                        </Button>
                    </Col>
                    <Col className="align-self-center">
                        <span>
                            {currentIndex + 1} of {results.length}
                        </span>
                    </Col>
                </Row>
            )}
            {/* Footer */}
            <Row>
                <Col className="text-center">© ERP G-soft System 2025</Col>
            </Row>
            {/* Error message */}
            {errorMessage && (
                <Row className="mt-3">
                    <Col className="text-danger">{errorMessage}</Col>
                </Row>
            )}
        </Container>
    );  
};

export default GeneralSearchDriverPage;