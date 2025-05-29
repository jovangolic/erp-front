import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStorage, getByStorageId } from "../utils/storageApi";

const UpdateStorage = () => {

    const { id } = useParams(); // ID inventara koji se uređuje
    const [storage, setStorage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Lokalna stanja za nova roba i polica
    const [newGoods, setNewGoods] = useState({
        name: "",
        unitMeasure: "",
        supplierType: "CABAGE_SUPPLIER",
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
            const data = await updateStorage(id,storage.name,storage.location,storage.capacity,storage.type,storage.goods,storage.shelves);
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
      supplierType: "CABAGE_SUPPLIER",
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
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                    >
                        <option value="PRODUCTION">Production</option>
                        <option value="DISTRIBUTION">Distribution</option>
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
                    <option value="CABAGE_SUPPLIER">Cabage Supplier</option>
                    <option value="CARROT_SUPPLIER">Carrot Supplier</option>
                </select>
                <select
                    className="form-select mb-2"
                    value={newGoods.goodsType}
                    onChange={(e) => setNewGoods({ ...newGoods, goodsType: e.target.value })}
                >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="FINISHED_PRODUCT">Finished Product</option>
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