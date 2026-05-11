import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Result from '../models/Result.js';
import Leaderboard from '../models/Leaderboard.js';
import Quiz from '../models/Quiz.js';
import { updateStreak } from '../services/streakService.js';

export const submitResult = catchAsync(async (req, res, next) => {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    // Grade answers
    let correctAnswers = 0;
    const gradedAnswers = quiz.questions.map((q, i) => {
        const selected = answers[i];
        const isCorrect = selected !== undefined && selected === q.correctAnswer;
        if (isCorrect) correctAnswers++;
        return {
            questionId: q._id,
            selectedOption: selected ?? -1,
            isCorrect,
            timeSpent: 0,
            pointsEarned: isCorrect ? q.points : 0,
        };
    });

    const total = quiz.questions.length;
    const incorrectAnswers = total - correctAnswers;
    const totalPossibleScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const score = gradedAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const percentage = total === 0 ? 0 : Math.round((correctAnswers / total) * 100);

    // Save result
    const result = await Result.create({
        user: req.user.id,
        quiz: quizId,
        answers: gradedAnswers,
        score,
        totalPossibleScore,
        percentage,
        timeTaken,
        correctAnswers,
        incorrectAnswers,
    });

    // Upsert per-quiz leaderboard entry (best score)
    const existing = await Leaderboard.findOne({ user: req.user.id, quiz: quizId });
    if (!existing || score > existing.score) {
        await Leaderboard.findOneAndUpdate(
            { user: req.user.id, quiz: quizId },
            { score, accuracy: percentage, timeTaken },
            { upsert: true, new: true }
        );
    }

    // Increment play count
    await Quiz.findByIdAndUpdate(quizId, { $inc: { playCount: 1 } });

    // Update user streak
    await updateStreak(req.user.id);

    res.status(201).json({
        success: true,
        data: {
            resultId: result._id,
            score,
            totalPossibleScore,
            percentage,
            correctAnswers,
            incorrectAnswers,
            timeTaken,
            quizId,
        },
    });
});

export const getMyResults = catchAsync(async (req, res) => {
    const results = await Result.find({ user: req.user.id })
        .populate('quiz', 'title category difficulty thumbnail')
        .sort('-createdAt')
        .lean();
    res.json({ success: true, data: results });
});

export const getResultById = catchAsync(async (req, res, next) => {
    const result = await Result.findById(req.params.id)
        .populate('quiz', 'title category difficulty')
        .populate('user', 'username');
    if (!result) return next(new AppError('Result not found', 404));

    // Only the owner or admin can see a result
    if (result.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Access denied', 403));
    }
    res.json({ success: true, data: result });
});
