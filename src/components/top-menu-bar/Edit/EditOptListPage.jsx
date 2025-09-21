import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import EditOptForm from "./EditOptForm";
import { getAll, updateEditOpt } from "../../utils/editOptApi";

const EditOptListPage = () => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEdit =async() => {
            try{
                const data = await getAll();
                setOptions(data);
                setLoading(false);
            }
            catch(err) {
                console.error("Greska prilikom ucitavanja:", err);
                setError("Neuspesno učitavanje opcija");
                setLoading(false);
            }
        };
        fetchEdit();
    },[]);

    const handleChange = async (id, field, newValue) => {
        setOptions((prev) =>
            prev.map((o) => (o.id === id ? { ...o, [field]: newValue } : o))
        );
        try {
            const updated = options.find((o) => o.id === id);
            await updateEditOpt({ ...updated, [field]: newValue });
        } 
        catch (err) {
            console.error("Greska prilikom azuriranja:", err);
            setError("Neuspesno azuriranje opcije");
            setOptions((prev) =>
            prev.map((o) => (o.id === id ? { ...o, [field]: !newValue } : o))
            );
        }
    };

    if (loading) {
        return (
        <Container className="text-center p-5">
            <Spinner animation="border" />
        </Container>
        );
    }

    if (error) {
        return (
        <Container className="p-3">
            <Alert variant="danger">{error}</Alert>
        </Container>
        );
    }

    return (
        <Container fluid className="p-3">
        <h3 className="mb-4">Edit Options</h3>
        <Row>
            {options.map((opt) => (
            <Col md={6} lg={4} key={opt.id} className="mb-3">
                <EditOptForm option={opt} onChange={handleChange} />
            </Col>
            ))}
        </Row>
        </Container>
    );
};

export default EditOptListPage;
