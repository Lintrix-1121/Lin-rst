import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenreDistributionChart = ({ distribution }) => {
  // Fallback if no data
  const safeDistribution = distribution && distribution.length > 0 ? distribution : [{ name: 'No Data', value: 1 }];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];

  const data = {
    labels: safeDistribution.map(d => d.name),
    datasets: [{
      data: safeDistribution.map(d => d.value),
      backgroundColor: colors.slice(0, safeDistribution.length),
      borderColor: 'white',
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div style={{ height: '300px' }}>
      {safeDistribution.length === 1 && safeDistribution[0].name === 'No Data' ? (
        <p className="text-muted text-center">No genre data available</p>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
};

export default GenreDistributionChart;