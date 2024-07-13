import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthDataVisualization = ({ healthData }) => {
  const dates = healthData.map(data => data.date);
  const heartRates = healthData.map(data => data.heartRate);
  const bloodPressures = healthData.map(data => data.bloodPressure);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Heart Rate',
        data: heartRates,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Blood Pressure',
        data: bloodPressures,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Data Over Time',
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Health Data Visualization</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default HealthDataVisualization;
