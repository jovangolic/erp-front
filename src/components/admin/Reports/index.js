import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReportList from '../../admin/Reports/ReportList';
import ReportGenerator from '../../admin/Reports/ReportGenerator';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
      <Routes>
        <Route path="/reports" element={<ReportList />} />
        <Route path="/reports/generate" element={<ReportGenerator />} />
      </Routes>
    </Router>
  </React.StrictMode>
);