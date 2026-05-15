// Module model validation and schema definition
const moduleSchema = {
  id: { type: Number, required: true },
  roadmap_id: { type: Number, required: true },
  title: { type: String, required: true, max: 200 },
  description: { type: String },
  order_index: { type: Number, default: 0 }
};

const validateModule = (moduleData) => {
  const errors = [];
  
  if (!moduleData.roadmap_id) {
    errors.push('Roadmap ID is required');
  }
  
  if (!moduleData.title || moduleData.title.length < 3) {
    errors.push('Module title must be at least 3 characters long');
  }
  
  if (moduleData.order_index === undefined || moduleData.order_index < 0) {
    errors.push('Order index must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { moduleSchema, validateModule };