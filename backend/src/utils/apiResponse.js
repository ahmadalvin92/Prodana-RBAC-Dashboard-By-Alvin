const sendSuccess = (res, message, data = null, statusCode = 200, meta = undefined) => {
  const payload = {
    success: true,
    status: "success",
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, message, statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    status: "error",
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
