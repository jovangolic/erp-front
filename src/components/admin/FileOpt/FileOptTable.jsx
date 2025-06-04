import React from 'react';

const FileOptTable = ({ data, onEdit, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ekstenzija</th>
          <th>MIME</th>
          <th>Max size</th>
          <th>Upload</th>
          <th>Preview</th>
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
        {data.map(opt => (
          <tr key={opt.id}>
            <td>{opt.id}</td>
            <td>{opt.extension}</td>
            <td>{opt.mimeType}</td>
            <td>{opt.maxSizeInBytes}</td>
            <td>{opt.uploadEnabled ? 'Da' : 'Ne'}</td>
            <td>{opt.previewEnabled ? 'Da' : 'Ne'}</td>
            <td>
              <button onClick={() => onEdit(opt.id)}>Izmeni</button>
              <button onClick={() => onDelete(opt.id)}>Obriši</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileOptTable;