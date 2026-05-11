import AppError from '../utils/AppError.js';

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists. Please use a different value.`, 400);
};
const handleValidationError = (err) =>
  new AppError(Object.values(err.errors).map((e) => e.message).join('. '), 400);
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpired = () => new AppError('Token expired. Please log in again.', 401);

export const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFields(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
