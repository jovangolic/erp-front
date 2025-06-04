import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../../utils/helpApi";

const HelpDetails = () => {
  const { id } = useParams();
  const [help, setHelp] = useState(null);

  useEffect(() => {
    getById(id).then(data => {
      setHelp(data);
    }).catch(error => {
      console.error("Greška prilikom učitavanja help-a:", error);
    });
  }, [id]);

  if (!help) return <p>Učitavanje...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{help.title}</h2>
      <p className="text-gray-700 mb-4">{help.description}</p>
      <p><strong>Status:</strong> {help.status}</p>
      <p><strong>Korisnik:</strong> {help.user?.username}</p>
      <p><strong>Datum kreiranja:</strong> {new Date(help.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default HelpDetails;