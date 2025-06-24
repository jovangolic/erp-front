import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { findAll, deleteRoute } from "../utils/routeApi";



const RouteList = async () => {

    const[errorMessage, setErrorMessage] = useState("");
    const[routes, setRoutes] = useState([]);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllRoute = async () => {
            try{
                const data = await findAll();
                setRoutes(data);
                setIsLoading(false)
            }
            catch(error){
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        };
        fetchAllRoute()
    },[]);

    const handleDelete = async (id) => {
        try{
            await deleteRoute(id);
            setRoutes(routes.filter((r) => r.id !== id));
        }
        catch(error){
            setErrorMessage("Greška prilikom brisanja: " + error.message);
        }
    };

    if(isLoading){
        return <div>Loading...</div>
    }

    if (errorMessage) {
        return <div className="alert alert-danger mt-3">{errorMessage}</div>;
    }

    return (
        <div 
                className="d-flex justify-content-center align-items-center" 
                style={{ minHeight: "80vh" }} // da zauzme većinu visine ekrana
            >
                <table className="table table-striped table-bordered w-75">
                    <thead className="thead-dark">
                        <tr>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Distance (km)</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">No routes found.</td>
                        </tr>
                        ) : (
                        routes.map(route => (
                            <tr key={route.id}>
                                <td>{route.origin}</td>
                                <td>{route.destination}</td>
                                <td>{route.distanceKm}</td>
                                <td>
                                    <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(route.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
            </table>
        </div>
    );
};

export default RouteList;