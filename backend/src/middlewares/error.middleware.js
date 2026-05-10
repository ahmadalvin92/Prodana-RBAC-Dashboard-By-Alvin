const { sendError } = require("../utils/apiResponse");

const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  if (error.code === "P2002") {
    return sendError(res, "A record with the same unique value already exists.", 409);
  }

  if (error.code === "P2025") {
    return sendError(res, "Requested record was not found.", 404);
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error." : error.message;

  return sendError(res, message, statusCode, error.errors || null);
};

module.exports = { notFoundHandler, errorHandler };
