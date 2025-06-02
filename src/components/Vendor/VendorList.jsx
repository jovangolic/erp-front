import React, { useEffect, useState } from "react";
import { getAllVendors} from "../utils/vendorApi";
import TableComponent from "../TableComponent/TableComponent";

const VendorList = () => {

    const[vendor, setVendor] = useState([]);

    useEffect(() => {
        const fetchVenodrs = async () => {
            const data = await getAllVendors();
            setVendor(data);
        };
        fetchVenodrs();
    },[]);

    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Phone-number", accessor: "phoneNumber" },
        { header: "Address", accessor: "address" },
    ];

    /*return (
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
                    {vendor.map(item => (
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
    );*/
    return (
        <div>
            <h2>Vendors List</h2>
            <TableComponent 
                columns={columns} 
                data={vendor}
                actions={(item) => (
                    <>
                        <button className="btn btn-warning btn-sm">Edit</button>
                        <button className="btn btn-danger btn-sm ms-2">Delete</button>
                    </>
                )}
            />
        </div>
    );
};

export default VendorList;