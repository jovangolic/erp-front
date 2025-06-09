import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createEditOpt, updateEditOpt } from "../../utils/editOptApi";

const EditSystemSettingModal = ({ show, handleClose, editOpt, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    type: "NOTIFICATION_METHOD",
    editable: true,
    visible: true,
  });

  useEffect(() => {
    if (editOpt) {
      setFormData({
        name: editOpt.name || "",
        value: editOpt.value || "",
        type: editOpt.type || "NOTIFICATION_METHOD",
        editable: editOpt.editable ?? true,
        visible: editOpt.visible ?? true,
      });
    } else {
      setFormData({
        name: "",
        value: "",
        type: "NOTIFICATION_METHOD",
        editable: true,
        visible: true,
      });
    }
  }, [editOpt]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editOpt && editOpt.id) {
        await updateEditOpt(
          editOpt.id,
          formData.name,
          formData.value,
          formData.type,
          formData.editable,
          formData.visible
        );
      } else {
        await createEditOpt(
          formData.name,
          formData.value,
          formData.type,
          formData.editable,
          formData.visible
        );
      }
      onSave(); // obnavlja listu
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editOpt ? "Izmeni opciju" : "Kreiraj opciju"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Naziv</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formValue" className="mb-3">
            <Form.Label>Vrednost</Form.Label>
            <Form.Control
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formType" className="mb-3">
            <Form.Label>Tip</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleChange}>
              <option value="NOTIFICATION_METHOD">NOTIFICATION_METHOD</option>
              <option value="REPORT_FORMAT">REPORT_FORMAT</option>
              <option value="USER_PERMISSION">USER_PERMISSION</option>
              <option value="DASHBOARD_WIDGET">DASHBOARD_WIDGET</option>
            </Form.Select>
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Može se uređivati"
            name="editable"
            checked={formData.editable}
            onChange={handleChange}
            className="mb-2"
          />

          <Form.Check
            type="checkbox"
            label="Vidljivo"
            name="visible"
            checked={formData.visible}
            onChange={handleChange}
            className="mb-3"
          />

          <Button variant="primary" type="submit">
            {editOpt ? "Sačuvaj izmene" : "Kreiraj"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSystemSettingModal;