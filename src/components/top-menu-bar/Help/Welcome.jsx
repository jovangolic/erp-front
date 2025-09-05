import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../../layout/Footer";


const Welcome = () => {

    return(
        <Container fluid>
            <Row className="p-3 bg-white border-bottom">
                <Col>
                    <h3>Welcome to G-soft ERP System</h3>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default Welcome;