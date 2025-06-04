import React from "react";
import { Routes, Route } from "react-router-dom";
import HelpList from "./HelpList";
import HelpForm from "./HelpForm";
import HelpDetail from "./HelpDetail"; // ako imaš komponentu za prikaz detalja

const HelpIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<HelpList />} />
      <Route path="/create" element={<HelpForm />} />
      <Route path="/edit/:id" element={<HelpForm />} />
      <Route path="/view/:id" element={<HelpDetail />} />
    </Routes>
  );
};

export default HelpIndex;