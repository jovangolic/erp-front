import { motion } from "framer-motion";
import  Tilt  from "react-parallax-tilt";
import React from "react";
import { fadeIn, textVariant } from "../../utils/motion";
import {  Row, Col } from "react-bootstrap";
import { styles } from "../../../styles";
import Footer from "../../layout/Footer";
import { ListGroup } from "react-bootstrap";
import { BoxSeam, Truck, Calculator, Boxes, ClipboardCheck, Award } from "react-bootstrap-icons";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      >
        <img
          src={icon}
          alt={title}
          className="w-16 h-16 object-contain"
          loading="lazy"
        />
        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className="text-muted">Introduction about software</p>
        <h2 className="fw-bold">About</h2>
      </motion.div>

      {/* Glavni opis */}
      <motion.div variants={fadeIn("", "", 0.1, 1)}>
        <p className="mt-4 text-secondary fs-5">
          G-soft is an ERP software developed with the aim of helping micro,
          small and medium-sized enterprises to improve, offer and expand their
          business. It was developed using SOLID principles of software
          development, which makes it sustainable, easily upgradeable and
          suitable for long-term maintenance. These features make G-soft a
          valuable product for IT companies and potential partners.
        </p>
      </motion.div>

      {/* Lista funkcionalnosti */}
      <motion.div variants={fadeIn("", "", 0.2, 1)}>
        <p className="fw-bold mt-4">Current functionalities:</p>
        <Row>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <BoxSeam className="me-2 text-primary" /> Storage
              </ListGroup.Item>
              <ListGroup.Item>
                <Truck className="me-2 text-success" /> Logistics
              </ListGroup.Item>
              <ListGroup.Item>
                <Calculator className="me-2 text-warning" /> Accounting
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Boxes className="me-2 text-danger" /> Material management
              </ListGroup.Item>
              <ListGroup.Item>
                <ClipboardCheck className="me-2 text-info" /> Production
                planning
              </ListGroup.Item>
              <ListGroup.Item>
                <Award className="me-2 text-secondary" /> Quality control
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </motion.div>

      {/* Footer */}
      <Row className="mt-5">
        <Col className="text-center text-muted">
          © ERP G-soft System 2025
        </Col>
      </Row>
    </>
  );
}

export default About;