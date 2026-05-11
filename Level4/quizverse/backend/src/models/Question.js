import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    // Flat string array — index of correct answer stored in correctAnswer
    options: {
        type: [String],
        validate: {
            validator: (v) => v.length >= 2 && v.length <= 6,
            message: 'A question must have between 2 and 6 options'
        }
    },
    correctAnswer: {
        type: Number,
        required: [true, 'correctAnswer index is required'],
        min: 0
    },
    explanation: {
        type: String,
        default: ''
    },
    points: {
        type: Number,
        default: 10,
        min: 1,
        max: 100
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

questionSchema.index({ quiz: 1, order: 1 });

export default mongoose.model('Question', questionSchema);