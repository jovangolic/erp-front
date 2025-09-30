import React, { useState } from "react";
import { cancelDriver, confirmDriver, trackDriver } from "../utils/driverApi";
import { generateDriverReport, downloadDriverReportExcel,downloadDriverReportPdf,generateAdvancedDriverReport } from "../utils/DriverReportApi";
import { Container, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card, Tab } from "react-bootstrap";
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
import DriverReport from "./DriverReport";
import DriverReportAdvanced from "./DriverReportAdvanced";

const ReportsDashboard =() => {

    const navigate = useNavigate();
    const [driver, setDriver] = useState({trips : []});
    const [driverId, setDriverId] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [status, setStatus] = useState("");
    const [minRevenue, setMinRevenue] = useState("");
    const [maxDuration, setMaxDuration] = useState("");
    const [reportData, setReportData] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDriver, setTrackedDriver] = useState(null); 
    const [showReports, setShowReports] = useState(false);

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
    
    const handleExit = async() =>{
        try{
            await logout();
            navigate("/login");
        }
        catch(error){
            alert("Greska pri odjavi");
        }
    };

    return(
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
                        
                    </ButtonGroup>
                </Col>
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>

            {/*Page title (G-Soft: Driver) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: Izvestaji </h4>
                </Col>
            </Row>
            <Row>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Tab.Container defaultActiveKey="general">
                            <Row>
                                <Col sm={3}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="general">Opsti izvestaj</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="advanced">Napredni izvestaj</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="monthly">Mesecni izvestaji</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="custom">Prilagodjeni izvestaji</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                    <Tab.Pane eventKey="general">
                                        <DriverReport />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="advanced">
                                        <DriverReportAdvanced />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="monthly">
                                        <h5>Mesecni izvestaji (uskoro)</h5>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="custom">
                                        <h5>Prilagodjeni izvestaji (uskoro)</h5>
                                    </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Card.Body>
                </Card>
            </Row>
            {/* Footer */}
            {/* Alert poruke */}
            <Row className="mt-3">
                <Col>
                    {successMessage && (
                        <Alert variant="success">{successMessage}</Alert>
                    )}
                    {errorMessage && (
                        <Alert variant="danger">{errorMessage}</Alert>
                    )}
                </Col>
            </Row>
            {/* Footer */}
            <Row className="mt-5">
                <Col className="text-center text-muted">
                    © ERP G-Soft System 2025
                </Col>
            </Row>  
        </Container>
    );
};

export default ReportsDashboard;