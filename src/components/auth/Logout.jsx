import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const Logout = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.handleLogout();
        navigate("/", { state: { message: "You have been logged out!" } });
    };

    return (
        <>
            <li>
                <Link className="dropdown-item" to="/profile">
                    Profile
                </Link>
            </li>
            <li>
                <hr className="dropdown-divider" />
            </li>
            <li>
                <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                </button>
            </li>
        </>
    );
};

export default Logout;