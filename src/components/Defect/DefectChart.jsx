import React from "react";
import { Bar,Pie,Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";

// Registracija potrebnih Chart.js komponenti
ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,ArcElement,PointElement,LineElement);

const DefectChart = ({ 
    title = "Statistika defekata", 
    data = [], 
    xKey = "label", 
    yKey = "count", 
    type = "bar" 
    }) => {
  
    const safeData = Array.isArray(data) ? data : [];

    const chartData = {
      labels: safeData.map(item => item[xKey]),
      datasets: [
        {
          label: title,
          data: safeData.map(item => item[yKey]),
          backgroundColor: [
            "#6c757d", "#0d6efd", "#198754", "#ffc107", "#dc3545",
            "#20c997", "#6610f2", "#fd7e14"
          ]
        }
      ]
};

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: title }
      },
      scales: type === "bar" || type === "line"
        ? { y: { beginAtZero: true } }
        : {}
    };

    if (type === "pie") return <Pie data={chartData} options={options} />;
    if (type === "line") return <Line data={chartData} options={options} />;
    return <Bar data={chartData} options={options} />;
};

export default DefectChart;
