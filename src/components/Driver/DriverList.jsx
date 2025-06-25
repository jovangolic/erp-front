import React, { useState, useEffect } from "react";
import { deleteDriver, findAllDrivers } from "../utils/driverApi";

const DriverList = async() => {

    const[errorMessage, setErrorMessage] = useState("");
    const[drivers,setDrivers] = useState([]);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async() => {
            try{
                const  data = await findAllDrivers();
                setDrivers(data);
                setIsLoading(false);
            }
            catch(error){
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        };
        fetchDrivers()
    },[]);

    const handleDelete = async(id) => {
        try{
            await deleteDriver(id);
            setDrivers(drivers.filter((d) => d.id !== d));
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
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">No drivers found.</td>
                        </tr>
                        ) : (
                        drivers.map(driver => (
                            <tr key={driver.id}>
                                <td>{driver.name}</td>
                                <td>{driver.phone}</td>
                                <td>
                                    <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(driver.id)}
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

export default DriverList;