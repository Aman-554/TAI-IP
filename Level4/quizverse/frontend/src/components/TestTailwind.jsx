import React from 'react';

const TestTailwind = () => {
  return (
    <div className="p-8">
      <div className="bg-purple-500 text-white p-4 rounded-lg mb-4">
        Tailwind CSS is working! 🎉
      </div>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Button 1
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          Button 2
        </button>
      </div>
    </div>
  );
};

export default TestTailwind;