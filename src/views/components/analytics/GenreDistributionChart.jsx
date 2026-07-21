import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenreDistributionChart = ({ dashboardData }) => {
  // Generate genre data from dashboard data or use mock data
  const generateGenreData = () => {
    // This would come from your actual data
    const genreData = {
      'Rock': 25,
      'Pop': 20,
      'Jazz': 15,
      'Electronic': 18,
      'Classical': 12,
      'Hip Hop': 10
    };

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];

    return {
      labels: Object.keys(genreData),
      datasets: [
        {
          data: Object.values(genreData),
          backgroundColor: colors,
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 8
        }
      ]
    };
  };

  const data = generateGenreData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default GenreDistributionChart;