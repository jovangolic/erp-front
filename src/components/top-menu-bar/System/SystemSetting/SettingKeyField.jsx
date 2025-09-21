import React from "react";
import { Form } from "react-bootstrap";

const SettingKeyField = ({ value, onChange, isEdit = false }) => {

    return (
        <Form.Group className="mb-3" controlId="settingKey">
            <Form.Label>Setting Key</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Unesite ključ podešavanja (npr. MAX_UPLOAD_SIZE)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={isEdit}  // onemogućeno menjanje u edit modu
                />
            <Form.Text className="text-muted">
                Jedinstveni kljuc koji identifikuje podesavanje u sistemu.
            </Form.Text>
        </Form.Group>
    );
};

export default SettingKeyField;