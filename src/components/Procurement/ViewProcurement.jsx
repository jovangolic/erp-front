import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewProcurement = ({ procurementId }) => {
  const [procurement, setProcurement] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/procurement/${procurementId}`)
      .then((res) => setProcurement(res.data))
      .catch(() => alert("Failed to load procurement."));
  }, [procurementId]);

  if (!procurement) return <p>Loading...</p>;

  return (
    <div>
      <h3>Procurement Details</h3>
      <p><strong>Date:</strong> {new Date(procurement.date).toLocaleString()}</p>
      <p><strong>Total Cost:</strong> {procurement.totalCost} RSD</p>

      <div>
        <strong>Item Sales:</strong>
        <ul>
          {procurement.itemSales.map(item => (
            <li key={item.id}>{item.name || `Item ${item.id}`}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Supplies:</strong>
        <ul>
          {procurement.supplies.map(item => (
            <li key={item.id}>{item.name || `Supply ${item.id}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewProcurement;