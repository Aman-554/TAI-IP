import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaExclamationCircle className="text-red-500" />,
    info: <FaInfoCircle className="text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-900 border-green-700',
    error: 'bg-red-900 border-red-700',
    info: 'bg-blue-900 border-blue-700'
  };

  return (
    <div className={`fixed top-20 right-4 z-50 ${bgColors[type]} border rounded-lg shadow-lg p-4 min-w-[300px] animate-slide-in`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-white text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-white">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Toast;