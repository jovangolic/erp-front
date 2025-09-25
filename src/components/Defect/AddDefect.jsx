import React, { useEffect, useState } from "react";
import { createDefect,confirmDefect,cancelDefect,trackDefect,findByDescriptionContainingIgnoreCase,countDefectsByYearAndMonth } from "../utils/defectApi";
import { Container, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
import DefectDropdown from "./DefectDropdown";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import TrackModal from "./TrackModal";
import ReportsModal from "./ReportsModal";
import DefectChart from "./DefectChart";
import { logout } from "../utils/AppFunction";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";

const AddDefect = () => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("TRIVIAL_SEVERITY");  // vrednost iz SeverityLevel
    const [status, setStatus] = useState("NEW"); // vrednost iz DefectStatus
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDefect, setTrackedDefect] = useState(null); 
    const [showReports, setShowReports] = useState(false);
    const [defect, setDefect] = useState({ inspections: [] });
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await countDefectsByYearAndMonth();
                setMonthlyData(Array.isArray(data) ? data : []);
            } 
            catch (error) {
                console.error("Greska prilikom ucitavanja podataka:", error);
                setMonthlyData([]); // fallback na prazan niz
            }
            };
        fetchData();
    }, []);

    const defectStats = {
        trivial: 5,
        minor: 10,
        moderate: 7,
        major: 3,
        critical: 1
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await createDefect({ code, name, description, severity, status });
            setSuccessMessage(`Defekt ${data.code} uspesno kreiran!`);
            setErrorMessage("");
        } 
        catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleExecute =async() => {
            // 1. Provera da li postoji defekt
            if (!defect || !defect.code) {
                alert("Nema defekta za izvrsenje!");
                return;
            }
            //provera da li defekat ima inspekcije,
            //tacnije da li tabela sa inspekcijama ne postoji, i ako postoji da li je njena duzina jednaka nuli, prazna
            if(!defect.inspections || defect.inspections.length === 0){
                alert("Defekt nema inspekcija!");
                return;
            }
            const updatedInspections = defect.inspections.map((ins) => ({
                ...ins,
                confirmed: true, // primer dodavanja polja za status
            }));
    
            setDefect({
                ...defect,
                inspections: updatedInspections,
            });
            try{
                await confirmDefect(defect.id);
                alert(`Defekt ${defect.code} je potvrdjen!`);
            }
            catch(error){
                alert("Greska pri potvrdi ",error.message);
            }
        };
    
        const handleCancel = async() => {
            if (!defect || !defect.code) {
                alert("Nema defekta za izvrsenje!");
                return;
            }
            if(!defect.inspections || defect.inspections.length === 0){
                alert("Defekt nema inspekcija!");
                return;
            }
            try{
                await cancelDefect(defect.id);
                const updatedInspections = defect.inspections.map(ins => ({
                    ...ins,
                    confirmed: false
                }));
    
                setDefect({
                    ...defect,
                    status: "CANCELLED",
                    confirmed: false,
                    inspections: updatedInspections
                });
                alert(`Defekt ${defect.code} je otkazan!`);
            }
            catch(error){
                alert("Greska pri otkazivanju ",error.message);
            }
        };
    
        const handleTrack = async (defectId) => {
            try {
                const defectData = await trackDefect(defectId);
                setTrackedDefect(defectData);
                setShowTrackModal(true);
            } catch (error) {
                alert("Greska pri pracenju defekta: " + error.message);
            }
        };
    
        const handleReports = async() => {
            try{
                if(!defect || defect.description){
                    alert("Defekt nema opis za izvestaj!");
                    return;
                }
                const relatedDefects = await findByDescriptionContainingIgnoreCase(defect.description);
                if (relatedDefects.length === 0) {
                    alert("Nema pronadjenih defekata za dati opis.");
                    return;
                }
                console.log("Pronadjeni defekti:", relatedDefects);
                    alert(`Pronasli smo ${relatedDefects.length} slicnih defekata po opisu.`);
                setShowReports(true);    
                }
            catch(error){
                alert("Greska pri generisanju izvestaja: " + error.message);
            }
        };
    
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
                        <DefectDropdown handleExit={handleExit} />
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
                        <Button variant="secondary" onClick={() => handleTrack(defect.id)} className="me-2">Track Defect</Button>
                        <TrackModal
                            show={showTrackModal}
                            onHide={() => setShowTrackModal(false)}
                            defect={trackedDefect}
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
            {/*Page title (G-Soft: Defect List) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: </h4>
                </Col>
            </Row>
            {/* Toolbar */}
            <Row className="mb-3 bg-primary text-white p-2">
                <Col className="d-flex flex-wrap justify-content-start gap-2">
                    <Button variant="light" onClick={handleExecute} className="me-2">Execute</Button>
                    <Button variant="light" onClick={() => handleTrack(defect.id)} className="me-2">Track Defect</Button>
                    <TrackModal
                        show={showTrackModal}
                        onHide={() => setShowTrackModal(false)}
                        defect={trackedDefect}
                        />
                    <Button variant="light" onClick={handleCancel} className="me-2">Cancel</Button>
                    <Button variant="light" onClick={handleReports} className="me-2">Reports</Button>
                    <ReportsModal
                        show={showReports}
                        onHide={() => setShowReports(false)}
                        description={defect?.description}
                        />
                </Col>
            </Row>
            {/* Defect Form in Card */}
            <Row className="d-flex justify-content-center my-5">
                <Col xs={12} md={12} lg={12} xl={12}>
                    <Card className="shadow-sm w-100">
                        <Card.Body>
                            <h3 className="text-center mb-4">Kreiraj Novi Defekat</h3>

                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}

                            <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Sifra</Form.Label>
                                <Form.Control 
                                type="text" 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} 
                                required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Naziv</Form.Label>
                                <Form.Control 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Opis</Form.Label>
                                <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ozbiljnost (Severity)</Form.Label>
                                <Form.Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                                <option value="TRIVIAL_SEVERITY">Trivial</option>
                                <option value="MINOR_SEVERITY">Minor</option>
                                <option value="MODERATE_SEVERITY">Moderate</option>
                                <option value="MAJOR_SEVERITY">Major</option>
                                <option value="CRITICAL_SEVERITY">Critical</option>
                                </Form.Select>
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
                <Col xs={12} md={12} lg={12} xl={12}>
                    <Card className="shadow-sm w-100">
                        <Card.Body>
                            <h3 className="text-center mb-4">Statistika Defekata</h3>
                            {/**Defekat grafikon za severity/ozbiljnost */}
                            <DefectChart 
                                title="Defekti po ozbiljnosti" 
                                data={severity} 
                                xKey="severity" 
                                yKey="count" 
                                type="bar" 
                                />
                            {/**Defekat grafikon za status */}
                            <DefectChart 
                                title="Defekti po statusu"
                                data={status}
                                xKey="status"
                                yKey="count"
                                type="pie"
                            />    
                            {/**Defekat grafikon za mesecnu statistiku */}
                            <DefectChart 
                                title="Defekti po mesecima" 
                                data={monthlyData.map(d => ({
                                    label: `${d.month}.${d.year}`,
                                    count: d.count
                                }))} 
                                xKey="label" 
                                yKey="count" 
                                type="line" 
                            />
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

export default AddDefect;
