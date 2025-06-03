import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProcurement = ({ procurementId }) => {
  const [date, setDate] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [itemSalesIds, setItemSalesIds] = useState([]);
  const [supplyItemIds, setSupplyItemIds] = useState([]);

  const [allItemSales, setAllItemSales] = useState([]);
  const [allSupplyItems, setAllSupplyItems] = useState([]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Učitavanje postojećeg Procurement-a
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/procurements/update/${procurementId}`).then((res) => {
      const data = res.data;
      setDate(data.date);
      setTotalCost(data.totalCost);
      setItemSalesIds(data.itemSales.map(item => item.id));
      setSupplyItemIds(data.supplies.map(item => item.id));
    });

    // Učitavanje svih mogućih itemSales i supplyItems
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/itemSales`).then((res) => setAllItemSales(res.data));
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/supplyItems`).then((res) => setAllSupplyItems(res.data));
  }, [procurementId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      date,
      totalCost,
      itemSales: itemSalesIds,
      supplies: supplyItemIds
    };

    axios.put(`${import.meta.env.VITE_API_BASE_URL}/procurements/update/${procurementId}`, updatedData)
      .then(() => setSuccessMsg("Procurement updated successfully."))
      .catch(() => setErrorMsg("Update failed."));
  };

  const handleMultiSelect = (e, setter) => {
    const selected = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
    setter(selected);
  };

  return (
    <div>
      <h3>Edit Procurement</h3>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Total Cost:</label>
        <input
          type="number"
          value={totalCost}
          onChange={(e) => setTotalCost(e.target.value)}
        />

        <label>Item Sales:</label>
        <select multiple value={itemSalesIds} onChange={(e) => handleMultiSelect(e, setItemSalesIds)}>
          {allItemSales.map(item => (
            <option key={item.id} value={item.id}>
              {item.name || `Item ${item.id}`}
            </option>
          ))}
        </select>

        <label>Supplies:</label>
        <select multiple value={supplyItemIds} onChange={(e) => handleMultiSelect(e, setSupplyItemIds)}>
          {allSupplyItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.name || `Supply ${item.id}`}
            </option>
          ))}
        </select>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProcurement;