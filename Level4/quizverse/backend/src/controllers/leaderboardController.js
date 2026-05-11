import catchAsync from '../utils/catchAsync.js';
import Leaderboard from '../models/Leaderboard.js';

export const getLeaderboard = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Global leaderboard: aggregate best score per user across all quizzes
    const entries = await Leaderboard.aggregate([
        { $group: { _id: '$user', score: { $sum: '$score' }, accuracy: { $avg: '$accuracy' } } },
        { $sort: { score: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 0,
                user: { _id: '$user._id', username: '$user.username' },
                score: 1,
                accuracy: { $round: ['$accuracy', 1] }
            }
        }
    ]);

    res.json({ success: true, data: entries });
});

export const getQuizLeaderboard = catchAsync(async (req, res) => {
    const entries = await Leaderboard.find({ quiz: req.params.quizId })
        .sort({ score: -1, timeTaken: 1 })
        .limit(50)
        .populate('user', 'username')
        .lean();

    res.json({ success: true, data: entries });
});

export const getMyRank = catchAsync(async (req, res) => {
    // Calculate total score for each user
    const all = await Leaderboard.aggregate([
        { $group: { _id: '$user', score: { $sum: '$score' } } },
        { $sort: { score: -1 } }
    ]);

    const rankIndex = all.findIndex((e) => e._id.toString() === req.user.id);
    const myEntry = all[rankIndex];

    res.json({
        success: true,
        data: myEntry
            ? { rank: rankIndex + 1, score: myEntry.score }
            : null,
    });
});
