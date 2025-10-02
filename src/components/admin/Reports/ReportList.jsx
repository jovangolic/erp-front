import React, { useEffect, useState } from 'react';
import { getReportById, getByType, getReportsBetweenDates } from "../../utils/reportsApi";
import moment from 'moment';

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [type, setType] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const fetchReportsByType = async () => {
      const data = await getByType(type);
      setReports(data);
    };

    const fetchReportsBetweenDates = async () => {
      const data = await getReportsBetweenDates(from, to);
      setReports(data);
    };

    return (
      <div>
        <h2>Izvestaji</h2>
        <div>
          <label>Tip izvestaja:</label>
          <input value={type} onChange={(e) => setType(e.target.value)} />
          <button onClick={fetchReportsByType}>Pretrazi po tipu</button>
        </div>

        <div>
          <label>Od datuma:</label>
          <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
          <label>Do datuma:</label>
          <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
          <button onClick={fetchReportsBetweenDates}>Pretrazi po datumu</button>
        </div>

        <ul>
          {reports.map((r) => (
            <li key={r.id}>
              {r.type} - {moment(r.generatedAt).format('YYYY-MM-DD HH:mm')} - {r.filePath}
            </li>
          ))}
        </ul>
      </div>
    );
};

export default ReportList;