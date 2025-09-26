import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateDefect, findOne, confirmDefect, cancelDefect, trackDefect, findByDescriptionContainingIgnoreCase, countDefectsByYearAndMonth } from "../utils/defectApi";
import { Container, Form, Button, Alert, Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
import DefectDropdown from "./DefectDropdown";
import TrackModal from "./TrackModal";
import ReportsModal from "./ReportsModal";
import DefectChart from "./DefectChart";
import { logout } from "../utils/AppFunction";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";

const EditDefect = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    //const [defect, setDefect] = useState(null);
    const [defect, setDefect] = useState({
        code: "",
        name: "",
        description: "",
        severity: "TRIVIAL_SEVERITY",
        status: "NEW",
        confirmed: false,
        inspections: []
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDefect, setTrackedDefect] = useState(null);
    const [showReports, setShowReports] = useState(false);
    const [monthlyData, setMonthlyData] = useState([]);

    // Local input states
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("TRIVIAL_SEVERITY");
    const [status, setStatus] = useState("NEW");

    // Fetch defect
    useEffect(() => {
        if (!id) return; // zato sto nema ID-ija
        const fetchDefect = async () => {
            try {
                const response = await findOne(id);
                setDefect(response);
                setCode(response.code || "");
                setName(response.name || "");
                setDescription(response.description || "");
                setSeverity(response.severity || "NEW");
                setStatus(response.status || "NEW");
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchDefect();
    }, [id]);

    // Fetch monthly statistics
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await countDefectsByYearAndMonth();
                setMonthlyData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                setMonthlyData([]);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await updateDefect(id, code, name, description, severity, status, defect.confirmed);
            setSuccessMessage(`Defekt ${data.id} uspesno azuriran!`);
            setErrorMessage("");
            setDefect(data); // update local state
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

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

    const handleExit = async () => {
        try {
            await logout();
            navigate("/login");
        } catch {
            alert("Greska pri odjavi");
        }
    };

    if (!defect) return <div>Loading...</div>;

    // Derived chart data
    const severityData = useMemo(() => {
        if (!defect || !defect.inspections) return [];
        const counts = {
        TRIVIAL_SEVERITY: 0,
        MINOR_SEVERITY: 0,
        MODERATE_SEVERITY: 0,
        MAJOR_SEVERITY: 0,
        CRITICAL_SEVERITY: 0,
        };
        defect.inspections.forEach(ins => {
        counts[ins.severity] = (counts[ins.severity] || 0) + 1;
        });
        counts[defect.severity] = (counts[defect.severity] || 0) + 1;
        return Object.entries(counts).map(([key, value]) => ({ severity: key, count: value }));
    }, [defect]);

    const statusData = useMemo(() => {
        if (!defect || !defect.inspections) return [];
        const counts = {
        NEW: 0,
        ACTIVE: 0,
        CONFIRMED: 0,
        CLOSED: 0,
        CANCELLED: 0,
        };
        defect.inspections.forEach(ins => {
        counts[ins.status] = (counts[ins.status] || 0) + 1;
        });
        counts[defect.status] = (counts[defect.status] || 0) + 1;
        return Object.entries(counts).map(([key, value]) => ({ status: key, count: value }));
    }, [defect]);

    return (
        <Container fluid className="p-0">
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

            {/* Form */}
            <Row className="d-flex justify-content-center my-5">
                <Col xs={12} md={10} lg={8}>
                    <Card className="shadow-sm w-100">
                        <Card.Body>
                            <h3 className="text-center mb-4">Azuriraj Defekat</h3>
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sifra</Form.Label>
                                    <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Naziv</Form.Label>
                                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Opis</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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

                {/* Charts */}
                <Col xs={12} md={10} lg={8} className="mt-4">
                    <Card className="shadow-sm w-100">
                        <Card.Body>
                            <h3 className="text-center mb-4">Statistika Defekata</h3>
                            <DefectChart title="Defekti po ozbiljnosti" data={severityData} xKey="severity" yKey="count" type="bar" />
                            <DefectChart title="Defekti po statusu" data={statusData} xKey="status" yKey="count" type="pie" />
                            <DefectChart title="Defekti po mesecima" data={monthlyData.map(d => ({ label: `${d.month}.${d.year}`, count: d.count }))} xKey="label" yKey="count" type="line" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col className="text-center">© ERP G-Soft System 2025</Col>
            </Row>
        </Container>
    );
};

export default EditDefect;
