/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Passes any thrown errors to Express's next() error handler.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
