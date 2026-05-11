import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        selectedOption: Number,
        isCorrect: Boolean,
        timeSpent: Number,
        pointsEarned: Number
    }],
    score: {
        type: Number,
        required: true
    },
    totalPossibleScore: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // Total time in seconds
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    incorrectAnswers: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
resultSchema.index({ user: 1, quiz: 1 });
resultSchema.index({ createdAt: -1 });

export default mongoose.model('Result', resultSchema);