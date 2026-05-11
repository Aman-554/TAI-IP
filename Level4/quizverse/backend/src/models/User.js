import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    profile: {
        bio: { type: String, maxlength: 200 },
        location: String,
        favoriteCategories: [String],
        totalScore: { type: Number, default: 0 },
        quizzesTaken: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        totalQuestions: { type: Number, default: 0 }
    },
    badges: [{
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastPlayed: Date
    },
    bookmarkedQuizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },

    isBanned: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);