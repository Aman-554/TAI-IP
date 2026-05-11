import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Optional: per-quiz leaderboard entry
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        default: null
    },
    score: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    quizzesPlayed: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Unique entry per user+quiz combo (null quiz = global entry)
leaderboardSchema.index({ user: 1, quiz: 1 }, { unique: true });
leaderboardSchema.index({ score: -1 });

export default mongoose.model('Leaderboard', leaderboardSchema);