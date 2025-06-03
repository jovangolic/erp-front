import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import { createProcurement } from "../api/procurementApi";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllItemSales } from "../utils/itemSalesApi";
import { getAllSuppliesItems } from "../utils/supplyItemApi";

const AddProcurement = () => {

    const [date, setDate] = useState(new Date());
    const [totalCost, setTotalCost] = useState("");
    const [itemSalesIds, setItemSalesIds] = useState([]);
    const [supplyItemIds, setSupplyItemIds] = useState([]);
    const [allItemSales, setAllItemSales] = useState([]);
    const [allSupplyItems, setAllSupplyItems] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");


    useEffect(() => {
    // Učitaj sve itemSales i supplyItems
    async function fetchData() {
      try {
        const [itemSalesData, supplyItemsData] = await Promise.all([
          getAllItemSales(),
          getAllSuppliesItems()
        ]);
        setAllItemSales(itemSalesData);
        setAllSupplyItems(supplyItemsData);
      } catch (error) {
        setErrorMsg("Greška prilikom učitavanja podataka.");
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProcurement(date, totalCost, itemSalesIds, supplyItemIds);
      setSuccessMsg("Nabavka uspešno kreirana!");
      setErrorMsg("");
      // reset
      setTotalCost("");
      setItemSalesIds([]);
      setSupplyItemIds([]);
    } catch (error) {
      setErrorMsg(error.message);
      setSuccessMsg("");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Dodaj novu nabavku</h2>
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Datum:</Form.Label>
          <Col sm={10}>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="form-control"
            />
          </Col>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ukupna cena:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Prodajne stavke (Item Sales):</Form.Label>
          <Form.Control as="select" multiple onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
            setItemSalesIds(selected);
          }}>
            {allItemSales.map(item => (
              <option key={item.id} value={item.id}>
                #{item.id} - {item.goods?.name ?? 'Nepoznato'} ({item.quantity})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stavke od dobavljača (Supply Items):</Form.Label>
          <Form.Control as="select" multiple onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
            setSupplyItemIds(selected);
          }}>
            {allSupplyItems.map(supply => (
              <option key={supply.id} value={supply.id}>
                #{supply.id} - {supply.supplier?.name ?? 'Nepoznato'} ({supply.cost} RSD)
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">Sačuvaj nabavku</Button>
      </Form>
    </div>
  );

};  

export default AddProcurement;