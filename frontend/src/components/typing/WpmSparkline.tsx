import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface WpmSparklineProps {
  wpmHistory: { time: number; wpm: number }[];
  isRunning: boolean;
}

const WpmSparkline = ({ wpmHistory, isRunning }: WpmSparklineProps) => {
  if (!isRunning || wpmHistory.length === 0) return null;

  const currentWpm = wpmHistory[wpmHistory.length - 1]?.wpm ?? 0;

  const data = {
    labels: wpmHistory.map(p => `${p.time}s`),
    datasets: [
      {
        data: wpmHistory.map(p => p.wpm),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: { duration: 300 },
  } as const;

  return (
    <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3">
      <div className="text-center min-w-[56px]">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Live WPM</p>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 leading-none">{currentWpm}</div>
      </div>
      <div style={{ width: 180, height: 70 }} className="flex-1 min-w-0">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WpmSparkline;
