import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { findOne } from "../../../utils/localizedOptionApi";

const LocalizedOptionDetailsPage = () => {
    const { id } = useParams();
    const [localizedOption, setLocalizedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await findOne(id);
            setLocalizedOption(data);
        }
        catch (err) {
            setError("Greska prilikom ucitavanja detalja prevoda");
        } 
        finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!localizedOption) return <Alert variant="info">Prevod nije pronadjen</Alert>;

    return (
        <Card>
        <Card.Header>
            <h4>Detalji prevoda (ID: {localizedOption.id})</h4>
        </Card.Header>
        <Card.Body>
            <p>
            <strong>Option:</strong> {localizedOption.option?.label} (
            {localizedOption.option?.category})
            </p>
            <p>
            <strong>Language:</strong>{" "}
            {localizedOption.language?.languageNameType} [
            {localizedOption.language?.languageCodeType}]
            </p>
            <p>
            <strong>Localized Label:</strong> {localizedOption.localizedLabel}
            </p>
        </Card.Body>
        <Card.Footer>
            <Button as={Link} to="/localized-option" variant="secondary">
                Nazad
            </Button>
            <Button
                as={Link}
                to={`/localized-option/edit/${localizedOption.id}`}
                variant="warning"
                className="ms-2"
                >
                Edit
            </Button>
        </Card.Footer>
        </Card>
    );
};

export default LocalizedOptionDetailsPage;