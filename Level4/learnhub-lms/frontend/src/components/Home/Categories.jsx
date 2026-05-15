import React from 'react';

const Categories = ({ selectedCategory, onSelectCategory }) => {
  const categories = ['All', 'MERN', 'DSA', 'AI/ML', 'Java', 'Python'];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-dark-100 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;