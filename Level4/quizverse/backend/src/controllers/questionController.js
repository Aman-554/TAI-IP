import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Question from '../models/Question.js';

export const getQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find({ quiz: req.params.quizId }).lean();
  res.json({ success: true, data: questions });
});

export const getQuestionById = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) return next(new AppError('Question not found', 404));
  res.json({ success: true, data: question });
});

export const createQuestion = catchAsync(async (req, res) => {
  const question = await Question.create(req.body);
  res.status(201).json({ success: true, data: question });
});

export const updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!question) return next(new AppError('Question not found', 404));
  res.json({ success: true, data: question });
});

export const deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) return next(new AppError('Question not found', 404));
  res.json({ success: true, message: 'Question deleted' });
});
