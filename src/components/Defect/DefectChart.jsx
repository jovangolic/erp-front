import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Registracija potrebnih Chart.js komponenti
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DefectChart = ({ data }) => {
  // data je objekat sa brojem defekata po ozbiljnosti
  // primer: { trivial: 5, minor: 10, moderate: 7, major: 3, critical: 1 }
  
  const chartData = {
    labels: ["Trivial", "Minor", "Moderate", "Major", "Critical"],
    datasets: [
      {
        label: "Broj Defekata",
        data: [
          data.trivial || 0,
          data.minor || 0,
          data.moderate || 0,
          data.major || 0,
          data.critical || 0
        ],
        backgroundColor: [
          "#6c757d",
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545"
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Defekti po Ozbiljnosti" }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default DefectChart;
