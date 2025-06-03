import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProcurementList = () => {
  const [procurements, setProcurements] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadProcurements();
  }, []);

  const loadProcurements = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/procurements`)
      .then((res) => {
        setProcurements(res.data);
        setErrorMsg("");
      })
      .catch(() => setErrorMsg("Failed to load procurements."));
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this procurement?");
    if (confirmed) {
      axios.delete(`${import.meta.env.VITE_API_BASE_URL}/procurements/delete/${id}`)
        .then(() => {
          setSuccessMsg("Procurement deleted successfully.");
          setErrorMsg("");
          loadProcurements(); // Refresh the list
        })
        .catch(() => {
          setErrorMsg("Failed to delete procurement.");
          setSuccessMsg("");
        });
    }
  };

  return (
    <div>
      <h2>All Procurements</h2>

      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <Link to="/procurements/add">
        <button>Create New Procurement</button>
      </Link>

      {procurements.length === 0 ? (
        <p>No procurements found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total Cost</th>
              <th>Item Sales</th>
              <th>Supplies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {procurements.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{new Date(p.date).toLocaleString()}</td>
                <td>{p.totalCost} RSD</td>
                <td>{p.itemSales?.length || 0}</td>
                <td>{p.supplies?.length || 0}</td>
                <td>
                  <Link to={`/procurements/view/${p.id}`}>View</Link> |{" "}
                  <Link to={`/procurements/edit/${p.id}`}>Edit</Link> |{" "}
                  <Link to="/procurements/add">
                    <button>Create New Procurement</button>
                  </Link>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcurementList;
