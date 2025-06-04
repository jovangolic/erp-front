import React, { useState, useEffect } from 'react';
import { createFileOpt, updateFileOpt, getFileOptById} from "../../utils/fileOptApi";

const initialState = {
  extension: '',
  mimeType: '',
  maxSizeInBytes: '',
  uploadEnabled: true,
  previewEnabled: false,
  availableActions: []
};


const FileOptForm = ({ id, onSuccess }) => {
  const [formData, setFormData] = useState(initialState);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      getFileOptById(id).then(data => setFormData(data));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleActionChange = e => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const actions = new Set(prev.availableActions);
      if (checked) actions.add(value);
      else actions.delete(value);
      return { ...prev, availableActions: Array.from(actions) };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const action = isEdit ? updateFileOpt : createFileOpt;
    await action(id, ...Object.values(formData)).then(onSuccess);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="extension" value={formData.extension} onChange={handleChange} placeholder="Ekstenzija" required />
      <input name="mimeType" value={formData.mimeType} onChange={handleChange} placeholder="MIME type" required />
      <input name="maxSizeInBytes" value={formData.maxSizeInBytes} type="number" onChange={handleChange} placeholder="Max size in bytes" required />
      <label>
        Upload enabled
        <input name="uploadEnabled" type="checkbox" checked={formData.uploadEnabled} onChange={handleChange} />
      </label>
      <label>
        Preview enabled
        <input name="previewEnabled" type="checkbox" checked={formData.previewEnabled} onChange={handleChange} />
      </label>
      <fieldset>
        <legend>Akcije</legend>
        {['SAVE', 'SAVE_AS', 'SAVE_ALL', 'EXIT'].map(action => (
          <label key={action}>
            <input type="checkbox" value={action} checked={formData.availableActions.includes(action)} onChange={handleActionChange} />
            {action}
          </label>
        ))}
      </fieldset>
      <button type="submit">{isEdit ? 'Ažuriraj' : 'Kreiraj'}</button>
    </form>
  );
};

export default FileOptForm;