import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import React from "react";
import { fadeIn, textVariant } from "../../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      >
        <img src={icon} alt="web-development" className="w-16 h-16 object-contain" loading="lazy" />

        <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction about software</p>
        <h2 className={styles.sectionHeadText}>About</h2>
      </motion.div>

      <motion.p
        variants={fadeIn('', '', 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        G-soft is an ERP software developed with the aim of helping micro, small and medium-sized enterprises to improve, offer and expand their business. 
        It was developed using SOLID principles of software development, which makes it sustainable, easily upgradeable and suitable for long-term maintenance. 
        It is these features that make G-soft a valuable product for IT companies and potential partners.
        Current functionalities: • Storage • Logistics • Accounting • Material management • Production planning • Quality control 
        Disclaimer:   
        G-soft is not a copy of existing ERP systems, but an original solution tailored to local market needs.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
      {/* Footer */}
        <Row>
            <Col className="text-center">© ERP G-soft System 2025</Col>
        </Row>
    </>
  );
};

export default About;