import React from "react";
import { Link } from "react-router-dom";
import { FaThLarge, FaUsers, FaBox, FaClipboard, FaCogs, FaWarehouse, FaFileAlt, FaQuestionCircle, FaTruck, FaTags } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className="sidebar bg-dark text-white" style={{ width: "250px", minHeight: "100vh" }}>
            <div className="p-3">
                <h3>ERP Modules</h3>
                <ul className="list-unstyled">

                    {/* Dashboard */}
                    <li>
                        <Link className="text-white" to="/dashboard">
                            <FaThLarge /> Dashboard
                        </Link>
                    </li>

                    {/* Users & Permissions */}
                    <li>
                        <Link className="text-white" to="/users">
                            <FaUsers /> Users
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/roles">
                            <FaUsers /> Roles
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/permissions">
                            <FaUsers /> Permissions
                        </Link>
                    </li>

                    {/* Sales */}
                    <li>
                        <Link className="text-white" to="/sales">
                            <FaClipboard /> Sales
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/invoices">
                            <FaClipboard /> Invoices
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/buyers">
                            <FaClipboard /> Buyers
                        </Link>
                    </li>

                    {/* Procurement */}
                    <li>
                        <Link className="text-white" to="/procurement">
                            <FaTruck /> Procurement
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/suppliers">
                            <FaTruck /> Vendors
                        </Link>
                    </li>

                    {/* Inventory */}
                    <li>
                        <Link className="text-white" to="/inventory">
                            <FaWarehouse /> Inventory
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/products">
                            <FaTags /> Products
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/raw-materials">
                            <FaTags /> Raw Materials
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/shelves">
                            <FaWarehouse /> Shelves
                        </Link>
                    </li>

                    {/* Reports */}
                    <li>
                        <Link className="text-white" to="/reports">
                            <FaFileAlt /> Reports
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/audit-log">
                            <FaFileAlt /> Audit Log
                        </Link>
                    </li>

                    {/* Settings */}
                    <li>
                        <Link className="text-white" to="/system-settings">
                            <FaCogs /> System Settings
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/email-settings">
                            <FaCogs /> Email Settings
                        </Link>
                    </li>
                    <li>
                        <Link className="text-white" to="/language">
                            <FaCogs /> Language
                        </Link>
                    </li>

                    {/* Help */}
                    <li>
                        <Link className="text-white" to="/help">
                            <FaQuestionCircle /> Help
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;