import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStorage } from "../utils/storageApi";
import TableComponent from "../TableComponent/TableComponent";

const StorageList = () => {

    const [storages, setStorages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchStorages = async() => {
            try{
                const response = await getAllStorage();
                setStorages(response);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchStorages();
    },[]);

    return (
        <div>
            <h2>Storage List</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div>
                <Link to="/storage/add" className="btn btn-success mb-3">Add New Storage</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Goods</th>
                        <th>Shelves</th>
                    </tr>
                </thead>
                <tbody>
                    {storages.map((storage) => (
                    <tr key={storage.id}>
                        <td>{storage.id}</td>
                        <td>{storage.name}</td>
                        <td>{storage.location}</td>
                        <td>{storage.capacity}</td>
                        <td>{storage.storageType}</td>
                        <td>{storage.storageStatus}</td>
                        <td>
                            <Link to={`/storage/${storage.id}/goods`} className="btn btn-primary btn-sm">
                            View Goods
                            </Link>
                        </td>
                        <td>
                            <Link to={`/storage/${storage.id}/shelves`} className="btn btn-secondary btn-sm">
                            View Shelves
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

};

export default StorageList;