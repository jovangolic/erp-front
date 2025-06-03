import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { api } from "../utils/AppFunction";
import { uploadDocument,generateAndSaveDocument } from "../utils/confirmationDocumentApi";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { getAllShifts } from "../utils/shiftApi";

const AddConfirmationDocument = () => {

  const navigate = useNavigate();
  // Za upload
  const [file, setFile] = useState(null);
  // Za korisnika i smenu
  const [userId, setUserId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [shifts, setShifts] = useState([]);
  // Za generaciju
  const [employeeName, setEmployeeName] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 0, unit: "" }]);
  // Ostalo
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
  const fetchShifts = async () => {
    try {
      const response = await api.get("/shifts/get-all");
      const sortedShifts = response.data.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      setShifts(sortedShifts);
      if (sortedShifts.length > 0) {
        setShiftId(sortedShifts[0].id); // najnovija smena
      }
    } catch (error) {
      setErrorMessage("Greška prilikom učitavanja smena.");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (currentUser) {
    setUserId(currentUser.id);
  }

  fetchShifts();
}, []);

  // Upload fajla
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !shiftId) {
      setErrorMessage("Fajl i smena su obavezni.");
      return;
    }

    try {
      await uploadDocument(file, userId, shiftId);
      setSuccessMessage("Dokument uspešno otpremljen.");
      navigate("/confirmation-documents");
    } catch (error) {
      setErrorMessage("Greška prilikom slanja fajla.");
    }
  };

  // Generacija PDF-a
  const handleGenerate = async (e) => {
  e.preventDefault();

  if (!shiftId) {
    setErrorMessage("Smena nije izabrana.");
    return;
  }

  const dto = {
    employeeName,
    items,
    shiftId: shiftId,
  };

  try {
    await generateAndSaveDocument(dto);
    setSuccessMessage("Dokument generisan i sačuvan.");
    navigate("/confirmation-documents");
  } catch (error) {
    setErrorMessage("Greška prilikom generisanja dokumenta.");
  }
};

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 0, unit: "" }]);
  };

  return(
    <div className="container mt-4">
      <h3>Dodaj Confirmation Dokument</h3>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleUpload} className="mb-5">
        <h5> Upload dokumenta</h5>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Izaberi PDF fajl</Form.Label>
          <Form.Control
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Izaberi smenu</Form.Label>
          <Form.Select
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
          >
            <option value="">-- Izaberi smenu --</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name || `Smena ${shift.id}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Pošalji dokument
        </Button>
      </Form>

      <Form onSubmit={handleGenerate}>
        <h5> Generiši dokument</h5>

        <Form.Group className="mb-3">
          <Form.Label>Ime zaposlenog</Form.Label>
          <Form.Control
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
        </Form.Group>

        {items.map((item, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                placeholder="Naziv artikla"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Količina"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="Jedinica mere"
                value={item.unit}
                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                required
              />
            </Col>
          </Row>
        ))}

        <Button variant="secondary" onClick={addItem} className="mb-3">
          Dodaj stavku
        </Button>
        <br />

        <Button variant="success" type="submit">
          Generiši i sačuvaj dokument
        </Button>
      </Form>
    </div>
  );

};

export default AddConfirmationDocument;