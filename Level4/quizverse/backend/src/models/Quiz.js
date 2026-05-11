import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        default: '',
        maxlength: 500
    },
    category: {
        type: String,
        required: true,
        enum: [
            'General Knowledge', 'Science', 'History', 'Geography',
            'Sports', 'Technology', 'Mathematics', 'Literature',
            'Movies & TV', 'Music', 'Programming'
        ]
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    thumbnail: {
        type: String,
        default: 'default-quiz.jpg'
    },
    timePerQuestion: {
        type: Number,
        default: 30,
        min: 10,
        max: 120
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    playCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    tags: [String]
}, { timestamps: true });

// Virtual for question count
quizSchema.virtual('questionCount').get(function () {
    return this.questions?.length || 0;
});

quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

export default mongoose.model('Quiz', quizSchema);