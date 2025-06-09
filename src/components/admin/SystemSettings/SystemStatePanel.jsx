import React, { useEffect, useState } from "react";
import { getCurrentState, updateState, restartSystem } from "../../utils/systemStateApi";
import { Button, Form, Card } from "react-bootstrap";

const SystemStatePanel = () => {
  const [state, setState] = useState(null);
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    registrationEnabled: false,
    systemVersion: "",
    statusMessage: "RUNNING"
  });

  useEffect(() => {
    getCurrentState()
      .then(data => {
        setState(data);
        setFormData({
          maintenanceMode: data.maintenanceMode,
          registrationEnabled: data.registrationEnabled,
          systemVersion: data.systemVersion,
          statusMessage: data.statusMessage
        });
      })
      .catch(err => console.error(err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateState(
        formData.maintenanceMode,
        formData.registrationEnabled,
        formData.systemVersion,
        formData.statusMessage
      );
      alert("Sistem je uspešno ažuriran.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRestart = async () => {
    try {
      await restartSystem();
      alert("Sistem restartovan.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Card className="p-4 mt-3">
      <h4>System State Panel</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Check
          type="checkbox"
          label="Maintenance Mode"
          name="maintenanceMode"
          checked={formData.maintenanceMode}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Registration Enabled"
          name="registrationEnabled"
          checked={formData.registrationEnabled}
          onChange={handleChange}
        />
        <Form.Group>
          <Form.Label>System Version</Form.Label>
          <Form.Control
            name="systemVersion"
            value={formData.systemVersion}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="statusMessage"
            value={formData.statusMessage}
            onChange={handleChange}
          >
            <option value="RUNNING">RUNNING</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="RESTARTING">RESTARTING</option>
          </Form.Select>
        </Form.Group>
        <div className="d-flex justify-content-between mt-3">
          <Button variant="primary" type="submit">
            Sačuvaj izmene
          </Button>
          <Button variant="warning" onClick={handleRestart}>
            Restartuj sistem
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default SystemStatePanel;