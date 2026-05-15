// Lesson model validation and schema definition
const lessonSchema = {
  id: { type: Number, required: true },
  module_id: { type: Number, required: true },
  title: { type: String, required: true, max: 200 },
  youtube_url: { type: String, max: 500 },
  playlist_url: { type: String, max: 500 },
  resources: { type: String },
  notes: { type: String },
  duration: { type: String, max: 50 },
  order_index: { type: Number, default: 0 }
};

const validateLesson = (lessonData) => {
  const errors = [];
  
  if (!lessonData.module_id) {
    errors.push('Module ID is required');
  }
  
  if (!lessonData.title || lessonData.title.length < 3) {
    errors.push('Lesson title must be at least 3 characters long');
  }
  
  // Validate YouTube URL if provided
  if (lessonData.youtube_url && !lessonData.youtube_url.includes('youtube.com') && !lessonData.youtube_url.includes('youtu.be')) {
    errors.push('Invalid YouTube URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { lessonSchema, validateLesson };