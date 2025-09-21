import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ButtonGroup, Alert } from "react-bootstrap";
import FileActionsSelector from "./FileActionsSelector";
import { saveFileOpt } from "../../utils/fileOptApi";

const FileOptAdvancedPage = ({ fileOpt }) => {
    const [selectedActions, setSelectedActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (fileOpt?.availableActions) {
            setSelectedActions(fileOpt.availableActions);
        }
    }, [fileOpt]);

    const handleActionsChange = (newActions) => {
        setSelectedActions(newActions);
    };

    const handleActionClick = async (action) => {
        setLoading(true);
        setMessage("");
        try {
            const requestBody = {
                id: fileOpt.id,
                extension: fileOpt.extension,
                mimeType: fileOpt.mimeType,
                maxSizeInBytes: fileOpt.maxSizeInBytes,
                uploadEnabled: fileOpt.uploadEnabled,
                previewEnabled: fileOpt.previewEnabled,
                availableActions: selectedActions,
                actionType: action
            };
            const response = await saveFileOpt(requestBody);

            switch (action) {
                case "SAVE":
                    setMessage("Fajl uspesno sacuvan.");
                    break;
                case "SAVE_AS":
                    setMessage("Fajl sacuvan pod novim imenom.");
                    break;
                case "SAVE_ALL":
                    setMessage("Svi fajlovi uspesno sacuvani.");
                    break;
                case "EXIT":
                    setMessage("Izlazak izvrsen.");
                    break;
                default:
                    setMessage(`Akcija "${action}" izvrsena.`);
            }

            console.log("Response:", response);
        } catch (error) {
            setMessage(`Greska prilikom akcije "${action}": ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!fileOpt) {
        return (
            <Container className="p-5 text-center">
                <p>Nema ucitanog FileOpt objekta.</p>
            </Container>
        );
    }

    return (
        <Container className="p-3">
            <h3>Advanced Actions for {fileOpt.extension}</h3>
            
            <Row className="mb-3">
                <Col>
                    <FileActionsSelector
                        selectedActions={selectedActions}
                        onChange={handleActionsChange}
                    />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <ButtonGroup>
                        {["SAVE", "SAVE_AS", "SAVE_ALL", "EXIT"].map((action) => (
                            <Button
                                key={action}
                                variant="primary"
                                disabled={loading}
                                onClick={() => handleActionClick(action)}
                            >
                                {action.replace("_", " ")}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>

            {message && (
                <Row>
                    <Col>
                        <Alert variant="info">{message}</Alert>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default FileOptAdvancedPage;
