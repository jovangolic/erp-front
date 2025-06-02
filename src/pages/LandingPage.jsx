import React, { useState } from "react";
import LoginForm from "../auth/LoginForm";

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Dobrodošli u ERP-V1 WMS</h1>
      {!selectedRole ? (
        <div className="mt-4">
          <h4>Koja je vaša uloga?</h4>
          <select
            className="form-select w-50 mx-auto"
            onChange={handleRoleSelect}
            defaultValue=""
          >
            <option value="" disabled>Izaberite ulogu</option>
            <option value="ROLE_SUPERADMIN">Super Admin</option>
            <option value="ROLE_ADMIN">Admin</option>
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