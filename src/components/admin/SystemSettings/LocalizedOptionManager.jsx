import React, { useState, useEffect } from "react";
import {
  getAll as getAllLocalizedOptions,
  getTranslationsForOption,
  addTranslationForOption,
} from "../../utils/localizedOptionApi";
import { getAll as getAllEditOpts } from "../../utils/editOptApi";
import { getALL as getAllLanguages } from "../../utils/languageApi";
import { Form, Button, Table, Modal } from "react-bootstrap";

const LocalizedOptionManager = () => {
  const [options, setOptions] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [formData, setFormData] = useState({ languageId: "", localizedLabel: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [opts, langs] = await Promise.all([getAllEditOpts(), getAllLanguages()]);
      setOptions(opts);
      setLanguages(langs);
    } catch (error) {
      alert("Greška prilikom učitavanja opcija ili jezika");
    }
  };

  const handleSelectOption = async (optionId) => {
    setSelectedOptionId(optionId);
    try {
      const data = await getTranslationsForOption(optionId);
      setTranslations(data);
      setShowModal(true);
    } catch (error) {
      alert("Greška prilikom učitavanja prevoda");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTranslation = async () => {
    try {
      await addTranslationForOption(selectedOptionId, formData);
      const updated = await getTranslationsForOption(selectedOptionId);
      setTranslations(updated);
      setFormData({ languageId: "", localizedLabel: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>Uredi prevode za sistemske opcije</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Tip</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt) => (
            <tr key={opt.id}>
              <td>{opt.id}</td>
              <td>{opt.name}</td>
              <td>{opt.type}</td>
              <td>
                <Button variant="info" onClick={() => handleSelectOption(opt.id)}>
                  Prikaži prevode
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Prevodi za opciju ID {selectedOptionId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Dodaj novi prevod</h5>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Jezik</Form.Label>
              <Form.Select
                name="languageId"
                value={formData.languageId}
                onChange={handleInputChange}
              >
                <option value="">-- Izaberi jezik --</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Prevod</Form.Label>
              <Form.Control
                type="text"
                name="localizedLabel"
                value={formData.localizedLabel}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleAddTranslation}>
              Dodaj prevod
            </Button>
          </Form>

          <hr />
          <h5>Postojeći prevodi</h5>
          <ul>
            {translations.map((t) => (
              <li key={t.id}>
                [{t.language.name}]: {t.localizedLabel}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LocalizedOptionManager;