// Enrollment model validation and schema definition
const enrollmentSchema = {
  id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  roadmap_id: { type: Number, required: true },
  enrolled_at: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }
};

const validateEnrollment = (enrollmentData) => {
  const errors = [];
  
  if (!enrollmentData.user_id) {
    errors.push('User ID is required');
  }
  
  if (!enrollmentData.roadmap_id) {
    errors.push('Roadmap ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to calculate progress
const calculateProgress = async (pool, userId, roadmapId) => {
  try {
    // Get total lessons in roadmap
    const [totalLessons] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE m.roadmap_id = ?
    `, [roadmapId]);
    
    // Get completed lessons
    const [completedLessons] = await pool.execute(`
      SELECT COUNT(*) as completed 
      FROM completed_lessons cl
      JOIN lessons l ON cl.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      WHERE cl.user_id = ? AND m.roadmap_id = ?
    `, [userId, roadmapId]);
    
    const total = totalLessons[0].total;
    const completed = completedLessons[0].completed;
    
    return total === 0 ? 0 : (completed / total) * 100;
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0;
  }
};

module.exports = { enrollmentSchema, validateEnrollment, calculateProgress };