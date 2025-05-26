import React from "react";
import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider";

const AdminPanel = () => {
    const { user } = useAuth();  // Uzmi podatke o korisniku iz AuthProvider

    return (
        <section className="container mt-5">
            <h2>Welcome to the Admin Panel</h2>
            <hr />
            {/* Ove funkcionalnosti su dostupne samo adminu, smenovodji i magacioneru */}
            {user && (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN") || user.roles.includes("STORAGE_FOREMAN") || user.roles.includes("STORAGE_EMPLOYEE")) && (
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

            {/* Specifične opcije za SUPER_ADMIN */}
            {user && user.roles.includes("SUPER_ADMIN") && (
                <>
                    <Link to={"/manage-settings"}>System Settings</Link><br />
                    {/* Specifične opcije za super-admina */}
                </>
            )}
        </section>
    );
};

export default AdminPanel;