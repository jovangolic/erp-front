import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getConfirmationDocumentById,
  updateConfirmationDocument,
} from "../../utils/confirmationDocumentApi";
import {
  getAllUsers,
  getUserById,
} from "../../utils/userApi";
import { getAllShifts } from "../../utils/shiftApi";
import moment from "moment";
import { Form, Button, Col, Row } from "react-bootstrap";

export default function EditConfirmationDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filePath, setFilePath] = useState("");
  const [confirmationDoc, setConfirmationDoc] = useState({});
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [shiftId, setShiftId] = useState("");
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await getConfirmationDocumentById(id);
        setFilePath(doc.filePath);
        setConfirmationDoc(doc); // Dodato!
        setShiftId(doc.shiftId);
        const userData = await getUserById(doc.userId);
        setUser(userData);
        const shiftsData = await getAllShifts();
        setShifts(shiftsData);
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Greška prilikom učitavanja podataka:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        filePath: filePath,
        createdAt: confirmationDoc?.createdAt,
        userId: confirmationDoc?.userId,
        shiftId: shiftId,
      };

      await updateConfirmationDocument(id, updatedData);
      navigate("/confirmationDocuments");
    } catch (error) {
      console.error("Greška prilikom ažuriranja dokumenta:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Izmena dokumenta</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Putanja fajla</Form.Label>
          <Form.Control
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Korisnik</Form.Label>
          <Form.Control type="text" value={user?.username || ""} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Smene</Form.Label>
          <Form.Select
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
          >
            <option value="">-- Izaberi smenu --</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row>
          <Col>
            <Button variant="primary" type="submit">
              Sačuvaj izmene
            </Button>
          </Col>
          <Col>
            <Button variant="secondary" onClick={() => navigate("/confirmationDocuments")}>
              Otkaži
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}