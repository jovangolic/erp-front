import React, { useState, useEffect } from 'react';
import { createHelp, updateHelp, getById } from "../../utils/helpApi";

const HelpForm = ({ helpId, onSuccess }) => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
        isVisible: true,
    });

    const isEditMode = !!helpId;

    useEffect(() => {
        if (isEditMode) {
            getById(helpId).then(data => {
                setForm({
                    title: data.title,
                    content: data.content,
                    category: data.category,
                    isVisible: data.isVisible,
                });
            });
        }
    }, [helpId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateHelp(helpId, form.title, form.content, form.category, form.isVisible);
            } else {
                await createHelp(form.title, form.content, form.category, form.isVisible);
            }
            onSuccess?.(); // callback za osvežavanje liste
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{isEditMode ? "Izmeni pomoć" : "Dodaj novu pomoć"}</h3>
            <div>
                <label>Naslov:</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
                <label>Sadržaj:</label>
                <textarea name="content" value={form.content} onChange={handleChange} required />
            </div>
            <div>
                <label>Kategorija:</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">-- Izaberi --</option>
                    {Object.keys(import.meta.env.VITE_HELP_CATEGORIES?.split(",") || {}).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>
                    <input type="checkbox" name="isVisible" checked={form.isVisible} onChange={handleChange} />
                    Vidljivo korisnicima
                </label>
            </div>
            <button type="submit">{isEditMode ? "Sačuvaj izmene" : "Kreiraj"}</button>
        </form>
    );
};

export default HelpForm;