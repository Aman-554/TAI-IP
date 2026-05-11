import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password').lean();
  res.json({ success: true, data: users });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, data: user });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { username, email },
    { new: true, runValidators: true }
  ).select('-password');
  res.json({ success: true, user });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return next(new AppError('Invalid role', 400));
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, data: user });
});

export const banUser = catchAsync(async (req, res, next) => {
  const { isBanned } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned }, { new: true }).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, data: user });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, message: 'User deleted' });
});
