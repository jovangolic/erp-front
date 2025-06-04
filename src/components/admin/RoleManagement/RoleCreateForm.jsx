import React, { useState, useEffect } from 'react';
import { createRole, updateRole, getRoleById } from "../../utils/roleApi";
import { useNavigate, useParams } from 'react-router-dom';

const RoleCreateForm = () => {
  const [name, setName] = useState('');
  const [roleTypes, setRoleTypes] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getRoleById(id)
        .then(role => {
          setName(role.name);
          setRoleTypes(role.roleTypes);
        })
        .catch(err => setError(err.message));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateRole(id, name, []); // assume empty user list
      } else {
        await createRole(name, []);
      }
      navigate('/roles');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Izmeni ulogu' : 'Kreiraj novu ulogu'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Naziv uloge</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tip uloge</label>
          <select
            className="form-select"
            value={roleTypes}
            onChange={(e) => setRoleTypes(e.target.value)}
            required
          >
            <option value="">-- Izaberi tip --</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STORAGE_EMPLOYEE">STORAGE_EMPLOYEE</option>
            <option value="STORAGE_FOREMAN">STORAGE_FOREMAN</option>
            <option value="STORAGE_MANAGER">STORAGE_MANAGER</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Sačuvaj
        </button>
      </form>
    </div>
  );
};

export default RoleCreateForm;