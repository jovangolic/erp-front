import React from "react";

const TableComponent = ({ columns, data, actions }) => {
    return (
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx}>{col.header}</th>
                    ))}
                    {actions && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item) => (
                        <tr key={item.id || Math.random()}>
                            {columns.map((col, idx) => (
                                <td key={idx}>{item[col.accessor]}</td>
                            ))}
                            {actions && <td>{actions(item)}</td>}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length + (actions ? 1 : 0)}>No data found</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableComponent;