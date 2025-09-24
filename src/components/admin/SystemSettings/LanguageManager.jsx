import React, { useEffect, useState } from 'react';
import { create, getAllLanguages } from "../../utils/languageApi";
import { Form, Button, Alert, Table } from 'react-bootstrap';

const LanguageManager = () => {
  const [languageCodeType, setLanguageCodeType] = useState('');
  const [languageNameType, setLanguageNameType] = useState('');
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const data = await getAllLanguages();
      setLanguages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await create(languageCodeType, languageNameType);
      setSuccess('Jezik je uspešno dodat!');
      setLanguageCodeType('');
      setLanguageNameType('');
      fetchLanguages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h3>Dodaj novi jezik</h3>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group>
          <Form.Label>Language Code (npr. EN, RS...)</Form.Label>
          <Form.Control
            type="text"
            value={languageCodeType}
            onChange={(e) => setLanguageCodeType(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Language Name (npr. ENGLISH, SRPSKI...)</Form.Label>
          <Form.Control
            type="text"
            value={languageNameType}
            onChange={(e) => setLanguageNameType(e.target.value)}
            required
          />
        </Form.Group>

        <Button className="mt-3" type="submit">Dodaj</Button>
      </Form>

      <h4 className="mt-4">Postojeći jezici</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang, index) => (
            <tr key={lang.id}>
              <td>{index + 1}</td>
              <td>{lang.languageCodeType}</td>
              <td>{lang.languageNameType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default LanguageManager;