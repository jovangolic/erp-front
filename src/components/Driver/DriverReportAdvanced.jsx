import React, { useState } from "react";
import { cancelDriver, confirmDriver, trackDriver } from "../utils/driverApi";
import { generateDriverReport, downloadDriverReportExcel,downloadDriverReportPdf,generateAdvancedDriverReport } from "../utils/DriverReportApi";
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


const DriverReportAdvanced = () => {

    const navigate = useNavigate();
    const [driver, setDriver] = useState({trips : []});
    const [driverId, setDriverId] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [status, setStatus] = useState("");
    const [minRevenue, setMinRevenue] = useState("");
    const [maxDuration, setMaxDuration] = useState("");
    const [reportData, setReportData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");   
    const [successMessage, setSuccessMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDriver, setTrackedDriver] = useState(null); 
    const [showReports, setShowReports] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = {
                driverId,
                dateFrom,
                dateTo,
                status,
                minRevenue,
                maxDuration,
            };
            const data = await generateAdvancedDriverReport(request);
            setReportData(data);
            setSuccessMessage("Izvestaj uspesno generisan!");
            setErrorMessage("");
        } 
        catch (error) {
            setErrorMessage(error.message || "Greska pri generisanju izvestaja.");
            setSuccessMessage("");
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
                    <h4>G-Soft: Driver Advanced Report </h4>
                </Col>
            </Row>
            <Card className="p-3 shadow-sm mb-4">
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                        <Form.Group>
                            <Form.Label>Izaberi vozaca</Form.Label>
                            <DriverDropdown onSelect={setDriverId} />
                        </Form.Group>
                        </Col>
                        <Col md={3}>
                        <Form.Group>
                            <Form.Label>Od datuma</Form.Label>
                            <Form.Control
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={3}>
                        <Form.Group>
                            <Form.Label>Do datuma</Form.Label>
                            <Form.Control
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                        <Form.Group>
                            <Form.Label>Status putovanja</Form.Label>
                            <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            >
                            <option value="">Svi</option>
                            <option value="PLANNED">Planned</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            </Form.Select>
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group>
                            <Form.Label>Minimalni prihod (euro)</Form.Label>
                            <Form.Control
                            type="number"
                            value={minRevenue}
                            onChange={(e) => setMinRevenue(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group>
                            <Form.Label>Maksimalno trajanje (h)</Form.Label>
                            <Form.Control
                            type="number"
                            value={maxDuration}
                            onChange={(e) => setMaxDuration(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                        Generate Report
                    </Button>
                </Form>
            </Card>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {reportData && (
                <Card className="p-3 shadow-sm">
                <h5>Rezultat izvestaja</h5>
                <pre>{JSON.stringify(reportData, null, 2)}</pre>
                </Card>
            )}

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

export default DriverReportAdvanced;