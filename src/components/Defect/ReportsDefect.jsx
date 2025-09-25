import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findOne, deleteDefect,confirmDefect,cancelDefect,trackDefect,findByDescriptionContainingIgnoreCase, getReports, saveDefects } from "../utils/defectApi";
import { Container, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
import DefectDropdown from "./DefectDropdown";
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

const ReportsDefect = () => {
    
    const { id } = useParams();
    const [reportId, setReportId] = useState("");
    const navigate = useNavigate();
    const [defect, setDefect] = useState({ inspections: [] });
    const [errorMessage, setErrorMessage] = useState("");
    const [showReports, setShowReports] = useState(false);
    //za pracenje defekata
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDefect, setTrackedDefect] = useState(null); 
    //za pretragu defekta
    const [description, setDescription] = useState(""); 
    const [successMessage, setSuccessMessage] = useState("");
    const [report, setReport] = useState({
        description: ""
    });

    useEffect(() => {
        if (!id) return; // zato sto nema ID-ija
        const fetchOneReport = async() => {
            try{
                const response = await getReports(id);
                setReport(response);
                setDescription(response.description || "");
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchOneReport();
    },[id]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportId) return setError("Unesi ID izvestaja.");

        try {
            const data = await getReports(reportId);
            if (!data) {
                setReport(null);
                setErrorMessage("Izvestaj nije pronadjen.");
            } 
        else {
            setReport(data);
            setErrorMessage("");
        }
        } 
        catch (err) {
            setErrorMessage("Greska prilikom pretrage izvestaja.");
            setReport(null);
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

    return(
        <Container fluid >
            {/*Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom w-100">
                    <Nav className="ms-2">
                        <DefectDropdown 
                            handleExit={handleExit} 
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
                    <h4>G-Soft: Izvestaji Defekta</h4>
                </Col>
            </Row>
            {/* Toolbar */}
            <Row className="align-items-center bg-light border-bottom p-2 fixed-top" style={{ top: '56px', zIndex: 1000 }}>
                <Col>
                    <ButtonGroup>
                        <Button variant="primary" onClick={handleExecute} className="me-2">Execute</Button>
                        <Button variant="secondary" onClick={() => handleTrack(defect.id)} className="me-2">Track Defect</Button>
                        <TrackModal show={showTrackModal} onHide={() => setShowTrackModal(false)} defect={trackedDefect} />
                        <Button variant="warning" onClick={handleCancel} className="me-2">Cancel</Button>
                        <Button variant="info" onClick={handleReports}>Reports</Button>
                        <ReportsModal show={showReports} onHide={() => setShowReports(false)} description={defect.description} />
                    </ButtonGroup>
                </Col>
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>
            {/**Reports form */}
            <Row className="d-flex justify-content-center my-5">
                <Col xs={12} md={12} lg={12}>   
                    <Card className="shadow-sm w-100"> 
                    <Card.Body className="p-6">      
                        <h3 className="text-center mb-4">Pretraga Izvestaja</h3>

                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                        {/* Forma za unos ID-a */}
                        <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Izveštaja</Form.Label>
                            <Form.Control
                            type="number"
                            placeholder="Unesi ID izveštaja"
                            value={reportId}
                            onChange={(e) => setReportId(e.target.value)}
                                          
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" variant="primary" >
                            Pronadji izvestaj
                            </Button>
                        </div>
                        </Form>

                        {/* Prikaz rezultata */}
                        {report && (
                        <div className="mt-5">
                            <h4>Detalji izvestaja</h4>

                            <Form.Group className="mb-3">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" value={report.id} readOnly  />
                            </Form.Group>

                            <Form.Group className="mb-3">
                            <Form.Label>Opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}    
                                value={report.description}
                                readOnly
                                
                            />
                            </Form.Group>

                            {report.status && (
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Control type="text" value={report.status} readOnly  />
                            </Form.Group>
                            )}
                            {report.createdAt && (
                            <Form.Group className="mb-3">
                                <Form.Label>Kreiran</Form.Label>
                                <Form.Control type="text" value={report.createdAt} readOnly  />
                            </Form.Group>
                            )}
                        </div>
                        )}
                    </Card.Body>
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

export default ReportsDefect;