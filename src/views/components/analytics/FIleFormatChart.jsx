import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FileFormatChart = ({ distribution }) => {
  const safeDistribution = distribution && distribution.length > 0 ? distribution : [{ name: 'No Data', value: 1 }];

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(14, 165, 233, 0.8)'
  ];

  const data = {
    labels: safeDistribution.map(d => d.name),
    datasets: [{
      label: 'Tracks',
      data: safeDistribution.map(d => d.value),
      backgroundColor: colors.slice(0, safeDistribution.length),
      borderColor: colors.slice(0, safeDistribution.length).map(c => c.replace('0.8', '1')),
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Tracks: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6c757d' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#6c757d', stepSize: 20 }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      {safeDistribution.length === 1 && safeDistribution[0].name === 'No Data' ? (
        <p className="text-muted text-center">No format data available</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default FileFormatChart;