import React, { useState } from 'react';
import { generateReport, downloadReport } from "../../utils/reportsApi";

const ReportGenerator = () => {
  const [type, setType] = useState('');
  const [generatedReportId, setGeneratedReportId] = useState(null);

  const handleGenerate = async () => {
    try {
      const report = await generateReport(type);
      setGeneratedReportId(report.id);
      alert('Izveštaj je generisan!');
    } catch (e) {
      alert('Greška prilikom generisanja.');
    }
  };

  const handleDownload = async () => {
    if (generatedReportId) {
      const blob = await downloadReport(generatedReportId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${generatedReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div>
      <h2>Generisanje izveštaja</h2>
      <input placeholder="Tip (e.g. ORDERS)" value={type} onChange={(e) => setType(e.target.value.toUpperCase())} />
      <button onClick={handleGenerate}>Generisi</button>
      {generatedReportId && <button onClick={handleDownload}>Preuzmi</button>}
    </div>
  );
};

export default ReportGenerator;