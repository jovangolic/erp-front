import { useState, useEffect } from "react";
import { logout } from "../utils/AppFunction";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import { createDriver, updateDriver,findAllDrivers,deleteDriver,generalSearch,confirmDriver,cancelDriver } from "../utils/driverApi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DriverDropdown from "./DriverDropdown";


const DriverPage = () => {};

export default DriverPage;