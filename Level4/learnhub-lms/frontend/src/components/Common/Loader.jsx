import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-200 bg-opacity-90 flex justify-center items-center z-50">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

export default Loader;