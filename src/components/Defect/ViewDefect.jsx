import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { findOne,findAll, deleteDefect, confirmDefect, cancelDefect, findByDescriptionContainingIgnoreCase, trackDefect } from "../utils/defectApi";
import { Container, Row, Col, Card, Button, Navbar, Nav, ButtonGroup,Form } from "react-bootstrap";
import ReportsModal from "./ReportsModal";
import TrackModal from "./TrackModal";
import DefectDropdown from "./DefectDropdown";
import DefectSearchForm from "./DefectSearchForm";
import GeneralSearchDefect from "./GeneralSearchDefect";
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

const ViewDefect = () => {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("details");
    const [defects, setDefects] = useState([]);
    const [defect, setDefect] = useState({ inspections: [] });
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
    const [trackedDefect, setTrackedDefect] = useState(null); 
    //za pretragu defekta
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams, setSearchParams] = useState({});  
    
    const filteredInspections = defect?.inspections.filter(ins => {
        if (filterStatus === "ALL") return true;
        if (filterStatus === "ACTIVE") return ins.status !== "CANCELLED";
        if (filterStatus === "CANCELLED") return ins.status === "CANCELLED";
        return true;
    }) || [];


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
        const getPaginatedInspections = () => {
            let paginated = defect.inspections || [];
            // Ako je range filter postavljen
            if (rangeStart && rangeEnd) {
                const start = parseInt(rangeStart, 10) - 1;
                const end = parseInt(rangeEnd, 10);
                paginated = paginated.slice(start, end);
            } 
            else {
                // Standardna paginacija po 10 redova
                const startIndex = (currentPage - 1) * rowsPerPage;
                paginated = paginated.slice(startIndex, startIndex + rowsPerPage);
            }
            return paginated;
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
            catch
            (error){
                alert("Greska pri generisanju izvestaja: " + error.message);
        }
    };
    
        //dugme za brisanje podatka iz tabele inspections
        // Delete dugme
        const handleDeleteItem = async (id) => {
            if (!window.confirm("Da li ste sigurni da zelite da obrisete?")) return;
            try {
                await deleteDefect(id); // poziv iz API-ja
                const updatedInspections = defect.inspections.filter((item) => item.id !== id);
                setDefect({ ...defect, inspections: updatedInspections });
            } 
            catch (error) {
                setErrorMessage(error.message);
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

    const handleSearch = async () => {
        try {
            if (!searchDescription || typeof searchDescription !== "string") {
                throw new Error("Opis za pretragu mora biti unet i validan");
            }
            const data = await searchDefects({
                severity: filterSeverity,
                descPart: searchDescription,
                status: filterStatus,
                confirmed: filterConfirmed
            });        
        
                if (!data || !Array.isArray(data)) {
                    throw new Error("Nije vracen validan rezultat pretrage");
                }
                setDefects(data);
                if (data.length > 0) setDefect(data[0]);
                setErrorMessage("");
            }
            catch (error) {
                setErrorMessage(error.message);
                setDefects([]);
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

    return(
        <Container fluid>
            {/*Top menu-bar */}
            <Row className="bg-light fixed-top">
                <Navbar bg="light" variant="light" className="border-bottom w-100">
                    <Nav className="ms-2">
                        <DefectDropdown handleExit={handleExit} />
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
                    <h4>G-Soft: View Defects</h4>
                </Col>
            </Row>
            {/* Toolbar */}
            <Row className="mb-3 bg-primary text-white p-2">
                <Col>
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
                    <Button variant="light" className="me-2">Trailer Management</Button>
                    <Button variant="light">Trail Defect</Button>
                </Col>
            </Row>
            {/* General Search Form */}
            <Row className="mb-3">
                <Col>
                    <DefectSearchForm
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            {/* Tabela sa rezultatima generalne pretrage */}
            <Row className="mb-4">
                <Col>
                    <GeneralSearchDefect
                        results={searchResults}
                        onSelectDefect={(selected) => setDefect(selected)}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </Col>
            </Row>

            {/* Tabela inspekcija */}
            <Row className="mt-3">
                <Col>
                    <Card>
                        <Card.Header>
                            <Row className="align-items-center">
                                <Col><h5>Inspections for defect: {defect.code}</h5></Col>
                                <Col xs="auto">
                                    <Button
                                        variant={filterStatus === "ALL" ? "primary" : "light"}
                                        className="me-1"
                                        onClick={() => setFilterStatus("ALL")}
                                        >
                                        All
                                    </Button>
                                    <Button
                                        variant={filterStatus === "ACTIVE" ? "primary" : "light"}
                                        className="me-1"
                                        onClick={() => setFilterStatus("ACTIVE")}
                                        >
                                        Active
                                    </Button>
                                    <Button
                                        variant={filterStatus === "CANCELLED" ? "primary" : "light"}
                                        onClick={() => setFilterStatus("CANCELLED")}
                                    >
                                        Cancelled
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-2 align-items-center">
                                <Col xs="auto">
                                    <Form.Control
                                    type="number"
                                    placeholder="From"
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Control
                                    type="number"
                                    placeholder="To"
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="secondary" onClick={() => setCurrentPage(1)}>
                                    Apply
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>

                        <Card.Body className="p-0">
                            <Row className="bg-dark text-white fw-bold p-2">
                                <Col>ID</Col>
                                <Col>Inspection ID</Col>
                                <Col>Defect ID</Col>
                                <Col>Quantity</Col>
                                <Col>Confirmed</Col>
                                <Col>Status</Col>
                                <Col>Date-Time</Col>
                                <Col xs="auto">Actions</Col>
                            </Row>

                            {getPaginatedInspections().map((ins) => (
                            <Row key={ins.id} className="border-bottom align-items-center p-2">
                                <Col>{ins.id}</Col>
                                <Col>{ins.inspection?.id}</Col>
                                <Col>{ins.defect?.id}</Col>
                                <Col>{ins.quantityAffected}</Col>
                                <Col>
                                {ins.confirmed ? (
                                    <Badge bg="success">Yes</Badge>
                                ) : (
                                    <Badge bg="warning">No</Badge>
                                )}
                                </Col>
                                <Col>
                                {ins.status === "NEW" && <Badge bg="info">NEW</Badge>}
                                {ins.status === "CONFIRMED" && <Badge bg="success">CONFIRMED</Badge>}
                                {ins.status === "CLOSED" && <Badge bg="secondary">CLOSED</Badge>}
                                {ins.status === "CANCELLED" && <Badge bg="danger">CANCELLED</Badge>}
                                </Col>
                                <Col xs="auto">
                                <ButtonGroup size="sm">
                                    <Button variant="primary">View</Button>
                                    <Button variant="danger" onClick={() => handleDeleteItem(ins.id)}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                                </Col>
                            </Row>
                            ))}
                        </Card.Body>

                        <Card.Footer>
                            <Row className="align-items-center">
                                <Col xs="auto">
                                    <Button
                                    variant="secondary"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="me-2"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                    variant="secondary"
                                    disabled={currentPage * rowsPerPage >= (defect.inspections?.length || 0)}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </Button>
                                </Col>
                                <Col className="text-center">
                                    Page {currentPage} / {Math.ceil(filteredInspections.length / rowsPerPage)}
                                </Col>
                            </Row>
                        </Card.Footer>
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

export default ViewDefect;