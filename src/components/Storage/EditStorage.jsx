import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStorage, getByStorageId } from "../utils/storageApi";

const UpdateStorage = () => {

    const { id } = useParams(); // ID inventara koji se uredjuje
    const [storage, setStorage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Lokalna stanja za nova roba i polica
    const [newGoods, setNewGoods] = useState({
        name: "",
        unitMeasure: "",
        supplierType: "RAW_MATERIAL",
        goodsType: "RAW_MATERIAL",
    });

    const [newShelf, setNewShelf] = useState({
        label: "",
        capacity: "",
    });

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const data = await updateStorage(id,storage.name,storage.location,storage.capacity,storage.type,storage.status,storage.shelves,storage.hasShelvesFor);
            navigate("/storage", { state: { message: "Storage successfully updated!" } });
        }
        catch(error){
            setErrorMessage(error.message);
        }
    };

    // Roba
  const addGoods = () => {
    if (!newGoods.name || !newGoods.unitMeasure) return;
    setStorage((prev) => ({
      ...prev,
      goods: [...prev.goods, { ...newGoods }],
    }));
    setNewGoods({
      name: "",
      unitMeasure: "",
      supplierType: "RAW_MATERIAL",
      goodsType: "RAW_MATERIAL",
    });
  };

    const removeGoods = (index) => {
        setStorage((prev) => ({
        ...prev,
        goods: prev.goods.filter((_, i) => i !== index),
        }));
    };

    // Police
    const addShelf = () => {
        if (!newShelf.label || !newShelf.capacity) return;
        setStorage((prev) => ({
        ...prev,
        shelves: [...prev.shelves, { ...newShelf }],
        }));
        setNewShelf({ label: "", capacity: "" });
    };

    const removeShelf = (index) => {
        setStorage((prev) => ({
        ...prev,
        shelves: prev.shelves.filter((_, i) => i !== index),
        }));
    };

    if (!storage) return <div>Loading...</div>;

    return (
        <div>
            <h2>Edit Storage</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    value={storage.name} 
                    onChange={(e) => setStorage({ ...storage, name: e.target.value })} 
                    required 
                 />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    value={storage.location} 
                    onChange={(e) => setStorage({ ...storage, location: e.target.value })} 
                    required 
                 />
                </div>
                <div className="mb-3">
                    <label className="form-label">Capacity</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    value={storage.capacity} 
                    onChange={(e) => setStorage({ ...storage, capacity: e.target.value })} 
                    required 
                 />
                </div>
                <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select 
                        className="form-select" 
                        value={storage.type} 
                        onChange={(e) => setType(e.target.value)} 
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
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                        <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="TEMPORARY">TEMPORARY</option>
                        <option value="FULL">FULL</option>
                    </select>
                </div>
                <hr />
                {/* GOODS */}
                <h5>Goods</h5>
                <div className="mb-3">
                <input
                    className="form-control mb-1"
                    type="text"
                    placeholder="Name"
                    value={newGoods.name}
                    onChange={(e) => setNewGoods({ ...newGoods, name: e.target.value })}
                />
                <input
                    className="form-control mb-1"
                    type="text"
                    placeholder="Unit Measure"
                    value={newGoods.unitMeasure}
                    onChange={(e) => setNewGoods({ ...newGoods, unitMeasure: e.target.value })}
                />
                <select
                    className="form-select mb-1"
                    value={newGoods.supplierType}
                    onChange={(e) => setNewGoods({ ...newGoods, supplierType: e.target.value })}
                >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="MANUFACTURER">Manufacturer</option>
                    <option value="WHOLESALER">Wholesaler</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="SERVICE_PROVIDER">Service Provider</option>
                    <option value="AGRICULTURE">Agriculture</option>
                    <option value="FOOD_PROCESSING">Food Processing</option>
                    <option value="LOGISTICS">Logistics</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="MAINTENANCE">Maintenance</option>
                </select>
                <select
                    className="form-select mb-2"
                    value={newGoods.goodsType}
                    onChange={(e) => setNewGoods({ ...newGoods, goodsType: e.target.value })}
                >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="SEMI_FINISHED_PRODUCT">Semi-Finished Product</option>
                    <option value="FINISHED_PRODUCT">Finished Product</option>
                    <option value="WRITE_OFS">Write-ofs</option>
                    <option value="CONSTRUCTION_MATERIAL">Construction-material</option>
                    <option value="BULK_GOODS">Bulk-goods</option>
                    <option value="PALLETIZED_GOODS">Palletized-goods</option>
                </select>
                <button type="button" className="btn btn-outline-secondary" onClick={addGoods}>
                    Add Goods
                </button>
                </div>
                <ul className="list-group mb-3">
                {storage.goods.map((g, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                    {g.name} ({g.unitMeasure}) - {g.goodsType}
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeGoods(idx)}>
                        Remove
                    </button>
                    </li>
                ))}
                </ul>
                <hr />
                {/* SHELVES */}
                <h5>Shelves</h5>
                <div className="mb-3">
                <input
                    className="form-control mb-1"
                    type="text"
                    placeholder="Label"
                    value={newShelf.label}
                    onChange={(e) => setNewShelf({ ...newShelf, label: e.target.value })}
                />
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Capacity"
                    value={newShelf.capacity}
                    onChange={(e) => setNewShelf({ ...newShelf, capacity: e.target.value })}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={addShelf}>
                    Add Shelf
                </button>
                </div>
                <ul className="list-group mb-3">
                {storage.shelves.map((s, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                    {s.label} - {s.capacity}
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeShelf(idx)}>
                        Remove
                    </button>
                    </li>
                ))}
                </ul>
                <button type="submit" className="btn btn-primary">
                        Update Storage
                </button>
            </form>
        </div>
    );

};

export default UpdateStorage;