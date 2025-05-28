import React, { useEffect, useState } from "react";
import { getAllVendors} from "../utils/vendorApi";

const VendorList = () => {

    const[vendor, setVendor] = useState([]);

    useEffect(() => {
        const fetchVenodrs = async () => {
            const data = await getAllVendors();
            setVendor(data);
        };
        fetchVenodrs();
    },[]);

    return (
        <div>
            <h2>Vendors List</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone-number</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.phoneNumber}</td>
                            <td>{item.address}</td>
                            <td>
                                <button className="btn btn-warning">Edit</button>
                                <button className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorList;