// User model validation and schema definition (for reference/validation)
const userSchema = {
  id: { type: Number, required: true },
  name: { type: String, required: true, min: 2, max: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, min: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  streak: { type: Number, default: 0 },
  last_login: { type: Date },
  created_at: { type: Date, default: Date.now }
};

// Validation functions
const validateUser = (userData) => {
  const errors = [];
  
  if (!userData.name || userData.name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { userSchema, validateUser };