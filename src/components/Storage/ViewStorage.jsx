import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getByStorageId } from "../utils/storageApi";

const ViewStorage = () => {

    const { id } = useParams();  // Preuzimanje ID-ja inventara iz URL parametara
    const [storage, setStorage] = useState(null);  // State za čuvanje podataka o inventaru
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchStorage = async() => {
            try{
                const response = await getByStorageId(id);
                setStorage(response);
            }
            catch(error){
                setErrorMessage(error.message);
            }
        };
        fetchStorage();
    },[id]);

    function formatShelves(hasShelvesFor){
        return hasShelvesFor ? "Ima" : "Nema"
    }

    function calculateAvailable(storage){
        if(!storage.capacity || !storage.usedCapacity){
            return 0;
        }
        return storage.capacity - storage.usedCapacity;
    }

    if(storage == null){
        return <div>Loading....</div>
    }

    return(
        <div>
            <h2>Storage Details</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="mb-3">
                <strong>Name: </strong> {storage.name}
            </div>
            <div className="mb-3">
                <strong>Location</strong> {storage.location}
            </div>
            <div className="mb-3">
                <strong>Capacity: </strong> {storage.capacity}
            </div>
            <div className="mb-3">
                    <strong>Capacity usage: </strong>
                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${storage.capacity > 0 ? (storage.usedCapacity / storage.capacity) * 100 : 0}%` }}
                        >
                            {storage.usedCapacity} / {storage.capacity}
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <strong>Available Capacity: </strong> {calculateAvailable(storage)}
            </div>
            <div className="mb-3">
                <strong>Has Shelves: </strong> {formatShelves(storage.hasShelvesFor)}
            </div>
            <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select 
                        className="form-select" 
                        value={storage.type} 
                        onChange={(e) => setStorage({ ...storage, type: e.target.value })} 
                    >
                        <option value="PRODUCTION">PRODUCTION</option>
                        <option value="DISTRIBUTION">DISTRIBUTION</option>
                        <option value="YARD">YARD</option>
                        <option value="SILO">SILO</option>
                        <option value="COLD_STORAGE">COLD_STORAGE</option>
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="INTERIM">INTERIM</option>
                        <option value="AVAILABLE">AVAILABLE</option>
                    </select>
             </div>
             <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                        className="form-select"
                        value={storage.status}
                        onChange={(e) => setStorage({... storage, status: e.target.value})}
                        >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                        <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="TEMPORARY">TEMPORARY</option>
                        <option value="FULL">FULL</option>
                    </select>
             </div>
            <h3>Shelves</h3>
            <table className="table table-striped">
                <thead>
                        <tr>
                        <th>#</th>
                        <th>Row</th>
                        <th>Column</th>
                        </tr>
                </thead>
                 <tbody>
                        {storage.shelves && storage.shelves.length > 0 ? (
                        storage.shelves.map((shelf, index) => (
                            <tr key={shelf.id}>
                            <td>{index + 1}</td>
                            <td>{shelf.rowCount}</td>
                            <td>{shelf.cols}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="3">No shelves found.</td>
                        </tr>
                        )}
                </tbody>
            </table>   
            <h3>Goods</h3>
            <table className="table table-bordered">
                 <thead>
                        <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Unit Measure</th>
                        <th>Supplier Type</th>
                        <th>Storage Type</th>
                        <th>Goods Type</th>
                        <th>Bar Codes</th>
                        </tr>
                </thead>
                <tbody>
                        {storage.goods && storage.goods.length > 0 ? (
                        storage.goods.map((good, index) => (
                            <tr key={good.id}>
                            <td>{index + 1}</td>
                            <td>{good.name}</td>
                            <td>{good.unitMeasure}</td>
                            <td>{good.supplierType}</td>
                            <td>{good.storageType}</td>
                            <td>{good.goodsType}</td>
                            <td>
                                {good.barCodes && good.barCodes.length > 0
                                ? good.barCodes.map(bar => bar.code).join(', ')
                                : 'N/A'}
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="7">No goods found.</td>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewStorage;