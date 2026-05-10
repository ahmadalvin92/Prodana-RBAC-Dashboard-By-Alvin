const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  return sendSuccess(res, "Login completed successfully.", data);
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.getAuthenticatedUser(req.user.id);

  return sendSuccess(res, "Authenticated user retrieved successfully.", data);
});

module.exports = { login, me };
