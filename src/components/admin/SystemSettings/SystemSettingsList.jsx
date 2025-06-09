import React, { useEffect, useState } from "react";
import { getAll, deleteSystemSetting } from "../../utils/systemSettingsApi";
import { Table, Button } from "react-bootstrap";

const SystemSettingList = ({ onEdit }) => {
  const [settings, setSettings] = useState([]);

  const loadSettings = () => {
    getAll()
      .then(data => setSettings(data))
      .catch(err => alert(err.message));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete podešavanje?")) {
      try {
        await deleteSystemSetting(id);
        loadSettings();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="mt-3">
      <h4>Lista podešavanja</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ključ</th>
            <th>Vrednost</th>
            <th>Kategorija</th>
            <th>Vidljivo</th>
            <th>Izmenjivo</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr key={setting.id}>
              <td>{setting.settingKey}</td>
              <td>{setting.value}</td>
              <td>{setting.category}</td>
              <td>{setting.isVisible ? "Da" : "Ne"}</td>
              <td>{setting.editable ? "Da" : "Ne"}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(setting)}
                >
                  Izmeni
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(setting.id)}
                >
                  Obriši
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SystemSettingList;