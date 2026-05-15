import React from 'react';
import { FaFire, FaCheckCircle, FaBook, FaChartLine } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const getIcon = () => {
    switch(icon) {
      case 'streak':
        return <FaFire className="text-orange-500" />;
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'enrolled':
        return <FaBook className="text-blue-500" />;
      case 'progress':
        return <FaChartLine className="text-purple-500" />;
      default:
        return <FaBook className="text-blue-500" />;
    }
  };

  const getColorClass = () => {
    switch(color) {
      case 'orange':
        return 'from-orange-500 to-red-500';
      case 'green':
        return 'from-green-500 to-emerald-500';
      case 'blue':
        return 'from-blue-500 to-cyan-500';
      case 'purple':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <div className="card relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-r ${getColorClass()} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">
            {getIcon()}
          </div>
          {trend && (
            <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold">{value}</p>
          {typeof value === 'number' && value < 100 && title !== 'Streak' && (
            <span className="text-gray-400 text-sm">/ 100</span>
          )}
        </div>
        
        {title === 'Progress' && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className={`bg-gradient-to-r ${getColorClass()} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;