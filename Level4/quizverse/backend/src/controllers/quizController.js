import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { generateAIQuiz as callGemini } from '../services/aiQuizService.js';

// ─── CRUD ────────────────────────────────────────────────────────────────────

// @desc    Get all quizzes (public)
// @route   GET /api/quizzes
// @access  Public
export const getAllQuizzes = catchAsync(async (req, res) => {
  const { category, difficulty, search, page = 1, limit = 12 } = req.query;
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort('-createdAt')
      .select('-questions')
      .lean(),
    Quiz.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: quizzes,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single quiz with questions
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) return next(new AppError('Quiz not found', 404));
  res.json({ success: true, data: quiz });
});

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
export const createQuiz = catchAsync(async (req, res) => {
  const { questions: rawQuestions, ...quizData } = req.body;
  const quiz = await Quiz.create({ ...quizData, creator: req.user.id });

  if (rawQuestions?.length) {
    const docs = rawQuestions.map((q) => ({ ...q, quiz: quiz._id }));
    const savedQs = await Question.insertMany(docs);
    quiz.questions = savedQs.map((q) => q._id);
    await quiz.save();
  }

  res.status(201).json({ success: true, data: quiz });
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
export const updateQuiz = catchAsync(async (req, res, next) => {
  const { questions: rawQuestions, ...quizData } = req.body;
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, quizData, {
    new: true,
    runValidators: true,
  });
  if (!quiz) return next(new AppError('Quiz not found', 404));

  // Replace questions if provided
  if (rawQuestions) {
    await Question.deleteMany({ quiz: quiz._id });
    const docs = rawQuestions.map((q) => ({ ...q, quiz: quiz._id }));
    const savedQs = await Question.insertMany(docs);
    quiz.questions = savedQs.map((q) => q._id);
    await quiz.save();
  }

  res.json({ success: true, data: quiz });
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
export const deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));
  await Question.deleteMany({ quiz: req.params.id });
  res.json({ success: true, message: 'Quiz deleted' });
});

// @desc    Submit quiz result (score calculation)
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuizResult = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) return next(new AppError('Quiz not found', 404));

  const { answers, timeTaken } = req.body;
  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] !== undefined && answers[i] === q.correctAnswer) correct++;
  });

  const total = quiz.questions.length;
  const score = Math.round((correct / total) * 100);

  await Quiz.findByIdAndUpdate(req.params.id, { $inc: { playCount: 1 } });

  res.json({ success: true, data: { score, correct, total, timeTaken, quizId: quiz._id } });
});

// ─── AI Generation ───────────────────────────────────────────────────────────

// @desc    Generate AI quiz using Gemini (async — responds 202 immediately)
// @route   POST /api/quizzes/generate-ai
// @access  Private/Admin
export const generateAIQuiz = catchAsync(async (req, res, next) => {
  const { topic, numberOfQuestions = 5, difficulty = 'Medium', quizTitle, quizDescription, category } = req.body;

  if (!topic) return next(new AppError('Topic is required for AI quiz generation', 400));
  if (numberOfQuestions < 1 || numberOfQuestions > 20)
    return next(new AppError('Number of questions must be between 1 and 20', 400));

  res.status(202).json({ success: true, message: 'Quiz generation started', status: 'generating' });

  try {
    const aiQuestions = await callGemini(topic, numberOfQuestions, difficulty);

    const quiz = await Quiz.create({
      title: quizTitle || `${difficulty} Quiz on ${topic}`,
      description: quizDescription || `AI-generated quiz about ${topic}`,
      category: category || 'General Knowledge',
      difficulty,
      creator: req.user.id,
      tags: [topic, difficulty, 'AI-generated'],
    });

    const docs = aiQuestions.map((q, idx) => ({
      text: q.text,
      quiz: quiz._id,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      order: idx,
    }));
    const savedQs = await Question.insertMany(docs);
    quiz.questions = savedQs.map((q) => q._id);
    await quiz.save();

    const io = req.app.get('io');
    io?.to(`user-${req.user.id}`).emit('quiz-generated', { quizId: quiz._id, title: quiz.title });
  } catch (err) {
    console.error('Background AI quiz generation failed:', err.message);
  }
});