/*import { OptionCategory } from "../../shared/enums/OptionCategory";

const OptionForm = () => {
  return (
    <form>
      <label>Option Label:</label>
      <input type="text" name="label" required />

      <label>Category:</label>
      <select name="category">
        {OptionCategory.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="submit">Save</button>
    </form>
  );
};

export default OptionForm;*/
import React, { useState, useEffect } from "react";
import { createOption, updateOption } from "../../utils/optionApi";

const OptionForm = ({ option, onSuccess }) => {
  const [form, setForm] = useState({
    label: "",
    value: "",
    category: "GENDER",
    active: true,
  });

  useEffect(() => {
    if (option) setForm(option);
  }, [option]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (option?.id) {
        await updateOption(option.id, form.label, form.value, form.category, form.active);
      } else {
        await createOption(form.label, form.value, form.category, form.active);
      }
      onSuccess();
      setForm({ label: "", value: "", category: "GENDER", active: true });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="label" value={form.label} onChange={handleChange} placeholder="Labela" required />
      <input name="value" value={form.value} onChange={handleChange} placeholder="Vrednost" required />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="GENDER">Pol</option>
        <option value="ROLE">Uloga</option>
        <option value="STATUS">Status</option>
        <option value="LANGUAGE">Jezik</option>
        <option value="THEME">Tema</option>
      </select>
      <label>
        Aktivan:
        <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
      </label>
      <button type="submit">{option ? "Ažuriraj" : "Kreiraj"}</button>
    </form>
  );
};

export default OptionForm;