const dashboardService = require("../services/dashboard.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getDashboardStats = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getDashboardStats();

  return sendSuccess(res, "Dashboard statistics retrieved successfully.", data);
});

module.exports = { getDashboardStats };
