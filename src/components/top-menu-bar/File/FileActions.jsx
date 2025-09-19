import { saveFileOpt } from "../../utils/fileOptApi";
import React, { useState } from "react";
import { Button, ButtonGroup, Container, Row, Col } from "react-bootstrap";

const FileActions = ({ fileOpt }) => {
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
            };
            const response = await saveFileOpt(requestBody);
            setMessage(`Akcija "${action}" uspešno izvrsena.`);
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

export default FileActions;

