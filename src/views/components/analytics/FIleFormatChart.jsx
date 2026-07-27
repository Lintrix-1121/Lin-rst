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

  const FileFormatChart = ({ formatBreakdown }) => {
    const generateFormatData = () => {
      const data = formatBreakdown || { 'No Data': 1 };
      const labels = Object.keys(data);
      const values = Object.values(data);

      const colors = [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(14, 165, 233, 0.8)'
      ];

      return {
        labels,
        datasets: [{
          label: 'Tracks',
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.map(c => c.replace('0.8', '1')),
          borderWidth: 1,
          borderRadius: 4,
        }]
      };
    };
    
  const data = generateFormatData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
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
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c757d',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6c757d',
          stepSize: 20
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FileFormatChart;

