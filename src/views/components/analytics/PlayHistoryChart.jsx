import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PlayHistoryChart = ({ chartData, timeRange }) => {
  // chartData in format: { labels, datasets: [ { label, data, ... } ] }
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return <div className="text-muted text-center py-3">No chart data available</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default PlayHistoryChart;