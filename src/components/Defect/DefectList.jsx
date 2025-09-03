import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { findAll, deleteDefect } from "../utils/defectApi";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const DefectList = () => {
    
    const [defect, setDefect] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    //state za paginaciju i filter
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [rangeStart, setRangeStart] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");

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

    const handleExecute =() => {
        if(defect.length === 0){
            alert("Nema defekata za izvršenje!");
            return;
        }
    };

    //dugme za brisanje podatka iz tabele inspections
    // Delete dugme
    const handleDeleteItem = async (id) => {
        if (!window.confirm("Da li ste sigurni da želite da obrišete?")) return;
        try {
            await deleteDefect(id); // poziv API-ja
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
                        <Button variant="primary">Execute</Button>
                        <Button variant="secondary">Track</Button>
                        <Button variant="warning">Cancel</Button>
                        <Button variant="info">Reports</Button>
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
                    <Button variant="light">Track Defect</Button>
                    <Button variant="light">Cancel</Button>
                    <Button variant="light">Reports</Button>
                    <Button variant="light">Trailer Management</Button>
                    <Button variant="light">Trail Defect</Button>
                </Col>
            </Row>
            {/* Tabs*/}
            

            {/* Tabela inspekcija */}
            <Row className="mt-3">
                <Col>
                <h5>Inspections for defect: {defect.code}</h5>

                    {/* Range filter */}
                    <Row className="mb-2 align-items-center">
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

                    {/* Tabela */}
                    <Row className="bg-dark text-white p-2 fw-bold">
                        <Col>ID</Col>
                        <Col>Inspection ID</Col>
                        <Col>Quantity Affected</Col>
                        <Col xs="auto">Actions</Col>
                    </Row>

                    {getPaginatedInspections().map((ins) => (
                        <Row key={ins.id} className="border-bottom align-items-center p-2">
                            <Col>{ins.id}</Col>
                            <Col>{ins.inspection?.id}</Col>
                            <Col>{ins.quantityAffected}</Col>
                            <Col xs="auto">
                                <ButtonGroup size="sm">
                                <Button variant="primary">View</Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteItem(ins.id)}
                                >
                                    Delete
                                </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    ))}

                    {/* Pagination */}
                    <Row className="mt-2">
                        <Col xs="auto">
                            <Button
                                variant="secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="secondary"
                                disabled={
                                currentPage * rowsPerPage >= (defect.inspections?.length || 0)
                                }
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </Col>
                    </Row>
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