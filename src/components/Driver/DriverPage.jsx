import { useState, useEffect } from "react";
import { logout } from "../utils/AppFunction";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import { createDriver, updateDriver,findAllDrivers,deleteDriver,generalSearch,confirmDriver,cancelDriver } from "../utils/driverApi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DriverDropdown from "./DriverDropdown";


const DriverPage = () => {

    const [driver, setDriver] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    //Za paginaciju
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    //Za greske i poruke
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async() => {
            try{
                const data = await findAllDrivers();
                setDrivers(data);
                if(data.length > o) setDriver(data[0]);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchAll()
    },[]);

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
            <Navbar bg="light" variant="light" className="border-bottom">
                 <Nav>
                    {/* Driver dropdown */}
                    <DriverDropdown handleExit={handleExit} />
                    {/* Ostali glavni meniji (bez dropdowna za sada) */}
                </Nav>
            </Navbar>
            {/* Ovde se prikazuje sadrzaj child ruta */}
            <Outlet />
        </Container>
    );
};

export default DriverPage;