import React, { useState } from "react"
import { Link } from "react-router-dom"
import { createStorage} from "../utils/storageApi";
import { useNavigate } from "react-router-dom";

const AddStorage = () => {

    const[name, setName] = useState("");
    const[location, setLocation] = useState("");
    const[capacity, setCapacity] = useState(0);
    const[goods, setGoods] = useState([]);
    const[shelves, setShelves] = useState([]);
    const [type, setType] = useState("PRODUCTION");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    // Shelf input states
    const [rowCount, setRowCount] = useState(1);
    const [cols, setCols] = useState(1);
    // Goods input states
    const [goodsName, setGoodsName] = useState("");
    const [unitMeasure, setUnitMeasure] = useState("");
    const [supplierType, setSupplierType] = useState("CABAGE_SUPPLIER");
    const [goodsType, setGoodsType] = useState("RAW_MATERIAL");
    const [supplyId, setSupplyId] = useState(null); // mora biti broj
    const [storageName, setStorageName] = useState("");
    const [shelfInput, setShelfInput] = useState({ rowCount: 1, cols: 1 });

    const addGoods = () => {
        const newGoods = {
            name: goodsName,
            unitMeasure,
            supplierType,
            goodsType,
            storageType: type,
            storageName,
            supplyId: parseInt(supplyId)
        };
        setGoods([...goods, newGoods]);

        // Reset
        setGoodsName("");
        setUnitMeasure("");
        setSupplierType("CABAGE_SUPPLIER");
        setGoodsType("RAW_MATERIAL");
        setStorageName("");
        setSupplyId(null);
    };

    // Add shelf to list
    const addShelf = () => {
        const newShelf = { rowCount, cols };
        setShelves([...shelves, newShelf]);
        setRowCount(1);
        setCols(1);
    };

    const updateShelf = (index, field, value) => {
        const updated = [...shelves];
        updated[index][field] = Number(value);
        setShelves(updated);
    };

    const removeShelf = (index) => {
        setShelves(shelves.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createStorage(name, location, capacity, goods, shelves, type);
            navigate("/storage", { state: { message: "Storage successfully added!" } });
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Unexpected error";
            setErrorMessage(msg);
        }
    };

    const handleShelfInputChange = (e) => {
        const { name, value } = e.target;
        setShelfInput(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    return(
        <div>
            <h2>Add New Storage</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Capacity</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={capacity} 
                        onChange={(e) => setCapacity(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select 
                        className="form-select" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                    >
                        <option value="PRODUCTION">Production</option>
                        <option value="DISTRIBUTION">Distribution</option>
                    </select>
                </div>
                <hr />
                <h5>Add Goods</h5>
                <div className="mb-2">
                    <input className="form-control mb-1" type="text" placeholder="Name" value={goodsName} onChange={(e) => setGoodsName(e.target.value)} />
                    <input className="form-control mb-1" type="text" placeholder="Unit Measure" value={unitMeasure} onChange={(e) => setUnitMeasure(e.target.value)} />
                    <select className="form-select mb-1" value={supplierType} onChange={(e) => setSupplierType(e.target.value)}>
                        <option value="CABAGE_SUPPLIER">Cabage Supplier</option>
                        <option value="CARROT_SUPPLIER">Carrot Supplier</option>
                    </select>
                    <select className="form-select mb-1" value={goodsType} onChange={(e) => setGoodsType(e.target.value)}>
                        <option value="RAW_MATERIAL">Raw Material</option>
                        <option value="FINISHED_PRODUCT">Finished Product</option>
                    </select>
                    <button type="button" className="btn btn-outline-secondary" onClick={addGoods}>Add Goods</button>
                </div>

                <ul>
                    {goods.map((g, idx) => (
                        <li key={idx}>{g.name} ({g.unitMeasure}) - {g.goodsType}</li>
                    ))}
                </ul>

                <hr />
                <h5>Add Shelf</h5>
                <div className="mb-2 d-flex gap-2 align-items-center">
                    <input
                        className="form-control"
                        type="number"
                        name="rowCount"
                        placeholder="Rows"
                        value={shelfInput.rowCount}
                        onChange={handleShelfInputChange}
                    />
                    <input
                        className="form-control"
                        type="number"
                        name="cols"
                        placeholder="Columns"
                        value={shelfInput.cols}
                        onChange={handleShelfInputChange}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={addShelf}
                    >
                        Add Shelf
                    </button>
                </div>

                {/* List of added shelves */}
                <ul className="list-group mb-3">
                    {shelves.map((shelf, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-2 align-items-center">
                                <label>Rows:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={shelf.rowCount}
                                    onChange={(e) => updateShelf(idx, "rowCount", e.target.value)}
                                    style={{ width: "80px" }}
                                />
                                <label>Cols:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={shelf.cols}
                                    onChange={(e) => updateShelf(idx, "cols", e.target.value)}
                                    style={{ width: "80px" }}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeShelf(idx)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                <button type="submit" className="btn btn-primary">Add Storage</button>
            </form>
        </div>
    );
};

export default AddStorage;



/*<h5>Add Shelf</h5>
<div className="mb-2">
    <input className="form-control mb-1" type="number" placeholder="Row Count" value={rowCount} onChange={(e) => setRowCount(Number(e.target.value))} />
    <input className="form-control mb-1" type="number" placeholder="Columns" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
    <button type="button" className="btn btn-outline-secondary" onClick={addShelf}>Add Shelf</button>
</div>

<ul>
    {shelves.map((s, idx) => (
    <li key={idx}>Row: {s.rowCount}, Cols: {s.cols}</li>
     ))}
</ul>     
const handleAddShelf = () => {
    setShelves([...shelves, { rowCount: 1, cols: 1 }]);
        };

    const handleShelfChange = (index, field, value) => {
        const updatedShelves = [...shelves];
        updatedShelves[index][field] = value;
        setShelves(updatedShelves);
    };

    const handleRemoveShelf = (index) => {
        const updatedShelves = shelves.filter((_, i) => i !== index);
        setShelves(updatedShelves);
    };        */