import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { findAll, deleteDefect, confirmDefect, cancelDefect, findByDescriptionContainingIgnoreCase, trackDefect } from "../utils/defectApi";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ReportsModal from "./ReportsModal";
import TrackModal from "./TrackModal";

const DefectList = () => {
    
    const [defect, setDefect] = useState([]);
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
        catch(error){
            alert("Greska pri generisanju izvestaja: " + error.message);
        }
    };

    //dugme za brisanje podatka iz tabele inspections
    // Delete dugme
    const handleDeleteItem = async (id) => {
        if (!window.confirm("Da li ste sigurni da želite da obrišete?")) return;
        try {
            await deleteDefect(id); // poziv iz API-ja
            const updatedInspections = defect.inspections.filter((item) => item.id !== id);
            setDefect({ ...defect, inspections: updatedInspections });
        } 
        catch (error) {
            setErrorMessage(error.message);
        }
    };


    return(
        <Container fluid>
            {/*Top menu-bar */}
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    <Nav.Link href="#">Defect</Nav.Link>
                    <Nav.Link href="#">Edit</Nav.Link>
                    <Nav.Link href="#">Goto</Nav.Link>
                    <Nav.Link href="#">System</Nav.Link>
                    <Nav.Link href="#">Help</Nav.Link>
                </Nav>
            </Navbar>
            {/*Toolbar (red ispod – Execute, Track, Cancel, Reports, Search bar...) */}
            <Row className="align-items-center bg-light border-bottom p-2">
                <Col>
                    <ButtonGroup>
                        <Button variant="primary" onClick={handleExecute}>Execute</Button>
                        <Button variant="secondary" onClick={() => handleTrack(defect.id)}>Track Defect</Button>
                        <TrackModal
                            show={showTrackModal}
                            onHide={() => setShowTrackModal(false)}
                            defect={trackedDefect}
                            />
                        <Button variant="warning" onClick={handleCancel}>Cancel</Button>
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
                    <h4>G-Soft: Defect List</h4>
                </Col>
            </Row>
            {/* Toolbar */}
            <Row className="mb-3 bg-primary text-white p-2">
                <Col>
                    <Button variant="light" onClick={handleExecute}>Execute</Button>
                    <Button variant="light" onClick={() => handleTrack(defect.id)}>Track Defect</Button>
                    <TrackModal
                        show={showTrackModal}
                        onHide={() => setShowTrackModal(false)}
                        defect={trackedDefect}
                        />
                    <Button variant="light" onClick={handleCancel}>Cancel</Button>
                    <Button variant="light" onClick={handleReports}>Reports</Button>
                    <ReportsModal
                        show={showReports}
                        onHide={() => setShowReports(false)}
                        description={defect?.description}
                        />
                    <Button variant="light">Trailer Management</Button>
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
                                <Col>Quantity</Col>
                                <Col>Confirmed</Col>
                                <Col>Status</Col>
                                <Col xs="auto">Actions</Col>
                            </Row>

                            {getPaginatedInspections().map((ins) => (
                            <Row key={ins.id} className="border-bottom align-items-center p-2">
                                <Col>{ins.id}</Col>
                                <Col>{ins.inspection?.id}</Col>
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

export default DefectList;