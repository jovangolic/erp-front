import React, { useEffect, useState } from "react";
import { Accordion, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import Footer from "../../layout/Footer";
import { findFaqContent } from "../../utils/helpApi";

const Content = () => {

    const [faqItems, setFaqItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const res = await findFaqContent();
                if (!res.ok) throw new Error("Failed to load FAQ content");
                const data = await res.json();
                setFaqItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFaq();
    }, []);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container fluid>
            <Row className="p-3 bg-white border-bottom">
                <Col>
                <h3>Frequently Asked Questions (FAQ)</h3>
                </Col>
            </Row>

            <Row className="p-3">
                <Col>
                <Accordion defaultActiveKey="0">
                    {faqItems.map((item, index) => (
                    <Accordion.Item eventKey={index.toString()} key={item.id}>
                        <Accordion.Header>{item.title}</Accordion.Header>
                        <Accordion.Body>{item.content}</Accordion.Body>
                    </Accordion.Item>
                    ))}
                </Accordion>
                </Col>
            </Row>
            <Footer />
        </Container>
  );
};

export default Content;