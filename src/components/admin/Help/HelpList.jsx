import React, { useState, useEffect } from 'react';
import { getAllHelp, deleteHelp } from '../../utils/helpApi';
import HelpForm from './HelpForm';

const HelpList = () => {
    const [helps, setHelps] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const loadHelps = async () => {
        try {
            const data = await getAllHelp();
            setHelps(data);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        loadHelps();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Da li sigurno želiš da obrišeš?')) {
            try {
                await deleteHelp(id);
                loadHelps();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div>
            <h2>Spisak Help Stavki</h2>
            <HelpForm helpId={editingId} onSuccess={() => {
                setEditingId(null);
                loadHelps();
            }} />
            <ul>
                {helps.map(help => (
                    <li key={help.id}>
                        <strong>{help.title}</strong> | Kategorija: {help.category} | Vidljivo: {help.isVisible ? 'Da' : 'Ne'}
                        <button onClick={() => setEditingId(help.id)}>Izmeni</button>
                        <button onClick={() => handleDelete(help.id)}>Obriši</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HelpList;