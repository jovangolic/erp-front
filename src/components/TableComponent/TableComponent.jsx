import React from "react";

const TableComponent = ({ data, columns }) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    {columns.map((col, index) => <th key={index}>{col}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {columns.map((col, idx) => <td key={idx}>{item[col]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableComponent;