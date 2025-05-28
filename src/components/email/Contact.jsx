import React, { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { slideIn} from "../utils/motion";
import { styles } from "../../styles";
import { toast } from "react-toastify";
import { FaEnvelope,FaUser, FaRegCommentDots } from "react-icons/fa";

const InputField = ({ label, value, onChange, placeholder, name, type, icon: Icon }) => (
  <label className="flex flex-col w-full relative">
    <span className="text-black bg-white font-medium mb-2">{label}</span>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-tertiary py-3 pl-10 pr-4 placeholder:text-secondary text-black bg-white rounded-lg outline-none border-none font-medium w-full"
      />
    </div>
  </label>
);

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setNameError("");
    setConfirmation("");

    if (!validateEmail(form.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!form.name.trim()) {
      setNameError("Name is required.");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        "service_88bol8j",
        "template_pklcni4",
        {
          from_name: form.name,
          to_name: "Jovan Golic",
          from_email: form.email,
          to_email: "jovangolic19@gmail.com",
          message: form.message,
        },
        "CvAWKcLxJ7_DJ0Mn8"
      )
      .then(() => {
        setLoading(false)
        toast.success("Thanks for reaching out! I'll get back to you soon.");
        setConfirmation("Thank you! I will get back to you as soon as possible.");

        setForm({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        setConfirmation("Something went wrong. Please try again. :/");
        toast.error("Something went wrong. Please try again. :(");
      });
  };

  return (
    <Container className="mt-5">
      <div className="xl:mt-12 flex flex-col gap-10 overflow-hidden">
      <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="bg-black bg-opacity-30 backdrop-blur-md border border-white/10 shadow-xl p-8 rounded-2xl w-full max-w-2xl mx-auto"
        >
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadText}>Contact Me</h3>
  
          <motion.form
            noValidate
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            
            <div>
              <InputField
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Insert your name here..."
                type="text"
                icon={FaUser}
                className="text-black bg-white" 
              />
              {nameError && (
                <span className="text-red-500 text-sm mt-1 block">
                  {nameError}
                </span>
              )}
            </div>
  
            
            <div>
              <InputField
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email address?"
                type="email"
                icon={FaEnvelope}
                className="text-black bg-white" 
              />
              <AnimatePresence mode="wait">
                {emailError && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    key="emailError"
                  >
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
  
            
            <div>
            <label className="flex flex-col relative">
              <span className="text-black bg-white font-medium mb-2">Your Message</span>
              <div className="relative">
                <FaRegCommentDots className="absolute left-3 top-3 text-secondary" />
                <textarea
                  rows={7}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="bg-tertiary py-4 pl-10 pr-4 placeholder:text-secondary text-black bg-white rounded-lg outline-none border-none font-medium w-full"
                />
              </div>
            </label>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-black bg-white font-bold shadow-md shadow-primary transition"
            >
              {loading ? "Sending..." : "Send"}
            </motion.button>
            {confirmation && (
              <p className="mt-2 text-sm text-green-400">{confirmation}</p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </Container>
  );
}

export default SectionWrapper(Contact, "contact");