
import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color, icon }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
        <span className="flex items-center gap-1">
          <i className={`fa-solid ${icon}`}></i> {label}
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
