import React, { useEffect, useState } from "react";
import { findByActiveTrue } from "../../utils/goToApi";

const GoToList = () => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true; // zastita od memory leak-a
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await findByActiveTrue(); 
                if (isMounted) {
                setItems(data);
                }
            } 
            catch (err) {
                if (isMounted) {
                setError("Greska pri učitavanju podataka");
                }
            } 
            finally {
                if (isMounted) {
                setLoading(false);
                }
            }
        };
        fetchData();
        return () => {
        isMounted = false; // cleanup
        };
    }, []);

    if (loading) return <p>Ucitavanje...</p>;
    if (error) return <p>{error}</p>;

    return (
        <ul>
        {items.map((item) => (
            <li key={item.id}>{item.label}</li>
        ))}
        </ul>
    );
};

export default GoToList;