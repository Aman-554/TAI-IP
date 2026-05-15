// Roadmap model validation and schema definition
const roadmapSchema = {
  id: { type: Number, required: true },
  title: { type: String, required: true, max: 200 },
  category: { type: String, enum: ['MERN', 'DSA', 'AI/ML', 'Java', 'Python'], required: true },
  description: { type: String },
  thumbnail: { type: String, max: 500 },
  created_at: { type: Date, default: Date.now }
};

const validateRoadmap = (roadmapData) => {
  const errors = [];
  
  if (!roadmapData.title || roadmapData.title.length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  
  if (!roadmapData.category) {
    errors.push('Category is required');
  }
  
  const validCategories = ['MERN', 'DSA', 'AI/ML', 'Java', 'Python'];
  if (!validCategories.includes(roadmapData.category)) {
    errors.push('Invalid category');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { roadmapSchema, validateRoadmap };