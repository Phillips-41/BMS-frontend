import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TemperatureG = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  

  // Prepare data for Voltage
  const chartData = {
    labels: data.map((cell) => `Cell ${cell.cellNumber}`),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((cell) => cell.cellTemperature),
        backgroundColor: colors.greenAccent[500],
        borderColor: colors.greenAccent[500],
        borderWidth: 1,
        // barThickness: 30,        // Explicit bar width (in pixels)
        // maxBarThickness: 40,     // Maximum bar width
        // // Optional, you can try tweaking this for spacing control
        // categoryPercentage: 10, // Controls spacing between categories
        // barPercentage: 0.6,      // Controls the width of the bars within the category
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem) => `${tooltipItem[0].label}`,
          label: (tooltipItem) => `${tooltipItem.raw} °C`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Cell Number',
          color: colors.grey[100],
        },
        ticks: {
          color: colors.grey[100],
        },
        offset: true, // Ensures bars are spaced apart
        grid: {
          display: false, // Optional: Hide vertical grid lines
        }
        // barPercentage: 0.1,        // Decrease bar width (0 < value <= 1)
        // categoryPercentage: 0.6,      // Increase spacing between bars
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (C)',
          color: colors.grey[100],
        },
        ticks: {
          color: colors.grey[100],
          stepSize: 2,  // Ensure ticks are spaced at intervals of 1
        },
      },
    },
  };

  return (
    <div style={{height: "200px", // Fill parent container
      overflow: "hidden",
      flexGrow: 1,
      margin: "0 auto auto ",
      marginLeft: "40px",
      width: "100%"}}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
export default TemperatureG;