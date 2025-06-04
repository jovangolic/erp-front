import React, { useEffect, useState } from 'react';
import { getAllFileOpts, deleteFileOpt } from '../api/FileOptApi';
import FileOptTable from './FileOptTable';
import FileOptForm from './FileOptForm';

const FileOptList = () => {
  const [fileOpts, setFileOpts] = useState([]);
  const [editId, setEditId] = useState(null);

  const loadFileOpts = () => getAllFileOpts().then(setFileOpts);

  useEffect(() => {
    loadFileOpts();
  }, []);

  const handleDelete = async (id) => {
    await deleteFileOpt(id);
    loadFileOpts();
  };

  return (
    <div>
      <h2>File Opt Lista</h2>
      <FileOptForm id={editId} onSuccess={loadFileOpts} />
      <FileOptTable data={fileOpts} onEdit={setEditId} onDelete={handleDelete} />
    </div>
  );
};

export default FileOptList;