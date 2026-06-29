import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  suffix?: string;
}

const StatCard = ({ label, value, icon, color = 'text-primary-600', suffix }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        {icon && <span className={color}>{icon}</span>}
      </div>
      <div className={`text-3xl font-bold ${color}`}>
        {value}
        {suffix && <span className="text-lg font-normal text-gray-400 ml-1">{suffix}</span>}
      </div>
    </div>
  );
};

export default StatCard;
