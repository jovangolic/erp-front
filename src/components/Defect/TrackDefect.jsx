import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findOne, findAll, deleteDefect,confirmDefect,cancelDefect,trackDefect,findByDescriptionContainingIgnoreCase, getReports, saveDefects } from "../utils/defectApi";
import { Container, Table, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
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
import { FaCheck, FaTimes, FaTrash, FaChartBar, FaSearch } from "react-icons/fa";

const TrackDefect =() => {

    const [defect, setDefect] = useState("");
    // Lista defekata (master)
    const [defects, setDefects] = useState([]);
    // Selektovani defekt (detail)
    const [selectedDefect, setSelectedDefect] = useState(null);
    // UI state
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showReports, setShowReports] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDefect, setTrackedDefect] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDefects = async () => {
        setLoading(true);
        try {
            const response = await findAll();
            setDefects(response || []);
        } 
        catch (error) {
            setErrorMessage(error.message || "Greska pri ucitavanju defekata.");
        } 
        finally {
            setLoading(false);
        }
        };
        fetchDefects();
    }, []);

    const handleExecute = async () => {
        if (!defect || !defect.code) return alert("Nema defekta za izvrsenje!");
        if (!defect.inspections || defect.inspections.length === 0) return alert("Defekt nema inspekcija!");
    
        const updatedInspections = defect.inspections.map(ins => ({ ...ins, confirmed: true }));
        setDefect({ ...defect, inspections: updatedInspections });
        try {
            await confirmDefect(defect.id);
            alert(`Defekt ${defect.code} je potvrdjen!`);
        } catch (error) {
            alert("Greska pri potvrdi: " + error.message);
        }
    };
    
    const handleCancel = async () => {
        if (!defect || !defect.code) return alert("Nema defekta za izvrsenje!");
        if (!defect.inspections || defect.inspections.length === 0) return alert("Defekt nema inspekcija!");
    
        const updatedInspections = defect.inspections.map(ins => ({ ...ins, confirmed: false }));
        try {
            await cancelDefect(defect.id);
            setDefect({ ...defect, status: "CANCELLED", confirmed: false, inspections: updatedInspections });
            alert(`Defekt ${defect.code} je otkazan!`);
        } catch (error) {
            alert("Greska pri otkazivanju: " + error.message);
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
    
    const handleReports = async () => {
        if (!defect || !defect.description) return alert("Defekt nema opis za izvestaj!");
        try {
            const relatedDefects = await findByDescriptionContainingIgnoreCase(defect.description);
            if (!relatedDefects.length) return alert("Nema pronadjenih defekata za dati opis.");
                setShowReports(true);
        } catch (error) {
            alert("Greska pri generisanju izvestaja: " + error.message);
        }
    };

    const handleConfirm = async () => {
        try {
            await confirmDefect(selectedDefect.id);
            setSuccessMessage("Defekt potvrđen.");
        } catch (err) {
            setErrorMessage("Greska pri potvrdjivanju defekta.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDefect(selectedDefect.id);
            setDefects(defects.filter(d => d.id !== selectedDefect.id));
            setSelectedDefect(null);
            setSuccessMessage("Defekt obrisan.");
        } catch (err) {
            setErrorMessage("Greska pri brisanju defekta.");
        }
    };
    
    const handleExit = async () => {
        try {
            await logout();
            navigate("/login");
        } catch {
            alert("Greska pri odjavi");
        }
    };

    return(
        <Container fluid className="mt-4">
            {/* Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom fixed-top">
                    <Nav className="ms-2">
                        <DefectDropdown handleExit={handleExit} />
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
            {/*Page title (G-Soft: Defect List) */}
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h4>G-Soft: Prati Defekat</h4>
                </Col>
            </Row>
            <Row>
                {/* Master view (tabela sa listom) */}
                <Col md={8}>
                    <h4>Lista Defekata</h4>
                    {loading && <p>Ucitavanje...</p>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sifra</th>
                            <th>Naziv</th>
                            <th>Ozbiljnost</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {defects.map((d) => (
                            <tr
                            key={d.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedDefect(d)}
                            >
                            <td>{d.id}</td>
                            <td>{d.code}</td>
                            <td>{d.name}</td>
                            <td>{d.severity}</td>
                            <td>{d.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>

                {/* Detail view (detaljan prikaz + akcije) */}
                <Col md={4}>
                {selectedDefect ? (
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5>Detalji Defekta</h5>
                            <p><b>ID:</b> {selectedDefect.id}</p>
                            <p><b>Sifra:</b> {selectedDefect.code}</p>
                            <p><b>Naziv:</b> {selectedDefect.name}</p>
                            <p><b>Opis:</b> {selectedDefect.description}</p>
                            <p><b>Ozbiljnost:</b> {selectedDefect.severity}</p>
                            <p><b>Status:</b> {selectedDefect.status}</p>
                            <p><b>Potvrđen:</b> {selectedDefect.confirmed ? "Da" : "Ne"}</p>

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

export default TrackDefect;