import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGoodsByStorageId } from "../utils/goodsApi"; 

const StorageGoods = () => {
  const { id } = useParams();
  const [goods, setGoods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await getGoodsByStorageId(id);
        setGoods(response);
      } catch (err) {
        setError("Failed to fetch goods: " + err.message);
      }
    };
    fetchGoods();
  }, [id]);

  return (
    <div>
      <h2>Goods in Storage #{id}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit</th>
            <th>Type</th>
            <th>Supplier</th>
            <th>Barcodes</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.unitMeasure}</td>
              <td>{item.goodsType}</td>
              <td>{item.supplierType}</td>
              <td>
                <ul>
                  {item.barCodes.map((bc) => (
                    <li key={bc.id}>{bc.code}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StorageGoods;