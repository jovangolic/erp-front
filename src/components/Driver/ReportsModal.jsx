import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { generalSearch } from "../utils/driverApi";

const ReportsModal = ({show, onHide, description}) => {

    const [descPart, setDescPart] = useState(description || "");
    const [driverStatus, setDriverStatus] = useState("ALL"); 
    const [confirmed, setConfirmed] = useState(false);
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAdvanced, setIsAdvanced] = useState(false); // toggle simple vs advanced

    // Jedinstvena funkcija za pretragu
    const handleSearch = async () => {
        try {
            const data = await searchDefects({
                descPart,
                status: isAdvanced ? driverStatus : null, // simple pretraga ignorise status
                confirmed: isAdvanced ? confirmed : null   // simple pretraga ignorise confirmed
            });
            setResults(data);
            setErrorMessage("");
        } catch (error) {
            setResults([]);
            setErrorMessage(error.message);
        }
    };
};

export default ReportsModal;