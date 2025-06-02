import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";

const AdminCreateUser = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
    roleIds: []  // npr. [1, 2] — ID-jevi rola
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(value) 
        ? prev.roleIds.filter(id => id !== value) 
        : [...prev.roleIds, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/users/admin/create-user", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Korisnik uspešno kreiran!");
    } catch (err) {
      alert("Greška prilikom kreiranja korisnika.");
    }
  };

  return (
    <div>
      <h2>Kreiraj novog korisnika</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="Ime" onChange={handleChange} required />
        <input name="lastName" placeholder="Prezime" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="username" placeholder="Korisničko ime" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Lozinka" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Telefon" onChange={handleChange} required />
        <input name="address" placeholder="Adresa" onChange={handleChange} required />
        
        {/* Primer checkbox za role-ove */}
        <label>
          <input type="checkbox" value={1} onChange={handleRoleChange} /> ROLE_SUPERADMIN
        </label>
        <label>
          <input type="checkbox" value={2} onChange={handleRoleChange} /> ROLE_ADMIN
        </label>
        <label >
            <input type="checkbox" value={3} onChange={handleRoleChange} /> ROLE_STORAGE_FOREMAN
        </label>
        <label>
            <input type="checkbox" value={4} onChange={handleRoleChange} /> ROLE_STORAGE_EMPLOYEE
        </label>
        {/* Dodaj ostale role po potrebi */}
        
        <button type="submit">Kreiraj korisnika</button>
      </form>
    </div>
  );
};

export default AdminCreateUser;
