import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
}

const ProgressBar = ({ value, max, color = 'bg-primary-600', className = '' }: ProgressBarProps) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className={`${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
