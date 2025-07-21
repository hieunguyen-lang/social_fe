"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

interface ChartProps {
  data: ChartData<any>;
  options?: ChartOptions<any>;
  title?: string;
  className?: string;
  type?: 'line' | 'bar' | 'pie';
  height?: string;
}

const Chart = ({ data, options, title, className = '', type = 'line', height = 'h-80' }: ChartProps) => {
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: !!title, text: title || '' },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
      }
    },
    scales: {
      y: { beginAtZero: true },
      x: {},
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={`card ${height} ${className}`}>
      {type === 'bar' && <Bar data={data} options={mergedOptions} />}
      {type === 'pie' && <Pie data={data} options={mergedOptions} />}
      {type === 'line' && <Line data={data} options={mergedOptions} />}
    </div>
  );
};

export default Chart; 