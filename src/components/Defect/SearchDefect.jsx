import React, { useEffect, useState } from "react";
import { Container,Form, Button, Alert, Row, Col, Navbar, Nav, ButtonGroup, Card, Table } from "react-bootstrap";
import { logout } from "../utils/AppFunction";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import { useNavigate, useParams } from "react-router-dom";
import { cancelDefect, confirmDefect, findAll, findByDescriptionContainingIgnoreCase, trackDefect } from "../utils/defectApi";
import DefectDropdown from "./DefectDropdown";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import ReportsModal from "./ReportsModal";
import TrackModal from "./TrackModal";
import GeneralSearchDefect from "./GeneralSearchDefect";

const SearchDefect =() => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [defect, setDefect] = useState("");
    /*const [defect, setDefect] = useState({
        code: "",
        name: "",
        description: "",
        severity: "TRIVIAL_SEVERITY",
        status: "NEW",
        confirmed: false,
        inspections: []
    });*/
    const [results, setResults] = useState([]);
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
    const [severity, setSeverity] = useState("NEW");
    const [status, setStatus] = useState("NEW");
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    
    useEffect(() => {
        const fetchAllDefect = async () => {
            try {
                const response = await findAll();
                setDefect(response[0] || { inspections: [] });
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchAllDefect();
    }, []);
    
    //funkcija za paginiranu listu:
    const paginatedResults = results.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleExecute = async () => {
        if (!defect || !defect.code) return alert("Nema defekta za izvrsenje!");
        if (!defect.inspections || defect.inspections.length === 0) return alert("Defekt nema inspekcija!");
    
        const updatedInspections = defect.inspections.map(ins => ({ ...ins, confirmed: true }));
        setDefect({ ...defect, inspections: updatedInspections });
        try {
            await confirmDefect(defect.id);
            alert(`Defekt ${defect.code} je potvrdjen!`);
        } 
        catch (error) {
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

    const handleDeleteItem = (id) => {
        setResults((prev) => prev.filter((d) => d.id !== id));
        alert(`Defekt ${id} obrisan iz liste (lokalno).`);
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

    const handleGeneralSearch = async () => {
        try {
            // Validacija unosa
            const idVal = searchId ? parseInt(searchId) : null;
            const fromVal = rangeStart ? parseInt(rangeStart) : null;
            const toVal = rangeEnd ? parseInt(rangeEnd) : null;
            if ((fromVal != null && toVal != null) && fromVal > toVal) {
                throw new Error("Pocetak opsega id-ija ne sme biti veci od kraja id-ja");
            }
            const data = await generalSearch({
            id: idVal,
            idFrom: fromVal,
            idTo: toVal,
            code: searchCode || null,
            name: searchName || null,
            description: searchDescription || null,
            severity: filterSeverity !== "ALL" ? filterSeverity : null,
            status: filterStatus !== "ALL" ? filterStatus : null,
            confirmed: filterConfirmed // true/false/null
            });
            if (!data || !Array.isArray(data)) {
                throw new Error("Nije vracen validan rezultat pretrage");
            }
            setDefects(data);
            if (data.length > 0) setDefect(data[0]); // default: prvi defekt
            setErrorMessage("");
            } 
            catch (error) {
            setErrorMessage(error.message);
            setDefects([]);
        }
    };  

    const handleExit = async () => {
        try {
            await logout();
            navigate("/login");
        }
        catch {
            alert("Greska pri odjavi");
        }
    };

    return(
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
            <Row
                className="align-items-center bg-light border-bottom p-2 fixed-top"
                style={{ top: "56px", zIndex: 1000 }}
            >
                <Col>
                <ButtonGroup>
                    <Button variant="primary" onClick={handleExecute} className="me-2">
                    Execute
                    </Button>
                    <Button
                    variant="secondary"
                    onClick={() =>
                        results[0] && handleTrack(results[0].id)
                    }
                    className="me-2"
                    >
                    Track Defect
                    </Button>
                    <TrackModal
                    show={showTrackModal}
                    onHide={() => setShowTrackModal(false)}
                    defect={trackedDefect}
                    />
                    <Button
                    variant="warning"
                    onClick={() => results[0] && handleCancel(results[0].id)}
                    className="me-2"
                    >
                    Cancel
                    </Button>
                    <Button
                    variant="info"
                    onClick={() => results[0] && handleReports(results[0])}
                    >
                    Reports
                    </Button>
                    <ReportsModal
                    show={showReports}
                    onHide={() => setShowReports(false)}
                    description={results[0]?.description}
                    />
                </ButtonGroup>
                </Col>
                <Col xs="auto">
                <Form.Control type="text" placeholder="Search..." />
                </Col>
            </Row>

            {/* --- Page title --- */}
            <Row className="p-3 bg-white border-bottom" style={{ marginTop: "100px" }}>
                <Col>
                <h4>G-Soft: Defect List</h4>
                </Col>
            </Row>

            {/* --- Main Content: Search form + Results --- */}
            <Row className="p-4">
                {/* Left: search form */}
                <Col xs={12} md={4}>
                <Card className="shadow-sm w-100 mb-4">
                    <Card.Body>
                    <h5 className="text-center mb-4">Traži Defekat</h5>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Form>
                        <Form.Group className="mb-3">
                        <Form.Label>Šifra</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Naziv</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Opis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Ozbiljnost</Form.Label>
                        <Form.Select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                        >
                            <option value="TRIVIAL_SEVERITY">Trivial</option>
                            <option value="MINOR_SEVERITY">Minor</option>
                            <option value="MODERATE_SEVERITY">Moderate</option>
                            <option value="MAJOR_SEVERITY">Major</option>
                            <option value="CRITICAL_SEVERITY">Critical</option>
                        </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="NEW">New</option>
                            <option value="ACTIVE">Active</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CLOSED">Closed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                        <Button onClick={handleGeneralSearch} variant="primary">
                            Pretraži
                        </Button>
                        </div>
                    </Form>
                    </Card.Body>
                </Card>
                </Col>

                {/* Right: results table */}
                <Col xs={12} md={8}>
                <Card className="shadow-sm w-100 mb-4">
                    <Card.Body>
                    <h5 className="text-center mb-4">Rezultati Pretrage</h5>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Šifra</th>
                            <th>Naziv</th>
                            <th>Opis</th>
                            <th>Ozbiljnost</th>
                            <th>Status</th>
                            <th>Potvrđen</th>
                            <th>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedResults.length > 0 ? (
                            paginatedResults.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.severity}</td>
                                <td>{item.status}</td>
                                <td>
                                {item.confirmed ? (
                                    <Badge bg="success">✔</Badge>
                                ) : (
                                    <Badge bg="warning">✘</Badge>
                                )}
                                </td>
                                <td>
                                <ButtonGroup size="sm">
                                    <Button
                                    variant="primary"
                                    onClick={() => handleTrack(item.id)}
                                    >
                                    View
                                    </Button>
                                    <Button
                                    variant="danger"
                                    onClick={() => handleDeleteItem(item.id)}
                                    >
                                    Delete
                                    </Button>
                                </ButtonGroup>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="8" className="text-center text-muted">
                                Nema rezultata pretrage.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                    <Button
                        variant="secondary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} / {Math.ceil(results.length / rowsPerPage)}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={currentPage * rowsPerPage >= results.length}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                    </Card.Footer>
                </Card>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">© ERP G-Soft System 2025</Col>
            </Row>
        </Container>
    );
};

export default SearchDefect;