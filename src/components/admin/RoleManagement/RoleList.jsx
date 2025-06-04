import React, { useEffect, useState } from 'react';
import { getAllRoles, deleteRole } from "../../utils/roleApi";
import { useNavigate } from 'react-router-dom';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu ulogu?')) {
      try {
        await deleteRole(roleId);
        loadRoles();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista uloga</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-success mb-3" onClick={() => navigate('/roles/create')}>
        Dodaj novu ulogu
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Tip</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{role.roleTypes}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate(`/roles/edit/${role.id}`)}
                >
                  Izmeni
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(role.id)}>
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;