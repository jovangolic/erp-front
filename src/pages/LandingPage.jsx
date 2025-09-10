import React, { useState } from "react";
import LoginForm from "./LoginForm";

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Dobrodosli u G-Soft ERP System</h1>
      {!selectedRole ? (
        <div className="mt-4">
          <h4>Koja je vasa uloga?</h4>
          <select
            className="form-select w-50 mx-auto"
            onChange={handleRoleSelect}
            defaultValue=""
          >
            <option value="" disabled>Izaberite ulogu</option>
            <option value="ROLE_SUPERADMIN">SUPERADMIN</option>
            <option value="ROLE_ADMIN">ADMIN</option>
            <option value="ROLE_MANAGER">MANAGER</option>
            <option value="ROLE_INVENTORY_MANAGER">INVENTORY MANAGER</option>
            <option value="ROLE_PRODUCTION_PLANNER">PRODUCTION PLANNER</option>
            <option value="ROLE_QUALITY_MANAGER">QUALITY MANAGER</option>
            <option value="ROLE_QUALITY_INSPECTOR">QUALITY INSPECTOR</option>
            <option value="ROLE_QUALITY_TECHNICIAN">QUALITY TECHNICIAN</option>
            <option value="ROLE_ACCOUNTANT">ACCOUNTANT</option>
            <option value="ROLE_AUDITOR">AUDITOR</option>
            <option value="ROLE_FINANCIAL_MANAGER">FINANCIAL MANAGER</option>
            <option value="ROLE_SECURITY_AUDITOR">SECURITY AUDITOR</option>
            <option value="ROLE_INVENTORY_APPROVER">INVENTORY APPROVER</option>
            <option value="ROLE_CUSTOMER_SERVICE">CUSTOMER SERVICE</option>
            <option value="ROLE_LOGISTICS_MANAGER">LOGISTICS MANAGER</option>
            <option value="ROLE_SUPPLY_CHAIN_MANAGER">SUPPLY CHAIN MANAGER</option>
            <option value="ROLE_TRANSPORT_PLANNER">TRANSPORT PLANNER</option>
            <option value="ROLE_DISPATCHER">DISPATCHER</option>
            <option value="ROLE_DRIVER">DRIVER</option>
            <option value="ROLE_MECHANIC">MECHANIC</option>
            <option value="ROLE_PRODUCTION_MANAGER">PRODUCTION MANAGER</option>
            <option value="ROLE_MAINTENANCE_MANAGER">MAINTENANCE MANAGER</option>
            <option value="ROLE_PRODUCTION_OPERATOR">PRODUCTION OPERATOR</option>
            <option value="ROLE_REGULATORY_AUDITOR">REGULATORY AUDITOR</option>
            <option value="ROLE_DISPOSAL_MANAGER">DISPOSAL MANAGER</option>
            <option value="ROLE_SALES">SALES</option>
            <option value="ROLE_SALES_MANAGER">SALES MANAGER</option>
            <option value="ROLE_HR_MANAGER">HR MANAGER</option>
            <option value="ROLE_PROCUREMENT">PROCUREMENT</option>
            <option value="ROLE_STORAGE_FOREMAN">Storage Foreman</option>
            <option value="ROLE_STORAGE_EMPLOYEE">Storage Employee</option>
          </select>
        </div>
      ) : (
        <LoginForm role={selectedRole} />
      )}
    </div>
  );
};

export default LandingPage;