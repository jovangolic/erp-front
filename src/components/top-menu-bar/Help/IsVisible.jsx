import React, { useState } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";

const IsVisible = ({ isVisible, onToggle }) => {

    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        setLoading(true);
        try {
            await onToggle(!isVisible); // roditelj obavlja update
        } 
        catch (error) {
            console.error("Failed to update visibility", error);
        } 
        finally {
            setLoading(false);
        }
    };

  return (
    <Container className="p-2">
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Check 
            type="switch"
            id="is-visible-switch"
            label={isVisible ? "Visible" : "Hidden"}
            checked={isVisible}
            onChange={handleChange}
            disabled={loading}
          />
        </Col>
        <Col xs="auto">
          {loading && <Spinner animation="border" size="sm" />}
        </Col>
      </Row>
    </Container>
  );
};

export default IsVisible;