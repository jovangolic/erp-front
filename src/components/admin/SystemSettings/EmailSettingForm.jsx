import React, { useState } from 'react';
import { sendEmail } from "../../utils/emailApi";
import { Form, Button, Alert } from 'react-bootstrap';

const EmailSettingForm = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await sendEmail(formData.to, formData.subject, formData.text);
      setSuccess('Email je uspešno poslat!');
      setFormData({ to: '', subject: '', text: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group>
        <Form.Label>Email primaoca</Form.Label>
        <Form.Control
          type="email"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Naslov</Form.Label>
        <Form.Control
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Poruka</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button className="mt-3" type="submit">Pošalji Email</Button>
    </Form>
  );
};

export default EmailSettingForm;