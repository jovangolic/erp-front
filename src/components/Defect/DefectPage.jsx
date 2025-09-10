import { useState, useEffect } from "react";
import { findAll, searchDefects, createDefect, deleteDefect, confirmDefect, cancelDefect, generalSearch, updateDefect } from "../utils/defectApi";
import { logout } from "../utils/AppFunction";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DefectDropdown from "./DefectDropdown";
import HelpDropdownPage from "../top-menu-bar/Help/HelpDropdownPage";

const DefectPage = () => {

    //Za selektovani defekt i listu defekata
    const [defect, setDefect] = useState(null); // trenutno izabrani defekt
    const [defects, setDefects] = useState([]); // lista defekata
    //Za modale (Add/Edit/Track/Reports itd.)
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    //Za paginaciju
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    //Za pretragu / filtere
    const [searchId, setSearchId] = useState("");
    const [searchCode, setSearchCode] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchDescription, setSearchDescription] = useState("");
    const [filterSeverity, setFilterSeverity] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterConfirmed, setFilterConfirmed] = useState(null);
    const [rangeStart, setRangeStart] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");
    //Za greske i poruke
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllDefects = async () => {
            try {
                const data = await findAll();
                setDefects(data);
                if (data.length > 0) setDefect(data[0]); // po default-u prvi defekt
            }
            catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchAllDefects();
    }, []);

    //hendler funkcije - ili na srpskom majkumu j.... pomocne funkcije, Jovane, jebemu pisi cirilicom XD ;) :), Only jokes bloke, are allowed
    const handleAddDefect = async (payload) => {
        if (!payload?.code || !payload?.name || !payload?.description || !payload?.severity) {
            alert("Sva polja su obavezna!");
            return;
        }
        try {
            const created = await createDefect({ ...payload });
            setDefect(created);
            setShowEditModal(true);
        }
        catch (error) {
            console.error("Greska prilikom kreiranja defekta:", error.message);
            alert(error.message || "Nesto je poslo po zlu prilikom kreiranja defekta.");
        }
    };

    const handleEditDefect = async (id, updatedData) => {
        try {
            const updated = await updateDefect({ id, ...updatedData });
            setDefects((prev) =>
                prev.map((d) => (d.id === id ? updated : d))
            );
            setDefect(updated);
            setShowEditModal(true);
        }
        catch (error) {
            console.error("Greska prilikom azuriranja defekta:", error.message);
            alert(error.message || "Nesto je poslo po zlu prilikom azuriranja defekta.");
        }
    };

    const handleDeleteDefect = async (id) => {
        try {
            await deleteDefect(id);
            setDefects(defects.filter(d => d.id !== id));
            setSuccessMessage(`Defect ${id} deleted successfully`);
        }
        catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleTrackDefect = async (id) => {
        try {
            if (!id || isNaN(id)) throw new Error("Nevalidan ID defekta za pracenje");
            const data = await trackDefect(id);
            setDefect(data);
            setShowTrackModal(true);
            setErrorMessage("");
        }
        catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleReports = async () => {
        try {
            const data = await getReports({
                id: defect?.id || null,
                description: defect?.description || null
            });
            setDefects(data);
            if (data.length > 0) setDefect(data[0]);
            setShowReportsModal(true);
        }
        catch (error) {
            setErrorMessage(error.message);
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

    const handleExit = async () => {
        try {
            await logout();
            navigate("/login"); // redirect na login stranicu
        }
        catch (error) {
            alert("Greska pri odjavi");
        }
    };

    const handlePageChange = async (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Container fluid>
            {/* Toolbar sa dugmadima */}
            {/* Search form */}
            {/* Tabela defekata */}
            {/* Pagination */}
            {/* Modali */}
            {/* Error / Success */}
            {/* Top menu-bar */}
            <Navbar bg="light" variant="light" className="border-bottom">
                <Nav>
                    {/* Defect dropdown */}
                    <DefectDropdown handleExit={handleExit} />
                    {/* Ostali glavni meniji (bez dropdowna za sada) */}
                    <Nav.Link as={Link} to="/edit">Edit</Nav.Link>
                    <Nav.Link as={Link} to="/goto">Goto</Nav.Link>
                    <Nav.Link as={Link} to="/system">System</Nav.Link>
                    <HelpDropdownPage />
                </Nav>
            </Navbar>
            {/* Ovde se prikazuje sadrzaj child ruta */}
            <Outlet />
        </Container>
    );

};

export default DefectPage;