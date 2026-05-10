const aiService = require("../services/ai.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const askDatabaseQuestion = asyncHandler(async (req, res) => {
  const data = await aiService.askDatabaseQuestion(req.body.question);

  return sendSuccess(res, "Database question answered successfully.", data);
});

module.exports = { askDatabaseQuestion };
