import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { findByStorageId } from "../utils/shelfApi"; // napravi funkciju u utils

const StorageShelves = () => {
  const { id } = useParams();
  const [shelves, setShelves] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const response = await findByStorageId(id);
        setShelves(response);
      } catch (err) {
        setError("Failed to fetch shelves: " + err.message);
      }
    };
    fetchShelves();
  }, [id]);

  return (
    <div>
      <h2>Shelves in Storage #{id}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rows</th>
            <th>Cols</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {shelves.map((shelf) => (
            <tr key={shelf.id}>
              <td>{shelf.id}</td>
              <td>{shelf.rowCount}</td>
              <td>{shelf.cols}</td>
              <td>
                <Link to={`/shelf/${shelf.id}/with-goods`} className="btn btn-info btn-sm">
                  View Shelf With Goods
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StorageShelves;