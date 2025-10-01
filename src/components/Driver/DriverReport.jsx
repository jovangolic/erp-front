import React, { useState } from "react";
import { cancelDriver, confirmDriver, trackDriver } from "../utils/driverApi";
import { generateDriverReport, downloadDriverReportExcel,downloadDriverReportPdf } from "../utils/DriverReportApi";
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

const DriverReport =() => {

    const navigate = useNavigate();
    const [driver, setDriver] = useState({trips : []});
    const [report, setReport] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("NEW"); 
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDriver, setTrackedDriver] = useState(null); 
    const [showReports, setShowReports] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const report = await generateDriverReport(driver.id); // vraca DriverReportResponse
            setDriver({
                id: report.driverId,
                firstName: report.fullName.split(" ")[0],
                lastName: report.fullName.split(" ")[1],
                phone: report.phone,
                totalTrips: report.totalTrips,
                completedTrips: report.completedTrips,
                cancelledTrips: report.cancelledTrips,
                activeTrips: report.activeTrips,
                averageDurationInHours: report.averageDurationInHours,
                totalRevenue: report.totalRevenue,
            });
            setSuccessMessage(`Izvestaj je uspesno kreiran!`);
            setErrorMessage("");
            setShowReports(true); // pokazi tabelu
        } 
        catch (error) {
            setErrorMessage(error.message || "Greska pri generisanju izvestaja");
            setSuccessMessage("");
            setShowReports(false);
        }
    };

    const handleGenerateDriverReport = async() => {
        if(!driver || !driver.id){
            alert("Nema vozaca za izvrsenje");
            return;
        }
        try{
            const data = await generateDriverReport(driver.id);
            setReport(data);
            alert(`Izvestaj za vozaca ${driver.id} je generisan!`);
        }
        catch(error){
            alert("Greska pri generisanju izvestaja ",error.message);
        }
    };

    const handeDownloadDriverPDFReport = async() => {
        if(!driver || !driver.id){
            alert("Nema vozaca za izvrsenje");
            return;
        }
        try{
            const response = await downloadDriverReportPdf(driver.id);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `driver_report_${driver.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
        catch(error){
            alert("Greska pri generisanju PDF izvestaja ",error.message);
        }
    };

    const handleDownloadDriverExcelReport = async() => {
        if(!driver || !driver.id){
            alert("Nema vozaca za izvrsenje");
            return;
        }
        try{
            const response = await downloadDriverReportExcel(driver.id);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `driver_report_${driver.id}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
        catch(error){
            alert("Greska pri generisanju Excel izvestaja ",error.message);
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
                    <h4>G-Soft: Driver Report </h4>
                </Col>
            </Row>
            {/* Kartica sa report akcijama */}
            {/* Kartica za generisanje izveštaja */}
            <Row>
                <Col md={8} lg={6}>
                    <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>Generisanje izvestaja</Card.Title>
                        <Card.Text>
                            Izaberi vozaca iz liste i generisi njegov izvestaj u zeljenom formatu.
                        </Card.Text>

                        {/* Dropdown za izbor vozača */}
                        <DriverDropdown onSelect={setDriver} />

                        <div className="mt-3">
                        <ButtonGroup>
                            <Button variant="primary" onClick={handleSubmit}>
                                Generate Report
                            </Button>
                            <Button variant="success" onClick={handeDownloadDriverPDFReport}>
                                Download PDF
                            </Button>
                            <Button variant="info" onClick={handleDownloadDriverExcelReport}>
                                Download Excel
                            </Button>
                        </ButtonGroup>
                        </div>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Alert poruke */}
            <Row className="mt-3">
                <Col>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                </Col>
            </Row>

            {/* Tabela sa rezultatima izveštaja */}
            {driver && driver.id && showReports && (
            <Row className="mt-4">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                        <Card.Title>Rezultat izvestaja</Card.Title>
                        <Table striped bordered hover responsive className="mt-3">
                            <tbody>
                            <tr>
                                <th>Driver ID</th>
                                <td>{driver.id}</td>
                            </tr>
                            <tr>
                                <th>Full Name</th>
                                <td>{driver.firstName} {driver.lastName}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{driver.phone}</td>
                            </tr>
                            <tr>
                                <th>Total Trips</th>
                                <td>{driver.totalTrips}</td>
                            </tr>
                            <tr>
                                <th>Completed Trips</th>
                                <td>{driver.completedTrips}</td>
                            </tr>
                            <tr>
                                <th>Cancelled Trips</th>
                                <td>{driver.cancelledTrips}</td>
                            </tr>
                            <tr>
                                <th>Active Trips</th>
                                <td>{driver.activeTrips}</td>
                            </tr>
                            <tr>
                                <th>Average Duration (hrs)</th>
                                <td>{driver.averageDurationInHours}</td>
                            </tr>
                            <tr>
                                <th>Total Revenue</th>
                                <td>{driver.totalRevenue}</td>
                            </tr>
                            </tbody>
                        </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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

export default DriverReport;