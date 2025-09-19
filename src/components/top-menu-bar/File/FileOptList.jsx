import React from "react";
import { Container, Row, Col, Table, Badge, Button } from "react-bootstrap";

const FileOptList = ({ fileOpts = [], onEdit, onDelete }) => {
    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h4>File Options List</h4>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Extension</th>
                            <th>MIME Type</th>
                            <th>Max Size</th>
                            <th>Upload</th>
                            <th>Preview</th>
                            <th>Actions</th>
                            <th>Available Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fileOpts.length > 0 ? (
                            fileOpts.map((opt) => (
                            <tr key={opt.id}>
                                <td>{opt.id}</td>
                                <td><Badge bg="info">{opt.extension}</Badge></td>
                                <td>{opt.mimeType}</td>
                                <td>{(opt.maxSizeInBytes / 1024 / 1024).toFixed(2)} MB</td>
                                <td>
                                {opt.uploadEnabled ? (
                                    <Badge bg="success">Enabled</Badge>
                                ) : (
                                    <Badge bg="secondary">Disabled</Badge>
                                )}
                                </td>
                                <td>
                                {opt.previewEnabled ? (
                                    <Badge bg="success">Enabled</Badge>
                                ) : (
                                    <Badge bg="secondary">Disabled</Badge>
                                )}
                                </td>
                                <td>
                                <Button
                                    size="sm"
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => onEdit(opt)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => onDelete(opt.id)}
                                >
                                    Delete
                                </Button>
                                </td>
                                <td>
                                {opt.availableActions?.length > 0 ? (
                                    opt.availableActions.map((action) => (
                                    <Badge key={action} bg="primary" className="me-1">
                                        {action}
                                    </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted">No Actions</span>
                                )}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="8" className="text-center text-muted">
                                No File Options found
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
  );
};

export default FileOptList;
