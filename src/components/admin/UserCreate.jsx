import React, { useState } from "react";
import axios from "axios";

const UserCreate = async () => {

    // State za formu
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
    roleIds: [], // Niz ID-jeva rola, npr. [1, 2]
  });

  const [message, setMessage] = useState(""); // Poruka za uspeh/gresku

  // Menjanje vrednosti u formi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Checkbox za role-ove (dodavanje/uklanjanje ID-jeva iz niza)
  /*const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value);
    setFormData(prev => {
      if (prev.roleIds.includes(roleId)) {
        // Ukloni rolu
        return { ...prev, roleIds: prev.roleIds.filter(id => id !== roleId) };
      } else {
        // Dodaj rolu
        return { ...prev, roleIds: [...prev.roleIds, roleId] };
      }
    });
  };*/
  const handleRoleChange = (e) => {
  const roleId = Number(e.target.value);
  if (e.target.checked) {
    setFormData(prev => ({
      ...prev,
      roleIds: [...prev.roleIds, roleId],
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.filter(id => id !== roleId),
    }));
  }
};

  // Slanje forme na backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Resetuj poruku

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/users/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        setMessage("Greška: " + (errData.message || response.statusText));
        return;
      }

      const data = await response.json();
      setMessage("Korisnik uspešno kreiran!");
      // Očisti formu posle uspeha
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        phoneNumber: "",
        address: "",
        roleIds: [],
      });
    } catch (error) {
      setMessage("Greška pri komunikaciji sa serverom.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Kreiraj korisnika</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="Ime"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Prezime"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Korisničko ime"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="phoneNumber"
          placeholder="Telefon"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Adresa"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div>
            <label>
                <input
                type="checkbox"
                value={1} // ROLE_SUPERADMIN
                checked={formData.roleIds.includes(1)}
                onChange={handleRoleChange}
                />{" "}
                ROLE_SUPERADMIN
            </label>
        </div>
        <div>
            <label>
                <input
                type="checkbox"
                value={2} // ROLE_ADMIN
                checked={formData.roleIds.includes(2)}
                onChange={handleRoleChange}
                />{" "}
                ROLE_ADMIN
            </label>
        </div>
        <div>
            <label>
                <input
                type="checkbox"
                value={3} // ROLE_STORAGE_FOREMAN
                checked={formData.roleIds.includes(3)}
                onChange={handleRoleChange}
                />{" "}
                ROLE_STORAGE_FOREMAN
            </label>
        </div>
        <div>
            <label>
                <input
                type="checkbox"
                value={4} // ROLE_STORAGE_EMPLOYEE
                checked={formData.roleIds.includes(4)}
                onChange={handleRoleChange}
                />{" "}
                ROLE_STORAGE_EMPLOYEE
            </label>
        </div>
        {/* Dodaj još role checkbox-ova po potrebi */}

        <button type="submit" style={{ marginTop: "10px" }}>
          Kreiraj korisnika
        </button>
      </form>
    </div>
  );
};


export default UserCreate;