import React, { useEffect, useState } from "react";
import { createSystemSetting, updateSystemSetting } from "../../utils/systemSettingsApi";
import { Form, Button, Card } from "react-bootstrap";

const initialFormState = {
  id: null,
  settingKey: "",
  value: "",
  category: "",
  isVisible: true,
  editable: true
};

const SystemSettingForm = ({ selectedSetting, onFinish }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (selectedSetting) {
      setFormData(selectedSetting);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedSetting]);

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
      if (formData.id) {
        await updateSystemSetting(formData);
        alert("Podešavanje uspešno izmenjeno.");
      } else {
        await createSystemSetting(formData);
        alert("Novo podešavanje uspešno dodato.");
      }
      onFinish(); // da osveži listu i resetuje formu
      setFormData(initialFormState);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    onFinish();
  };

  return (
    <Card className="p-4 mt-3">
      <h4>{formData.id ? "Izmeni podešavanje" : "Dodaj novo podešavanje"}</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Ključ</Form.Label>
          <Form.Control
            name="settingKey"
            value={formData.settingKey}
            onChange={handleChange}
            required
            disabled={!!formData.id} // da ne može da se menja ključ pri izmeni
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vrednost</Form.Label>
          <Form.Control
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kategorija</Form.Label>
          <Form.Control
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="Vidljivo"
          name="isVisible"
          checked={formData.isVisible}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Izmenjivo"
          name="editable"
          checked={formData.editable}
          onChange={handleChange}
        />

        <div className="d-flex justify-content-between mt-3">
          <Button type="submit" variant="success">
            {formData.id ? "Sačuvaj izmene" : "Dodaj"}
          </Button>
          {formData.id && (
            <Button variant="secondary" onClick={handleCancel}>
              Otkaži
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default SystemSettingForm;