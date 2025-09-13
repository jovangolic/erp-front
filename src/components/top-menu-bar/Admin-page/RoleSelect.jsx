import React from "react";
import { Form } from "react-bootstrap";
import { RoleTypes } from "../../shared/enums/RoleTypes";

const RoleSelect = ({ selectedRoles = [], onChange }) => {
  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    onChange(options); // vraca listu selektovanih uloga parent komponenti
  };

  return (
    <Form.Group controlId="gotoRoles">
      <Form.Label>Dozvoljene uloge</Form.Label>
      <Form.Select multiple value={selectedRoles} onChange={handleChange}>
        {Object.values(RoleTypes).map((role) => (
          <option key={role} value={role}>
            {role.replaceAll("_", " ")}
          </option>
        ))}
      </Form.Select>
      <Form.Text className="text-muted">
        Ove uloge imaju pravo da koriste izabrani GoTo shortcut.
      </Form.Text>
    </Form.Group>
  );
};

export default RoleSelect;