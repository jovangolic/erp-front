import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { findOne } from "../utils/defectApi";

const ViewDefect = () => {

    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [defect, setDefect] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        const fetchDefect = async () => {
        try {
            const response = await findOne(id);
            setDefect(response);
        } catch (error) {
            setErrorMessage(error.message);
        }
        };
        fetchDefect();
    }, [id]);

    if (defect == null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
        <h2>Defect #{defect.code}</h2>
        {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
        )}

        {/* Tab navigation */}
        <ul className="nav nav-tabs">
            <li className="nav-item">
            <button
                className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
            >
                Details
            </button>
            </li>
            <li className="nav-item">
            <button
                className={`nav-link ${activeTab === "inspections" ? "active" : ""}`}
                onClick={() => setActiveTab("inspections")}
            >
                Related Inspections
            </button>
            </li>
        </ul>

        {/* Tab content */}
        <div className="tab-content mt-3">
            {activeTab === "details" && (
            <div className="tab-pane active">
                <div className="mb-3">
                <strong>Code: </strong> {defect.code}
                </div>
                <div className="mb-3">
                <strong>Name: </strong> {defect.name}
                </div>
                <div className="mb-3">
                <strong>Description: </strong> {defect.description}
                </div>
                <div className="mb-3">
                        <label className="form-label">Severity</label>
                        <select 
                            className="form-select" 
                            value={defect.severity} 
                            onChange={(e) => setStorage({ ...defect, severity: e.target.value })} 
                        >
                            <option value="TRIVIAL_SEVERITY">TRIVIAL_SEVERITY</option>
                            <option value="MINOR_SEVERITY">MINOR_SEVERITY</option>
                            <option value="MODERATE_SEVERITY">MODERATE_SEVERITY</option>
                            <option value="MAJOR_SEVERITY">MAJOR_SEVERITY</option>
                            <option value="CRITICAL_SEVERITY">CRITICAL_SEVERITY</option>
                            
                        </select>
                </div>
            </div>
            )}

            {activeTab === "inspections" && (
            <div className="tab-pane active">
                <h4>Inspections containing this defect</h4>
                <table className="table table-striped">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Quantity Affected</th>
                    <th>Inspection Code</th>
                    <th>Defect Code</th>
                    </tr>
                </thead>
                <tbody>
                    {defect.inspections && defect.inspections.length > 0 ? (
                    defect.inspections.map((inspDef, index) => (
                        <tr key={inspDef.id}>
                        <td>{index + 1}</td>
                        <td>{inspDef.quantityAffected}</td>
                        <td>{inspDef.inspection?.code || inspDef.inspection?.id}</td>
                        <td>{inspDef.defect?.code}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={4} className="text-center">
                        No inspections found
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
  );
};

export default ViewDefect;