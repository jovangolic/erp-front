import { saveFileOpt } from "../../utils/fileOptApi";
import React, { useState } from "react";
import { Button, ButtonGroup, Container, Row, Col } from "react-bootstrap";

const FileActionsAdvanced = ({ fileOpt }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleAction = async (action) => {
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
                availableActions: fileOpt.availableActions,
                actionType: action, 
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
                setMessage("Svi fajlovi uspešno sacuvani.");
                break;
                case "EXIT":
                setMessage("Izlazak izvrsen.");
                break;
                default:
                setMessage(`Akcija "${action}" izvrsena.`);
            }

            console.log("Response:", response);
        } 
        catch (error) {
            setMessage(`Greska prilikom akcije "${action}": ${error.message}`);
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                <ButtonGroup>
                    {fileOpt.availableActions.map((action) => (
                    <Button
                        key={action}
                        variant="primary"
                        disabled={loading}
                        onClick={() => handleAction(action)}
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
                    <p>{message}</p>
                </Col>
                </Row>
        )}
        </Container>
    );
};

export default FileActionsAdvanced;