import React, { useState } from "react";

const roles = [
  "SUPER_ADMIN",
  "ADMIN",
  "STORAGE_FOREMAN",
  "STORAGE_EMPLOYEE",
  "STORAGE_MANAGER",
];

const RoleManager = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  const toggleRole = (role) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <div>
      <h2>Role Manager</h2>
      <ul>
        {roles.map((role) => (
          <li key={role}>
            <label>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              {role}
            </label>
          </li>
        ))}
      </ul>

      <div>
        <h4>Izabrane uloge:</h4>
        <p>{selectedRoles.join(", ") || "Nema izabranih"}</p>
      </div>
    </div>
  );
};

export default RoleManager;