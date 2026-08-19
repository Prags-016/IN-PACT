// Catches unmatched routes
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found — ${req.originalUrl}`));
}

// Central error formatter — every thrown error (sync or async, via asyncHandler)
// ends up here instead of leaking a stack trace straight to the client.
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} is already in use`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
