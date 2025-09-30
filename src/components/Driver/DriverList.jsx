import React, { useState, useEffect } from "react";
import { findAllDrivers, saveDriver, saveAs, saveAll, deleteDriver, confirmDriver,cancelDriver,trackDriver } from "../utils/driverApi";
import { Container, Row, Col, Card, Button, Navbar, Nav, ButtonGroup,Form } from "react-bootstrap";
import TrackModal from "./TrackModal";
import DriverDropdown from "./DriverDropdown";
import GeneralSearchDriver from "./GeneralSearchDriver";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import { logout } from "../utils/AppFunction";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";


const DriverList = () => {

    const [driver, setDriver] = useState({ trips : []})
    const [drivers,setDrivers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    //state za paginaciju i filter
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [rangeStart, setRangeStart] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [showReports, setShowReports] = useState(false);
    //za pracenje vozaca
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDefect, setTrackedDefect] = useState(null); 
    //za pretragu vozaca
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams, setSearchParams] = useState({});  
    const [trackedDriver, setTrackedDriver] = useState(null); 
    
    const filteredTrips = driver?.trips.filter(t => {
            if (filterStatus === "ALL") return true;
            if (filterStatus === "ACTIVE") return t.status !== "CANCELLED";
            if (filterStatus === "CANCELLED") return t.status === "CANCELLED";
            return true;
    }) || [];

    useEffect(() => {
        const fetchDrivers = async() => {
            try{
                const data = await findAllDrivers();
                setDrivers(data[0] || {trips : []});
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchDrivers()
    },[]);

    const handleCancel = async() => {
        if(!driver || !driver.id){
            alert("Nema vozaca za izvrsenje!");
            return;
        }
        try{
            await cancelDriver(driver.id);
            setDriver({
                ...driver,
                status : CANCELLED,
                confirmed : false
            });
            alert(`Vozac ${driver.id} je otkazan!`);
        }
        catch(error){
            alert("Greska pri otkazivanju ",error.message);
        }
    };

    const handleExecute = async() => {
        if(!driver || !driver.id){
            alert("Nema vozaca za izvrsenje");
            return;
        }
        if(!driver.trips || !driver.trips.length === 0){
            alert("Vozac nema putovanja")
            return
        }
        const updatedTrips = driver.trips.map((t) => ({
            ...t,
            confirmed : true
        }));
        setDriver({
            ...driver,
            trips : updatedTrips
        });
        try{
            await confirmDriver(driver.id);
            alert(`Vozac ${driver.id} je potvrdjen`)
        }
        catch(error){
            alert("Greska pri potvrdi ",error.message);
        }
    };

    const handleTrack = async(driverId) => {
        try{
            const data = await trackDriver(driverId);
            setTrackedDriver(data);
            setShowTrackModal(true);
        }
        catch(error){
            alert("Greska pri pracenju vozaca ",error.message);
        }
    };    

    const getPaginatedInspections = () => {
        let paginated = driver.trips || [];
        // Ako je range filter postavljen
        if (rangeStart && rangeEnd) {
            const start = parseInt(rangeStart, 10) - 1;
            const end = parseInt(rangeEnd, 10);
            paginated = paginated.slice(start, end);
        } 
        else {
            // Standardna paginacija po 10 redova
            const startIndex = (currentPage - 1) * rowsPerPage;
            paginated = paginated.slice(startIndex, startIndex + rowsPerPage);
        }
        return paginated;
    };

    // Delete dugme
    const handleDeleteItem = async (id) => {
        if (!window.confirm("Da li ste sigurni da zelite da obrisete?")) return;
        try{
            await deleteDriver(id);
            const updatedTrips = driver.trips.filter((item) => item.id != id);
            setDriver({ ...driver, trips : updatedTrips});
        }
        catch(error){
            setErrorMessage(error.message);
        }
    }

    const handleGeneralSearch = async () => {};
    
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

    return (
        <Container fluid>
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
                        <Button variant="secondary" onClick={() => handleTrack(defect.id)} className="me-2">Track Defect</Button>
                        <TrackModal
                            show={showTrackModal}
                            onHide={() => setShowTrackModal(false)}
                            defect={trackedDefect}
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
                    <h4>G-Soft: Driver List</h4>
                </Col>
            </Row>
            {/* Tabela sa rezultatima generalne pretrage */}
            <Row className="mb-4">
                <Col>
                    <GeneralSearchDriver
                        results={searchResults}  
                        onSelectDriver={(selected) => setDriver(selected)}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </Col>
            </Row>
            {/* Tabela putovanja */}
            <Row className="mt-3">
                <Col>
                    <Card>
                        <Card.Header>
                            <Row className="align-items-center">
                                <Col><h5>Vozaceva putovanja: {driver.id}</h5></Col>
                                <Col xs="auto">
                                    <Button
                                        variant={filterStatus === "ALL" ? "primary" : "light"}
                                        className="me-1"
                                        onClick={() => setFilterStatus("ALL")}
                                        >
                                        All
                                    </Button>
                                    <Button
                                        variant={filterStatus === "ACTIVE" ? "primary" : "light"}
                                        className="me-1"
                                        onClick={() => setFilterStatus("ACTIVE")}
                                        >
                                        Active
                                    </Button>
                                    <Button
                                        variant={filterStatus === "CANCELLED" ? "primary" : "light"}
                                        onClick={() => setFilterStatus("CANCELLED")}
                                    >
                                        Cancelled
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-2 align-items-center">
                                <Col xs="auto">
                                    <Form.Control
                                    type="number"
                                    placeholder="From"
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Control
                                    type="number"
                                    placeholder="To"
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="secondary" onClick={() => setCurrentPage(1)}>
                                    Apply
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>

                        <Card.Body className="p-0">
                            <Row className="bg-dark text-white fw-bold p-2">
                                <Col>ID</Col>
                                <Col>Start Location</Col>
                                <Col>End Location</Col>
                                <Col>Start Time</Col>
                                <Col>End Time</Col>
                                <Col>Status</Col>
                                <Col>Type Status</Col>
                                <Col>Driver ID</Col>
                                <Col>Confirmed</Col>
                                <Col>Fare</Col>
                                <Col xs="auto">Actions</Col>
                            </Row>

                            {getPaginatedInspections().map((t) => (
                            <Row key={t.id} className="border-bottom align-items-center p-2">
                                <Col>{t.id}</Col>
                                <Col>{t.startLocation}</Col>
                                <Col>{t.endLocation}</Col>
                                <Col>{t.startTime}</Col>
                                <Col>{t.endTime}</Col>
                                <Col>{t.status}</Col>
                                <Col>{t.typeStatus}</Col>
                                <Col>{t.driver?.id}</Col>
                                <Col>{t.fare}</Col>
                                <Col>
                                {t.confirmed ? (
                                    <Badge bg="success">Yes</Badge>
                                ) : (
                                    <Badge bg="warning">No</Badge>
                                )}
                                </Col>
                                <Col>
                                {ins.status === "NEW" && <Badge bg="info">NEW</Badge>}
                                {ins.status === "CONFIRMED" && <Badge bg="success">CONFIRMED</Badge>}
                                {ins.status === "CLOSED" && <Badge bg="secondary">CLOSED</Badge>}
                                {ins.status === "CANCELLED" && <Badge bg="danger">CANCELLED</Badge>}
                                </Col>
                                <Col xs="auto">
                                <ButtonGroup size="sm">
                                    <Button variant="primary">View</Button>
                                    <Button variant="danger" onClick={() => handleDeleteItem(ins.id)}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                                </Col>
                            </Row>
                            ))}
                        </Card.Body>

                        <Card.Footer>
                            <Row className="align-items-center">
                                <Col xs="auto">
                                    <Button
                                    variant="secondary"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="me-2"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                    variant="secondary"
                                    disabled={currentPage * rowsPerPage >= (driver.trips?.length || 0)}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </Button>
                                </Col>
                                <Col className="text-center">
                                    Page {currentPage} / {Math.ceil(filteredTrips.length / rowsPerPage)}
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* Footer */}
            <Row>
                <Col className="text-center">© ERP G-soft System 2025</Col>
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

export default DriverList;