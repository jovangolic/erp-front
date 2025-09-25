import React, { useState } from "react";
import { Container, Form, Button, Alert,Row, Col, Navbar, Nav, ButtonGroup, Card } from "react-bootstrap";
import { cancelDefect, confirmDefect, generalSearch, trackDefect,findByDescriptionContainingIgnoreCase } from "../utils/defectApi";
import { logout } from "../utils/AppFunction";
import DefectDropdown from "./DefectDropdown";
import FileOptDropdownPage from "../top-menu-bar/File/FileOptDropdownPage";
import EditOptDropdownPage from "../top-menu-bar/Edit/EditOptDropdownPage";
import AdminDropdownPage from "../top-menu-bar/Admin-page/AdminDropdownPage";
import GoToDropdownPage from "../top-menu-bar/GoTo/GoToDropdownPage";
import SystemStateDropdownPage from "../top-menu-bar/System/SystemState/SystemStateDropdownPage";
import SystemSettingDropdownPage from "../top-menu-bar/System/SystemSetting/SystemSettingDropdownPage";
import SecuritySettingDropdownPage from "../top-menu-bar/System/SecuritySetting/SecuritySettingDropdownPage";
import LanguageDropdownPage from "../top-menu-bar/System/Language/LanguageDropdownPage";
import LocalizedOptionDropdownPage from "../top-menu-bar/System/LocalizedOption/LocalizedOptionDropdown";
import PermissionDropdownPage from "../top-menu-bar/System/Permission/PermissionDropdownPage";
import OptionDropdownPage from "../top-menu-bar/Option/OptionDropdownPage";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";
import TrackModal from "./TrackModal";
import ReportsModal from "./ReportsModal";

const GeneralSearchDefectPage = () => {
    const [id, setId] = useState("");
    const [idFrom, setIdFrom] = useState("");
    const [idTo, setIdTo] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("");
    const [status, setStatus] = useState("");
    const [confirmed, setConfirmed] = useState("");
    //filteri za datum
    const [created, setCreated] = useState("");
    const [createdAfter, setCreatedAfter] = useState("");
    const [createdBefore, setCreatedBefore] = useState("");

    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const [defect, setDefect] = useState({ inspections: [] });
    const [successMessage, setSuccessMessage] = useState("");
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackedDefect, setTrackedDefect] = useState(null); 
    const [showReports, setShowReports] = useState(false);

    const handleSearch = async () => {
      try {
        const formatDateTime = (dateStr, isEndOfDay = false) => {
          if (!dateStr) return null;
          return isEndOfDay
            ? `${dateStr}T23:59:59`
            : `${dateStr}T00:00:00`;
        };

        const response = await generalSearch({
          id,
          idFrom,
          idTo,
          code,
          name,
          description,
          severity,
          status,
          confirmed: confirmed === "" ? null : confirmed === "true",
          created: created ? `${created}T00:00:00` : null,
          createdAfter: formatDateTime(createdAfter),
          createdBefore: formatDateTime(createdBefore, true),
        });

        setResults(response);
        setCurrentIndex(0);
        setErrorMessage("");
      } catch (error) {
        setResults([]);
        setErrorMessage(error.message);
      }
    };

    const currentDefect = results[currentIndex] || null;

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
            }
            catch (error) {
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
      <Container fluid className="p-3">
        {/*Top menu-bar */}
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
                    <h4>G-Soft: Generalna Pretraga </h4>
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
        {/* Toolbar za osnovne filtere */}
        <Row className="mb-3 bg-light border p-3 rounded">
          <Col xs={2}>
            <Form.Control
              type="number"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="number"
              placeholder="ID From"
              value={idFrom}
              onChange={(e) => setIdFrom(e.target.value)}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="number"
              placeholder="ID To"
              value={idTo}
              onChange={(e) => setIdTo(e.target.value)}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </Row>

        {/* Filteri za status, severity, confirmed i datum */}
        <Row className="mb-3 bg-light border p-3 rounded">
          <Col xs={3}>
            <Form.Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="">All Severities</option>
              <option value="TRIVIAL_SEVERITY">Trivial</option>
              <option value="MINOR_SEVERITY">Minor</option>
              <option value="MODERATE_SEVERITY">Moderate</option>
              <option value="MAJOR_SEVERITY">Major</option>
              <option value="CRITICAL_SEVERITY">Critical</option>
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="NEW">New</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Form.Select value={confirmed} onChange={(e) => setConfirmed(e.target.value)}>
              <option value="">All Confirmed</option>
              <option value="true">Confirmed</option>
              <option value="false">Not Confirmed</option>
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Button variant="primary" onClick={handleSearch} className="w-100">
              Search
            </Button>
          </Col>
        </Row>

        {/* Filteri za datum */}
        <Row className="mb-3 bg-light border p-3 rounded">
          <Col xs={4}>
            <Form.Control
              type="date"
              value={created}
              onChange={(e) => setCreated(e.target.value)}
              placeholder="Created Date"
            />
          </Col>
          <Col xs={4}>
            <Form.Control
              type="date"
              value={createdAfter}
              onChange={(e) => setCreatedAfter(e.target.value)}
              placeholder="Created After"
            />
          </Col>
          <Col xs={4}>
            <Form.Control
              type="date"
              value={createdBefore}
              onChange={(e) => setCreatedBefore(e.target.value)}
              placeholder="Created Before"
            />
          </Col>
        </Row>

        {/* Detaljan prikaz defekta */}
        {currentDefect && (
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Row>
                <Col><strong>ID:</strong> {currentDefect.id}</Col>
                <Col><strong>Code:</strong> {currentDefect.code}</Col>
                <Col><strong>Name:</strong> {currentDefect.name}</Col>
              </Row>
              <Row className="mt-2">
                <Col><strong>Description:</strong> {currentDefect.description}</Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <Badge bg="info">{currentDefect.severity}</Badge>
                </Col>
                <Col>
                  <Badge bg={
                    currentDefect.status === "CANCELLED" ? "danger" :
                    currentDefect.status === "CLOSED" ? "secondary" :
                    currentDefect.status === "CONFIRMED" ? "success" : "warning"
                  }>
                    {currentDefect.status}
                  </Badge>
                </Col>
                <Col>
                  {currentDefect.confirmed ? (
                    <Badge bg="success">Confirmed</Badge>
                  ) : (
                    <Badge bg="warning">Not Confirmed</Badge>
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col><strong>Created At:</strong> {new Date(currentDefect.createdAt).toLocaleString()}</Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Navigacija */}
        {results.length > 1 && (
          <Row className="mt-2">
            <Col xs="auto">
              <Button
                variant="secondary"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                Previous
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="secondary"
                disabled={currentIndex === results.length - 1}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next
              </Button>
            </Col>
            <Col className="align-self-center">
              <span>
                {currentIndex + 1} of {results.length}
              </span>
            </Col>
          </Row>
        )}
        {/* Footer */}
        <Row>
          <Col className="text-center">© ERP G-Soft System 2025</Col>
        </Row>
        {/* Error message */}
        {errorMessage && (
          <Row className="mt-3">
            <Col className="text-danger">{errorMessage}</Col>
          </Row>
        )}
      </Container>
    );
};

export default GeneralSearchDefectPage;
