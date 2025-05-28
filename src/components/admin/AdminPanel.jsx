import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { hasRole } from "../auth/checkRole"; 

const AdminPanel = () => {
    const { user } = useAuth();

    const isGeneralAdmin = hasRole(user, ["ADMIN", "SUPER_ADMIN", "STORAGE_FOREMAN", "STORAGE_EMPLOYEE"]);
    const isSuperAdmin = hasRole(user, ["SUPER_ADMIN"]);

    return (
        <section className="container mt-5">
            <h2>Welcome to the Admin Panel</h2>
            <hr />

            {isGeneralAdmin && (
                <>
                    <Link to={"/manage-users"}>Manage Users</Link><br />
                    <Link to={"/manage-roles"}>Manage Roles</Link><br />
                    <Link to={"/manage-vendors"}>Manage Vendors</Link><br />
                    <Link to={"/manage-buyers"}>Manage Buyers</Link><br />
                    <Link to={"/manage-goods"}>Manage Goods</Link><br />
                    <Link to={"/manage-products"}>Manage Products</Link><br />
                    <Link to={"/manage-rawMaterial"}>Manage Raw-Material</Link><br />
                    <Link to={"/manage-procurement"}>Manage Procurement</Link><br />
                    <Link to={"/manage-sales"}>Manage Sales</Link><br />
                    <Link to={"/manage-salesOrder"}>Manage Sales Order</Link><br />
                    <Link to={"/manage-invoice"}>Manage Invoice</Link><br />
                    <Link to={"/manage-inventory"}>Manage Inventory</Link><br />
                    <Link to={"/manage-inventoryItems"}>Manage Inventory Items</Link><br />
                    <Link to={"/manage-storage"}>Manage Storage</Link><br />
                    <Link to={"/manage-supply"}>Manage Supply</Link><br />
                    <Link to={"/manage-supply-item"}>Manage Supply Item</Link><br />
                    <Link to={"/manage-shelf"}>Manage Shelves</Link><br />
                    <Link to={"/manage-shift"}>Manage Shifts</Link><br />
                    <Link to={"/manage-shift-report"}>Manage Shift-Report</Link><br />
                    <Link to={"/manage-payment"}>Manage Payment</Link><br />
                    <Link to={"/manage-item-sales"}>Manage Item-Sales</Link><br />
                    <Link to={"/manage-confirmationDocument"}>Manage Confirmation-Document</Link><br />
                    <Link to={"/manage-bar-Code"}>Manage Bar-Code</Link><br />
                    <Link to={"/manage-tokens"}>Manage Tokens</Link><br />
                </>
            )}

            {isSuperAdmin && (
                <>
                    <Link to={"/manage-settings"}>System Settings</Link><br />
                    <Link to={"/manage-dashboard"}>Manage Dashboard</Link><br />
                    <Link to={"/manage-help"}>Manage Help</Link><br />
                    <Link to={"/manage-option"}>Manage Option</Link><br />
                    <Link to={"/manage-fileOpt"}>Manage FileOpt</Link><br />
                    <Link to={"/manage-editOpt"}>Manage EditOpt</Link><br />
                </>
            )}
        </section>
    );
};

export default AdminPanel;