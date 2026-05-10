const express = require("express");
const aiController = require("../controllers/ai.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.post(
  "/query",
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER),
  aiController.askDatabaseQuestion,
);

module.exports = router;
