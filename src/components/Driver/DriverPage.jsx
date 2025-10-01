import { useState, useEffect } from "react";
import { createDriver, updateDriver,findAllDrivers,deleteDriver,generalSearch,confirmDriver,cancelDriver } from "../utils/driverApi";
import { Link, Outlet, useNavigate } from "react-router-dom";
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



const DriverPage = () => {

    const [driver, setDriver] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    //Za paginaciju
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [trackedDriver, setTrackedDriver] = useState(null); 
    const [searchResults, setSearchResults] = useState([]);
    //Za greske i poruke
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async() => {
            try{
                const data = await findAllDrivers();
                setDrivers(data);
                if(data.length > o) setDriver(data[0]);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchAll()
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

    return(
        <Container fluid >
            {/*Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom w-100">
                    <Nav className="ms-2">
                        <DriverDropdown handleExit={handleExit} />
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
                        <Button variant="info" onClick={handleReports}>Reports</Button>
                        
                    </ButtonGroup>
                </Col>
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>
            {/*Page title (G-Soft: Defect List) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: Stranica Vozaca</h4>
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

export default DriverPage;