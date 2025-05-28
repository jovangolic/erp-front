import React, { useContext, useState,useEffect } from "react"
import { NavLink, Link } from "react-router-dom"
import { FaCalendarAlt } from 'react-icons/fa';
import Logout from "../auth/Logout";
import { useAuth } from "../auth/AuthProvider";
import { hasRole } from "../auth/checkRole";

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const { user } = useAuth();

    const handleAccountClick = () => {
        setShowAccount(!showAccount)
    }

    const handleInfoClick = () => {
        setShowInfo(!showInfo)
    };

    const isLoggedIn = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    // Proverava da li je korisnik admin ili super-admin
    const isAdminOrSuperAdmin = hasRole(user, ["ADMIN", "SUPER_ADMIN"]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">ERP-WMS</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {/* Dashboard link samo za admina ili super-admina */}
                        {isAdminOrSuperAdmin && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dashboard">
                                    <FaCalendarAlt className="me-2" />
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                        
                        {/* Link za Login/Logout */}
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <Logout /> {/* Logout komponenta */}
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Register</NavLink>
                                </li>
                            </>
                        )}

                        {/* Link za Admin sekciju, vidljiv samo za Admin i Super Admin */}
                        {isAdminOrSuperAdmin && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin-panel">Admin Panel</NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default NavBar;