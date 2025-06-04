import React, { useEffect, useState } from "react";
import { getAll, deleteEditOpt, createEditOpt, updateEditOpt } from "../../utils/editOptApi";

const EditOptManager = () => {
  const [editOpts, setEditOpts] = useState([]);
  const [form, setForm] = useState({ name: "", value: "", type: "NOTIFICATION_METHOD", editable: true, visible: true });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEditOpts();
  }, []);

  const loadEditOpts = async () => {
    const data = await getAll();
    setEditOpts(data || []);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateEditOpt(editingId, form.name, form.value, form.type, form.editable, form.visible);
    } else {
      await createEditOpt(form.name, form.value, form.type, form.editable, form.visible);
    }
    loadEditOpts();
    setForm({ name: "", value: "", type: "NOTIFICATION_METHOD", editable: true, visible: true });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Obrisati opciju?")) {
      await deleteEditOpt(id);
      loadEditOpts();
    }
  };

  const handleEdit = (opt) => {
    setForm(opt);
    setEditingId(opt.id);
  };

  return (
    <div>
      <h2>Editabilne Opcije</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Naziv" required />
        <input name="value" value={form.value} onChange={handleChange} placeholder="Vrednost" required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="NOTIFICATION_METHOD">Notifikacije</option>
          <option value="REPORT_FORMAT">Format Izveštaja</option>
          <option value="USER_PERMISSION">Dozvole</option>
          <option value="DASHBOARD_WIDGET">Widgeti</option>
        </select>
        <label>
          Editabilno:
          <input type="checkbox" name="editable" checked={form.editable} onChange={handleChange} />
        </label>
        <label>
          Vidljivo:
          <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} />
        </label>
        <button type="submit">{editingId ? "Ažuriraj" : "Kreiraj"}</button>
      </form>
      <ul>
        {editOpts.map((opt) => (
          <li key={opt.id}>
            {opt.name} ({opt.type}) - {opt.value}
            <button onClick={() => handleEdit(opt)}>Izmeni</button>
            <button onClick={() => handleDelete(opt.id)}>Obriši</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditOptManager;