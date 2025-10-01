import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findOneById, trackDriver,cancelDriver,confirmDriver, deleteDriver, findAllDrivers, generalSearch } from "../utils/driverApi";
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

const ViewDriver = () => {

    const {id} = useParams();
    const [activeTab, setActiveTab] = useState("details");
    const [drivers, setDrivers] = useState([]);
    const [driver, setDriver] = useState({ trips: [] });
    const [errorMessage, setErrorMessage] = useState("");
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

    useEffect(() => {
        const fetchDriver = async() => {
            try{
                const data = await findOneById(id);
                setDriver(data[0] || {trips : []});
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchDriver();
    },[id]);

    //fetch all drivers
    useEffect(() => {
        const fetchAllDriver = async() => {
            try{
                const response = await findAllDrivers();
                setDriver(response[0] || { trips : []});
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchAllDriver();
    }, []);

    const getPaginatedTrips = () =>{
        let paginated = driver.trips || [];
        if(rangeStart && rangeEnd){
            const start = parseInt(rangeStart,10) - 1;
            const end = parseInt(rangeEnd, 10);
            paginated = paginated.slice(start,end);
        }
        else{
            const startIndex = (currentPage - 1) * rowsPerPage;
            paginated = paginated.slice(startIndex, startIndex + rowsPerPage);
        }
        return paginated;
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

    const handleGeneralSearchDriver = async() => {
        try{
            const valId = searchId ? parseInt(searchid) : null;
            const fromVal = rangeStart ? parseInt(rangeStart) : null;
            const toVal = rangeEnd ? parseInt(rangeEnd) : null;
            if((fromVal != null && toVal != null) && fromVal > toVal){
                throw new Error("Pocetak opsega id-ija ne sme biti veci od kraja id-ja");
            }
            const data = await generalSearch({
                id: valId,
                idFrom : fromVal,
                idTo : toVal,
                firstName : searchFirstName || null,
                lastName : searchLastName || null,
                phone : searchPhone || null,
                status : filterStatus !== "ALL" ? filterStatus : null,
                confirmed : filterConfirmed
            });
            if(!data || !Array.isArray(data)){
                throw new Error("Nije vracen validan rezultat pretrage");
            }
            setDrivers(data);
            if(data.length > 0) setDriver(data[0]);
            setErrorMessage("");
        }
        catch(error){
            setErrorMessage(error.message);
            setDrivers([]);
        }
    };

    return(
        <Container fluid>
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
            <Row clasclassName="align-items-center bg-light border-bottom p-2 fixed-top" style={{ top: '56px', zIndex: 1000 }}>
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
                    <h4>G-Soft: Pregled Vozaca</h4>
                </Col>
            </Row>
            {/* Toolbar */}  

            {/* Tabela sa rezultatima generalne pretrage */}
            <Row className="mb-3">
                <Col>
                    <GeneralSearchDriver 
                        result={searchResults}
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

export default ViewDriver;