import React from "react";
import { Link } from "react-router-dom";
import { FaThLarge, FaClipboard, FaBox, FaUsers } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className="sidebar bg-dark text-white" style={{ width: "250px", minHeight: "100vh" }}>
            <div className="p-3">
                <h3>Modules</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link className="text-white" to="/dashboard"><FaThLarge /> Dashboard</Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/inventory"><FaBox /> Inventory</Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/sales"><FaClipboard /> Sales</Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/users"><FaUsers /> Users</Link>
                    </li>
                    {/* Dodaj više sekcija po potrebi */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;