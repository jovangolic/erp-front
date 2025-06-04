import React, { useEffect, useState } from "react";
import { getAll, deleteOption } from "../../utils/optionApi";
import OptionForm from "./OptionForm";

const OptionList = () => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadOptions = async () => {
    const data = await getAll();
    setOptions(data || []);
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Da li sigurno želite da obrišete?")) {
      await deleteOption(id);
      loadOptions();
    }
  };

  return (
    <div>
      <h2>Lista Opcija</h2>
      <OptionForm option={selected} onSuccess={loadOptions} />
      <ul>
        {options.map((opt) => (
          <li key={opt.id}>
            {opt.label} ({opt.category}) - {opt.value}
            <button onClick={() => setSelected(opt)}>Izmeni</button>
            <button onClick={() => handleDelete(opt.id)}>Obriši</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OptionList;