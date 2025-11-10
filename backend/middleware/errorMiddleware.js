// backend/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Provide stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };