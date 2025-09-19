import React, { useEffect, useState } from "react";
import { Table, Form, Spinner } from "react-bootstrap";
import { getAll, updateEditOpt } from "../../utils/editOptApi";
import { Container, Row, Col, Table, Form, Spinner } from "react-bootstrap"; 

const EditOptList = () => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAll();
                setOptions(data);
            } 
            catch (error) {
                console.error("Greska prilikom ucitavanja opcija:", error);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggle = async (id, field, value) => {
        try {
            setOptions((prev) =>
                prev.map((opt) =>
                opt.id === id ? { ...opt, [field]: value } : opt
                )
            );
            await updateEditOpt(id, { [field]: value });
        } 
        catch (error) {
            console.error("Greska prilikom azuriranja opcije:", error);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return(
        <Container fluid className="p-3">
            {/* Naslov */}
            <Row className="mb-3">
                <Col>
                    <h4>Edit Options</h4>
                </Col>
            </Row>

            {/* Search i filter */}
            <Row className="mb-3">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                    <Form.Control
                    type="text"
                    placeholder="Pretraži po nazivu ili tipu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col xs={12} md={4}>
                    <Form.Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    >
                    <option value="">Svi tipovi</option>
                    <option value="NOTIFICATION_METHOD">Notification Method</option>
                    <option value="REPORT_FORMAT">Report Format</option>
                    <option value="USER_PERMISSION">User Permission</option>
                    <option value="DASHBOARD_WIDGET">Dashboard Widget</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Tabela sa opcijama */}
            <Row>
                <Col>
                    <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Naziv</th>
                        <th>Tip</th>
                        <th>Vrednost</th>
                        <th>Visible</th>
                        <th>Editable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {options
                        .filter((opt) => {
                            const matchesSearch =
                            opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            opt.type.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesType =
                            typeFilter === "" || opt.type === typeFilter;
                            return matchesSearch && matchesType;
                        })
                        .map((opt) => (
                            <tr key={opt.id}>
                            <td>{opt.id}</td>
                            <td>{opt.name}</td>
                            <td>{opt.type}</td>
                            <td>{opt.value}</td>
                            <td>
                                <Form.Check
                                type="switch"
                                id={`visible-${opt.id}`}
                                checked={opt.visible}
                                onChange={(e) =>
                                    handleToggle(opt.id, "visible", e.target.checked)
                                }
                                />
                            </td>
                            <td>
                                <Form.Check
                                type="switch"
                                id={`editable-${opt.id}`}
                                checked={opt.editable}
                                onChange={(e) =>
                                    handleToggle(opt.id, "editable", e.target.checked)
                                }
                                />
                            </td>
                            </tr>
                        ))}
                    </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
export default EditOptList;